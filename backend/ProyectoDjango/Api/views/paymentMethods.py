from .common import *

cipher = Fernet(settings.ENCRYPTION_KEY.encode())


def encrypt_data(data):
    """
    Cifra datos sensibles.
    :param data: Texto a cifrar
    :return: Texto cifrado
    """
    if not isinstance(data, bytes):
        data = data.encode()
    return cipher.encrypt(data).decode()


def decrypt_data(encrypted_data):
    """
    Descifra datos previamente cifrados.
    :param encrypted_data: Texto cifrado
    :return: Texto original
    """
    return cipher.decrypt(encrypted_data.encode()).decode()


@api_view(["POST"])
@transaction.atomic
def add_payment_method(request):
    try:
        # Obtener usuario y rol de la sesión
        usuario = request.session.get("user")
        rol_id = request.session.get("role")

        if not usuario or not rol_id:
            return Response(
                {"error": "Usuario no autenticado."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if rol_id != 4:  # Asegurarse de que solo los clientes puedan agregar métodos
            return Response(
                {"error": "No tiene permisos para agregar métodos de pago."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Obtener datos del cuerpo de la solicitud
        tipo_pago = request.data.get("tipo_pago")
        numero_tarjeta = request.data.get("numero_tarjeta")
        nombre_titular = request.data.get("nombre_titular")
        fecha_expiracion = request.data.get("fecha_expiracion")
        direccion = request.data.get("direccion")
        provincia = request.data.get("provincia")
        pais = request.data.get("pais")
        codigo_postal = request.data.get("codigo_postal")

        # Validar campos requeridos
        if not all(
            [
                tipo_pago,
                numero_tarjeta,
                nombre_titular,
                fecha_expiracion,
                direccion,
                provincia,
                pais,
                codigo_postal,
            ]
        ):
            return Response(
                {"error": "Faltan campos obligatorios."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validar formato del número de tarjeta (16 dígitos)
        if not re.fullmatch(r"\d{16}", numero_tarjeta):
            return Response(
                {"error": "El número de tarjeta debe contener 16 dígitos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validar formato de la fecha de expiración (MM/YYYY)
        if not re.fullmatch(r"(0[1-9]|1[0-2])/\d{4}", fecha_expiracion):
            return Response(
                {"error": "El formato de la fecha de expiración debe ser MM/YYYY."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Extraer los últimos 4 dígitos antes de cifrar
        ultimos_4_digitos = numero_tarjeta[-4:]

        # Cifrar el número de tarjeta
        numero_tarjeta_cifrado = encrypt_data(numero_tarjeta)

        # Llamar al procedimiento almacenado
        with connection.cursor() as cursor:
            cursor.callproc(
                "VETLINK.AGREGAR_METODO_PAGO",
                [
                    usuario,  # USUARIO_CLIENTE
                    tipo_pago,  # TIPO_PAGO
                    numero_tarjeta_cifrado,  # NUMERO_TARJETA
                    ultimos_4_digitos,  # ULTIMOS_4_DIGITOS
                    nombre_titular,  # NOMBRE_TITULAR
                    fecha_expiracion,  # FECHA_EXPIRACION
                    direccion,  # DIRECCION
                    provincia,  # PROVINCIA
                    pais,  # PAIS
                    codigo_postal,  # CODIGO_POSTAL
                ],
            )

        # Confirmar éxito
        return Response(
            {"message": "Método de pago agregado exitosamente."},
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        error_message = str(e)
        if "ORA-" in error_message:
            return Response(
                {"error": error_message},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"error": "Error al agregar el método de pago."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
