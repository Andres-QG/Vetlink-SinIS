from .common import *

@api_view(["GET"])
def consult_clinics(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "nombre")
    order = request.GET.get("order", "asc")

    if column == "clinica":
        column = "nombre"
    if column == "dueño":
        column = "usuario_propietario"

    try:
        clinicas = Clinicas.objects.all()
        if search:
            # Para otras columnas, utiliza el filtrado dinámico basado en kwargs
            kwargs = {f"{column}__icontains": search}
            clinicas = clinicas.filter(**kwargs)

        # Ordenamiento de resultados
        clinicas = clinicas.order_by(f"-{column}" if order == "desc" else column)

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(clinicas, request)
        serializer_data = [
            {
                "clinica_id": clinicas.clinica_id,
                "clinica": clinicas.nombre,
                "direccion": clinicas.direccion,
                "telefono": clinicas.telefono,
                "dueño": clinicas.usuario_propietario.nombre,
                "activo": clinicas.activo,
            }
            for clinicas in result_page
        ]

        return paginator.get_paginated_response(serializer_data)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
@transaction.atomic
def add_clinic(request):
    try:
        clinica = request.data.get("clinica")
        dueno = request.data.get("usuario")
        telefono = request.data.get("telefono")
        direccion = request.data.get("direccion")

        print(clinica)
        print(dueno)
        print(telefono)
        print(direccion)

        usuario = Usuarios.objects.get(nombre=dueno).usuario

        # Verificar si ya existe una clínica con el mismo nombre
        if Clinicas.objects.filter(nombre=clinica).exists():
            return Response(
                {"error": "Ya hay una clínica con este nombre."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Preparar datos para el serializador
        data = {
            "nombre": clinica,
            "telefono": telefono,
            "direccion": direccion,
            "usuario_propietario": usuario,
            "activo": True,
        }

        # Validar con el serializador
        nuevaClinica = ClinicasSerializer(data=data)

        if nuevaClinica.is_valid():
            nuevaClinica.save()  # Guardar si es válido
            return Response(
                {"message": "Clínica agregada con éxito"},
                status=status.HTTP_201_CREATED,
            )
        else:
            print("NOT VALId")
            print(nuevaClinica.errors)
            return Response(
                {"errors": nuevaClinica.errors}, status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["PUT"])
def update_clinic(request, clinica_id):
    try:
        clin = Clinicas.objects.get(pk=clinica_id)  # Buscar clínica por el id

        # No permitimos modificar la llave primaria (usuario)
        clinica_nombre = request.data.get("clinica")
        direccion = request.data.get("direccion")
        telefono = request.data.get("telefono")
        dueno = request.data.get("usuario")

        try:
            ownerUser = Usuarios.objects.get(usuario=dueno)
        except Usuarios.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)

        # Actualizar los datos de la clínica
        clin.nombre = clinica_nombre
        clin.direccion = direccion
        clin.telefono = telefono
        clin.usuario_propietario = ownerUser
        clin.save()

        return Response(
            {"message": "Clínica actualizada con éxito."}, status=status.HTTP_200_OK
        )

    except Exception as e:
        print(f"Error actualizando clínica: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["PUT"])
def reactivate_clinic(request, clinica_id):
    try:
        clinica = Clinicas.objects.get(pk=clinica_id)
        clinica.activo = True
        clinica.save()
        return Response(
            {"message": "Clínica reactivada con éxito."},
            status=status.HTTP_200_OK,
        )
    except Clinicas.DoesNotExist:
        return Response(
            {"error": "Clínica no encontrada."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(["DELETE"])
def delete_clinic(request, clinica_id):
    try:
        clinica = Clinicas.objects.get(pk=clinica_id)
        clinica.activo = False
        clinica.save()
        return Response(
            {"message": "Clínica eliminada correctamente"}, status=status.HTTP_200_OK
        )
    except Clinicas.DoesNotExist:
        return Response(
            {"error": "Clínica no encontrada"}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

