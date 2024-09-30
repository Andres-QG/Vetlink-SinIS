from django.urls import path
from .views import check_user_exists
from .views import consult_client
from .views import create_mascota

urlpatterns = [
    path('check-user/', check_user_exists, name='check_user_exists'),
    path('consult-client/', consult_client, name='consult_client'),
    path('create-pet/', create_mascota, name='create_mascota'),
]
