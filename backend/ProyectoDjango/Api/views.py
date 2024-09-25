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
