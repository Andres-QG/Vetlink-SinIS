from django.urls import path
from .views import *

urlpatterns = [
    path("check-user/", check_user_exists, name="check_user_exists"),
    path("consult-client/", consult_client, name="consult_client"),
    path("create-pet/", create_pet, name="create_pet"),
    path("consult_vet/", consult_vet, name="consult_vet"),
    path("create-user/", create_user, name="create_user"),
]
