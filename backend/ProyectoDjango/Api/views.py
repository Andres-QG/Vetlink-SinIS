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
from django.views.decorators.cache import cache_page
from .serializers import *
import random
from datetime import datetime
from django.http import JsonResponse
from django.db import connection


class CustomPagination(PageNumberPagination):
    page_size = 7  # Número de registros por página
    page_size_query_param = (
        "page_size"  # Puedes ajustar el tamaño de la página desde la query
    )
    max_page_size = 100  # Tamaño máximo de la página que puedes solicitar


@api_view(["POST"])
def check_user_exists(request):
    formData = request.data.get("formData")
    if formData:
        user = formData.get("usuario")
        password = formData.get("clave")
    else:
        user = request.data.get("user") or request.data.get("usuario")
        password = request.data.get("password") or request.data.get("clave")

    if not user or not password:
        return Response(
            {"error": "Se requieren usuario y contraseña."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        userResponse = Usuarios.objects.get(usuario=user)

        if check_password(password, userResponse.clave):
            # Guardar el usuario y rol en la sesión
            request.session["user"] = userResponse.usuario
            request.session["role"] = userResponse.rol_id

            # Si es administrador, también guardar el ID de la clínica en la sesión
            if userResponse.rol_id == 2:
                clinica_id = userResponse.clinica_id
                request.session["clinica_id"] = clinica_id

            return Response(
                {
                    "exists": True,
                    "message": f"Usuario {user} autenticado.",
                    "rol": userResponse.rol_id,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {"exists": False, "message": "Contraseña incorrecta."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    except Usuarios.DoesNotExist:
        return Response(
            {"exists": False, "message": "Usuario no encontrado."},
            status=status.HTTP_404_NOT_FOUND,
        )


@api_view(["POST"])
def reset_password(request):
    email = request.data.get("email")  # Obtiene el correo de la solicitud
    if not email:
        return Response(
            {"error": "Se requiere correo electrónico."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    request.session["role"] = 5
    try:
        userResponse = Usuarios.objects.get(
            correo=email
        )  # Revisa que exista un usuario que tenga ese correo asociado
        verification_code = random.randint(
            100000, 999999
        )  # Genera un número aleatorio de 6 dígitos

        send_mail(
            "Código de reinicio de contraseña",  # Asunto
            f"Tu código para reiniciar la contraseña es {verification_code}.",  # Cuerpo
            "vetlinkmail@gmail.com",  # Desde este correo
            [email],  # Hacia este correo
            fail_silently=False,  # Mostrar errores
        )
        request.session["reset_code"] = (
            verification_code  # Guarda el código en la sesión
        )
        request.session["email"] = email

        if userResponse.correo == email:
            return Response(
                {"exists": True, "message": "Correo autenticado.", "rol": 5},
                status=status.HTTP_200_OK,
            )
    except Usuarios.DoesNotExist:
        return Response(
            {"exists": False, "message": "No se pudo verificar el correo."},
            status=status.HTTP_404_NOT_FOUND,
        )


@api_view(["POST"])
def verify_code(request):
    values_str = int(
        "".join(request.data.get("values"))
    )  # Convierte los valores ingresados a int
    if request.session.get("reset_code") == values_str:  # Verificación del código
        return Response(
            {"exists": True, "status": "success"}, status=status.HTTP_200_OK
        )
    else:
        return Response(
            {"exists": False, "message": "No se pudo verificar el código."},
            status=status.HTTP_404_NOT_FOUND,
        )


@api_view(["POST"])
def check_new_pass(request):
    newPass = request.data.get("newPass")
    confPass = request.data.get("confPass")
    if newPass != confPass or not newPass or not confPass:
        return Response(
            {
                "exists": False,
                "message": "Las contraseñas no coinciden o están vacías.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    email = request.session.get("email")
    if email:
        try:
            userResponse = Usuarios.objects.get(correo=email)
        except Usuarios.DoesNotExist:
            return Response(
                {"exists": False, "message": "Usuario no encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )
    else:
        return Response(
            {"exists": False, "message": "No se pudo verificar el correo."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if check_password(newPass, userResponse.clave):
        return Response(
            {
                "exists": False,
                "message": "La nueva contraseña no puede ser igual a la anterior.",
                "same": True,
            },
            status=status.HTTP_200_OK,
        )

    hashed_password = make_password(newPass)
    userResponse.clave = hashed_password
    userResponse.save()
    return Response({"exists": True, "status": "success"}, status=status.HTTP_200_OK)


@api_view(["GET"])
def consult_clinics(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "nombre")
    order = request.GET.get("order", "asc")

    if column == "clinica":
        column = "nombre"
    if column == "dueño":
        column = "usuario_propietario"

    try:
        clinicas = Clinicas.objects.all()
        if search:
            # Para otras columnas, utiliza el filtrado dinámico basado en kwargs
            kwargs = {f"{column}__icontains": search}
            clinicas = clinicas.filter(**kwargs)

        # Ordenamiento de resultados
        clinicas = clinicas.order_by(f"-{column}" if order == "desc" else column)

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(clinicas, request)
        serializer_data = [
            {
                "clinica_id": clinicas.clinica_id,
                "clinica": clinicas.nombre,
                "direccion": clinicas.direccion,
                "telefono": clinicas.telefono,
                "dueño": clinicas.usuario_propietario.nombre,
                "activo": clinicas.activo,
            }
            for clinicas in result_page
        ]

        return paginator.get_paginated_response(serializer_data)
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@transaction.atomic
def add_clinic(request):
    try:
        clinica = request.data.get("clinica")
        dueno = request.data.get("usuario")
        telefono = request.data.get("telefono")
        direccion = request.data.get("direccion")

        print(clinica)
        print(dueno)
        print(telefono)
        print(direccion)

        usuario = Usuarios.objects.get(nombre=dueno).usuario

        # Verificar si ya existe una clínica con el mismo nombre
        if Clinicas.objects.filter(nombre=clinica).exists():
            return Response(
                {"error": "Ya hay una clínica con este nombre."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Preparar datos para el serializador
        data = {
            "nombre": clinica,
            "telefono": telefono,
            "direccion": direccion,
            "usuario_propietario": usuario,
            "activo": True,
        }

        # Validar con el serializador
        nuevaClinica = ClinicasSerializer(data=data)

        if nuevaClinica.is_valid():
            nuevaClinica.save()  # Guardar si es válido
            return Response(
                {"message": "Clínica agregada con éxito"},
                status=status.HTTP_201_CREATED,
            )
        else:
            print("NOT VALId")
            print(nuevaClinica.errors)
            return Response(
                {"errors": nuevaClinica.errors}, status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
def update_clinic(request, clinica_id):
    try:
        clin = Clinicas.objects.get(pk=clinica_id)  # Buscar clínica por el id

        # No permitimos modificar la llave primaria (usuario)
        clinica_nombre = request.data.get("clinica")
        direccion = request.data.get("direccion")
        telefono = request.data.get("telefono")
        dueno = request.data.get("usuario")

        try:
            ownerUser = Usuarios.objects.get(usuario=dueno)
        except Usuarios.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)

        # Actualizar los datos de la clínica
        clin.nombre = clinica_nombre
        clin.direccion = direccion
        clin.telefono = telefono
        clin.usuario_propietario = ownerUser
        clin.save()

        return Response(
            {"message": "Clínica actualizada con éxito."}, status=status.HTTP_200_OK
        )

    except Exception as e:
        print(f"Error actualizando clínica: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["DELETE"])
def delete_clinic(request, clinica_id):
    try:
        clinica = Clinicas.objects.get(pk=clinica_id)
        clinica.activo = False
        clinica.save()
        return Response(
            {"message": "Clínica eliminada correctamente"}, status=status.HTTP_200_OK
        )
    except Clinicas.DoesNotExist:
        return Response(
            {"error": "Clínica no encontrada"}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def consult_citas(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "fecha")
    order = request.GET.get("order", "asc")

    if column == "cliente":
        column = "usuario_cliente__nombre"
    elif column == "veterinario":
        column = "usuario_veterinario__nombre"
    elif column == "mascota":
        column = "mascota__nombre"

    try:
        citas = Citas.objects.all()

        if search:
            if column == "fecha":
                citas = citas.filter(fecha__icontains=search)
            else:
                citas = citas.filter(**{f"{column}__icontains": search})

        citas = citas.order_by(f"-{column}" if order == "desc" else column)

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(citas, request)

        serializer_data = [
            {
                "cita_id": cita.cita_id,
                "cliente": cita.usuario_cliente.nombre,
                "veterinario": cita.usuario_veterinario.nombre,
                "mascota": cita.mascota.nombre,
                "fecha": cita.fecha,
                "hora": cita.hora,
                "motivo": cita.motivo,
                "estado": cita.estado,
            }
            for cita in result_page
        ]

        return paginator.get_paginated_response(serializer_data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@transaction.atomic
def add_cita(request):
    try:
        cliente_id = request.data.get("cliente_id")
        veterinario_id = request.data.get("veterinario_id")
        mascota_id = request.data.get("mascota_id")
        fecha = request.data.get("fecha")
        hora = request.data.get("hora")
        motivo = request.data.get("motivo", "")
        estado = request.data.get("estado", "Programada")

        cliente = Usuarios.objects.get(usuario=cliente_id)
        veterinario = Usuarios.objects.get(usuario=veterinario_id)
        mascota = Mascotas.objects.get(pk=mascota_id)

        data = {
            "usuario_cliente": cliente.usuario,
            "usuario_veterinario": veterinario.usuario,
            "mascota": mascota.mascota_id,
            "fecha": fecha,
            "hora": hora,
            "motivo": motivo,
            "estado": estado,
        }

        nuevaCita = CitasSerializer(data=data)
        if nuevaCita.is_valid():
            nuevaCita.save()
            return Response(
                {"message": "Cita agregada con éxito"},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"errors": nuevaCita.errors}, status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
def update_cita(request, cita_id):
    try:
        cita = Citas.objects.get(pk=cita_id)

        cliente_id = request.data.get("cliente_id")
        veterinario_id = request.data.get("veterinario_id")
        mascota_id = request.data.get("mascota_id")
        fecha = request.data.get("fecha")
        hora = request.data.get("hora")
        motivo = request.data.get("motivo")
        estado = request.data.get("estado")

        if cliente_id:
            cita.usuario_cliente = Usuarios.objects.get(usuario=cliente_id)
        if veterinario_id:
            cita.usuario_veterinario = Usuarios.objects.get(usuario=veterinario_id)
        if mascota_id:
            cita.mascota = Mascotas.objects.get(pk=mascota_id)
        if fecha:
            cita.fecha = fecha
        if hora:
            cita.hora = hora
        if motivo:
            cita.motivo = motivo
        if estado:
            cita.estado = estado

        cita.save()
        return Response(
            {"message": "Cita actualizada con éxito."}, status=status.HTTP_200_OK
        )

    except Citas.DoesNotExist:
        return Response(
            {"error": "Cita no encontrada"}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["DELETE"])
def delete_cita(request, cita_id):
    try:
        cita = Citas.objects.get(pk=cita_id)
        cita.activo = False
        cita.save()
        return Response(
            {"message": "Cita eliminada correctamente"}, status=status.HTTP_200_OK
        )
    except Citas.DoesNotExist:
        return Response(
            {"error": "Cita no encontrada"}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def create_pet(request):
    try:
        usuario = request.data.get("usuario_cliente")

        # Verificar la existencia del cliente
        try:
            usuario_cliente = Usuarios.objects.get(usuario=usuario)
        except Usuarios.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND
            )

        data = request.data

        # Verificar si se envía edad y no la fecha de nacimiento
        edad = data.get("edad", None)
        if edad:
            try:
                # Convertir la edad en fecha de nacimiento aproximada
                edad = int(edad)
                current_year = datetime.now().year
                birth_year = current_year - edad
                data["fecha_nacimiento"] = (
                    f"{birth_year}-01-01"  # Se asigna el 1 de enero por defecto
                )
            except ValueError:
                return Response(
                    {"error": "La edad debe ser un número entero."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Reemplazar el usuario_cliente por el objeto relacionado
        data["usuario_cliente"] = usuario_cliente.usuario

        data["activo"] = 1

        # Serializar los datos y crear la mascota
        serializer = MascotaSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(["GET"])
def get_user_role(request):
    role = request.session.get("role")

    print("Current session:", request.session.items())
    if role:
        return Response({"status": "success", "message": "Rol obtenido", "role": role})
    else:
        return Response({"status": "error", "message": "Usuario no ha iniciado sesión"})


@api_view(["GET"])
def get_clients(request):
    clients = Usuarios.objects.filter(
        rol__nombre="Cliente"
    )  # Assuming "Cliente" represents clients in the 'Roles' table
    serializer = NameUsuariosSerializer(clients, many=True)
    if serializer:
        return Response(
            {
                "status": "success",
                "message": "Clientes obtenidos",
                "clients": serializer.data,
            }
        )
    else:
        return Response({"status": "error", "message": "No se pudo obtener clientes"})


@api_view(["GET"])
def get_vets(request):
    vets = Usuarios.objects.filter(
        rol__nombre="Veterinario"
    )  # Assuming "Veterinario" represents veterinarians
    serializer = NameUsuariosSerializer(vets, many=True)
    if serializer:
        return Response(
            {
                "status": "success",
                "message": "Veterinarios obtenidos",
                "vets": serializer.data,
            }
        )
    else:
        return Response(
            {"status": "error", "message": "No se pudo obtener veterinarios"}
        )


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


@api_view(["POST"])
@transaction.atomic
def add_clinic(request):
    try:
        clinica = request.data.get("clinica")
        dueno = request.data.get("usuario")
        telefono = request.data.get("telefono")
        direccion = request.data.get("direccion")

        usuario = Usuarios.objects.get(nombre=dueno).usuario

        # Verificar si ya existe una clínica con el mismo nombre
        if Clinicas.objects.filter(nombre=clinica).exists():
            return Response(
                {"error": "Ya hay una clínica con este nombre."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Preparar datos para el serializador
        data = {
            "nombre": clinica,
            "telefono": telefono,
            "direccion": direccion,
            "usuario_propietario": usuario,
        }

        # Validar con el serializador
        nuevaClinica = ClinicasSerializer(data=data)

        if nuevaClinica.is_valid():
            nuevaClinica.save()  # Guardar si es válido
            return Response(
                {"message": "Clínica agregada con éxito"},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"errors": nuevaClinica.errors}, status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        print(e)
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
def update_clinic(request, clinica_id):
    try:
        clin = Clinicas.objects.get(pk=clinica_id)  # Buscar clínica por el id

        # No permitimos modificar la llave primaria (usuario)
        clinica_nombre = request.data.get("clinica")
        direccion = request.data.get("direccion")
        telefono = request.data.get("telefono")
        dueno = request.data.get("usuario")

        try:
            ownerUser = Usuarios.objects.get(usuario=dueno)
        except Usuarios.DoesNotExist:
            return Response({"error": "Usuario no encontrado"}, status=404)

        # Actualizar los datos de la clínica
        clin.nombre = clinica_nombre
        clin.direccion = direccion
        clin.telefono = telefono
        clin.usuario_propietario = ownerUser
        clin.save()

        return Response(
            {"message": "Clínica actualizada con éxito."}, status=status.HTTP_200_OK
        )

    except Exception as e:
        print(f"Error actualizando clínica: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def consult_client(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "usuario")
    order = request.GET.get("order", "asc")

    try:
        usuarios_clientes = Usuarios.objects.filter(rol=4)
        if search:
            if column == "apellidos":
                usuarios_clientes = usuarios_clientes.filter(
                    Q(apellido1__icontains=search) | Q(apellido2__icontains=search)
                )
            else:
                kwargs = {f"{column}__icontains": search}
                usuarios_clientes = usuarios_clientes.filter(**kwargs)

        if column == "apellidos":
            usuarios_clientes = usuarios_clientes.order_by(
                "-apellido1",
                "-apellido2" if order == "desc" else "apellido1",
                "apellido2",
            )
        else:
            usuarios_clientes = usuarios_clientes.order_by(
                f"-{column}" if order == "desc" else column
            )

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
                "estado": usuario.activo,
            }
            for usuario in result_page
        ]

        return paginator.get_paginated_response(serializer_data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@transaction.atomic
def add_client(request):
    try:
        data = request.data
        usuario = data.get("usuario")
        cedula = data.get("cedula")
        correo = data.get("correo")
        nombre = data.get("nombre")
        apellido1 = data.get("apellido1")
        apellido2 = data.get("apellido2")
        telefono = data.get("telefono")
        clave = data.get("clave")

        # Verificar si ya existe un usuario con el mismo 'usuario' o 'correo'
        if Usuarios.objects.filter(Q(usuario=usuario) | Q(correo=correo)).exists():
            return Response(
                {"error": "El usuario o el correo ya están en uso."},
                status=status.HTTP_400_BAD_REQUEST,
            )

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
            rol_id=4,  # Rol para cliente
        )
        nuevo_cliente.save()
        return Response(
            {"message": "Cliente agregado con éxito"}, status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@transaction.atomic
def add_vet(request):
    try:
        data = request.data
        usuario = data.get("usuario")
        cedula = data.get("cedula")
        correo = data.get("correo")
        nombre = data.get("nombre")
        apellido1 = data.get("apellido1")
        apellido2 = data.get("apellido2")
        telefono = data.get("telefono")
        clave = data.get("clave")
        especialidad_id = data.get("especialidad")
        clinica_id = data.get("clinica")

        # Verificar si ya existe un usuario con el mismo 'usuario' o 'correo'
        if Usuarios.objects.filter(Q(usuario=usuario) | Q(correo=correo)).exists():
            return Response(
                {"error": "El usuario o el correo ya están en uso."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        hashed_password = make_password(clave)  # Hashear la contraseña

        # Verificar existencia de especialidad y clínica
        try:
            especialidad = Especialidades.objects.get(pk=especialidad_id)
        except Especialidades.DoesNotExist:
            return Response(
                {"error": "Especialidad no encontrada."},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            clinica = Clinicas.objects.get(pk=clinica_id)
        except Clinicas.DoesNotExist:
            return Response(
                {"error": "Clínica no encontrada."}, status=status.HTTP_404_NOT_FOUND
            )

        nuevo_veterinario = Usuarios(
            usuario=usuario,
            cedula=cedula,
            nombre=nombre,
            apellido1=apellido1,
            apellido2=apellido2,
            telefono=telefono,
            correo=correo,
            clave=hashed_password,
            rol_id=3,  # Rol para veterinario
            especialidad=especialidad,
            clinica=clinica,
        )
        nuevo_veterinario.save()
        return Response(
            {"message": "Veterinario agregado con éxito"},
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
def update_client(request, usuario):
    try:
        user = Usuarios.objects.get(usuario=usuario)

        correo = request.data.get("correo")
        nombre = request.data.get("nombre")
        apellido1 = request.data.get("apellido1")
        apellido2 = request.data.get("apellido2")
        telefono = request.data.get("telefono")
        cedula = request.data.get("cedula")

        if Usuarios.objects.filter(correo=correo).exclude(usuario=usuario).exists():
            return Response(
                {"error": "El correo ya está en uso."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Actualizar los datos del usuario
        user.cedula = cedula
        user.correo = correo
        user.nombre = nombre
        user.apellido1 = apellido1
        user.apellido2 = apellido2
        user.telefono = telefono
        user.save()

        return Response(
            {"message": "Usuario actualizado con éxito."}, status=status.HTTP_200_OK
        )

    except Usuarios.DoesNotExist:
        return Response(
            {"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Error actualizando usuario: {str(e)}")
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def log_out(request):
    logout(request)
    return Response(
        {"status": "success", "message": "Usuario desconectado exitosamente"}
    )


@api_view(["PUT"])
def update_pet(request, mascota_id):
    try:
        data = request.data
        usuario = data.get("usuario_cliente")

        # Verificar la existencia del usuario cliente
        try:
            usuario_cliente = Usuarios.objects.get(usuario=usuario)
        except Usuarios.DoesNotExist:
            return Response(
                {"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND
            )

        # Obtener la mascota a modificar
        try:
            mascota = Mascotas.objects.get(mascota_id=mascota_id)
        except Mascotas.DoesNotExist:
            return Response(
                {"error": "Mascota no encontrada."}, status=status.HTTP_404_NOT_FOUND
            )

        # Verificar si se envía la edad y convertirla en fecha de nacimiento aproximada si es necesario
        edad = data.get("edad", None)
        if edad:
            try:
                edad = int(edad)
                current_year = datetime.now().year
                birth_year = current_year - edad
                data["fecha_nacimiento"] = f"{birth_year}-01-01"
            except ValueError:
                return Response(
                    {"error": "La edad debe ser un número entero."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Asignar la instancia del usuario relacionado al campo usuario_cliente
        data["usuario_cliente"] = usuario_cliente.usuario

        # Serializar los datos con la instancia de la mascota existente
        serializer = MascotaSerializer(mascota, data=data)

        # Validar y guardar los datos actualizados
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def consult_mascotas(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "mascota_id")
    order = request.GET.get("order", "asc")

    try:
        mascotas = Mascotas.objects.all()

        if search:
            if column == "usuario_cliente":
                search_filter = {"usuario_cliente__usuario__icontains": search}
            else:
                search_filter = {f"{column}__icontains": search}
            mascotas = mascotas.filter(**search_filter)

        mascotas = mascotas.order_by(f"-{column}" if order == "desc" else column)

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(mascotas, request)
        serializer_data = [
            {
                "mascota_id": mascota.mascota_id,
                "nombre": mascota.nombre,
                "sexo": mascota.sexo,
                "especie": mascota.especie,
                "raza": mascota.raza,
                "fecha_nacimiento": mascota.fecha_nacimiento,
                "usuario_cliente": mascota.usuario_cliente.usuario,
                "activo": mascota.activo,
            }
            for mascota in result_page
        ]

        return paginator.get_paginated_response(serializer_data)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def consult_admin(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "usuario")
    order = request.GET.get("order", "asc")

    try:
        usuarios_admin = Usuarios.objects.filter(rol=2)

        if search:
            if column == "apellidos":
                usuarios_admin = usuarios_admin.filter(
                    Q(apellido1__icontains=search) | Q(apellido2__icontains=search)
                )
            else:
                kwargs = {f"{column}__icontains": search}
                usuarios_admin = usuarios_admin.filter(**kwargs)

        if column == "apellidos":
            usuarios_admin = usuarios_admin.order_by(
                "-apellido1",
                "-apellido2" if order == "desc" else "apellido1",
                "apellido2",
            )
        else:
            usuarios_admin = usuarios_admin.order_by(
                f"-{column}" if order == "desc" else column
            )

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(usuarios_admin, request)
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
                "clinica": usuario.clinica.nombre if usuario.clinica else None,
                "clinica_id": usuario.clinica.clinica_id if usuario.clinica else None,
                "estado": usuario.activo,
            }
            for usuario in result_page
        ]

        return paginator.get_paginated_response(serializer_data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@transaction.atomic
def add_admin(request):
    try:
        data = request.data
        usuario = data.get("usuario")
        cedula = data.get("cedula")
        correo = data.get("correo")
        nombre = data.get("nombre")
        apellido1 = data.get("apellido1")
        apellido2 = data.get("apellido2")
        telefono = data.get("telefono")
        clave = data.get("clave")
        clinica_id = data.get("clinica")

        if Usuarios.objects.filter(Q(usuario=usuario) | Q(correo=correo)).exists():
            return Response(
                {"error": "El usuario o el correo ya están en uso."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        hashed_password = make_password(clave)

        try:
            clinica = Clinicas.objects.get(pk=clinica_id)
        except Clinicas.DoesNotExist:
            return Response(
                {"error": "Clínica no encontrada."}, status=status.HTTP_404_NOT_FOUND
            )

        nuevo_admin = Usuarios(
            usuario=usuario,
            cedula=cedula,
            nombre=nombre,
            apellido1=apellido1,
            apellido2=apellido2,
            telefono=telefono,
            correo=correo,
            clave=hashed_password,
            rol_id=2,  # Rol para administrador
            clinica=clinica,
        )
        nuevo_admin.save()
        return Response(
            {"message": "Administrador agregado con éxito"},
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
def update_admin(request, usuario):
    try:
        admin = Usuarios.objects.get(usuario=usuario)

        correo = request.data.get("correo")
        nombre = request.data.get("nombre")
        apellido1 = request.data.get("apellido1")
        apellido2 = request.data.get("apellido2")
        telefono = request.data.get("telefono")
        cedula = request.data.get("cedula")
        clinica_id = request.data.get("clinica")

        if Usuarios.objects.filter(correo=correo).exclude(usuario=usuario).exists():
            return Response(
                {"error": "El correo ya está en uso."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            clinica = Clinicas.objects.get(pk=clinica_id)
        except Clinicas.DoesNotExist:
            return Response(
                {"error": "Clínica no encontrada."}, status=status.HTTP_404_NOT_FOUND
            )

        # Actualizar los datos del administrador
        admin.cedula = cedula
        admin.correo = correo
        admin.nombre = nombre
        admin.apellido1 = apellido1
        admin.apellido2 = apellido2
        admin.telefono = telefono
        admin.clinica = clinica
        admin.save()

        return Response(
            {"message": "Administrador actualizado con éxito."},
            status=status.HTTP_200_OK,
        )

    except Usuarios.DoesNotExist:
        return Response(
            {"error": "Administrador no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def consult_vet(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "usuario")
    order = request.GET.get("order", "asc")

    try:
        usuarios_veterinarios = Usuarios.objects.filter(rol=3).select_related(
            "especialidad", "clinica"
        )
        if search:
            kwargs = {f"{column}__icontains": search}
            usuarios_veterinarios = usuarios_veterinarios.filter(**kwargs)

        usuarios_veterinarios = usuarios_veterinarios.order_by(
            f"-{column}" if order == "desc" else column
        )

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(usuarios_veterinarios, request)
        serializer_data = [
            {
                "usuario": usuario.usuario,
                "cedula": usuario.cedula,
                "nombre": usuario.nombre,
                "apellido1": usuario.apellido1,
                "apellido2": usuario.apellido2,
                "telefono": usuario.telefono,
                "correo": usuario.correo,
                "estado": usuario.activo,
                "especialidad": (
                    {
                        "id": usuario.especialidad.especialidad_id,
                        "nombre": usuario.especialidad.nombre,
                        "descripcion": usuario.especialidad.descripcion,
                    }
                    if usuario.especialidad
                    else None
                ),
                "clinica": (
                    {
                        "id": usuario.clinica.clinica_id,
                        "nombre": usuario.clinica.nombre,
                    }
                    if usuario.clinica
                    else None
                ),
            }
            for usuario in result_page
        ]

        return paginator.get_paginated_response(serializer_data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def consult_specialties(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "nombre")
    order = request.GET.get("order", "asc")

    try:
        specialties = Especialidades.objects.all()
        if search:
            kwargs = {f"{column}__icontains": search}
            specialties = specialties.filter(**kwargs)

        specialties = specialties.order_by(f"-{column}" if order == "desc" else column)

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(specialties, request)
        serializer = EspecialidadesSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
def update_vet(request, usuario):
    try:
        vet = Usuarios.objects.get(usuario=usuario)

        correo = request.data.get("correo")
        nombre = request.data.get("nombre")
        apellido1 = request.data.get("apellido1")
        apellido2 = request.data.get("apellido2")
        telefono = request.data.get("telefono")
        cedula = request.data.get("cedula")
        clinica_id = request.data.get("clinica")
        especialidad_id = request.data.get("especialidad")

        if Usuarios.objects.filter(correo=correo).exclude(usuario=usuario).exists():
            return Response(
                {"error": "El correo ya está en uso."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        print(especialidad_id)
        try:
            clinica = Clinicas.objects.get(pk=clinica_id)
        except Clinicas.DoesNotExist:
            return Response(
                {"error": "Clínica no encontrada."}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            especialidad = Especialidades.objects.get(pk=especialidad_id)
            print(especialidad)
        except Especialidades.DoesNotExist:
            return Response(
                {"error": "Especialidad no encontrada."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Actualizar los datos del veterinario
        vet.cedula = cedula
        vet.correo = correo
        vet.nombre = nombre
        vet.apellido1 = apellido1
        vet.apellido2 = apellido2
        vet.telefono = telefono
        vet.clinica = clinica
        vet.especialidad = especialidad
        vet.save()

        return Response(
            {"message": "Veterinario actualizado con éxito."},
            status=status.HTTP_200_OK,
        )

    except Usuarios.DoesNotExist:
        return Response(
            {"error": "Veterinario no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["DELETE"])
def delete_client(request, usuario):
    try:
        user = Usuarios.objects.get(usuario=usuario)
        user.activo = False
        user.save()
        return Response(
            {"message": "Usuario desactivado con éxito."}, status=status.HTTP_200_OK
        )
    except Usuarios.DoesNotExist:
        return Response(
            {"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["DELETE"])
def delete_clinic(request, clinica_id):
    try:
        clinica = Clinicas.objects.get(pk=clinica_id)
        clinica.activo = False
        clinica.save()
        return Response(
            {"message": "Clínica desactivada correctamente."}, status=status.HTTP_200_OK
        )
    except Clinicas.DoesNotExist:
        return Response(
            {"error": "Clínica no encontrada."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["DELETE"])
def delete_pet(request, mascota_id):
    try:
        mascota = Mascotas.objects.get(pk=mascota_id)
        mascota.activo = False
        mascota.save()
        return Response(
            {"message": "Mascota desactivada correctamente."}, status=status.HTTP_200_OK
        )
    except Mascotas.DoesNotExist:
        return Response(
            {"error": "Mascota no encontrada."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["DELETE"])
def delete_admin(request, usuario):
    try:
        admin = Usuarios.objects.get(usuario=usuario)
        admin.activo = False
        admin.save()
        return Response(
            {"message": "Administrador desactivado con éxito."},
            status=status.HTTP_200_OK,
        )
    except Usuarios.DoesNotExist:
        return Response(
            {"error": "Administrador no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def consult_pet_records(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "nombre_mascota")
    order = request.GET.get("order", "asc")

    try:
        pet_records_list = fetch_pet_records_from_db()

        if not pet_records_list:
            return JsonResponse({"error": "Expediente no encontrado"}, status=404)

        if not pet_records:
            return JsonResponse({"error": "Expediente no encontrado"}, status=404)

        pet_records_list = []
        for entry in pet_records:
            pet_record_data = {
                "consulta_id": entry[0],
                "mascota_id": entry[1],
                "nombre_mascota": entry[2],
                "usuario_cliente": entry[3],
                "fecha": entry[4],
                "diagnostico": entry[5],
                "peso": entry[6],
                "vacunas": entry[7],
                "sintomas": entry[8],
                "tratamientos": entry[9],
            }
            pet_records_list.append(pet_record_data)

        # Filtrar por búsqueda
        if search:
            pet_records_list = [
                record
                for record in pet_records_list
                if search.lower() in str(record.get(column, "")).lower()
            ]

        # Ordenar resultados
        pet_records_list.sort(
            key=lambda x: x.get(column, ""), reverse=(order == "desc")
        )

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(pet_records_list, request)
        return paginator.get_paginated_response(result_page)

    except Mascotas.DoesNotExist:
        return Response(
            {"error": "Mascota no encontrada"}, status=status.HTTP_404_NOT_FOUND
        )
    except ConsultaMascotas.DoesNotExist:
        return Response(
            {"error": "Consulta no encontrada"}, status=status.HTTP_404_NOT_FOUND
        )
    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
def add_pet_record(request):
    serializer = ExpedienteSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    mascota_id = serializer.validated_data["mascota_id"]
    fecha = serializer.validated_data["fecha"]
    diagnostico = serializer.validated_data["diagnostico"]
    peso = serializer.validated_data["peso"]
    vacunas = serializer.validated_data["vacunas"]  # String separado por comas
    sintomas = serializer.validated_data["sintomas"]  # String separado por comas
    tratamientos = serializer.validated_data[
        "tratamientos"
    ]  # String separado por comas

    try:
        # Verificar si la mascota existe
        if not Mascotas.objects.filter(pk=mascota_id).exists():
            return Response({"error": "Mascota no encontrada"}, status=404)

        # Verificar si todas las vacunas existen
        vacunas_list = [vacuna.strip().lower() for vacuna in vacunas.split(",")]
        for vacuna in vacunas_list:
            if not Vacunas.objects.filter(nombre__iexact=vacuna).exists():
                return Response(
                    {"error": f"Vacuna con nombre {vacuna} no encontrada"}, status=404
                )

        # Verificar si todos los síntomas existen
        sintomas_list = [sintoma.strip().lower() for sintoma in sintomas.split(",")]
        for sintoma in sintomas_list:
            if not Sintomas.objects.filter(nombre__iexact=sintoma).exists():
                return Response(
                    {"error": f"Síntoma con nombre {sintoma} no encontrado"}, status=404
                )

        # Verificar si todos los tratamientos existen
        tratamientos_list = [
            tratamiento.strip().lower() for tratamiento in tratamientos.split(",")
        ]
        for tratamiento in tratamientos_list:
            if not Tratamientos.objects.filter(nombre__iexact=tratamiento).exists():
                return Response(
                    {"error": f"Tratamiento con nombre {tratamiento} no encontrado"},
                    status=404,
                )

        # Proceder a agregar el expediente
        with connection.cursor() as cursor:
            cursor.callproc(
                "VETLINK.Agregar_Expediente",
                [mascota_id, fecha, diagnostico, peso, vacunas, sintomas, tratamientos],
            )

        return Response({"message": "Expediente agregado correctamente"}, status=201)

    except Mascotas.DoesNotExist:
        return Response({"error": "Mascota no encontrada"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def consult_vaccines(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "nombre")
    order = request.GET.get("order", "asc")

    try:
        vaccines = Vacunas.objects.all()
        if search:
            kwargs = {f"{column}__icontains": search}
            vaccines = vaccines.filter(**kwargs)

        vaccines = vaccines.order_by(f"-{column}" if order == "desc" else column)

        paginator = CustomPagination()
        result_page = paginator.paginate_queryset(vaccines, request)
        serializer = VacunasSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_pet_record(request,consulta_id):
    try:
        # Verificar si la mascota existe
        mascota = Mascotas.objects.get(pk=mascota_id)

        # Verificar si la consulta existe
        consulta = ConsultaMascotas.objects.get(pk=consulta_id, mascota=mascota)

        # Si ambas existen, proceder a eliminar el expediente
        with connection.cursor() as cursor:
            cursor.callproc("VETLINK.Eliminar_Expediente", [mascota_id, consulta_id])

        return Response({"message": "Expediente eliminado correctamente"}, status=200)

    except Mascotas.DoesNotExist:
        return Response({"error": "Mascota no encontrada"}, status=404)

    except ConsultaMascotas.DoesNotExist:
        return Response({"error": "Consulta no encontrada"}, status=404)

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["PUT"])
def update_pet_record(request, mascota_id, consulta_id):
    diagnostico = request.data.get("diagnostico")
    peso = request.data.get("peso")
    vacunas = request.data.get(
        "vacunas"
    )  # Se espera una cadena con vacunas separadas por coma
    sintomas = request.data.get(
        "sintomas"
    )  # Se espera una cadena con síntomas separados por coma
    tratamientos = request.data.get(
        "tratamientos"
    )  # Se espera una cadena con tratamientos separados por coma

    # Validar los datos necesarios
    if not all([diagnostico, peso, vacunas, sintomas, tratamientos]):
        return Response(
            {"error": "Todos los campos son obligatorios."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        # Normalizar y verificar si todas las vacunas existen
        vacunas_list = [vacuna.strip().lower() for vacuna in vacunas.split(",")]
        for vacuna in vacunas_list:
            if not Vacunas.objects.filter(nombre__iexact=vacuna).exists():
                return Response(
                    {"error": f"Vacuna con nombre {vacuna} no encontrada"},
                    status=status.HTTP_404_NOT_FOUND,
                )

        # Normalizar y verificar si todos los síntomas existen
        sintomas_list = [sintoma.strip().lower() for sintoma in sintomas.split(",")]
        for sintoma in sintomas_list:
            if not Sintomas.objects.filter(nombre__iexact=sintoma).exists():
                return Response(
                    {"error": f"Síntoma con nombre {sintoma} no encontrado"},
                    status=status.HTTP_404_NOT_FOUND,
                )

        # Normalizar y verificar si todos los tratamientos existen
        tratamientos_list = [
            tratamiento.strip().lower() for tratamiento in tratamientos.split(",")
        ]
        for tratamiento in tratamientos_list:
            if not Tratamientos.objects.filter(nombre__iexact=tratamiento).exists():
                return Response(
                    {"error": f"Tratamiento con nombre {tratamiento} no encontrado"},
                    status=status.HTTP_404_NOT_FOUND,
                )

        with connection.cursor() as cursor:
            cursor.callproc(
                "VETLINK.Modificar_Expediente",
                [
                    mascota_id,
                    consulta_id,
                    diagnostico,
                    peso,
                    vacunas,
                    sintomas,
                    tratamientos,
                ],
            )

        # Respuesta exitosa si todo se realizó correctamente
        return Response(
            {"message": "Expediente modificado correctamente"},
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        # Manejo de errores de base de datos
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
def reactivate_user(request, usuario):
    try:
        user = Usuarios.objects.get(usuario=usuario)
        user.activo = True
        user.save()
        return Response(
            {"message": "Usuario reactivado con éxito."}, status=status.HTTP_200_OK
        )
    except Usuarios.DoesNotExist:
        return Response(
            {"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND
        )
    return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def consult_schedules(request):
    search = request.GET.get("search", "")
    column = request.GET.get("column", "usuario_veterinario")
    order = request.GET.get("order", "asc")

    try:
        # Obtener el rol y el usuario de la sesión
        rol_id = request.session.get("role")
        usuario = request.session.get("user")
        # Obtener la clínica del administrador
        clinica_id = request.session.get("clinica_id") if rol_id == 2 else None

        if not rol_id or not usuario:
            return Response(
                {"error": "Usuario no autenticado."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        with connection.cursor() as cursor:
            returned_cursor = cursor.connection.cursor()

            # Configurar los parámetros según el rol
            if rol_id == 1:
                # Dueño puede ver todos los horarios
                cursor.callproc(
                    "VETLINK.CONSULTAR_HORARIOS", [returned_cursor, None, None]
                )
            elif rol_id == 2:
                # Administrador puede ver los horarios de su clínica
                if not clinica_id:
                    return Response(
                        {"error": "No se ha encontrado la clínica del administrador."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                cursor.callproc(
                    "VETLINK.CONSULTAR_HORARIOS", [returned_cursor, None, clinica_id]
                )
            elif rol_id == 3:
                # Veterinario puede ver solo sus propios horarios, incluyendo la clínica
                cursor.callproc(
                    "VETLINK.CONSULTAR_HORARIOS", [returned_cursor, usuario, clinica_id]
                )
            else:
                return Response(
                    {"error": "No tiene permisos para consultar los horarios."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # Obtener los resultados del cursor de salida
            schedules = returned_cursor.fetchall()

            if not schedules:
                return JsonResponse(
                    {"error": "No se encontraron horarios."}, status=404
                )

            # Convertir los resultados en un formato adecuado para la respuesta
            schedules_list = []
            for schedule in schedules:
                try:
                    clinica_nombre = Clinicas.objects.get(clinica_id=schedule[6]).nombre if schedule[6] else "Desconocida"
                except Clinicas.DoesNotExist:
                    clinica_nombre = "Clínica no encontrada"

                schedule_data = {
                    "horario_id": schedule[0],
                    "usuario_veterinario": schedule[1],
                    "dia": schedule[2],
                    "hora_inicio": (
                        schedule[3].strftime("%H:%M") if schedule[3] else None
                    ),
                    "hora_fin": schedule[4].strftime("%H:%M") if schedule[4] else None,
                    "clinica": clinica_nombre,
                    "activo": True if schedule[5] == 1 else False,
                }
                schedules_list.append(schedule_data)

            # Filtrar por búsqueda
            if search:
                schedules_list = [
                    record
                    for record in schedules_list
                    if search.lower() in str(record.get(column, "")).lower()
                ]

            # Ordenar los resultados
            schedules_list.sort(
                key=lambda x: x.get(column, ""), reverse=(order == "desc")
            )

            # Paginación
            paginator = CustomPagination()
            result_page = paginator.paginate_queryset(schedules_list, request)
            return paginator.get_paginated_response(result_page)

    except Exception as e:
        # Log para el servidor y respuesta detallada para el usuario
        print(f"Error en consult_schedules: {str(e)}")
        if "ORACLE error" in str(e):
            return Response({"error": "Error en la base de datos, por favor intente más tarde."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"error": "Error desconocido en el servidor."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(["PUT"])
def reactivate_clinic(request, clinica_id):
    try:
        clinica = Clinicas.objects.get(pk=clinica_id)
        clinica.activo = True
        clinica.save()
        return Response(
            {"message": "Clínica reactivada con éxito."},
            status=status.HTTP_200_OK,
        )
    except Clinicas.DoesNotExist:
        return Response(
            {"error": "Clínica no encontrada."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["PUT"])
def reactivate_pet(request, mascota_id):
    try:
        mascota = Mascotas.objects.get(pk=mascota_id)
        mascota.activo = True
        mascota.save()
        return Response(
            {"message": "Mascota reactivada con éxito."},
            status=status.HTTP_200_OK,
        )
    except Mascotas.DoesNotExist:
        return Response(
            {"error": "Mascota no encontrada."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@transaction.atomic
def add_vet_schedule(request):
    try:
        # Obtener los parámetros enviados en el cuerpo de la solicitud
        usuario_veterinario = request.data.get("usuario_veterinario")
        dia = request.data.get("dia")
        hora_inicio = request.data.get("hora_inicio")
        hora_fin = request.data.get("hora_fin")
        clinica_id = request.data.get("clinica_id")

        # Validar que todos los campos estén presentes
        if not all([usuario_veterinario, dia, hora_inicio, hora_fin, clinica_id]):
            return Response(
                {"error": "Todos los campos son obligatorios."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Convertir horas a datetime para asegurar formato correcto
        try:
            hora_inicio_dt = datetime.strptime(hora_inicio, "%H:%M")
            hora_fin_dt = datetime.strptime(hora_fin, "%H:%M")
        except ValueError:
            return Response(
                {"error": "Formato de hora incorrecto. Use HH:MM."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verificación de que la hora de fin es posterior a la hora de inicio
        if hora_fin_dt <= hora_inicio_dt:
            return Response(
                {"error": "La hora de fin debe ser posterior a la hora de inicio."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verificar si el usuario veterinario existe
        if not Usuarios.objects.filter(usuario=usuario_veterinario, rol_id=3).exists():
            return Response(
                {"error": "El usuario veterinario especificado no existe."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Verificar si la clínica existe
        if not Clinicas.objects.filter(clinica_id=clinica_id).exists():
            return Response(
                {"error": "La clínica especificada no existe."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Llamar al procedimiento almacenado para agregar el horario
        with connection.cursor() as cursor:
            cursor.callproc(
                "VETLINK.AGREGAR_HORARIO_VETERINARIO",
                [usuario_veterinario, dia, hora_inicio_dt, hora_fin_dt, clinica_id],
            )

        return Response(
            {"message": "Horario agregado exitosamente."},
            status=status.HTTP_201_CREATED,
        )

    except Exception as e:
        # Manejar cualquier error que ocurra
        print(
            f"Error al agregar horario: {str(e)}"
        )  # Esto imprime el error en la consola
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET"])
def autocomplete_vet(request):
    search = request.GET.get("search", "")

    try:
        # Filtrar veterinarios (rol = 3) que coincidan con la búsqueda
        usuarios_veterinarios = Usuarios.objects.filter(
            rol=3, usuario__icontains=search
        ).order_by("usuario")

        # Serializar la información relevante para el autocompletado
        serializer_data = [
            {
                "usuario": usuario.usuario,
                "nombre": usuario.nombre,
                "apellido1": usuario.apellido1,
                "apellido2": usuario.apellido2,
            }
            for usuario in usuarios_veterinarios
        ]

        return Response(serializer_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_admin_clinic(request):
    try:
        # Obtener el rol y el ID del usuario de la sesión
        rol_id = request.session.get("role")
        usuario_id = request.session.get("user")

        # Validar que el rol sea de administrador (role_id == 2)
        if rol_id != 2:
            return Response(
                {"error": "No tiene permisos para acceder a esta información."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Obtener el usuario administrador
        usuario = Usuarios.objects.filter(usuario=usuario_id, rol=2).first()
        
        # Verificar si el usuario y la clínica existen
        if not usuario or not usuario.clinica:
            return Response(
                {"error": "No se encontró la clínica para este administrador."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Devolver la información de la clínica asociada
        clinica_data = {
            "clinica_id": usuario.clinica.clinica_id,
            "clinica": usuario.clinica.nombre,
        }
        return Response(clinica_data, status=status.HTTP_200_OK)

    except Exception as e:
        import traceback
        print(traceback.format_exc())  # Para registrar el error completo
        return Response(
            {"error": f"Error al obtener la clínica: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
