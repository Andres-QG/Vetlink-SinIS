from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Usuarios

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

    
@api_view(['GET'])
def consult_client(request):
    try:
        # Filtrar usuarios que tienen el rol de cliente (ID 4)
        usuarios_clientes = Usuarios.objects.filter(rol=4)

        # Comprobar si hay usuarios
        if usuarios_clientes.exists():
            # Serializar solo los campos deseados
            serializer_data = [
                {
                    "usuario": usuario.usuario,
                    "cedula": usuario.cedula,
                    "nombre": usuario.nombre,
                    "telefono": usuario.telefono,
                    "correo": usuario.correo,
                }
                for usuario in usuarios_clientes
            ]
            return Response(serializer_data, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'No se encontraron clientes.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
