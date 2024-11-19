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


@api_view(["GET"])
@transaction.atomic
def consult_payment_methods(request):
    try:
        # Obtener usuario y rol de la sesión
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
            # Crear un cursor para recibir el resultado del procedimiento
            out_cursor = cursor.connection.cursor()
            cursor.callproc("VETLINK.CONSULTAR_METODOS_PAGO", [usuario, out_cursor])

            # Obtener los nombres de las columnas
            columns = [col[0] for col in out_cursor.description]
            payment_methods = [dict(zip(columns, row)) for row in out_cursor.fetchall()]

            if not payment_methods:
                return Response(
                    {"message": "No tienes métodos de pago registrados."},
                    status=status.HTTP_200_OK,
                )

            # Formatear los datos según sea necesario (ejemplo: ajustar fechas)
            for method in payment_methods:
                if method["FECHA_EXPIRACION"]:
                    method["FECHA_EXPIRACION"] = method["FECHA_EXPIRACION"].strftime(
                        "%m/%Y"
                    )

            return Response({"results": payment_methods}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error interno: {str(e)}")
        error_message = str(e)
        if "ORA-" in error_message:
            return Response(
                {"error": error_message}, status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {"error": "Error al consultar los métodos de pago."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


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
        fecha_expiracion_str = request.data.get("fecha_expiracion")
        direccion = request.data.get("direccion")
        provincia = request.data.get("provincia")
        pais = request.data.get("pais")
        codigo_postal = request.data.get("codigo_postal")
        marca_tarjeta = request.data.get("marca_tarjeta")  # Nueva entrada

        # Validar campos requeridos
        if not all(
            [
                tipo_pago,
                numero_tarjeta,
                nombre_titular,
                fecha_expiracion_str,
                direccion,
                provincia,
                pais,
                codigo_postal,
                marca_tarjeta,  # Validar que la marca de la tarjeta está presente
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

        # Validar formato y convertir la fecha de expiración
        try:
            fecha_expiracion = datetime.strptime(fecha_expiracion_str, "%m/%Y")
        except ValueError:
            return Response(
                {"error": "Formato de fecha inválido. Debe ser MM/YYYY."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validar formato del código postal (4-10 caracteres numéricos)
        if not re.fullmatch(r"\d{4,10}", codigo_postal):
            return Response(
                {"error": "El código postal debe contener entre 4 y 10 dígitos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validar la marca de la tarjeta
        valid_brands = [
            "Visa",
            "MasterCard",
            "American Express",
            "Discover",
        ]  # Ejemplo de marcas válidas
        if marca_tarjeta not in valid_brands:
            return Response(
                {"error": f"La marca de la tarjeta '{marca_tarjeta}' no es válida."},
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
                    fecha_expiracion,  # FECHA_EXPIRACION como datetime
                    direccion,  # DIRECCION
                    provincia,  # PROVINCIA
                    pais,  # PAIS
                    codigo_postal,  # CODIGO_POSTAL
                    marca_tarjeta,  # MARCA_TARJETA
                ],
            )

        # Confirmar éxito
        return Response(
            {"message": "Método de pago agregado exitosamente."},
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        print(f"Error interno: {e}")  # Log detallado del error
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