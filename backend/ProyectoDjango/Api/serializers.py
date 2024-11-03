from rest_framework import serializers
from .models import *


class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = "__all__"

class ServiciosNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicios
        fields = ['servicio_id', 'nombre']


class NameUsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = "__all__"

class HorariosVeterinariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = HorariosVeterinarios
        fields = ['dia', 'hora_inicio', 'hora_fin', 'activo']

class NameUsuariosWithHorariosSerializer(serializers.ModelSerializer):
    horarios_veterinarios = HorariosVeterinariosSerializer(many=True, source='horariosveterinarios_set')

    class Meta:
        model = Usuarios
        fields = ['usuario', 'nombre', 'horarios_veterinarios']


class MascotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mascotas
        fields = "__all__"


class ClinicasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinicas
        fields = "__all__"


class FullUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = ["usuario", "rol_id", "clinica_id"]


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

class VacunasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacunas
        fields = "__all__"

class SintomasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sintomas
        fields = "__all__"

class TratamientosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tratamientos
        fields = "__all__"
