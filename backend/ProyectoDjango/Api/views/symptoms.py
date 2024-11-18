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
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error fetching symptoms: {str(e)}")
        return Response([], status=status.HTTP_200_OK)

