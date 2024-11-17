from .common import *

@api_view(["GET"])
def consult_mascotas(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "mascota_id")
    order = request.GET.get("order", "asc")

    try:
        mascotas = Mascotas.objects.all()

        if search:
            if column == "usuario_cliente":
                search_filter = {"usuario_cliente__usuario__icontains": search}
            else:
                search_filter = {f"{column}__icontains": search}
            mascotas = mascotas.filter(**search_filter)

        mascotas = mascotas.order_by(f"-{column}" if order == "desc" else column)

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(mascotas, request)
        serializer_data = [
            {
                "mascota_id": mascota.mascota_id,
                "nombre": mascota.nombre,
                "sexo": mascota.sexo,
                "especie": mascota.especie,
                "raza": mascota.raza,
                "fecha_nacimiento": mascota.fecha_nacimiento,
                "usuario_cliente": mascota.usuario_cliente.usuario,
                "activo": mascota.activo,
            }
            for mascota in result_page
        ]

        return paginator.get_paginated_response(serializer_data)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["POST"])
def create_pet(request):
    try:
        usuario = request.data.get("usuario_cliente")

        # Verificar la existencia del cliente
        try:
            usuario_cliente = Usuarios.objects.get(usuario=usuario)
        except Usuarios.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND
            )

        data = request.data

        # Verificar si se envía edad y no la fecha de nacimiento
        edad = data.get("edad", None)
        if edad:
            try:
                # Convertir la edad en fecha de nacimiento aproximada
                edad = int(edad)
                current_year = datetime.now().year
                birth_year = current_year - edad
                data["fecha_nacimiento"] = (
                    f"{birth_year}-01-01"  # Se asigna el 1 de enero por defecto
                )
            except ValueError:
                return Response(
                    {"error": "La edad debe ser un número entero."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Reemplazar el usuario_cliente por el objeto relacionado
        data["usuario_cliente"] = usuario_cliente.usuario

        data["activo"] = 1

        # Serializar los datos y crear la mascota
        serializer = MascotaSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["PUT"])
def update_pet(request, mascota_id):
    try:
        data = request.data
        usuario = data.get("usuario_cliente")

        # Verificar la existencia del usuario cliente
        try:
            usuario_cliente = Usuarios.objects.get(usuario=usuario)
        except Usuarios.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND
            )

        # Obtener la mascota a modificar
        try:
            mascota = Mascotas.objects.get(mascota_id=mascota_id)
        except Mascotas.DoesNotExist:
            return Response(
                {"error": "Mascota no encontrada."}, status=status.HTTP_404_NOT_FOUND
            )

        # Verificar si se envía la edad y convertirla en fecha de nacimiento aproximada si es necesario
        edad = data.get("edad", None)
        if edad:
            try:
                edad = int(edad)
                current_year = datetime.now().year
                birth_year = current_year - edad
                data["fecha_nacimiento"] = f"{birth_year}-01-01"
            except ValueError:
                return Response(
                    {"error": "La edad debe ser un número entero."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Asignar la instancia del usuario relacionado al campo usuario_cliente
        data["usuario_cliente"] = usuario_cliente.usuario

        # Serializar los datos con la instancia de la mascota existente
        serializer = MascotaSerializer(mascota, data=data)

        # Validar y guardar los datos actualizados
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["PUT"])
def reactivate_pet(request, mascota_id):
    try:
        mascota = Mascotas.objects.get(pk=mascota_id)
        mascota.activo = True
        mascota.save()
        return Response(
            {"message": "Mascota reactivada con éxito."},
            status=status.HTTP_200_OK,
        )
    except Mascotas.DoesNotExist:
        return Response(
            {"error": "Mascota no encontrada."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["DELETE"])
def delete_pet(request, mascota_id):
    try:
        mascota = Mascotas.objects.get(pk=mascota_id)
        mascota.activo = False
        mascota.save()
        return Response(
            {"message": "Mascota desactivada correctamente."}, status=status.HTTP_200_OK
        )
    except Mascotas.DoesNotExist:
        return Response(
            {"error": "Mascota no encontrada."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

