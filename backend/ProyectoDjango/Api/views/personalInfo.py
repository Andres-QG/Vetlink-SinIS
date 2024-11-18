from .common import *

@api_view(["GET"])
def get_user_personal_info(request):
    logged_user = request.session.get("user")
    logged_user_role = request.session.get("role")
    if not logged_user or not logged_user_role:
        return Response(
            {"error": "Usuario no autenticado."},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    try:
        with connection.cursor() as cursor:
            out_cursor = cursor.connection.cursor()
            cursor.callproc("VETLINK.CONSULTAR_USUARIO", [logged_user, out_cursor])
            result = out_cursor.fetchone()
            if result:
                user_info = {
                    "usuario": logged_user,
                    "nombre": result[0],
                    "apellido1": result[1],
                    "apellido2": result[2],
                    "cedula": result[3],
                    "correo": result[4],
                    "telefono": result[5]
                }
                print(user_info)
                return Response(user_info, status=status.HTTP_200_OK)
            return Response(
                {"error": "Usuario no encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )
    except Exception as e:
        print(f"Error consultando información del usuario: {str(e)}")
        return Response(
            {"error": "Error al consultar la información."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

@api_view(["PUT"])
def update_user_personal_info(request):
    usuario = request.session.get("user")
    try:
        correo = request.data.get("correo")
        nombre = request.data.get("nombre")
        apellido1 = request.data.get("apellido1")
        apellido2 = request.data.get("apellido2")
        telefono = request.data.get("telefono")
        cedula = request.data.get("cedula")

        with connection.cursor() as cursor:
            cursor.callproc("VETLINK.MODIFICAR_USUARIO", [
                usuario,
                nombre,
                apellido1,
                apellido2,
                cedula,
                correo,
                telefono
            ])

        return Response(
            {"message": "Usuario actualizado con éxito."},
            status=status.HTTP_200_OK,
        )

    except Usuarios.DoesNotExist:
        return Response(
            {"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Error actualizando usuario: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def deactivate_user(request):
    try:
        usuario = request.session.get("user")
        with connection.cursor() as cursor:
            cursor.callproc('VETLINK.DESACTIVAR_USUARIO', [usuario])

        return JsonResponse(
            {'status': 'success', 'message': f'Usuario {usuario} desactivado correctamente'})

    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})


