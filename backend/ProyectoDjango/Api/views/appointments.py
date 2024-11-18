from .common import *

@api_view(["GET"])
def consult_citas(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "fecha")
    order = request.GET.get("order", "asc")
    clinica_id = request.session.get("clinica_id")  # Optional clinic filter
    cliente = ""
    if request.session.get("role") == 4:
        cliente = request.session.get("user")

    # Map the column names to match the stored procedure's response if necessary
    column_mapping = {
        "cliente": "CLIENTE",
        "veterinario": "VETERINARIO",
        "mascota": "NOMBRE",
        "fecha": "FECHA",
    }
    column = column_mapping.get(column, column)

    try:
        with connection.cursor() as cursor:
            returned_cursor = cursor.connection.cursor()
            returned_services = cursor.connection.cursor()
            # Call the stored procedure
            cursor.callproc(
                "VETLINK.GET_ALL_CITAS", [clinica_id, cliente, returned_cursor]
            )

            # Fetch the results from returned_cursor instead of cursor
            citas = [
                {
                    "cita_id": row[0],
                    "cliente": row[1],
                    "cliente_usuario": row[2],
                    "veterinario": row[3],
                    "veterinario_usuario": row[4],
                    "mascota_id": row[5],
                    "mascota": row[6],
                    "fecha": row[7].strftime("%Y-%m-%d"),
                    "hora": row[8],
                    "clinica_id": row[9] if row[9] is not None else 0,
                    "clinica": row[10] if row[10] is not None else "N/A",
                    "motivo": row[11] if row[11] is not None else "N/A",
                    "estado": row[12],
                    "services": [],
                }
                for row in returned_cursor.fetchall()
            ]
            for cita in citas:
                cita_id = cita["cita_id"]
                services_cursor = cursor.connection.cursor()

                cursor.callproc(
                    "VETLINK.GET_SERVICES_BY_CITA_ID", [cita_id, services_cursor]
                )

                services = [
                    {"servicio_id": service_row[0], "nombre": service_row[1]}
                    for service_row in services_cursor.fetchall()
                ]
                cita["services"] = services

            # Apply search filter if specified
            if search:
                citas = [
                    cita
                    for cita in citas
                    if search.lower() in str(cita[column]).lower()
                ]

        # Sort the results based on specified column and order
        citas = sorted(
            citas, key=lambda x: x[column.lower()], reverse=(order == "desc")
        )

        # Paginate the results
        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(citas, request)

        # Return paginated response
        return paginator.get_paginated_response(result_page)

    except Exception as e:
        # Handle exceptions and log errors if needed
        print(f"Error: {e}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@transaction.atomic
def add_cita(request):
    try:
        cliente_id = request.data.get("cliente").get("usuario")
        veterinario_id = request.data.get("veterinario").get("usuario")
        mascota_id = request.data.get("mascota").get("mascota_id")
        clinica_id = request.data.get("clinica").get("clinica_id")
        fecha = request.data.get("fecha")
        hora = request.data.get("hora")
        servicios = request.data.get("services")
        motivo = request.data.get("motivo", "")
        estado = request.data.get("estado", "Programada")

        fecha_datetime = datetime.fromisoformat(fecha[:-1])
        formatted_fecha = fecha_datetime.strftime("%Y-%m-%d")

        servs_ids = []
        for serv in servicios:
            servs_ids.append(serv.get("servicio_id"))

        servs_ids = [str(serv.get("servicio_id")) for serv in servicios]
        service_ids_string = ",".join(servs_ids)

        with connection.cursor() as cursor:
            cursor.callproc(
                "VETLINK.ADD_CITA",
                [
                    cliente_id,  # P_CLIENTE_ID
                    veterinario_id,  # P_VETERINARIO_ID
                    mascota_id,  # P_MASCOTA_ID
                    formatted_fecha,  # P_FECHA (formatted as 'YYYY-MM-DD')
                    hora,  # P_HORA
                    motivo,  # P_MOTIVO
                    estado,  # P_ESTADO
                    clinica_id,  # P_CLINICA
                    service_ids_string,  # P_SERVICIOS
                ],
            )

        return Response({"Success": True})

    except Exception as e:
        print(str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def update_cita(request, cita_id):
    try:
        print(request.data)
        cliente_id = request.data.get("cliente", {}).get("usuario")
        veterinario_id = request.data.get("veterinario", {}).get("usuario")
        mascota_id = request.data.get("mascota", {}).get("mascota_id")
        fecha = request.data.get("fecha")
        hora = request.data.get("hora")
        motivo = request.data.get("motivo")

        clinica_id = request.data.get("clinica").get("clinica_id")
        services = [s["servicio_id"] for s in request.data.get("services", [])]

        if isinstance(fecha, datetime):
            formatted_fecha = fecha.strftime("%Y-%m-%d")
        else:
            formatted_fecha = datetime.strptime(
                fecha, "%Y-%m-%dT%H:%M:%S.%fZ"
            ).strftime("%Y-%m-%d")

        print(formatted_fecha)

        with connection.cursor() as cursor:
            cursor.callproc(
                "UPDATE_CITA",
                [
                    cita_id,
                    cliente_id,
                    veterinario_id,
                    mascota_id,
                    formatted_fecha,
                    hora,
                    motivo,
                    clinica_id,
                ],
            )

            for service in services:
                cursor.callproc("UPDATE_CITA_SERVICIO", [cita_id, service])

        return Response(
            {"message": "Cita y servicios actualizados con éxito."},
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        print(str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["DELETE"])
def delete_cita(request, cita_id):
    try:
        # Call the stored procedure to set estado as "Inactiva"
        with connection.cursor() as cursor:
            cursor.callproc("VETLINK.DELETE_CITA", [cita_id])

        return Response(
            {"message": "Cita eliminada correctamente"}, status=status.HTTP_200_OK
        )
    except Exception as e:
        print(str(e))
        if "Citas.DoesNotExist" in str(e):
            return Response(
                {"error": "Cita no encontrada"}, status=status.HTTP_404_NOT_FOUND
            )
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["PUT"])
def get_disp_times(request):
    try:
        vet_user = request.data.get("vet_user")
        clinica_id = request.data.get("clinica_id")
        full_date = request.data.get("full_date")

        if not vet_user or not clinica_id or not full_date:
            return Response(
                {
                    "error": "Missing required parameters: vet_user, clinica_id, full_date."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        with connection.cursor() as cursor:
            out_param = cursor.var(str).var
            cursor.callproc(
                "VETLINK.HORARIOS_DISP", [vet_user, clinica_id, full_date, out_param]
            )

        # Parse JSON string and return in response
        available_times = json.loads(out_param.getvalue())
        return Response(available_times, status=status.HTTP_200_OK)

    except Exception as e:
        # Log the error with full traceback
        print("Error calling VETLINK.HORARIOS_DISP: %s", str(e))

        return Response(
            {"error": "Error retrieving available times. Please try again later."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
