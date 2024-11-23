from .common import *


@api_view(["GET"])
def consult_payment_history(request):
    from datetime import datetime

    # Obtener parámetros de búsqueda, columna, y orden
    search = request.GET.get("search", "")
    column = request.GET.get("column", "fecha_pago")
    order = request.GET.get("order", "asc")

    try:
        # Obtener el rol y usuario de la sesión
        rol_id = request.session.get("role")
        usuario = request.session.get("user")
        clinica_id = request.session.get("clinica_id") if rol_id == 2 else None

        if not rol_id or not usuario:
            return Response(
                {"error": "Usuario no autenticado."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        with connection.cursor() as cursor:
            returned_cursor = cursor.connection.cursor()

            # Configurar los parámetros según el rol
            if rol_id in [1, 2]:
                cursor.callproc(
                    "VETLINK.CONSULTAR_HISTORIAL_PAGOS",
                    [usuario, rol_id, returned_cursor],
                )
            else:
                return Response(
                    {
                        "error": "No tiene permisos para consultar el historial de pagos."
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Obtener resultados del cursor
            columns = [col[0].lower() for col in returned_cursor.description]
            payments = [dict(zip(columns, row)) for row in returned_cursor.fetchall()]

            # Procesar los datos
            for payment in payments:
                # Formatear la fecha
                fecha_factura = payment.pop("fecha_factura", None)
                if fecha_factura:
                    payment["fecha"] = fecha_factura.strftime("%d/%m/%Y")
                else:
                    payment["fecha"] = "Fecha no disponible"

                # Renombrar claves y formatear datos
                payment["estado"] = payment.pop("estado_factura", None)
                payment["monto_total"] = f"₡{payment['monto_total']:,.2f}"

            if not payments:
                return Response(
                    {"error": "No se encontraron registros en el historial de pagos."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Filtrar por búsqueda
            if search:
                payments = [
                    record
                    for record in payments
                    if search.lower() in str(record.get(column, "")).lower()
                ]

            # Ordenar resultados
            payments.sort(key=lambda x: x.get(column, ""), reverse=(order == "desc"))

            paginator = CustomPagination()
            result_page = paginator.paginate_queryset(payments, request)
            return paginator.get_paginated_response(result_page)

    except Exception as e:
        # Log para depuración
        print(f"Error en consult_payment_history: {str(e)}")
        return Response(
            {"error": "Error en el servidor. Por favor, intente más tarde."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
