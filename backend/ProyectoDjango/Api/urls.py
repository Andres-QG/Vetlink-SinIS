from django.urls import path
from .views import *

urlpatterns = [
    path("check-user/", check_user_exists, name="check_user_exists"),
    path("get-user-role/", get_user_role, name="get_user_role"),
    path("log-out/", log_out, name="log_out"),
    path("reset-password/", reset_password, name="reset_password"),
    path("verify-code/", verify_code, name="verify_code"),
    path("check-new-pass/", check_new_pass, name="check_new_pass"),
    path("consult-client/", consult_client, name="consult_client"),
    path("consult-clinics/", consult_clinics, name="consult_clinics"),
    path("add-client/", add_client, name="add_client"),
    path("update-client/<str:usuario>/", update_client, name="update_client"),
    path("delete-client/<str:usuario>/", delete_client, name="delete_client"),
    path("consult-mascotas/", consult_mascotas, name="consult_mascotas"),
    path("create-pet/", create_pet, name="create_pet"),
    path("consult-vet/", consult_vet, name="consult_vet/"),
    path("add-vet/", add_vet, name="add_vet"),
    path("delete-pet/<int:mascota_id>/", delete_pet, name="delete_pet"),
    path("consult-specialties/", consult_specialties, name="consult_specialties"),
]
