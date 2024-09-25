from django.urls import path
from .views import check_user_exists

urlpatterns = [
    path('check-user/', check_user_exists, name='check_user_exists'),
]