from django.urls import path
from .views import *

urlpatterns = [
    path('check-user/', check_user_exists, name='check_user_exists'),
    path('get-user-role/', get_user_role, name='get_user_role'),
    path('consult-client/', consult_client, name='consult_client'),
    path('consult-mascotas/', consult_mascotas, name='consult_mascotas'),
    path('create-pet/', create_pet, name='create_pet'),
]
