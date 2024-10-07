from rest_framework import serializers
from .models import *

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
        fields = ['nombre', 'direccion', 'telefono', 'usuario_propietario']
