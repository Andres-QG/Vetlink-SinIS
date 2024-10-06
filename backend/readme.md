# registro de acciones

## pasos que seguí crear el proyecto

### 1 Instalar todo

- Antes se debe instalar la biblioteca virtualenv con python -m venv env

- Crear un entorno virtual con virtualenv -p python3 env

- Si le tira un error, se debe activar la ejecucion de scripts temporalmente, meter este comando desde terminal Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process, luego poner darle a sí

- activar el entorno virtual con .\env\Scripts\Activate.ps1
- Para desactivarlo se usa deactivate

A partir de aquí estarás adentro del entorno virtual y lo que instales solo estará ahí OJO

- Instalar setuptool con pip install setuptools==75.1.0

- Instalar djangorestframework con pip install djangorestframework==3.15.2

- Instalar django-cors-headers con pip install django-cors-headers==4.4.0

- Instalar cx_Oracle con pip install cx_Oracle==8.3.0

- Instalar Oracle db con python -m pip install oracledb==2.4.1

#### Verificacion

pip list

Package Version

<!-- --- -->

asgiref 3.8.1
cffi 1.17.1
cryptography 43.0.1
cx_Oracle 8.3.0
Django 5.1.1
django-cors-headers 4.4.0
djangorestframework 3.15.2
oracledb 2.4.1
pip 24.2
pycparser 2.22
setuptools 75.1.0
sqlparse 0.5.1
tzdata 2024.2

### 2 Crear el proyecto

`django-admin startproject ConfiguracionProyecto`

`cd ProyectoDjango`

### 3 Crear la app

`django-admin startapp Api`

### 4 Registrar la app en el settings.py

```python
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "Api"
]
```

### 5 Establecer los parametros para la conexion a la base de datos

```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.oracle",
        "NAME": "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCPS)(HOST=adb.sa-saopaulo-1.oraclecloud.com)(PORT=1522))(CONNECT_DATA=(SERVICE_NAME=g5936dc7ef2f8c4_vetlink_high.adb.oraclecloud.com))(SECURITY=(SSL_SERVER_DN_MATCH=YES)))
        "USER": "VETLINK",
        "PASSWORD": "Pruebas$2024",
    },
}
```

### 7 Migracion inicial

estando en la carpeta del proyecto:
`python manage.py migrate`

Traer los datos de la base a modelo de django
`python manage.py inspectdb > Api/models.py`

En la base de datos se crearan las tablas necesarias para el funcionamiento de django

### 8 Crear un superusuario

`python manage.py createsuperuser`

user: admin
password: admin

### 9 Correr el servidor

`python manage.py runserver`

## Ejemplo para crear una api nueva
Para crear una nueva API en Django que reciba datos de la base de datos, específicamente los usuarios de la clase [`Usuarios`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fserializers.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A1%2C%22character%22%3A20%7D%7D%2C%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fviews.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A7%2C%22character%22%3A20%7D%7D%2C%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fmodels.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A397%2C%22character%22%3A6%7D%7D%5D%2C%225542abe8-e3a2-42b1-b4f5-a9f7e7a1d796%22%5D "Go to definition") que tengan [`rol = 3`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fmodels.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A406%2C%22character%22%3A4%7D%7D%2C%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fviews.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A37%2C%22character%22%3A52%7D%7D%2C%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fmodels.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A406%2C%22character%22%3A4%7D%7D%5D%2C%225542abe8-e3a2-42b1-b4f5-a9f7e7a1d796%22%5D "Go to definition"), sigue estos pasos:
1. **Define el modelo [`Usuarios`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fserializers.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A1%2C%22character%22%3A20%7D%7D%2C%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fviews.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A7%2C%22character%22%3A20%7D%7D%2C%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fmodels.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A397%2C%22character%22%3A6%7D%7D%5D%2C%225542abe8-e3a2-42b1-b4f5-a9f7e7a1d796%22%5D "Go to definition") en [`models.py`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fmodels.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%225542abe8-e3a2-42b1-b4f5-a9f7e7a1d796%22%5D "c:\Users\milto\Desktop\PI\Vetlink-SinIS\backend\ProyectoDjango\Api\models.py")**:
   Asegúrate de que el modelo [`Usuarios`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fserializers.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A1%2C%22character%22%3A20%7D%7D%2C%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fviews.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A7%2C%22character%22%3A20%7D%7D%2C%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fmodels.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A397%2C%22character%22%3A6%7D%7D%5D%2C%225542abe8-e3a2-42b1-b4f5-a9f7e7a1d796%22%5D "Go to definition") esté correctamente definido en [`models.py`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fmodels.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%225542abe8-e3a2-42b1-b4f5-a9f7e7a1d796%22%5D "c:\Users\milto\Desktop\PI\Vetlink-SinIS\backend\ProyectoDjango\Api\models.py"). Aquí hay un ejemplo básico:
   ```python
   from django.db import models
   class Usuarios(models.Model):
       usuario = models.CharField(max_length=255)
       rol = models.IntegerField()
       def __str__(self):
           return self.usuario
   ```
