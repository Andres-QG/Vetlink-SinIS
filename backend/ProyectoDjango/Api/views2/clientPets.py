from .common import *

@api_view(["GET"])
def consult_my_pets(request):
    try:
        # Obtener el usuario y rol de la sesión
        usuario = request.session.get("user")
        rol_id = request.session.get("role")

        if not usuario or not rol_id:
            return Response(
                {"error": "Usuario no autenticado."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Verificar que el rol sea de cliente (por ejemplo, rol_id == 4)
        if rol_id != 4:
            return Response(
                {"error": "No tiene permisos para consultar esta información."},
                status=status.HTTP_403_FORBIDDEN,
            )

        with connection.cursor() as cursor:
            out_cursor = cursor.connection.cursor()
            cursor.callproc("VETLINK.CONSULTAR_MIS_MASCOTAS", [usuario, out_cursor])

            # Obtener los nombres de las columnas
            columns = [col[0] for col in out_cursor.description]
            pets = [dict(zip(columns, row)) for row in out_cursor.fetchall()]

            if not pets:
                return Response(
                    {"message": "No tienes mascotas registradas."},
                    status=status.HTTP_200_OK,
                )

            # Convertir FECHA_NACIMIENTO de cadena a fecha si es necesario
            for pet in pets:
                if pet["FECHA_NACIMIENTO"]:
                    pet["FECHA_NACIMIENTO"] = pet["FECHA_NACIMIENTO"]

            return Response({"results": pets}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error en consult_my_pets: {str(e)}")
        return Response(
            {"error": "Error al consultar las mascotas."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(["POST"])
@transaction.atomic
def add_mypet(request):
    try:
        # Obtener el usuario y rol de la sesión
        usuario = request.session.get("user")
        rol_id = request.session.get("role")

        # Validación de autenticación y permisos de cliente
        if not usuario or not rol_id:
            return Response(
                {"error": "Usuario no autenticado."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if rol_id != 4:
            return Response(
                {"error": "No tiene permisos para agregar mascotas."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Obtener y validar los datos de la mascota del cuerpo de la solicitud
        nombre = request.data.get("nombre")
        fecha_nacimiento_str = request.data.get("fecha_nacimiento")
        especie = request.data.get("especie")
        raza = request.data.get("raza")
        sexo = request.data.get("sexo")

        # Validar que todos los campos requeridos están presentes
        if not all([nombre, fecha_nacimiento_str, especie, sexo]):
            return Response(
                {"error": "Faltan campos obligatorios."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Convertir la fecha de nacimiento a un objeto datetime
        try:
            fecha_nacimiento = datetime.strptime(fecha_nacimiento_str, "%Y-%m-%d")
        except ValueError:
            return Response(
                {"error": "Formato de fecha inválido. Debe ser YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Llamar al procedimiento almacenado para agregar la mascota
        with connection.cursor() as cursor:
            cursor.callproc(
                "VETLINK.AGREGAR_MIMASCOTA",
                [
                    usuario,  # p_usuario_cliente
                    nombre,  # p_nombre
                    fecha_nacimiento,  # p_fecha_nacimiento
                    especie,  # p_especie
                    raza,  # p_raza
                    sexo,  # p_sexo
                    1,  # p_activo (valor por defecto)
                ],
            )

        # Retornar mensaje de éxito si el procedimiento fue exitoso
        return Response(
            {"message": "Mascota agregada exitosamente"}, status=status.HTTP_201_CREATED
        )

    except Exception as e:
        # Captura el mensaje de error desde Oracle
        error_message = str(e)
        if "ORA-" in error_message:
            return Response(
                {"error": error_message}, status=status.HTTP_400_BAD_REQUEST
            )
        else:
            print(f"Error en add_mypet: {str(e)}")
            return Response(
                {"error": "Error al agregar la mascota."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

@api_view(["PUT"])
@transaction.atomic
def update_mypet(request, mascota_id):
    try:
        # Obtener el usuario y rol de la sesión
        usuario = request.session.get("user")
        rol_id = request.session.get("role")

        # Validación de autenticación y permisos de cliente
        if not usuario or not rol_id:
            return Response(
                {"error": "Usuario no autenticado."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if rol_id != 4:
            return Response(
                {"error": "No tiene permisos para modificar mascotas."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Obtener y validar los datos de la mascota del cuerpo de la solicitud
        nombre = request.data.get("nombre")
        fecha_nacimiento_str = request.data.get("fecha_nacimiento")
        especie = request.data.get("especie")
        raza = request.data.get("raza")
        sexo = request.data.get("sexo")

        # Validar que todos los campos requeridos están presentes
        if not all([nombre, fecha_nacimiento_str, especie, sexo]):
            return Response(
                {"error": "Faltan campos obligatorios."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Convertir la fecha de nacimiento a un objeto datetime
        try:
            fecha_nacimiento = datetime.strptime(fecha_nacimiento_str, "%Y-%m-%d")
        except ValueError:
            return Response(
                {"error": "Formato de fecha inválido. Debe ser YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Llamar al procedimiento almacenado para actualizar la mascota
        with connection.cursor() as cursor:
            cursor.callproc(
                "VETLINK.MODIFICAR_MIMASCOTA",
                [
                    mascota_id,  # p_mascota_id
                    usuario,  # p_usuario_cliente
                    nombre,  # p_nombre
                    fecha_nacimiento,  # p_fecha_nacimiento
                    especie,  # p_especie
                    raza,  # p_raza
                    sexo,  # p_sexo
                ],
            )

        # Retornar mensaje de éxito si el procedimiento fue exitoso
        return Response(
            {"message": "Mascota modificada exitosamente"}, status=status.HTTP_200_OK
        )

    except Exception as e:
        # Captura el mensaje de error desde Oracle
        error_message = str(e)
        if "ORA-" in error_message:
            return Response(
                {"error": error_message}, status=status.HTTP_400_BAD_REQUEST
            )
        else:
            print(f"Error en update_mypet: {str(e)}")
            return Response(
                {"error": "Error al modificar la mascota."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

@api_view(["DELETE"])
@transaction.atomic
def delete_my_pet(request, mascota_id):
    try:
        # Obtener el usuario y rol de la sesión
        usuario = request.session.get("user")
        rol_id = request.session.get("role")

        if not usuario or not rol_id:
            return Response(
                {"error": "Usuario no autenticado."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Verificar que el rol sea de cliente (por ejemplo, rol_id == 4)
        if rol_id != 4:
            return Response(
                {"error": "No tiene permisos para eliminar mascotas."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Ejecutar el procedimiento almacenado para eliminar (desactivar) la mascota
        with connection.cursor() as cursor:
            cursor.callproc("VETLINK.ELIMINAR_MIMASCOTA", [mascota_id])

        return Response(
            {"message": "Mascota eliminada exitosamente"}, status=status.HTTP_200_OK
        )

    except Exception as e:
        # Manejar cualquier error y devolver un mensaje de error
        print(f"Error en delete_my_pet: {str(e)}")
        return Response(
            {"error": "Error al eliminar la mascota"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
