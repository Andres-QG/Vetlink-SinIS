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

# Mezcla de varias tablas requeridas para la vista de Expedientes
class ExpedienteSerializer(serializers.Serializer):
    consulta_id = serializers.IntegerField(required=False)
    mascota_id = serializers.IntegerField()
    nombre_mascota = serializers.CharField(max_length=255, required=False)
    usuario_cliente = serializers.CharField(max_length=255, required=False)
    fecha = serializers.DateTimeField()
    diagnostico = serializers.CharField(max_length=255)
    peso = serializers.FloatField()
    vacunas = serializers.CharField(max_length=255)   # Lista separada por comas
    sintomas = serializers.CharField(max_length=255)  # Lista separada por comas
    tratamientos = serializers.CharField(max_length=255)  # Lista separada por comas

class CitasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Citas
        fields = "__all__"