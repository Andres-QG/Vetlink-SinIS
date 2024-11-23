from .common import *

from django.template.loader import get_template


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


def link_callback(uri, rel):
    """
    Convierte las rutas de recursos en rutas absolutas del sistema de archivos
    para que xhtml2pdf pueda acceder a ellas.
    """
    # Si el recurso es un archivo estático
    if uri.startswith(settings.STATIC_URL):
        path = os.path.join(settings.STATIC_ROOT, uri.replace(settings.STATIC_URL, ""))
    # Si el recurso es un archivo de media
    elif uri.startswith(settings.MEDIA_URL):
        path = os.path.join(settings.MEDIA_ROOT, uri.replace(settings.MEDIA_URL, ""))
    else:
        return uri  # Devolver la URI original si no se encuentra

    # Verificar que el archivo existe
    if not os.path.isfile(path):
        raise Exception(f"No se pudo encontrar el archivo {path}")
    return path


@csrf_exempt
@api_view(["GET"])
def generate_invoice(request, factura_id):
    try:
        # Obtener datos del usuario y rol
        rol_id = request.session.get("role")
        usuario = request.session.get("user")

        if not rol_id or not usuario:
            return Response(
                {"error": "Usuario no autenticado."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        with connection.cursor() as cursor:
            returned_cursor = cursor.connection.cursor()

            # Llamar al procedimiento almacenado
            cursor.callproc(
                "VETLINK.OBTENER_FACTURA",
                [usuario, rol_id, factura_id, returned_cursor],
            )

            # Obtener resultados del cursor
            columns = [col[0].lower() for col in returned_cursor.description]
            row = returned_cursor.fetchone()

            if not row:
                return Response(
                    {"error": "Factura no encontrada o acceso no autorizado."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Mapear los datos de la fila a un diccionario
            invoice_data = dict(zip(columns, row))

        # Preparar el contexto para la plantilla
        context = {
            "invoice": invoice_data,
            "usuario": usuario,
        }

        # Renderizar la plantilla HTML
        template = get_template("invoice_template.html")
        html_string = template.render(context)

        # Generar el PDF
        response = HttpResponse(content_type="application/pdf")
        filename = f"Factura_{factura_id}.pdf"
        response["Content-Disposition"] = f'attachment; filename="{filename}"'

        # Crear el PDF
        pisa_status = pisa.CreatePDF(
            src=html_string,
            dest=response,
            link_callback=link_callback,  # Necesario para manejar archivos estáticos
        )

        # Verificar si hubo errores
        if pisa_status.err:
            return Response(
                {"error": "Error al generar el PDF."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return response

    except Exception as e:
        print(f"Error al generar la factura: {str(e)}")
        return Response(
            {"error": "Error en el servidor. Por favor, intente más tarde."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
