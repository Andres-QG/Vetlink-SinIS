from .common import *

@api_view(["GET"])
def consult_admin(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "usuario")
    order = request.GET.get("order", "asc")

    try:
        usuarios_admin = Usuarios.objects.filter(rol=2)

        if search:
            if column == "apellidos":
                usuarios_admin = usuarios_admin.filter(
                    Q(apellido1__icontains=search) | Q(apellido2__icontains=search)
                )
            else:
                kwargs = {f"{column}__icontains": search}
                usuarios_admin = usuarios_admin.filter(**kwargs)

        if column == "apellidos":
            usuarios_admin = usuarios_admin.order_by(
                "-apellido1",
                "-apellido2" if order == "desc" else "apellido1",
                "apellido2",
            )
        else:
            usuarios_admin = usuarios_admin.order_by(
                f"-{column}" if order == "desc" else column
            )

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(usuarios_admin, request)
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
                "clinica": usuario.clinica.nombre if usuario.clinica else None,
                "clinica_id": usuario.clinica.clinica_id if usuario.clinica else None,
                "activo": usuario.activo,
            }
            for usuario in result_page
        ]

        return paginator.get_paginated_response(serializer_data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@transaction.atomic
def add_admin(request):
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
        clinica_id = data.get("clinica")
        activo = True

        if Usuarios.objects.filter(Q(usuario=usuario) | Q(correo=correo)).exists():
            return Response(
                {"error": "El usuario o el correo ya están en uso."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        hashed_password = make_password(clave)

        try:
            clinica = Clinicas.objects.get(pk=clinica_id)
        except Clinicas.DoesNotExist:
            return Response(
                {"error": "Clínica no encontrada."}, status=status.HTTP_404_NOT_FOUND
            )

        nuevo_admin = Usuarios(
            usuario=usuario,
            cedula=cedula,
            nombre=nombre,
            apellido1=apellido1,
            apellido2=apellido2,
            telefono=telefono,
            correo=correo,
            clave=hashed_password,
            rol_id=2,  # Rol para administrador
            clinica=clinica,
            activo=activo,
        )
        nuevo_admin.save()
        return Response(
            {"message": "Administrador agregado con éxito"},
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["PUT"])
def update_admin(request, usuario):
    try:
        admin = Usuarios.objects.get(usuario=usuario)

        correo = request.data.get("correo")
        nombre = request.data.get("nombre")
        apellido1 = request.data.get("apellido1")
        apellido2 = request.data.get("apellido2")
        telefono = request.data.get("telefono")
        cedula = request.data.get("cedula")
        clinica_id = request.data.get("clinica")

        if Usuarios.objects.filter(correo=correo).exclude(usuario=usuario).exists():
            return Response(
                {"error": "El correo ya está en uso."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            clinica = Clinicas.objects.get(pk=clinica_id)
        except Clinicas.DoesNotExist:
            return Response(
                {"error": "Clínica no encontrada."}, status=status.HTTP_404_NOT_FOUND
            )

        # Actualizar los datos del administrador
        admin.cedula = cedula
        admin.correo = correo
        admin.nombre = nombre
        admin.apellido1 = apellido1
        admin.apellido2 = apellido2
        admin.telefono = telefono
        admin.clinica = clinica
        admin.save()

        return Response(
            {"message": "Administrador actualizado con éxito."},
            status=status.HTTP_200_OK,
        )

    except Usuarios.DoesNotExist:
        return Response(
            {"error": "Administrador no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["DELETE"])
def delete_admin(request, usuario):
    try:
        admin = Usuarios.objects.get(usuario=usuario)
        admin.activo = False
        admin.save()
        return Response(
            {"message": "Administrador desactivado con éxito."},
            status=status.HTTP_200_OK,
        )
    except Usuarios.DoesNotExist:
        return Response(
            {"error": "Administrador no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

