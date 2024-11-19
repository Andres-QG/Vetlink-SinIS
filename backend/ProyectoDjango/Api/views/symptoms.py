from .common import *


@api_view(["GET"])
def consult_symptoms(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "nombre")
    order = request.GET.get("order", "asc")

    try:
        symptoms = Sintomas.objects.all()
        if search:
            kwargs = {f"{column}__icontains": search}
            symptoms = symptoms.filter(**kwargs)

        symptoms = symptoms.order_by(f"-{column}" if order == "desc" else column)

        # Paginación
        paginator = CustomPagination()
        page = paginator.paginate_queryset(symptoms, request)

        serializer = SintomasSerializer(page, many=True)
        data = serializer.data

        # Renombrar 'sintoma_id' a 'id' en los datos serializados
        for item in data:
            item["id"] = item.pop("sintoma_id")

        return paginator.get_paginated_response(data)
    except Exception as e:
        print(f"Error fetching symptoms: {str(e)}")
        return Response([], status=status.HTTP_200_OK)


@api_view(["POST"])
def add_symptom(request):
    try:
        nombre = request.data.get("nombre")
        descripcion = request.data.get("descripcion")

        if not all([nombre, descripcion]):
            return JsonResponse(
                {"success": False, "error": "Todos los campos son requeridos"},
                status=400,
            )

        Sintomas.objects.create(
            nombre=nombre, descripcion=descripcion, estado=1
        )  # estado activo por defecto
        return JsonResponse(
            {"success": True, "message": "Síntoma agregado correctamente"}, status=201
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@api_view(["PUT"])
def update_symptom(request, id):
    try:
        symptom = Sintomas.objects.get(pk=id)
        nombre = request.data.get("nombre")
        descripcion = request.data.get("descripcion")

        if not all([nombre, descripcion]):
            return JsonResponse(
                {"success": False, "error": "Todos los campos son requeridos"},
                status=400,
            )

        symptom.nombre = nombre
        symptom.descripcion = descripcion
        symptom.save()

        return JsonResponse(
            {"success": True, "message": "Síntoma actualizado correctamente"},
            status=200,
        )
    except Sintomas.DoesNotExist:
        return JsonResponse(
            {"success": False, "error": "Síntoma no encontrado"}, status=404
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@api_view(["PUT"])
def desactivate_symptom(request, id):
    try:
        symptom = Sintomas.objects.get(pk=id)
        symptom.estado = 0  # desactivar
        symptom.save()
        return JsonResponse(
            {"success": True, "message": "Síntoma desactivado correctamente"},
            status=200,
        )
    except Sintomas.DoesNotExist:
        return JsonResponse(
            {"success": False, "error": "Síntoma no encontrado"}, status=404
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@api_view(["PUT"])
def restore_symptom(request, id):
    try:
        symptom = Sintomas.objects.get(pk=id)
        symptom.estado = 1  # activar
        symptom.save()
        return JsonResponse(
            {"success": True, "message": "Síntoma activado correctamente"}, status=200
        )
    except Sintomas.DoesNotExist:
        return JsonResponse(
            {"success": False, "error": "Síntoma no encontrado"}, status=404
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)
