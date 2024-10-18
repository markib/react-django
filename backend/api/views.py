from django.shortcuts import render
from .serializers import ItemSerializer
from rest_framework import viewsets
from .models import Item


# Create your views here.
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
