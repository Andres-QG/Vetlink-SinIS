from .common import *

@api_view(["POST"])
def verify_code(request):
    values_str = int(
        "".join(request.data.get("values"))
    )  # Convierte los valores ingresados a int
    if request.session.get("reset_code") == values_str:  # Verificación del código
        return Response(
            {"exists": True, "status": "success"}, status=status.HTTP_200_OK
        )
    else:
        return Response(
            {"exists": False, "message": "No se pudo verificar el código."},
            status=status.HTTP_404_NOT_FOUND,
        )

@api_view(["POST"])
def check_new_pass(request):
    newPass = request.data.get("newPass")
    confPass = request.data.get("confPass")
    if newPass != confPass or not newPass or not confPass:
        return Response(
            {
                "exists": False,
                "message": "Las contraseñas no coinciden o están vacías.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    email = request.session.get("email")
    if email:
        try:
            userResponse = Usuarios.objects.get(correo=email)
        except Usuarios.DoesNotExist:
            return Response(
                {"exists": False, "message": "Usuario no encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )
    else:
        return Response(
            {"exists": False, "message": "No se pudo verificar el correo."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if check_password(newPass, userResponse.clave):
        return Response(
            {
                "exists": False,
                "message": "La nueva contraseña no puede ser igual a la anterior.",
                "same": True,
            },
            status=status.HTTP_200_OK,
        )

    hashed_password = make_password(newPass)
    userResponse.clave = hashed_password
    userResponse.save()
    return Response({"exists": True, "status": "success"}, status=status.HTTP_200_OK)

@api_view(["POST"])
def reset_password(request):
    email = request.data.get("email")  # Obtiene el correo de la solicitud
    if not email:
        return Response(
            {"error": "Se requiere correo electrónico."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    request.session["role"] = 5
    try:
        userResponse = Usuarios.objects.get(
            correo=email
        )  # Revisa que exista un usuario que tenga ese correo asociado
        verification_code = random.randint(
            100000, 999999
        )  # Genera un número aleatorio de 6 dígitos
        sg = sendgrid.SendGridAPIClient(api_key=settings.SENDGRID_API_KEY)
        email_sent = Mail(
            from_email='vetlinkmail@gmail.com',
            to_emails=email,
            subject='Código de restablecimiento de contraseña',
            html_content=f'<p>Tu código para reiniciar la contraseña es {verification_code}.</p>'
        )
        response = sg.send(email_sent)
        print(response.status_code)
        print(response.body)
        print(response.headers)

        request.session["reset_code"] = (
            verification_code  # Guarda el código en la sesión
        )
        request.session["email"] = email

        if userResponse.correo == email:
            return Response(
                {"exists": True, "message": "Correo autenticado.", "rol": 5},
                status=status.HTTP_200_OK,
            )
    except Usuarios.DoesNotExist:
        return Response(
            {"exists": False, "message": "No se pudo verificar el correo."},
            status=status.HTTP_404_NOT_FOUND,
        )

