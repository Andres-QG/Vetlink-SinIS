from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.contrib.auth import logout
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.db import transaction
from .models import Usuarios, Mascotas, Clinicas
from .serializers import MascotaSerializer
import random
from datetime import datetime

class CustomPagination(PageNumberPagination):
    page_size = 10  # Número de registros por página
    page_size_query_param = 'page_size'  # Puedes ajustar el tamaño de la página desde la query
    max_page_size = 100  # Tamaño máximo de la página que puedes solicitar

@api_view(['POST'])
def check_user_exists(request):
    user = request.data.get('user')
    password = request.data.get('password')

    if not user or not password:
        return Response({"error": "Username and cedula are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        userResponse = Usuarios.objects.get(usuario=user) 

        if check_password(password, userResponse.clave):
            request.session['user'] = userResponse.usuario
            request.session['role'] = userResponse.rol_id
            print("Current session:", request.session.items())
            return Response({'exists': True, 'message': f'User {user} authenticated.', 'rol': userResponse.rol_id}, status=status.HTTP_200_OK)
        else:
            return Response({'exists': False, 'message': 'Password incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

    except:
        return Response({'exists': False, 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        

@api_view(['POST'])
def reset_password(request):
    email = request.data.get('email') # Obtiene el correo de la solicitud
    if not email:
        return Response({"error": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        userResponse = Usuarios.objects.get(correo=email) # Revisa que exista un usuario que tenga ese correo asociado
        verification_code = random.randint(100000, 999999) # Genera un número aleatorio de 6 dígitos
        
        send_mail(
            'Código de reinicio de contraseña', #Asunto
            f'Tu código para reiniciar la contraseña es {verification_code}.', # Cuerpo
            'vetlinkmail@gmail.com', # Desde este correo
            [email], # Hacia este correo
            fail_silently=False, # Mostrar errores
        )
        request.session['reset_code'] = verification_code # Guarda el código en la sesión
        request.session['email'] = email
        
        if userResponse.correo == email:
            return Response({'exists': True, 'message': f'Email authenticated.', 'rol': 5}, status=status.HTTP_200_OK)
    except Usuarios.DoesNotExist:
        return Response({'exists': False, 'message': 'Failed to verify email.'}, status=status.HTTP_404_NOT_FOUND)

    
@api_view(['POST'])
def verify_code(request):
    values_str = int(''.join(request.data.get('values'))) # Casteo a int de los valores digitados por el usuario
    if request.session.get('reset_code') == values_str: # Verificacion de que el codigo sea el enviado al correo
        return Response({'exists': True, 'status': 'success'}, status=status.HTTP_200_OK)
    else:
        return Response({'exists': False, 'message': 'Failed to verify code.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def check_new_pass(request):
    newPass = request.data.get('newPass')
    confPass = request.data.get('confPass')
    if newPass != confPass or not newPass or not confPass: # Revisa que las contraseñas no esten vacias y sean iguales
        return Response({'exists': False, 'message': 'Failed to verify passwords.'}, status=status.HTTP_404_NOT_FOUND)

    email = request.session.get('email')
    if email:
        try:
            userResponse = Usuarios.objects.get(correo = email) # Revisa que exista un usuario que tenga ese correo asociado
        except Usuarios.DoesNotExist:
            return Response({'exists': False, 'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({'exists': False, 'message': 'Failed to verify passwords.'}, status=status.HTTP_404_NOT_FOUND)

    if check_password(newPass, userResponse.clave):
        return Response({'exists': False, 'message': 'Password can\'t be the same as your previous', 'same': True}, status=status.HTTP_200_OK)

    hashed_password = make_password(newPass)
    userResponse.clave = hashed_password
    userResponse.save()
    return Response({'exists': True, 'status': 'success'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def consult_clinics(request):
    search = request.GET.get('search', '')
    column = request.GET.get('column', 'nombre')
    order = request.GET.get('order', 'asc')

    try:
        clinicas = Clinicas.objects.all()
        if search:
            # Para otras columnas, utiliza el filtrado dinámico basado en kwargs
            kwargs = {f'{column}__icontains': search}
            clinicas = clinicas.filter(**kwargs)

        # Ordenamiento de resultados
        clinicas = clinicas.order_by(f'-{column}' if order == 'desc' else column)

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(clinicas, request)
        serializer_data = [
            {
                "clinica": clinicas.nombre,
                "direccion": clinicas.direccion,
                "telefono": clinicas.telefono,
                "dueño": clinicas.usuario_propietario.nombre,
            }
            for clinicas in result_page
        ]

        return paginator.get_paginated_response(serializer_data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def create_pet(request):
    try:
        usuario = request.data.get('usuario_cliente')
        
        # Verificar la existencia del cliente
        try:
            usuario_cliente = Usuarios.objects.get(usuario=usuario) 
        except Usuarios.DoesNotExist:
            return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data

        # Verificar si se envía edad y no la fecha de nacimiento
        edad = data.get('edad', None)
        if edad:
            try:
                # Convertir la edad en fecha de nacimiento aproximada
                edad = int(edad)
                current_year = datetime.now().year
                birth_year = current_year - edad
                data['fecha_nacimiento'] = f"{birth_year}-01-01"  # Se asigna el 1 de enero por defecto
            except ValueError:
                return Response({'error': 'La edad debe ser un número entero.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Reemplazar el usuario_cliente por el objeto relacionado
        data['usuario_cliente'] = usuario_cliente.usuario  
        
        # Serializar los datos y crear la mascota
        serializer = MascotaSerializer(data=data)
        if serializer.is_valid():
            serializer.save()  
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(['GET'])
def get_user_role(request):
    role = request.session.get('role')
    
    print("Current session:", request.session.items())
    if role:
        return Response({'status':'success', 'message': 'Role acquired', 'role': role})
    else:
        return Response({'status':'error', 'message':'User not logged in'})

@api_view(['GET'])
def consult_client(request):
    search = request.GET.get('search', '')
    column = request.GET.get('column', 'usuario')
    order = request.GET.get('order', 'asc')

    try:
        usuarios_clientes = Usuarios.objects.filter(rol=4)
        if search:
            if column == "apellidos":
                # Si la columna de búsqueda es 'apellidos', filtra por 'apellido1' y 'apellido2'
                usuarios_clientes = usuarios_clientes.filter(
                    Q(apellido1__icontains=search) | Q(apellido2__icontains=search)
                )
            else:
                # Para otras columnas, utiliza el filtrado dinámico basado en kwargs
                kwargs = {f'{column}__icontains': search}
                usuarios_clientes = usuarios_clientes.filter(**kwargs)

        # Ordenación de resultados
        if column == "apellidos":
            # Si se ordena por 'apellidos', se ordena por 'apellido1' y luego por 'apellido2'
            usuarios_clientes = usuarios_clientes.order_by(f'-apellido1', '-apellido2' if order == 'desc' else 'apellido1', 'apellido2')
        else:
            usuarios_clientes = usuarios_clientes.order_by(f'-{column}' if order == 'desc' else column)

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(usuarios_clientes, request)
        serializer_data = [
            {
                "usuario": usuario.usuario,
                "cedula": usuario.cedula,
                "nombre": usuario.nombre,
                "apellidos": f"{usuario.apellido1} {usuario.apellido2}",
                "telefono": usuario.telefono,
                "correo": usuario.correo,
            }
            for usuario in result_page
        ]

        return paginator.get_paginated_response(serializer_data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@transaction.atomic
def add_client(request):
    try:
        data = request.data
        usuario = data.get('usuario')
        cedula = data.get('cedula')
        correo = data.get('correo')
        nombre = data.get('nombre')
        apellido1 = data.get('apellido1')
        apellido2 = data.get('apellido2')
        telefono = data.get('telefono')
        clave = data.get('clave')

        # Verificar si ya existe un usuario con el mismo 'usuario' o 'correo'
        if Usuarios.objects.filter(Q(usuario=usuario) | Q(correo=correo)).exists():
            return Response({'error': 'El usuario o el correo ya están en uso.'}, status=status.HTTP_400_BAD_REQUEST)

        hashed_password = make_password(clave)  # Hashear la contraseña

        nuevo_cliente = Usuarios(
            usuario=usuario,
            cedula=cedula,
            nombre=nombre,
            apellido1=apellido1,
            apellido2=apellido2,
            telefono=telefono,
            correo=correo,
            clave=hashed_password,
            rol_id=4  # Rol para cliente
        )
        nuevo_cliente.save()
        return Response({'message': 'Cliente agregado con éxito'}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def log_out(request):
    if logout(request):
        return Response({'status':'success', 'message':'User logged out succesfully'})
    else:
        return Response({'status':'failed', 'message':'Couldn\' log out'})
    


@api_view(['GET'])
def consult_mascotas(request):
    search = request.GET.get('search', '')
    column = request.GET.get('column', 'nombre')  
    order = request.GET.get('order', 'asc')

    try:
        mascotas = Mascotas.objects.all()

        if search:
            # Realizar la búsqueda en la columna especificada
            if column == "usuario_cliente":
                search_filter = {'usuario_cliente__usuario__icontains': search}
            else:
                search_filter = {f'{column}__icontains': search}
            mascotas = mascotas.filter(**search_filter)

        if order == 'desc':
            mascotas = mascotas.order_by(f'-{column}')
        else:
            mascotas = mascotas.order_by(column)

        # Paginar los resultados
        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(mascotas, request)
        serializer = MascotaSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

