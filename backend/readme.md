# registro de acciones

## pasos que seguí crear el proyecto

### 1 Instalar todo

- Antes se debe instalar la biblioteca virtualenv con pip install virtualenv

- Crear un entorno virtual con virtualenv -p python3 env

- Si le tira un error, se debe activar la ejecucion de scripts, meter este comando desde poweshell abierto como administrador Set-ExecutionPolicy RemoteSigned, luego poner darle a sí

- activar el entorno virtual con .\env\Scripts\activate

A partir de aquí estarás adentro del entorno virtual y lo que instales solo estará ahí OJO

- Instalar setuptool con pip install setuptools==75.1.0

- Instalar django 5.1.1 con pip install django==5.1.1

- Instalar cx_Oracle con pip install cx_Oracle==8.3.0

python -m pip install oracledb==2.4.1

#### Verificacion

pip list

Package Version

<!-- --- -->

asgiref 3.8.1
cffi 1.17.1
cryptography 43.0.1
cx_Oracle 8.3.0
Django 5.1.1
oracledb 2.4.1
pip 24.2
pycparser 2.22
setuptools 75.1.0
sqlparse 0.5.1
tzdata 2024.1

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
        "NAME": "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCPS)(HOST=adb.sa-saopaulo-1.oraclecloud.com)(PORT=1522))(CONNECT_DATA=(SERVICE_NAME=g5936dc7ef2f8c4_vetlink_high.adb.oraclecloud.com))(SECURITY=(SSL_SERVER_DN_MATCH=YES)))",
        "USER": "LPEREIRA",
        "PASSWORD": "Pruebas$2024",
    },
}
```

### 7 Migracion inicial

estando en la carpeta del proyecto:
`python manage.py migrate`

Traer los datos de la base a modelo de django
`python manage.py inspectdb > models.py`

En la base de datos se crearan las tablas necesarias para el funcionamiento de django

### 8 Crear un superusuario

`python manage.py createsuperuser`

user: admin
password: admin

### 9 Correr el servidor

`python manage.py runserver`