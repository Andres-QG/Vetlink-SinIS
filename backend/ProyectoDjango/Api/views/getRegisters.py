from .common import *

@api_view(["GET"])
def get_clients(request):
    try:
        with connection.cursor() as cursor:
            out_clientes = cursor.var(str).var
            cursor.callproc("VETLINK.OBTENER_CLIENTES_JSON", [out_clientes])

        clientes_data = out_clientes.getvalue()
        if clientes_data is None:
            return Response({"clients": []})

        clientes_json = json.loads(out_clientes.getvalue())
        return Response({"clients": clientes_json})

    except Exception as e:
        print("Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_vets(request):
    try:
        with connection.cursor() as cursor:
            out_vets = cursor.var(str).var
            cursor.callproc("VETLINK.OBTENER_VETERINARIOS_JSON", [out_vets])

        vets_data = out_vets.getvalue()
        if vets_data is None:
            return Response({"vets": []})

        vets_json = json.loads(vets_data)
        return Response({"vets": vets_json})

    except Exception as e:
        print("Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_owners(request):
    owners = Usuarios.objects.filter(rol_id=1)
    serializer = NameUsuariosSerializer(owners, many=True)
    if serializer:
        return Response(
            {
                "status": "success",
                "message": "Propietarios obtenidos",
                "owners": serializer.data,
            }
        )
    else:
        return Response(
            {"status": "error", "message": "No se pudo obtener propietarios"}
        )

@api_view(["PUT"])
def get_pets(request):
    try:
        in_client = request.data.get("cliente")
        with connection.cursor() as cursor:
            out_pets = cursor.var(str).var
            cursor.callproc("VETLINK.OBTENER_MASCOTAS_JSON", [in_client, out_pets])

        pets_data = out_pets.getvalue()
        if not pets_data:
            return Response({"pets": []})

        pets_json = json.loads(pets_data)
        return Response({"pets": pets_json})

    except Exception as e:
        print("Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_services(request):
    services = Servicios.objects.all()
    serializer = ServiciosNameSerializer(services, many=True)

    if serializer.data:
        return Response(
            {
                "status": "success",
                "message": "Servicios obtenidos",
                "services": serializer.data,
            }
        )
    else:
        return Response(
            {"status": "error", "message": "No se pudo obtener los servicios"}
        )

@api_view(["GET"])
def get_clinics(request):
    try:
        with connection.cursor() as cursor:
            out_clinicas = cursor.var(str).var
            cursor.callproc("VETLINK.OBTENER_CLINICAS_JSON", [out_clinicas])

        clinics_data = out_clinicas.getvalue()
        if clinics_data is None:
            return Response({"clinics": []})

        clinicas_json = json.loads(out_clinicas.getvalue())
        return Response({"clinics": clinicas_json})

    except Exception as e:
        print("Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_payment_methods(request):
    try:
        in_client = request.session.get("user")
        with connection.cursor() as cursor:
            out_metodos = cursor.var(str).var
            cursor.callproc("VETLINK.OBTENER_METODOS_DE_PAGO_JSON", [in_client, out_metodos])

        metodos_data = out_metodos.getvalue()
        if metodos_data is None:
            return Response({"methods": []})

        metodos_json = json.loads(out_metodos.getvalue())

        for method in metodos_json:
            encrypted_numero_tarjeta = method.get('numero_tarjeta')
            if encrypted_numero_tarjeta:
                try:
                    decrypted_numero_tarjeta = decrypt_data(encrypted_numero_tarjeta)
                    method['numero_tarjeta'] = decrypted_numero_tarjeta
                except Exception as decrypt_error:
                    method['numero_tarjeta'] = None

        return Response({"methods": metodos_json})

    except Exception as e:
        print("Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
