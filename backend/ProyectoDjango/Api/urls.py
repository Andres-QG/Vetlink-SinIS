from django.urls import path
from .views import *

urlpatterns = [
    # Independent actions
    path("check-user/", check_user_exists, name="check_user_exists"),
    path("get-user-role/", get_user_role, name="get_user_role"),
    path("log-out/", log_out, name="log_out"),
    path("reset-password/", reset_password, name="reset_password"),
    path("verify-code/", verify_code, name="verify_code"),
    path("check-new-pass/", check_new_pass, name="check_new_pass"),
    path("get-owners/", get_owners, name="get_owners"),
    path("get-clients/", get_clients, name="get_clients"),
    path("get-vets/", get_vets, name="get_vets"),
    # Client APIs
    path("consult-client/", consult_client, name="consult_client"),
    path("add-client/", add_client, name="add_client"),
    path("update-client/<str:usuario>/", update_client, name="update_client"),
    path("delete-client/<str:usuario>/", delete_client, name="delete_client"),
    # Clinic APIs
    path("consult-clinics/", consult_clinics, name="consult_clinics"),
    path("add-clinic/", add_clinic, name="add_clinic"),
    path("update-clinic/<int:clinica_id>/", update_clinic, name="update_clinic"),
    path("delete-clinic/<int:clinica_id>/", delete_clinic, name="delete_clinic"),
    # Mascotas APIs
    path("consult-mascotas/", consult_mascotas, name="consult_mascotas"),
    path("create-pet/", create_pet, name="create_pet"),
    path("update-pet/<int:mascota_id>/", update_pet, name="update_pet"),
    path("delete-pet/<int:mascota_id>/", delete_pet, name="delete_pet"),
    # Admin APIs
    path("consult-admin/", consult_admin, name="consult_admin"),
    path("add-admin/", add_admin, name="add_admin"),
    path("update-admin/<str:usuario>/", update_admin, name="update_admin"),
    path("delete-admin/<str:usuario>/", delete_admin, name="delete_admin"),
    # Veterinarian APIs
    path("consult-vet/", consult_vet, name="consult_vet"),
    path("add-vet/", add_vet, name="add_vet"),
    path("update-vet/<str:usuario>/", update_vet, name="update_vet"),
    path("consult-specialties/", consult_specialties, name="consult_specialties"),
    # Pet Records APIs
    path("consult-pet-records/", consult_pet_records, name="consult_pet_records"),
    path("add-pet-record/", add_pet_record, name="add_pet_record"),
    path(
        "update-pet-record/<int:mascota_id>/<int:consulta_id>/",
        update_pet_record,
        name="update_pet_record",
    ),
    path(
        "delete-pet-record/<int:consulta_id>/",
        delete_pet_record,
        name="delete_pet_record"
    ),

    # Vacunas
    path("consult-vaccines/", consult_vaccines, name="consult_vaccines"),
    # Citas APIs
    path("consult-citas/", consult_citas, name="consult_citas"),
    path("add-cita/", add_cita, name="add_cita"),
    path("update-cita/<int:cita_id>/", update_cita, name="update_cita"),
    path("delete-cita/<int:cita_id>/", delete_cita, name="delete_cita"),
    # Horarios Veterinarios APIs
    path("consult-schedules/", consult_schedules, name="consult_schedules"),
    path("add-schedule/", add_vet_schedule, name="add_vet_schedule"),
    path("autocomplete-vet/", autocomplete_vet, name="autocomplete_vet"),
    path('get-admin-clinic/', get_admin_clinic, name='get_admin_clinic'),
    path("modify-vet-schedule/<int:horario_id>/", modify_vet_schedule, name="modify_vet_schedule"),
    
    # Reactivate APIs
    path("reactivate-user/<str:usuario>/", reactivate_user, name="reactivate_user"),
    path("reactivate-pet/<int:mascota_id>/", reactivate_pet, name="reactivate_pet"),
    path("reactivate-clinic/<int:clinica_id>/", reactivate_clinic, name="reactivate_clinic"),
]