2. **Crear un serializador para el modelo [`Usuarios`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fserializers.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A1%2C%22character%22%3A20%7D%7D%2C%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fviews.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A7%2C%22character%22%3A20%7D%7D%2C%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fmodels.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A397%2C%22character%22%3A6%7D%7D%5D%2C%225542abe8-e3a2-42b1-b4f5-a9f7e7a1d796%22%5D "Go to definition") en [`serializers.py`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fserializers.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%225542abe8-e3a2-42b1-b4f5-a9f7e7a1d796%22%5D "c:\Users\milto\Desktop\PI\Vetlink-SinIS\backend\ProyectoDjango\Api\serializers.py")**:
   Ya tienes un serializador definido, pero asegúrate de que esté correcto:
   ```python
   from rest_framework import serializers
   from .models import Usuarios
   class UsuariosSerializer(serializers.ModelSerializer):
       class Meta:
           model = Usuarios
           fields = '__all__'
   ```
3. **Crear una vista para la API en [`views.py`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fviews.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%225542abe8-e3a2-42b1-b4f5-a9f7e7a1d796%22%5D "c:\Users\milto\Desktop\PI\Vetlink-SinIS\backend\ProyectoDjango\Api\views.py")**:
   Define una vista que filtre los usuarios con [`rol = 3`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fmodels.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A406%2C%22character%22%3A4%7D%7D%2C%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fviews.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A37%2C%22character%22%3A52%7D%7D%2C%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fmodels.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A406%2C%22character%22%3A4%7D%7D%5D%2C%225542abe8-e3a2-42b1-b4f5-a9f7e7a1d796%22%5D "Go to definition") y los devuelva en la respuesta:
   ```python
   from rest_framework.decorators import api_view
   from rest_framework.response import Response
   from rest_framework import status
   from .models import Usuarios
   from .serializers import UsuariosSerializer
   @api_view(['GET'])
   def get_users_with_role_3(request):
       try:
           users = Usuarios.objects.filter(rol=3)
           serializer = UsuariosSerializer(users, many=True)
           return Response(serializer.data, status=status.HTTP_200_OK)
       except Exception as e:
           return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
   ```
4. **Registrar la nueva vista en [`urls.py`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Furls.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%225542abe8-e3a2-42b1-b4f5-a9f7e7a1d796%22%5D "c:\Users\milto\Desktop\PI\Vetlink-SinIS\backend\ProyectoDjango\Api\urls.py")**:
   Añade una nueva ruta en [`urls.py`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Furls.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%225542abe8-e3a2-42b1-b4f5-a9f7e7a1d796%22%5D "c:\Users\milto\Desktop\PI\Vetlink-SinIS\backend\ProyectoDjango\Api\urls.py") para la vista que acabas de crear:
   ```python
   from django.urls import path
   from .views import check_user_exists, consult_client, get_users_with_role_3
   urlpatterns = [
       path('check-user/', check_user_exists, name='check_user_exists'),
       path('consult-client/', consult_client, name='consult_client'),
       path('users-with-role-3/', get_users_with_role_3, name='get_users_with_role_3'),
   ]
   ```
5. **Registrar el modelo en [`admin.py`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fadmin.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%225542abe8-e3a2-42b1-b4f5-a9f7e7a1d796%22%5D "c:\Users\milto\Desktop\PI\Vetlink-SinIS\backend\ProyectoDjango\Api\admin.py")**:
   Si deseas administrar el modelo [`Usuarios`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fserializers.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A1%2C%22character%22%3A20%7D%7D%2C%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fviews.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A7%2C%22character%22%3A20%7D%7D%2C%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fmodels.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A397%2C%22character%22%3A6%7D%7D%5D%2C%225542abe8-e3a2-42b1-b4f5-a9f7e7a1d796%22%5D "Go to definition") desde el panel de administración de Django, regístralo en [`admin.py`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fc%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fadmin.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%225542abe8-e3a2-42b1-b4f5-a9f7e7a1d796%22%5D "c:\Users\milto\Desktop\PI\Vetlink-SinIS\backend\ProyectoDjango\Api\admin.py"):
   ```python
   from django.contrib import admin
   from .models import Usuarios
   admin.site.register(Usuarios)
   ```
6. **Migrar la base de datos**:
   Si has realizado cambios en el modelo, asegúrate de migrar la base de datos:
   ```sh
   python manage.py makemigrations
   python manage.py migrate
   ```
7. **Probar la API**:
   Inicia el servidor de desarrollo y prueba la nueva API:
   ```sh
   python manage.py runserver
   ```
   Luego, accede a la URL `http://127.0.0.1:8000/users-with-role-3/` para verificar que la API devuelve los usuarios con [`rol = 3`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fmodels.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A406%2C%22character%22%3A4%7D%7D%2C%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fviews.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A37%2C%22character%22%3A52%7D%7D%2C%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FC%3A%2FUsers%2Fmilto%2FDesktop%2FPI%2FVetlink-SinIS%2Fbackend%2FProyectoDjango%2FApi%2Fmodels.py%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A406%2C%22character%22%3A4%7D%7D%5D%2C%225542abe8-e3a2-42b1-b4f5-a9f7e7a1d796%22%5D "Go to definition").
Siguiendo estos pasos, habrás creado una nueva API en Django que consulta la base de datos y devuelve los usuarios con un rol específico.
