from .common import *

@api_view(["GET"])
def consult_client(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "usuario")
    order = request.GET.get("order", "asc")

    try:
        usuarios_clientes = Usuarios.objects.filter(rol=4)
        if search:
            if column == "apellidos":
                usuarios_clientes = usuarios_clientes.filter(
                    Q(apellido1__icontains=search) | Q(apellido2__icontains=search)
                )
            else:
                kwargs = {f"{column}__icontains": search}
                usuarios_clientes = usuarios_clientes.filter(**kwargs)

        if column == "apellidos":
            usuarios_clientes = usuarios_clientes.order_by(
                "-apellido1",
                "-apellido2" if order == "desc" else "apellido1",
                "apellido2",
            )
        else:
            usuarios_clientes = usuarios_clientes.order_by(
                f"-{column}" if order == "desc" else column
            )

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(usuarios_clientes, request)
        serializer_data = [
            {
                "usuario": usuario.usuario,
                "cedula": usuario.cedula,
                "nombre": usuario.nombre,
                "apellido1": usuario.apellido1,
                "apellido2": usuario.apellido2,
                "apellidos": f"{usuario.apellido1} {usuario.apellido2}",
                "telefono": usuario.telefono,
                "correo": usuario.correo,
                "activo": usuario.activo,
            }
            for usuario in result_page
        ]

        return paginator.get_paginated_response(serializer_data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@transaction.atomic
def add_client(request):
    try:
        data = request.data
        usuario = data.get("usuario")
        cedula = data.get("cedula")
        correo = data.get("correo")
        nombre = data.get("nombre")
        apellido1 = data.get("apellido1")
        apellido2 = data.get("apellido2")
        telefono = data.get("telefono")
        clave = data.get("clave")
        activo = True

        # Verificar si ya existe un usuario con el mismo 'usuario' o 'correo'
        if Usuarios.objects.filter(Q(usuario=usuario) | Q(correo=correo)).exists():
            return Response(
                {"error": "El usuario o el correo ya están en uso."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        hashed_password = make_password(clave)  # Hashear la contraseña

        nuevo_cliente = Usuarios(
            usuario=usuario,
            cedula=cedula,
            nombre=nombre,
            apellido1=apellido1,
            apellido2=apellido2,
            telefono=telefono,
            correo=correo,
            clave=hashed_password,
            rol_id=4,  # Rol para cliente
            activo=activo,
        )
        nuevo_cliente.save()
        return Response(
            {"message": "Cliente agregado con éxito"}, status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
def update_client(request, usuario):
    try:
        user = Usuarios.objects.get(usuario=usuario)

        correo = request.data.get("correo")
        nombre = request.data.get("nombre")
        apellido1 = request.data.get("apellido1")
        apellido2 = request.data.get("apellido2")
        telefono = request.data.get("telefono")
        cedula = request.data.get("cedula")

        if Usuarios.objects.filter(correo=correo).exclude(usuario=usuario).exists():
            return Response(
                {"error": "El correo ya está en uso."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Actualizar los datos del usuario
        user.cedula = cedula
        user.correo = correo
        user.nombre = nombre
        user.apellido1 = apellido1
        user.apellido2 = apellido2
        user.telefono = telefono
        user.save()

        return Response(
            {"message": "Usuario actualizado con éxito."}, status=status.HTTP_200_OK
        )

    except Usuarios.DoesNotExist:
        return Response(
            {"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Error actualizando usuario: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["PUT"])
def reactivate_user(request, usuario):
    try:
        user = Usuarios.objects.get(usuario=usuario)
        user.activo = True
        user.save()
        return Response(
            {"message": "Usuario reactivado con éxito."}, status=status.HTTP_200_OK
        )
    except Usuarios.DoesNotExist:
        return Response(
            {"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["DELETE"])
def delete_client(request, usuario):
    try:
        user = Usuarios.objects.get(usuario=usuario)
        user.activo = False
        user.save()
        return Response(
            {"message": "Usuario desactivado con éxito."}, status=status.HTTP_200_OK
        )
    except Usuarios.DoesNotExist:
        return Response(
            {"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
