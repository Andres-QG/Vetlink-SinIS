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
