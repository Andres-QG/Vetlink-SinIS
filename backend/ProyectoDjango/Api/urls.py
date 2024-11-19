from django.urls import path
from .views import *

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Independent actions
    path("check-user/", check_user_exists, name="check_user_exists"),
    path("get-user-role/", get_user_role, name="get_user_role"),
    path("log-out/", log_out, name="log_out"),
    path("reset-password/", reset_password, name="reset_password"),
    path("verify-code/", verify_code, name="verify_code"),
    path("check-new-pass/", check_new_pass, name="check_new_pass"),
    path("get-user/", get_user, name="get_user"),
    # Get all registers
    path("get-owners/", get_owners, name="get_owners"),
    path("get-services/", get_services, name="get_services"),
    path("get-clinics/", get_clinics, name="get_clinics"),
    path("get-clients/", get_clients, name="get_clients"),
    path("get-vets/", get_vets, name="get_vets"),
    path("get-pets/", get_pets, name="get_pets"),
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
    path(
        "consult-vets-formatted/", consult_vets_formatted, name="consult_vets_formatted"
    ),
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
        name="delete_pet_record",
    ),
    # Vacunas
    path(
        "consult-vaccines/", consult_vaccines, name="consult_vaccines"
    ),  # Vacunas para expediente
    # vacunas para listado de vacunas
    path(
        "consult-clinic-vaccines/",
        consult_clinic_vaccines,
        name="consult_clinic_vaccines",
    ),
    path("add-clinic-vaccine/", add_clinic_vaccine, name="add_clinic_vaccine"),
    path(
        "update-clinic-vaccine/<int:vacuna_id>/",
        update_clinic_vaccine,
        name="update_clinic_vaccine",
    ),
    path(
        "deactivate-clinic-vaccine/<int:vacuna_id>/",
        deactivate_clinic_vaccine,
        name="deactivate_clinic_vaccine",
    ),
    path(
        "restore-clinic-vaccine/<int:vacuna_id>/",
        restore_clinic_vaccine,
        name="restore_clinic_vaccine",
    ),
    # Vacunas para historial de vacunación
    path(
        "consult-vaccines-history/",
        consult_vaccines_history,
        name="consult_vaccines_history",
    ),
    # Sintomas
    path("consult-symptoms/", consult_symptoms, name="consult_symptoms"),
    path("add-symptom/", add_symptom, name="add_symptom"),
    path("update-symptom/<int:id>/", update_symptom, name="update_symptom"),
    path("desactivate-symptom/<int:id>/", desactivate_symptom, name="delete_symptom"),
    path("restore-symptom/<int:id>/", restore_symptom, name="restore_symptom"),
    # Tratamientos
    path("consult-treatments/", consult_treatments, name="consult_treatments"),
    path("add-treatment/", add_treatment, name="add_treatment"),
    path("update-treatment/<int:id>/", update_treatment, name="update_treatment"),
    path(
        "desactivate-treatment/<int:id>/",
        desactivate_treatment,
        name="delete_treatment",
    ),
    path("restore-treatment/<int:id>/", restore_treatment, name="restore_treatment"),
    # Citas APIs
    path("consult-citas/", consult_citas, name="consult_citas"),
    path("add-cita/", add_cita, name="add_cita"),
    path("update-cita/<int:cita_id>/", update_cita, name="update_cita"),
    path("delete-cita/<int:cita_id>/", delete_cita, name="delete_cita"),
    path("get-disp-times/", get_disp_times, name="get_disp_times"),
    # Horarios Veterinarios APIs
    path("consult-schedules/", consult_schedules, name="consult_schedules"),
    path("add-schedule/", add_vet_schedule, name="add_vet_schedule"),
    path("autocomplete-vet/", autocomplete_vet, name="autocomplete_vet"),
    path("get-admin-clinic/", get_admin_clinic, name="get_admin_clinic"),
    path(
        "modify-vet-schedule/<int:horario_id>/",
        modify_vet_schedule,
        name="modify_vet_schedule",
    ),
    path(
        "delete-vet-schedule/<int:horario_id>/",
        delete_vet_schedule,
        name="delete_vet_schedule",
    ),
    path(
        "reactivate-vet-schedule/<int:horario_id>/",
        reactivate_vet_schedule,
        name="reactivate_vet_schedule",
    ),
    # Reactivate APIs
    path("reactivate-user/<str:usuario>/", reactivate_user, name="reactivate_user"),
    path("reactivate-pet/<int:mascota_id>/", reactivate_pet, name="reactivate_pet"),
    path(
        "reactivate-clinic/<int:clinica_id>/",
        reactivate_clinic,
        name="reactivate_clinic",
    ),
    # Services APIs
    path("add-service/", add_servicio, name="add_servicio"),
    path("consult-services/", consult_services, name="consult_services"),
    path("update-service/<int:servicio_id>/", update_servicio, name="update_servicio"),
    path("delete-service/<int:servicio_id>/", delete_service, name="delete_service"),
    path(
        "reactivate-service/<int:servicio_id>/",
        reactivate_service,
        name="reactivate_service",
    ),
    # Mascotas Cliente APIs
    path("consult-my-pets/", consult_my_pets, name="consult_my_pets"),
    path("add-mypet/", add_mypet, name="add_mypet"),
    path("update-my-pet/<int:mascota_id>/", update_mypet, name="update_mypet"),
    path("delete-my-pet/<int:mascota_id>/", delete_my_pet, name="delete_my_pet"),
    # Personal Info APIs
    path(
        "get-user-personal-info/",
        get_user_personal_info,
        name="get_user_personal_info",
    ),
    path(
        "update-user-personal-info/",
        update_user_personal_info,
        name="update_user_personal_info",
    ),
    path("deactivate-user/", deactivate_user, name="deactivate_user"),
    # Pagos APIs
    path("create-payment/", create_payment, name="create-payment"),
    # Metodos de pago Cliente APIs
    path("add-payment-method/", add_payment_method, name="add_payment_method"),
    path(
        "consult-payment-methods/",
        consult_payment_methods,
        name="consult_payment_methods",
    ),
    path(
        "modify-payment-method/<int:metodo_pago_id>/",
        modify_payment_method,
        name="modify_payment_method",
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(
        settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0]
    )
