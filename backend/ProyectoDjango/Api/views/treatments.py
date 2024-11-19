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

        serializer = TratamientosSerializer(treatments, many=True)
        data = serializer.data

        # Renombrar 'tratamiento_id' a 'id' en los datos serializados
        for item in data:
            item["id"] = item.pop("tratamiento_id")

        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error fetching treatments: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def add_treatment(request):
    try:
        serializer = TratamientosSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Tratamiento agregado con éxito."},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
def update_treatment(request, id):
    try:
        treatment = Tratamientos.objects.get(pk=id)
        serializer = TratamientosSerializer(treatment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Tratamiento actualizado con éxito."},
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )
    except Tratamientos.DoesNotExist:
        return Response(
            {"error": "Tratamiento no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["DELETE"])
def delete_treatment(request, id):
    try:
        treatment = Tratamientos.objects.get(pk=id)
        treatment.delete()
        return Response(
            {"message": "Tratamiento eliminado con éxito."}, status=status.HTTP_200_OK
        )
    except Tratamientos.DoesNotExist:
        return Response(
            {"error": "Tratamiento no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
