from .common import *

@api_view(["GET"])
def consult_pet_records(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "nombre_mascota")
    order = request.GET.get("order", "asc")

    try:
        pet_records_list = fetch_pet_records_from_db()

        if not pet_records_list:
            return JsonResponse({"error": "Expediente no encontrado"}, status=404)

        pet_records_list = filter_and_sort_pet_records(
            pet_records_list, search, column, order
        )

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(pet_records_list, request)
        return paginator.get_paginated_response(result_page)

    except Mascotas.DoesNotExist:
        return Response(
            {"error": "Mascota no encontrada"}, status=status.HTTP_404_NOT_FOUND
        )
    except ConsultaMascotas.DoesNotExist:
        return Response(
            {"error": "Consulta no encontrada"}, status=status.HTTP_404_NOT_FOUND
        )
    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def add_pet_record(request):
    serializer = ExpedienteSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    mascota_id = serializer.validated_data["mascota_id"]
    fecha = serializer.validated_data["fecha"]
    diagnostico = serializer.validated_data["diagnostico"]
    peso = serializer.validated_data["peso"]
    vacunas = serializer.validated_data["vacunas"]  # String separado por comas
    sintomas = serializer.validated_data["sintomas"]  # String separado por comas
    tratamientos = serializer.validated_data[
        "tratamientos"
    ]  # String separado por comas

    try:
        # Verificar si la mascota existe
        if not Mascotas.objects.filter(pk=mascota_id).exists():
            return Response({"error": "Mascota no encontrada"}, status=404)

        # Verificar si todas las vacunas existen
        vacunas_list = [
            vacuna.strip().lower() for vacuna in vacunas.split(",") if vacuna.strip()
        ]
        if vacunas_list:
            for vacuna in vacunas_list:
                if not Vacunas.objects.filter(nombre__iexact=vacuna).exists():
                    return Response(
                        {"error": f"Vacuna con nombre {vacuna} no encontrada"},
                        status=404,
                    )

        # Verificar si todos los síntomas existen
        sintomas_list = [
            sintoma.strip().lower()
            for sintoma in sintomas.split(",")
            if sintoma.strip()
        ]
        if sintomas_list:
            for sintoma in sintomas_list:
                if not Sintomas.objects.filter(nombre__iexact=sintoma).exists():
                    return Response(
                        {"error": f"Síntoma con nombre {sintoma} no encontrado"},
                        status=404,
                    )

        # Verificar si todos los tratamientos existen
        tratamientos_list = [
            tratamiento.strip().lower()
            for tratamiento in tratamientos.split(",")
            if tratamiento.strip()
        ]
        if tratamientos_list:
            for tratamiento in tratamientos_list:
                if not Tratamientos.objects.filter(nombre__iexact=tratamiento).exists():
                    return Response(
                        {
                            "error": f"Tratamiento con nombre {tratamiento} no encontrado"
                        },
                        status=404,
                    )

        # Proceder a agregar el expediente
        with connection.cursor() as cursor:
            cursor.callproc(
                "VETLINK.Agregar_Expediente",
                [mascota_id, fecha, diagnostico, peso, vacunas, sintomas, tratamientos],
            )

        return Response({"message": "Expediente agregado correctamente"}, status=201)

    except Mascotas.DoesNotExist:
        return Response({"error": "Mascota no encontrada"}, status=404)
    except Exception as e:
        print({"error": str(e)})
        return Response({"error": str(e)}, status=500)

@api_view(["PUT"])
def update_pet_record(request, mascota_id, consulta_id):
    diagnostico = request.data.get("diagnostico")
    peso = request.data.get("peso")
    vacunas = request.data.get(
        "vacunas"
    )  # Se espera una cadena con vacunas separadas por coma
    sintomas = request.data.get(
        "sintomas"
    )  # Se espera una cadena con síntomas separados por coma
    tratamientos = request.data.get(
        "tratamientos"
    )  # Se espera una cadena con tratamientos separados por coma

    try:
        # Normalizar y verificar si todas las vacunas existen
        vacunas_list = [
            vacuna.strip().lower() for vacuna in vacunas.split(",") if vacuna.strip()
        ]
        print("vacunas_list: ", vacunas_list)
        if vacunas_list:
            for vacuna in vacunas_list:
                if not Vacunas.objects.filter(nombre__iexact=vacuna).exists():
                    return Response(
                        {"error": f"Vacuna con nombre {vacuna} no encontrada"},
                        status=status.HTTP_404_NOT_FOUND,
                    )

        # Normalizar y verificar si todos los síntomas existen
        sintomas_list = [
            sintoma.strip().lower()
            for sintoma in sintomas.split(",")
            if sintoma.strip()
        ]
        if sintomas_list:
            for sintoma in sintomas_list:
                if not Sintomas.objects.filter(nombre__iexact=sintoma).exists():
                    return Response(
                        {"error": f"Síntoma con nombre {sintoma} no encontrado"},
                        status=status.HTTP_404_NOT_FOUND,
                    )

        # Normalizar y verificar si todos los tratamientos existen
        tratamientos_list = [
            tratamiento.strip().lower()
            for tratamiento in tratamientos.split(",")
            if tratamiento.strip()
        ]
        if tratamientos_list:
            for tratamiento in tratamientos_list:
                if not Tratamientos.objects.filter(nombre__iexact=tratamiento).exists():
                    return Response(
                        {
                            "error": f"Tratamiento con nombre {tratamiento} no encontrado"
                        },
                        status=status.HTTP_404_NOT_FOUND,
                    )

        with connection.cursor() as cursor:
            cursor.callproc(
                "VETLINK.Modificar_Expediente",
                [
                    mascota_id,
                    consulta_id,
                    diagnostico,
                    peso,
                    vacunas,
                    sintomas,
                    tratamientos,
                ],
            )

        # Respuesta exitosa si todo se realizó correctamente
        return Response(
            {"message": "Expediente modificado correctamente"},
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        # Manejo de errores de base de datos
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["DELETE"])
def delete_pet_record(request, consulta_id):
    try:

        # Si ambas existen, proceder a eliminar el expediente
        with connection.cursor() as cursor:
            cursor.callproc("VETLINK.Eliminar_Expediente", [consulta_id])

        return Response({"message": "Expediente eliminado correctamente"}, status=200)

    except Mascotas.DoesNotExist:
        return Response({"error": "Mascota no encontrada"}, status=404)

    except ConsultaMascotas.DoesNotExist:
        return Response({"error": "Consulta no encontrada"}, status=404)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

def fetch_pet_records_from_db():
    with connection.cursor() as cursor:
        result_set_cursor = cursor.connection.cursor()
        cursor.callproc("VETLINK.ConsultarExpedientes", [result_set_cursor])
        pet_records = result_set_cursor.fetchall()
        result_set_cursor.close()

    pet_records_list = []
    for entry in pet_records:
        pet_record_data = {
            "consulta_id": entry[0],
            "mascota_id": entry[1],
            "nombre_mascota": entry[2],
            "usuario_cliente": entry[3],
            "fecha": entry[4],
            "diagnostico": entry[5],
            "peso": entry[6],
            "vacunas": entry[7],
            "sintomas": entry[8],
            "tratamientos": entry[9],
        }
        pet_records_list.append(pet_record_data)

    return pet_records_list


def filter_and_sort_pet_records(pet_records_list, search, column, order):
    if search:
        pet_records_list = [
            record
            for record in pet_records_list
            if search.lower() in str(record.get(column, "")).lower()
        ]

    pet_records_list.sort(key=lambda x: x.get(column, ""), reverse=(order == "desc"))

    return pet_records_list

