from django.shortcuts import render
from .serializers import ItemSerializer
from rest_framework import viewsets
from .models import Item
from rest_framework.permissions import IsAuthenticated
from accounts.authentication import (
    CookieJWTAuthentication,
)  # Make sure this import path is correct

# Create your views here.
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
