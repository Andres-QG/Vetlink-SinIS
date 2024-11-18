from .common import *

@api_view(["POST"])
def add_servicio(request):
    nombre = request.data.get("nombre")
    descripcion = request.data.get("descripcion")
    numero_sesiones = request.data.get("numero_sesiones")
    minutos_sesion = request.data.get("minutos_sesion")
    costo = request.data.get("costo")
    activo = True
    imagen = request.FILES.get("imagen")  # Obtener la imagen desde el formulario

    if not all([nombre, descripcion, numero_sesiones, minutos_sesion, costo, imagen]):
        return Response(
            {"error": "Todos los campos son requeridos."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        # Formatear el nombre para el directorio
        nombre_formateado = format_service_name(nombre)
        ruta_carpeta = os.path.join(
            "static", "assets", "img", f"Service_{nombre_formateado}"
        )
        ruta_completa = os.path.normpath(os.path.join(settings.BASE_DIR, ruta_carpeta))

        # Crear la carpeta si no existe
        os.makedirs(ruta_completa, exist_ok=True)

        # Guardar la imagen en la carpeta especificada
        ruta_imagen = os.path.join(ruta_carpeta, imagen.name)
        ruta_imagen_completa = os.path.normpath(
            os.path.join(settings.BASE_DIR, ruta_imagen)
        )

        with open(ruta_imagen_completa, "wb+") as destino:
            for chunk in imagen.chunks():
                destino.write(chunk)

        # Guardar el registro en la base de datos con la ruta de la imagen
        servicio = Servicios.objects.create(
            nombre=nombre,
            descripcion=descripcion,
            numero_sesiones=numero_sesiones,
            minutos_sesion=minutos_sesion,
            costo=costo,
            activo=activo,
            dir_imagen=ruta_imagen.replace(
                "\\", "/"
            ),  # Reemplazar las barras invertidas por barras
        )

        return Response(
            {"message": "Servicio agregado exitosamente."},
            status=status.HTTP_201_CREATED,
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def consult_services(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "nombre")
    order = request.GET.get("order", "asc")

    try:
        servicios = Servicios.objects.all()
        if search:
            kwargs = {f"{column}__icontains": search}
            servicios = servicios.filter(**kwargs)

        # Ordenamiento de resultados
        servicios = servicios.order_by(f"-{column}" if order == "desc" else column)

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(servicios, request)
        serializer_data = [
            {
                "servicio_id": servicio.servicio_id,
                "nombre": servicio.nombre,
                "descripcion": servicio.descripcion,
                "numero_sesiones": servicio.numero_sesiones,
                "minutos_sesion": servicio.minutos_sesion,
                "costo": servicio.costo,
                "activo": servicio.activo,
                "imagen": servicio.dir_imagen,
            }
            for servicio in result_page
        ]

        return paginator.get_paginated_response(serializer_data)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["PUT"])
def update_servicio(request, servicio_id):
    try:
        servicio = Servicios.objects.get(pk=servicio_id)
        nombre = request.data.get("nombre")
        descripcion = request.data.get("descripcion")
        numero_sesiones = request.data.get("numero_sesiones")
        minutos_sesion = request.data.get("minutos_sesion")
        costo = request.data.get("costo")
        imagen = request.FILES.get(
            "imagen"
        )  # Obtener la nueva imagen desde el formulario

        # Actualizar los datos del servicio
        if nombre:
            servicio.nombre = nombre
        if descripcion:
            servicio.descripcion = descripcion
        if numero_sesiones:
            servicio.numero_sesiones = numero_sesiones
        if minutos_sesion:
            servicio.minutos_sesion = minutos_sesion
        if costo:
            servicio.costo = costo

        # Manejar la imagen
        if imagen:
            # Eliminar la imagen anterior si existe
            if servicio.dir_imagen:
                ruta_imagen_anterior = os.path.join(
                    settings.BASE_DIR, servicio.dir_imagen
                )
                if os.path.exists(ruta_imagen_anterior):
                    os.remove(ruta_imagen_anterior)

            # Guardar la nueva imagen
            nombre_formateado = format_service_name(servicio.nombre)
            ruta_carpeta = os.path.join(
                "static", "assets", "img", f"Service_{nombre_formateado}"
            )
            ruta_completa = os.path.normpath(
                os.path.join(settings.BASE_DIR, ruta_carpeta)
            )

            # Crear la carpeta si no existe
            os.makedirs(ruta_completa, exist_ok=True)

            # Guardar la imagen en la carpeta especificada
            ruta_imagen = os.path.join(ruta_carpeta, imagen.name)
            ruta_imagen_completa = os.path.normpath(
                os.path.join(settings.BASE_DIR, ruta_imagen)
            )

            with open(ruta_imagen_completa, "wb+") as destino:
                for chunk in imagen.chunks():
                    destino.write(chunk)

            # Actualizar el path de la imagen en el servicio
            servicio.dir_imagen = ruta_imagen.replace("\\", "/")

        servicio.save()
        return Response(
            {"message": "Servicio actualizado con éxito."}, status=status.HTTP_200_OK
        )
    except Servicios.DoesNotExist:
        return Response(
            {"error": "Servicio no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["PUT"])
def reactivate_service(request, servicio_id):
    try:
        servicio = Servicios.objects.get(pk=servicio_id)
        servicio.activo = True
        servicio.save()
        return Response(
            {"message": "Servicio reactivado con éxito."}, status=status.HTTP_200_OK
        )
    except Servicios.DoesNotExist:
        return Response(
            {"error": "Servicio no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["DELETE"])
def delete_service(request, servicio_id):
    try:
        servicio = Servicios.objects.get(pk=servicio_id)
        servicio.activo = False
        servicio.save()
        return Response(
            {"message": "Servicio desactivado correctamente."},
            status=status.HTTP_200_OK,
        )
    except Servicios.DoesNotExist:
        return Response(
            {"error": "Servicio no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def format_service_name(nombre):
    # Remover caracteres especiales y espacios
    return re.sub(r"[^A-Za-z0-9]+", "", nombre)
