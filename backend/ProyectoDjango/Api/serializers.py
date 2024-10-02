from rest_framework import serializers
from .models import Usuarios, Mascotas

class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = '__all__'

class MascotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mascotas
        fields = '__all__'
