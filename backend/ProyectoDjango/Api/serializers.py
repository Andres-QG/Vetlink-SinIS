from rest_framework import serializers
from .models import Usuarios, Mascotas, Pesos, ConsultaMascotas, Vacunas, Sintomas, Tratamientos, ConsultaVacunas, ConsultaSintomas, ConsultaTratamientos

class UsuariosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuarios
        fields = '__all__'

class MascotaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mascotas
        fields = '__all__'

class PesoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pesos
        fields = '__all__'

class ConsultaMascotasSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultaMascotas
        fields = '__all__'

class VacunaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacunas
        fields = '__all__'

class SintomaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sintomas
        fields = '__all__'

class TratamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tratamientos
        fields = '__all__'

class ConsultaVacunaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultaVacunas
        fields = '__all__'

class ConsultaSintomaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultaSintomas
        fields = '__all__'

class ConsultaTratamientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultaTratamientos
        fields = '__all__'
