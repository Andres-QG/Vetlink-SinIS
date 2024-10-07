from rest_framework import serializers
from .models import Usuarios, Mascotas, Clinicas, Especialidades

class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = '__all__'

class MascotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mascotas
        fields = '__all__'


class ClinicasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinicas
        fields = "__all__"


class EspecialidadesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidades
        fields = "__all__"
