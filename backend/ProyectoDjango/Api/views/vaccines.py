from .common import *

@api_view(["GET"])
def consult_vaccines(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "nombre")
    order = request.GET.get("order", "asc")

    try:
        vaccines = Vacunas.objects.all()
        if search:
            kwargs = {f"{column}__icontains": search}
            vaccines = vaccines.filter(**kwargs)

        vaccines = vaccines.order_by(f"-{column}" if order == "desc" else column)

        serializer = VacunasSerializer(vaccines, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error fetching vaccines: {str(e)}")
        return Response([], status=status.HTTP_200_OK)

# Vacunas para listado de vacunas

@api_view(["GET"])
def consult_clinic_vaccines(request):
    try:
        vacunas = Vacunas.objects.all()
        print(f"Total vaccines fetched: {vacunas.count()}")
        paginator = CustomPagination()
        page = paginator.paginate_queryset(vacunas, request)

        if page is not None:
            vacunas_list = [
                {"estado": vacuna.estado, "descripcion": vacuna.descripcion, "nombre": vacuna.nombre, "id": vacuna.vacuna_id}
                for vacuna in page
            ]
            return paginator.get_paginated_response(vacunas_list)

        return JsonResponse({'success': True, 'data': []}, status=200)

    except Vacunas.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Vacunas no encontradas'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


@api_view(["POST"])
def add_clinic_vaccine(request):
    try:
        nombre = request.data.get("nombre")
        descripcion = request.data.get("descripcion")

        if not all([nombre, descripcion]):
            return JsonResponse({
                'success': False, 'error': 'Todos los campos son requeridos'}, status=400)

        Vacunas.objects.create(nombre=nombre, descripcion=descripcion, estado=1) # default state is active
        return JsonResponse({
            'success': True, 'message': 'Vacuna agregada correctamente'}, status=201)

    except ValueError as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)
    except Vacunas.DoesNotExist as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


@api_view(["PUT"])
def update_clinic_vaccine(request, vacuna_id):
    try:
        vacuna = Vacunas.objects.get(pk=vacuna_id)
        nombre = request.data.get("nombre")
        descripcion = request.data.get("descripcion")

        if not all([nombre, descripcion]):
            return JsonResponse({
                'success': False, 'error': 'Todos los campos son requeridos'}, status=400)

        vacuna.nombre = nombre
        vacuna.descripcion = descripcion
        vacuna.save()

        return JsonResponse({
            'success': True, 'message': 'Vacuna actualizada correctamente'}, status=200)

    except Vacunas.DoesNotExist as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)

@api_view(["PUT"])
def deactivate_clinic_vaccine(request, vacuna_id):
    try:
        vacuna = Vacunas.objects.get(pk=vacuna_id)
        vacuna.estado = 0 # non active
        vacuna.save()
        return JsonResponse({
            'success': True, 'message': 'Vacuna desactivada correctamente'}, status=200)
    except Vacunas.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Vacuna no encontrada'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


@api_view(["PUT"])
def restore_clinic_vaccine(request, vacuna_id):
    try:
        vacuna = Vacunas.objects.get(pk=vacuna_id)
        vacuna.estado = 1 # active
        vacuna.save()
        return JsonResponse({
            'success': True, 'message': 'Vacuna desactivada correctamente'}, status=200)
    except Vacunas.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Vacuna no encontrada'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)
