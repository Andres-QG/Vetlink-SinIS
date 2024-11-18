from .common import *

@api_view(["GET"])
def consult_vets_formatted(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "usuario")
    order = request.GET.get("order", "asc")
    page_number = request.GET.get("page", 1)
    page_size = request.GET.get("page_size", 10)

    # Map columns to model fields
    column_mapping = {
        "usuario": "usuario",
        "cedula": "cedula",
        "nombre": "nombre",
        "apellido1": "apellido1",
        "apellido2": "apellido2",
        "telefono": "telefono",
        "correo": "correo",
        "activo": "activo",
        "especialidad": "especialidad__nombre",
        "clinica": "clinica__nombre",
    }

    try:
        # Base queryset
        vets = Usuarios.objects.filter(rol_id=3).select_related(
            "especialidad", "clinica"
        )

        # Search filter
        if search:
            vets = vets.filter(
                Q(usuario__icontains=search)
                | Q(cedula__icontains=search)
                | Q(nombre__icontains=search)
                | Q(apellido1__icontains=search)
                | Q(apellido2__icontains=search)
                | Q(telefono__icontains=search)
                | Q(correo__icontains=search)
                | Q(especialidad__nombre__icontains=search)
                | Q(clinica__nombre__icontains=search)
            )

        # Order by specified column
        sort_order = "" if order == "asc" else "-"
        order_field = column_mapping.get(column, "usuario")
        vets = vets.order_by(f"{sort_order}{order_field}")

        # Pagination
        paginator = PageNumberPagination()
        paginator.page_size = page_size
        result_page = paginator.paginate_queryset(vets, request)

        # Format data
        results = [
            {
                "usuario": vet.usuario,
                "cedula": vet.cedula,
                "nombre": vet.nombre,
                "apellido1": vet.apellido1,
                "apellido2": vet.apellido2,
                "telefono": vet.telefono,
                "correo": vet.correo,
                "activo": vet.activo,
                "especialidad": vet.especialidad.nombre if vet.especialidad else "",
                "clinica": vet.clinica.nombre if vet.clinica else "",
                "especialidad_id": (
                    vet.especialidad.especialidad_id if vet.especialidad else None
                ),
                "clinica_id": vet.clinica.clinica_id if vet.clinica else None,
            }
            for vet in result_page
        ]

        return paginator.get_paginated_response(results)

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})

@api_view(["GET"])
def consult_vet(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "usuario")
    order = request.GET.get("order", "asc")

    try:
        usuarios_veterinarios = Usuarios.objects.filter(rol=3).select_related(
            "especialidad", "clinica"
        )
        if search:
            kwargs = {f"{column}__icontains": search}
            usuarios_veterinarios = usuarios_veterinarios.filter(**kwargs)

        usuarios_veterinarios = usuarios_veterinarios.order_by(
            f"-{column}" if order == "desc" else column
        )

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(usuarios_veterinarios, request)
        serializer_data = [
            {
                "usuario": usuario.usuario,
                "cedula": usuario.cedula,
                "nombre": usuario.nombre,
                "apellido1": usuario.apellido1,
                "apellido2": usuario.apellido2,
                "telefono": usuario.telefono,
                "correo": usuario.correo,
                "estado": usuario.activo,
                "especialidad": (
                    {
                        "id": usuario.especialidad.especialidad_id,
                        "nombre": usuario.especialidad.nombre,
                        "descripcion": usuario.especialidad.descripcion,
                    }
                    if usuario.especialidad
                    else None
                ),
                "clinica": (
                    {
                        "id": usuario.clinica.clinica_id,
                        "nombre": usuario.clinica.nombre,
                    }
                    if usuario.clinica
                    else None
                ),
            }
            for usuario in result_page
        ]

        return paginator.get_paginated_response(serializer_data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@transaction.atomic
def add_vet(request):
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
        especialidad_id = data.get("especialidad")
        clinica_id = data.get("clinica")
        activo = True

        # Verificar si ya existe un usuario con el mismo 'usuario' o 'correo'
        if Usuarios.objects.filter(Q(usuario=usuario) | Q(correo=correo)).exists():
            return Response(
                {"error": "El usuario o el correo ya están en uso."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        hashed_password = make_password(clave)  # Hashear la contraseña

        # Verificar existencia de especialidad y clínica
        try:
            especialidad = Especialidades.objects.get(pk=especialidad_id)
        except Especialidades.DoesNotExist:
            return Response(
                {"error": "Especialidad no encontrada."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            clinica = Clinicas.objects.get(pk=clinica_id)
        except Clinicas.DoesNotExist:
            return Response(
                {"error": "Clínica no encontrada."}, status=status.HTTP_404_NOT_FOUND
            )

        nuevo_veterinario = Usuarios(
            usuario=usuario,
            cedula=cedula,
            nombre=nombre,
            apellido1=apellido1,
            apellido2=apellido2,
            telefono=telefono,
            correo=correo,
            clave=hashed_password,
            rol_id=3,  # Rol para veterinario
            especialidad=especialidad,
            clinica=clinica,
            activo=activo,
        )
        nuevo_veterinario.save()
        return Response(
            {"message": "Veterinario agregado con éxito"},
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["PUT"])
def update_vet(request, usuario):
    try:
        vet = Usuarios.objects.get(usuario=usuario)

        correo = request.data.get("correo")
        nombre = request.data.get("nombre")
        apellido1 = request.data.get("apellido1")
        apellido2 = request.data.get("apellido2")
        telefono = request.data.get("telefono")
        cedula = request.data.get("cedula")
        clinica_id = request.data.get("clinica")
        especialidad_id = request.data.get("especialidad")

        if Usuarios.objects.filter(correo=correo).exclude(usuario=usuario).exists():
            return Response(
                {"error": "El correo ya está en uso."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        print(especialidad_id)
        try:
            clinica = Clinicas.objects.get(pk=clinica_id)
        except Clinicas.DoesNotExist:
            return Response(
                {"error": "Clínica no encontrada."}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            especialidad = Especialidades.objects.get(pk=especialidad_id)
            print(especialidad)
        except Especialidades.DoesNotExist:
            return Response(
                {"error": "Especialidad no encontrada."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Actualizar los datos del veterinario
        vet.cedula = cedula
        vet.correo = correo
        vet.nombre = nombre
        vet.apellido1 = apellido1
        vet.apellido2 = apellido2
        vet.telefono = telefono
        vet.clinica = clinica
        vet.especialidad = especialidad
        vet.save()

        return Response(
            {"message": "Veterinario actualizado con éxito."},
            status=status.HTTP_200_OK,
        )

    except Usuarios.DoesNotExist:
        return Response(
            {"error": "Veterinario no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def consult_specialties(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "nombre")
    order = request.GET.get("order", "asc")

    try:
        specialties = Especialidades.objects.all()
        if search:
            kwargs = {f"{column}__icontains": search}
            specialties = specialties.filter(**kwargs)

        specialties = specialties.order_by(f"-{column}" if order == "desc" else column)

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(specialties, request)
        serializer = EspecialidadesSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

