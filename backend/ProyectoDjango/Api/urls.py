from django.urls import path
from .views import check_user_exists
from .views import consult_client, consult_mascotas,create_pet

urlpatterns = [
    path('check-user/', check_user_exists, name='check_user_exists'),
    path('consult-client/', consult_client, name='consult_client'),
    path('consult-mascotas/', consult_mascotas, name='consult_mascotas'),
    path('create-pet/', create_pet, name='create_pet'),
]
