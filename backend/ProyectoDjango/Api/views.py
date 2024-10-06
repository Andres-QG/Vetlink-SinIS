from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.db import transaction
from .models import Usuarios, Mascotas
from .serializers import MascotaSerializer

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
                "apellido1": usuario.apellido1,
                "apellido2": usuario.apellido2,
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

@api_view(['PUT'])
def update_client(request, usuario):
    try:
        # Verificar si se recibe el usuario correctamente
        print(f"Actualizando usuario: {usuario}")

        user = Usuarios.objects.get(usuario=usuario)  # Buscar el usuario por la llave primaria

        # Imprimir los datos recibidos en la solicitud
        print(f"Datos recibidos: {request.data}")

        # No permitimos modificar la llave primaria (usuario)
        correo = request.data.get('correo')
        nombre = request.data.get('nombre')
        apellido1 = request.data.get('apellido1')
        apellido2 = request.data.get('apellido2')
        telefono = request.data.get('telefono')
        cedula = request.data.get('cedula')

        # Verificar si el correo ya está en uso por otro usuario
        if Usuarios.objects.filter(correo=correo).exclude(usuario=usuario).exists():
            return Response({'error': 'El correo ya está en uso.'}, status=status.HTTP_400_BAD_REQUEST)

        # Actualizar los datos del usuario
        user.cedula = cedula
        user.correo = correo
        user.nombre = nombre
        user.apellido1 = apellido1
        user.apellido2 = apellido2
        user.telefono = telefono
        user.save()

        return Response({'message': 'Usuario actualizado con éxito.'}, status=status.HTTP_200_OK)

    except Usuarios.DoesNotExist:
        return Response({'error': 'Usuario no encontrado.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Imprimir el error exacto en el servidor
        print(f"Error actualizando usuario: {str(e)}")
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

