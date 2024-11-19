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

        serializer = SintomasSerializer(symptoms, many=True)
        data = serializer.data

        # Renombrar 'sintoma_id' a 'id' en los datos serializados
        for item in data:
            item["id"] = item.pop("sintoma_id")

        return Response(data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error fetching symptoms: {str(e)}")
        return Response([], status=status.HTTP_200_OK)


@api_view(["POST"])
def add_symptom(request):
    try:
        data = {
            "nombre": request.data.get("nombre"),
            "descripcion": request.data.get("descripcion"),
        }
        serializer = SintomasSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Síntoma agregado con éxito."},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
def update_symptom(request, id):
    try:
        symptom = Sintomas.objects.get(pk=id)
        serializer = SintomasSerializer(symptom, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Síntoma actualizado con éxito."}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )
    except Sintomas.DoesNotExist:
        return Response(
            {"error": "Síntoma no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["DELETE"])
def delete_symptom(request, id):
    try:
        symptom = Sintomas.objects.get(pk=id)
        symptom.delete()
        return Response(
            {"message": "Síntoma eliminado con éxito."}, status=status.HTTP_200_OK
        )
    except Sintomas.DoesNotExist:
        return Response(
            {"error": "Síntoma no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
