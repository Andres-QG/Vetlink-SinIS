from .common import *

@api_view(["POST"])
def check_user_exists(request):
    formData = request.data.get("formData")
    if formData:
        user = formData.get("usuario")
        password = formData.get("clave")
    else:
        user = request.data.get("user") or request.data.get("usuario")
        password = request.data.get("password") or request.data.get("clave")

    if not user or not password:
        return Response(
            {"error": "Se requieren usuario y contraseña."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        userResponse = Usuarios.objects.get(usuario=user)

        if check_password(password, userResponse.clave):
            # Guardar el usuario y rol en la sesión
            request.session["user"] = userResponse.usuario
            request.session["role"] = userResponse.rol_id

            # Si es administrador, también guardar el ID de la clínica en la sesión
            if userResponse.rol_id == 2:
                clinica_id = userResponse.clinica_id
                request.session["clinica_id"] = clinica_id

            return Response(
                {
                    "exists": True,
                    "message": f"Usuario {user} autenticado.",
                    "rol": userResponse.rol_id,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"exists": False, "message": "Contraseña incorrecta."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    except Usuarios.DoesNotExist:
        return Response(
            {"exists": False, "message": "Usuario no encontrado."},
            status=status.HTTP_404_NOT_FOUND,
        )

@csrf_exempt
@api_view(["GET"])
def get_user_role(request):
    role = request.session.get("role")

    if role:
        return Response({"status": "success", "message": "Rol obtenido", "role": role})
    else:
        return Response({"status": "error", "message": "Usuario no ha iniciado sesión"})

@api_view(["GET"])
def get_user(request):
    try:
        user = request.session.get("user")
        role = request.session.get("role")

        data = {
            "user": user,
            "role": role,
        }

        if role == 2:
            data["clinica"] = request.session.get("clinica_id")

        return Response({"status": "success", "data": data})

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def log_out(request):
    logout(request)
    return Response(
        {"status": "success", "message": "Usuario desconectado exitosamente"}
    )
