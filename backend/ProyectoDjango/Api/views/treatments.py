from .common import *


@api_view(["GET"])
def consult_treatments(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "nombre")
    order = request.GET.get("order", "asc")

    try:
        treatments = Tratamientos.objects.all()
        if search:
            kwargs = {f"{column}__icontains": search}
            treatments = treatments.filter(**kwargs)

        treatments = treatments.order_by(f"-{column}" if order == "desc" else column)

        # Paginación
        paginator = CustomPagination()
        page = paginator.paginate_queryset(treatments, request)

        serializer = TratamientosSerializer(page, many=True)
        data = serializer.data

        # Renombrar 'tratamiento_id' a 'id' en los datos serializados
        for item in data:
            item["id"] = item.pop("tratamiento_id")

        return paginator.get_paginated_response(data)
    except Exception as e:
        print(f"Error fetching treatments: {str(e)}")
        return Response([], status=status.HTTP_200_OK)


@api_view(["GET"])
def consult_treatments_fast(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "nombre")
    order = request.GET.get("order", "asc")

    try:
        treatments = Tratamientos.objects.all()
        if search:
            kwargs = {f"{column}__icontains": search}
            treatments = treatments.filter(**kwargs)

        treatments = treatments.order_by(f"-{column}" if order == "desc" else column)

        serializer = VacunasSerializer(treatments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error fetching treatments: {str(e)}")
        return Response([], status=status.HTTP_200_OK)


@api_view(["POST"])
def add_treatment(request):
    try:
        nombre = request.data.get("nombre")
        descripcion = request.data.get("descripcion")

        if not all([nombre, descripcion]):
            return JsonResponse(
                {"success": False, "error": "Todos los campos son requeridos"},
                status=400,
            )

        Tratamientos.objects.create(
            nombre=nombre,
            descripcion=descripcion,
            estado=1,  # Estado activo por defecto
        )

        return JsonResponse(
            {"success": True, "message": "Tratamiento agregado correctamente"},
            status=201,
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@api_view(["PUT"])
def update_treatment(request, id):
    try:
        treatment = Tratamientos.objects.get(pk=id)
        nombre = request.data.get("nombre")
        descripcion = request.data.get("descripcion")

        if not all([nombre, descripcion]):
            return JsonResponse(
                {"success": False, "error": "Todos los campos son requeridos"},
                status=400,
            )

        treatment.nombre = nombre
        treatment.descripcion = descripcion
        treatment.save()

        return JsonResponse(
            {"success": True, "message": "Tratamiento actualizado correctamente"},
            status=200,
        )
    except Tratamientos.DoesNotExist:
        return JsonResponse(
            {"success": False, "error": "Tratamiento no encontrado"}, status=404
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@api_view(["PUT"])
def desactivate_treatment(request, id):
    try:
        treatment = Tratamientos.objects.get(pk=id)
        treatment.estado = 0  # Desactivar
        treatment.save()

        return JsonResponse(
            {"success": True, "message": "Tratamiento desactivado correctamente"},
            status=200,
        )
    except Tratamientos.DoesNotExist:
        return JsonResponse(
            {"success": False, "error": "Tratamiento no encontrado"}, status=404
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@api_view(["PUT"])
def restore_treatment(request, id):
    try:
        treatment = Tratamientos.objects.get(pk=id)
        treatment.estado = 1  # Activar
        treatment.save()

        return JsonResponse(
            {"success": True, "message": "Tratamiento activado correctamente"},
            status=200,
        )
    except Tratamientos.DoesNotExist:
        return JsonResponse(
            {"success": False, "error": "Tratamiento no encontrado"}, status=404
        )
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)


@api_view(["GET"])
def consult_treatment_history(request):
    logged_user = request.session.get("user")
    if not logged_user:
        return JsonResponse(
            {"success": False, "error": "Usuario no autenticado"}, status=401
        )
    try:
        with connection.cursor() as cursor:
            result_set_cursor = cursor.connection.cursor()
            cursor.callproc(
                "VETLINK.ConsultarTratamientosPorUsuario",
                [logged_user, result_set_cursor],
            )
            columns = [col[0].lower() for col in result_set_cursor.description]
            results = [dict(zip(columns, row)) for row in result_set_cursor.fetchall()]
        result_set_cursor.close()
        return JsonResponse({"success": True, "results": results}, status=200)
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)
