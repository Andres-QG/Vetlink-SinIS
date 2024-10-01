from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.db import transaction
from .models import Usuarios, Mascotas
from .serializers import MascotaSerializer

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
def create_pet(request):
    try:
        usuario = request.data.get('usuario_cliente')
        
        # Verify client existence
        try:
            usuario_cliente = Usuarios.objects.get(usuario=usuario)  # Usar la columna usuario
        except Usuarios.DoesNotExist:
            return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Create a new pet that's associated with a client
        data = request.data
        data['usuario_cliente'] = usuario_cliente.usuario  
        
        serializer = MascotaSerializer(data=data)
        if serializer.is_valid():
            serializer.save()  
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



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
