from .common import *

@api_view(["GET"])
def consult_schedules(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "usuario_veterinario")
    order = request.GET.get("order", "asc")

    try:
        # Obtener el rol y el usuario de la sesión
        rol_id = request.session.get("role")
        usuario = request.session.get("user")
        # Obtener la clínica del administrador
        clinica_id = request.session.get("clinica_id") if rol_id == 2 else None

        if not rol_id or not usuario:
            return Response(
                {"error": "Usuario no autenticado."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        with connection.cursor() as cursor:
            returned_cursor = cursor.connection.cursor()

            # Configurar los parámetros según el rol
            if rol_id == 1:
                # Dueño puede ver todos los horarios
                cursor.callproc(
                    "VETLINK.CONSULTAR_HORARIOS", [returned_cursor, None, None]
                )
            elif rol_id == 2:
                # Administrador puede ver los horarios de su clínica
                if not clinica_id:
                    return Response(
                        {"error": "No se ha encontrado la clínica del administrador."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                cursor.callproc(
                    "VETLINK.CONSULTAR_HORARIOS", [returned_cursor, None, clinica_id]
                )
            elif rol_id == 3:
                # Veterinario puede ver solo sus propios horarios
                cursor.callproc(
                    "VETLINK.CONSULTAR_HORARIOS", [returned_cursor, usuario, None]
                )
            else:
                return Response(
                    {"error": "No tiene permisos para consultar los horarios."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Obtener los resultados del cursor de salida
            columns = [col[0] for col in returned_cursor.description]
            schedules = [dict(zip(columns, row)) for row in returned_cursor.fetchall()]

            if not schedules:
                return JsonResponse(
                    {"error": "No se encontraron horarios."}, status=404
                )

            # Procesar los datos y agregar campos adicionales si es necesario
            schedules_list = []
            for schedule in schedules:
                # Obtener el nombre de la clínica
                try:
                    clinica_nombre = (
                        Clinicas.objects.get(clinica_id=schedule["CLINICA_ID"]).nombre
                        if schedule["CLINICA_ID"]
                        else "Desconocida"
                    )
                except Clinicas.DoesNotExist:
                    clinica_nombre = "Clínica no encontrada"

                schedule_data = {
                    "horario_id": schedule["HORARIO_ID"],
                    "usuario_veterinario": schedule["USUARIO_VETERINARIO"],
                    "nombre_veterinario": schedule["NOMBRE_VETERINARIO"],  # Nuevo campo
                    "dia": schedule["DIA"],
                    "hora_inicio": schedule["HORA_INICIO"],
                    "hora_fin": schedule["HORA_FIN"],
                    "clinica_id": schedule["CLINICA_ID"],  # Nuevo campo
                    "clinica": clinica_nombre,
                    "activo": True if schedule["ACTIVO"] == 1 else False,
                }
                schedules_list.append(schedule_data)

            # Filtrar por búsqueda
            if search:
                schedules_list = [
                    record
                    for record in schedules_list
                    if search.lower() in str(record.get(column, "")).lower()
                ]

            # Ordenar los resultados
            schedules_list.sort(
                key=lambda x: x.get(column, ""), reverse=(order == "desc")
            )

            # Paginación
            paginator = CustomPagination()
            result_page = paginator.paginate_queryset(schedules_list, request)
            return paginator.get_paginated_response(result_page)

    except Exception as e:
        # Log para el servidor y respuesta detallada para el usuario
        print(f"Error en consult_schedules: {str(e)}")
        if "ORACLE error" in str(e):
            return Response(
                {"error": "Error en la base de datos, por favor intente más tarde."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return Response(
            {"error": "Error desconocido en el servidor."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(["POST"])
@transaction.atomic
def add_vet_schedule(request):
    try:
        # Obtener los parámetros enviados en el cuerpo de la solicitud
        usuario_veterinario = request.data.get("usuario_veterinario")
        dia = request.data.get("dia")
        hora_inicio = request.data.get("hora_inicio")
        hora_fin = request.data.get("hora_fin")
        clinica_id = request.data.get("clinica_id")

        # Validar que todos los campos estén presentes
        if not all([usuario_veterinario, dia, hora_inicio, hora_fin, clinica_id]):
            return Response(
                {"error": "Todos los campos son obligatorios."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Convertir horas a datetime para asegurar formato correcto
        try:
            hora_inicio_dt = datetime.strptime(hora_inicio, "%H:%M")
            hora_fin_dt = datetime.strptime(hora_fin, "%H:%M")
        except ValueError:
            return Response(
                {"error": "Formato de hora incorrecto. Use HH:MM."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verificación de que la hora de fin es posterior a la hora de inicio
        if hora_fin_dt <= hora_inicio_dt:
            return Response(
                {"error": "La hora de fin debe ser posterior a la hora de inicio."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verificar si el usuario veterinario existe
        if not Usuarios.objects.filter(usuario=usuario_veterinario, rol_id=3).exists():
            return Response(
                {"error": "El usuario veterinario especificado no existe."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verificar si la clínica existe
        if not Clinicas.objects.filter(clinica_id=clinica_id).exists():
            return Response(
                {"error": "La clínica especificada no existe."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Llamar al procedimiento almacenado para agregar el horario
        with connection.cursor() as cursor:
            cursor.callproc(
                "VETLINK.AGREGAR_HORARIO_VETERINARIO",
                [usuario_veterinario, dia, hora_inicio_dt, hora_fin_dt, clinica_id],
            )

        return Response(
            {"message": "Horario agregado exitosamente."},
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        # Manejar cualquier error que ocurra
        print(
            f"Error al agregar horario: {str(e)}"
        )  # Esto imprime el error en la consola
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def autocomplete_vet(request):
    search = request.GET.get("search", "")

    try:
        # Filtrar veterinarios (rol = 3) que coincidan con la búsqueda
        usuarios_veterinarios = Usuarios.objects.filter(
            rol=3, usuario__icontains=search
        ).order_by("usuario")

        # Serializar la información relevante para el autocompletado
        serializer_data = [
            {
                "usuario": usuario.usuario,
                "nombre": usuario.nombre,
                "apellido1": usuario.apellido1,
                "apellido2": usuario.apellido2,
            }
            for usuario in usuarios_veterinarios
        ]

        return Response(serializer_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_admin_clinic(request):
    try:
        # Obtener el rol y el ID del usuario de la sesión
        rol_id = request.session.get("role")
        usuario_id = request.session.get("user")

        # Validar que el rol sea de administrador (role_id == 2)
        if rol_id != 2:
            return Response(
                {"error": "No tiene permisos para acceder a esta información."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Obtener el usuario administrador
        usuario = Usuarios.objects.filter(usuario=usuario_id, rol=2).first()

        # Verificar si el usuario y la clínica existen
        if not usuario or not usuario.clinica:
            return Response(
                {"error": "No se encontró la clínica para este administrador."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Devolver la información de la clínica asociada
        clinica_data = {
            "clinica_id": usuario.clinica.clinica_id,
            "clinica": usuario.clinica.nombre,
        }
        return Response(clinica_data, status=status.HTTP_200_OK)

    except Exception as e:
        import traceback

        print(traceback.format_exc())  # Para registrar el error completo
        return Response(
            {"error": f"Error al obtener la clínica: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(["PUT"])
@transaction.atomic
def modify_vet_schedule(request, horario_id):
    try:
        # Obtener los parámetros enviados en el cuerpo de la solicitud
        usuario_veterinario = request.data.get("usuario_veterinario")
        dia = request.data.get("dia")
        hora_inicio = request.data.get("hora_inicio")
        hora_fin = request.data.get("hora_fin")
        clinica_id = request.data.get("clinica_id")

        # Validar que todos los campos estén presentes
        if not all([usuario_veterinario, dia, hora_inicio, hora_fin, clinica_id]):
            return Response(
                {"error": "Todos los campos son obligatorios."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Convertir horas a datetime para asegurar formato correcto
        try:
            hora_inicio_dt = datetime.strptime(hora_inicio, "%H:%M")
            hora_fin_dt = datetime.strptime(hora_fin, "%H:%M")
        except ValueError:
            return Response(
                {"error": "Formato de hora incorrecto. Use HH:MM."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verificación de que la hora de fin es posterior a la hora de inicio
        if hora_fin_dt <= hora_inicio_dt:
            return Response(
                {"error": "La hora de fin debe ser posterior a la hora de inicio."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verificar si el horario existe
        if not HorariosVeterinarios.objects.filter(horario_id=horario_id).exists():
            return Response(
                {"error": "El horario especificado no existe."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Verificar si el usuario veterinario existe
        if not Usuarios.objects.filter(usuario=usuario_veterinario, rol_id=3).exists():
            return Response(
                {"error": "El usuario veterinario especificado no existe."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verificar si la clínica existe
        if not Clinicas.objects.filter(clinica_id=clinica_id).exists():
            return Response(
                {"error": "La clínica especificada no existe."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Llamar al procedimiento almacenado para modificar el horario
        with connection.cursor() as cursor:
            cursor.callproc(
                "VETLINK.MODIFICAR_HORARIO_VETERINARIO",
                [
                    horario_id,
                    usuario_veterinario,
                    dia,
                    hora_inicio_dt,
                    hora_fin_dt,
                    clinica_id,
                ],
            )

        return Response(
            {"message": "Horario modificado exitosamente."},
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        # Manejar cualquier error que ocurra
        print(f"Error al modificar horario: {str(e)}")
        return Response(
            {"error": f"Error al modificar el horario: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(["DELETE"])
def delete_vet_schedule(request, horario_id):
    try:
        with connection.cursor() as cursor:
            # Llamar al procedimiento almacenado
            cursor.callproc("VETLINK.ELIMINAR_HORARIO_VETERINARIO", [horario_id])

        return Response(
            {"message": "Horario eliminado exitosamente."}, status=status.HTTP_200_OK
        )

    except Exception as e:
        error_message = str(e)
        if "ORA-20001" in error_message:
            # Error personalizado desde el procedimiento almacenado
            return Response(
                {"error": error_message.split("ORA-20001: ")[-1]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            # Otro error
            return Response(
                {"error": "Error al eliminar el horario."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

@api_view(["PUT"])
def reactivate_vet_schedule(request, horario_id):
    try:
        with connection.cursor() as cursor:
            # Llamar al procedimiento almacenado para reactivar el horario
            cursor.callproc("VETLINK.RECUPERAR_HORARIO_VETERINARIO", [horario_id])

        return Response(
            {"message": "Horario reactivado exitosamente."}, status=status.HTTP_200_OK
        )

    except Exception as e:
        error_message = str(e)
        if "ORA-20001" in error_message:
            # Error de conflicto de horarios desde el procedimiento almacenado
            return Response(
                {
                    "error": "Conflicto de horarios detectado al intentar reactivar el horario."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        elif "ORA-20002" in error_message:
            # Error personalizado si el horario no existe
            return Response(
                {"error": "El horario especificado no existe."},
                status=status.HTTP_404_NOT_FOUND,
            )
        else:
            # Otro error
            return Response(
                {"error": "Error al reactivar el horario."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
