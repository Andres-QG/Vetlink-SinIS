from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.db import transaction
from .models import Usuarios, Mascotas, Pesos, ConsultaMascotas, Vacunas, Sintomas, Tratamientos, ConsultaVacunas, ConsultaSintomas, ConsultaTratamientos
from .serializers import MascotaSerializer, PesoSerializer, ConsultaMascotasSerializer, ConsultaVacunaSerializer, ConsultaSintomaSerializer, ConsultaTratamientoSerializer

class CustomPagination(PageNumberPagination):
    page_size = 10  # Número de registros por página
    page_size_query_param = 'page_size'  # Puedes ajustar el tamaño de la página desde la query
    max_page_size = 100  # Tamaño máximo de la página que puedes solicitar

@api_view(['POST'])
def check_user_exists(request):
    # Extract username and password from the request body
    user = request.data.get('user')
    password = request.data.get('password')

    if not user or not password:
        return Response({"error": "Username and cedula are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        userResponse = Usuarios.objects.get(usuario=user, clave=password) 
        return Response({'exists': True, 'message': f'User {user} found.'}, status=status.HTTP_200_OK)
    except:
        return Response({'exists': False, 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def create_mascota(request):
    try:
        with transaction.atomic():  # Todas las operaciones se hacen dentro de una transacción
            # 1. Crear Mascota
            mascota_data = request.data.get('mascota')
            mascota_serializer = MascotaSerializer(data=mascota_data)
            if mascota_serializer.is_valid():
                mascota = mascota_serializer.save()
            else:
                return Response(mascota_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # 2. Crear Peso relacionado con la mascota
            peso_data = request.data.get('peso')
            peso_data['id_mascota'] = mascota.mascota_id
            peso_serializer = PesoSerializer(data=peso_data)
            if peso_serializer.is_valid():
                peso_serializer.save()
            else:
                return Response(peso_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # 3. Crear Consulta relacionada con la mascota
            consulta_data = request.data.get('consulta_mascota')
            consulta_data['id_mascota'] = mascota.mascota_id
            consulta_serializer = ConsultaSerializer(data=consulta_data)
            if consulta_serializer.is_valid():
                consulta = consulta_serializer.save()
            else:
                return Response(consulta_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # 4. Crear Síntomas asociados a la consulta
            sintomas_data = request.data.get('sintomas')
            for sintoma in sintomas_data:
                sintoma_serializer = SintomaSerializer(data=sintoma)
                if sintoma_serializer.is_valid():
                    sintoma_obj = sintoma_serializer.save()
                    # Crear registro en ConsultaSintomas
                    consulta_sintoma_data = {
                        "id_consulta": consulta.id_consulta,
                        "id_sintoma": sintoma_obj.id_sintoma
                    }
                    consulta_sintoma_serializer = ConsultaSintomaSerializer(data=consulta_sintoma_data)
                    if consulta_sintoma_serializer.is_valid():
                        consulta_sintoma_serializer.save()
                    else:
                        return Response(consulta_sintoma_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response(sintoma_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # 5. Crear Tratamientos asociados a la consulta
            tratamientos_data = request.data.get('tratamientos')
            for tratamiento in tratamientos_data:
                tratamiento_serializer = TratamientoSerializer(data=tratamiento)
                if tratamiento_serializer.is_valid():
                    tratamiento_obj = tratamiento_serializer.save()
                    # Crear registro en ConsultaTratamientos
                    consulta_tratamiento_data = {
                        "id_consulta": consulta.id_consulta,
                        "id_tratamiento": tratamiento_obj.id_tratamiento
                    }
                    consulta_tratamiento_serializer = ConsultaTratamientoSerializer(data=consulta_tratamiento_data)
                    if consulta_tratamiento_serializer.is_valid():
                        consulta_tratamiento_serializer.save()
                    else:
                        return Response(consulta_tratamiento_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response(tratamiento_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # 6. Crear Vacunas asociados a la consulta
            vacunas_data = request.data.get('vacunas')
            for vacuna in vacunas_data:
                vacuna_serializer = VacunaSerializer(data=vacuna)
                if vacuna_serializer.is_valid():
                    vacuna_obj = vacuna_serializer.save()
                    # Crear registro en ConsultaVacunas
                    consulta_vacuna_data = {
                        "id_consulta": consulta.id_consulta,
                        "id_vacuna": vacuna_obj.id_vacuna
                    }
                    consulta_vacuna_serializer = ConsultaVacunaSerializer(data=consulta_vacuna_data)
                    if consulta_vacuna_serializer.is_valid():
                        consulta_vacuna_serializer.save()
                    else:
                        return Response(consulta_vacuna_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response(vacuna_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response({"message": "Mascota y datos asociados creados correctamente."}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def consult_client(request):
    try:
        usuarios_clientes = Usuarios.objects.filter(rol=4)

        # Crear instancia de paginador
        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(usuarios_clientes, request)

        serializer_data = [
            {
                "usuario": usuario.usuario,
                "cedula": usuario.cedula,
                "nombre": usuario.nombre,
                "telefono": usuario.telefono,
                "correo": usuario.correo,
            }
            for usuario in result_page
        ]

        return paginator.get_paginated_response(serializer_data)  # Devuelve respuesta paginada
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
