from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from .models import Usuarios
from .serializers import UsuariosSerializer

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
            request.session['username'] = userResponse.usuario
            return Response({'exists': True, 'message': f'User {user} authenticated.', 'rol': userResponse.rol_id}, status=status.HTTP_200_OK)
        else:
            return Response({'exists': False, 'message': 'Password incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

    except:
        return Response({'exists': False, 'message': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

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


@api_view(["GET"])
def consult_vet(request):
    try:
        users = Usuarios.objects.filter(rol=3)
        serializer = UsuariosSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def create_user(request):
    try:
        serializer = UsuariosSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


"""
curl -X POST http://127.0.0.1:8000/create-user/ \
-H "Content-Type: application/json" \
-d '{
    "usuario": "nuevo_usuario",
    "rol": 3,
    "clave": "123456",
    "cedula": "123456789",
    "nombre": "prueba",
    "telefono": "0987654321",
    "correo": "prueba.subida@correo.com"
    "clinica" : 1,
    "especialidad" : 1
    
    
}'

class Usuarios(models.Model):
    usuario = models.CharField(primary_key=True, max_length=40, db_comment='Este campo es la llave primaria y almacena el nombre de usuario ·nico para cada usuario en el sistema. Debe ser ·nico y se utiliza para iniciar sesi≤n.')
    cedula = models.CharField(max_length=30, db_comment='Este almacena el n·mero de cΘdula del usuario.')
    nombre = models.CharField(max_length=50, db_comment='Este campo almacena el nombre completo del usuario. Es ·til para identificar al usuario dentro del sistema.')
    telefono = models.CharField(max_length=20, blank=True, null=True, db_comment='Este campo almacena el n·mero de telΘfono del usuario, permitiendo el contacto directo si es necesario.')
    correo = models.CharField(unique=True, max_length=30, db_comment='Este campo almacena la direcci≤n de correo electr≤nico del usuario. Debe ser ·nico, ya que se puede usar para recuperar contrase±as o enviar notificaciones.')
    clave = models.CharField(max_length=30, db_comment='Este campo almacena la contrase±a del usuario, que se utiliza para la autenticaci≤n al iniciar sesi≤n en el sistema.')
    especialidad = models.ForeignKey(Especialidades, models.DO_NOTHING, blank=True, null=True, db_comment='Este campo es una llave forßnea que hace referencia a la especialidad del usuario, si aplica. Permite vincular al usuario con una especialidad especφfica en la clφnica.')
    clinica = models.ForeignKey(Clinicas, models.DO_NOTHING, blank=True, null=True, db_comment='Este campo es una llave forßnea que hace referencia a la clφnica en la que trabaja el usuario. Ayuda a identificar la relaci≤n del usuario con una clφnica especφfica.')
    rol = models.ForeignKey(Roles, models.DO_NOTHING, blank=True, null=True, db_comment='Este campo es una llave forßnea que hace referencia al rol del usuario en el sistema (por ejemplo, veterinario, administrador, etc.). Permite gestionar los permisos y accesos del usuario seg·n su rol.')

"""
