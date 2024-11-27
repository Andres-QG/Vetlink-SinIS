from .common import *


@api_view(["GET"])
def consult_specialties_to_cards(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "nombre")
    order = request.GET.get("order", "asc")

    try:
        specialties = Especialidades.objects.all()
        if search:
            kwargs = {f"{column}__icontains": search}
            specialties = specialties.filter(**kwargs)

        specialties = specialties.order_by(f"-{column}" if order == "desc" else column)

        # Paginación
        paginator = CustomPagination()
        page = paginator.paginate_queryset(specialties, request)

        serializer = EspecialidadesSerializer(page, many=True)
        data = serializer.data

        # Renombrar 'especialidad_id' a 'id' y convertir 'activo' a 'estado' con 1 o 0
        for item in data:
            item["id"] = item.pop("especialidad_id")
            item["estado"] = 1 if item.pop("activo") else 0

        return paginator.get_paginated_response(data)
    except Exception as e:
        print(f"Error fetching specialties: {str(e)}")
        return Response([], status=status.HTTP_200_OK)


@api_view(["POST"])
def add_specialty(request):
    try:
        nombre = request.data.get("nombre")
        descripcion = request.data.get("descripcion")

        if not all([nombre, descripcion]):
            return JsonResponse(
                {"success": False, "error": "Todos los campos son requeridos"},
                status=400,
            )

        Especialidades.objects.create(
            nombre=nombre,
            descripcion=descripcion,
            activo=1,  # Estado activo por defecto
        )

        return JsonResponse(
            {"success": True, "message": "Especialidad agregada correctamente"},
            status=201,
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@api_view(["PUT"])
def update_specialty(request, id):
    try:
        specialty = Especialidades.objects.get(pk=id)
        nombre = request.data.get("nombre")
        descripcion = request.data.get("descripcion")

        if not all([nombre, descripcion]):
            return JsonResponse(
                {"success": False, "error": "Todos los campos son requeridos"},
                status=400,
            )

        specialty.nombre = nombre
        specialty.descripcion = descripcion
        specialty.save()

        return JsonResponse(
            {"success": True, "message": "Especialidad actualizada correctamente"},
            status=200,
        )
    except Especialidades.DoesNotExist:
        return JsonResponse(
            {"success": False, "error": "Especialidad no encontrada"}, status=404
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@api_view(["PUT"])
def deactivate_specialty(request, id):
    try:
        specialty = Especialidades.objects.get(pk=id)
        specialty.activo = 0  # Desactivar
        specialty.save()

        return JsonResponse(
            {"success": True, "message": "Especialidad desactivada correctamente"},
            status=200,
        )
    except Especialidades.DoesNotExist:
        return JsonResponse(
            {"success": False, "error": "Especialidad no encontrada"}, status=404
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@api_view(["PUT"])
def restore_specialty(request, id):
    try:
        specialty = Especialidades.objects.get(pk=id)
        specialty.activo = 1  # Activar
        specialty.save()

        return JsonResponse(
            {"success": True, "message": "Especialidad activada correctamente"},
            status=200,
        )
    except Especialidades.DoesNotExist:
        return JsonResponse(
            {"success": False, "error": "Especialidad no encontrada"}, status=404
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)
