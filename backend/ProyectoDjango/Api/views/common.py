# views/common.py

# Django imports
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import logout
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from django.db import connection, transaction
from django.db.models import Q
from django.views.decorators.cache import cache_page

# REST Framework imports
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

# Utilities
from datetime import datetime
import random
import stripe
import json
import sendgrid
from sendgrid.helpers.mail import Mail
import os
import re

# Models
from ..models import *
from ..serializers import *

# Encryption
from cryptography.fernet import Fernet

# Stripe setup
stripe.api_key = settings.STRIPE_SECRET_KEY


class CustomPagination(PageNumberPagination):
    page_size = 7  # Número de registros por página
    page_size_query_param = (
        "page_size"  # Puedes ajustar el tamaño de la página desde la query
    )
    max_page_size = 100  # Tamaño máximo de la página que puedes solicitar
