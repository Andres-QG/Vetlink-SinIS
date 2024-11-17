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
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error fetching treatments: {str(e)}")
        return Response([], status=status.HTTP_200_OK)

