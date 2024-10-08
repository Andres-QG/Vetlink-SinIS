from rest_framework import serializers
from .models import *


class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = "__all__"


class NameUsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = ["usuario", "nombre"]


class MascotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mascotas
        fields = "__all__"


class ClinicasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinicas
        fields = "__all__"


class EspecialidadesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidades
        fields = "__all__"
