# accounts/urls.py
from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import RegisterView , LoginView

urlpatterns = [
    path(
        "token/obtain/", jwt_views.TokenObtainPairView.as_view(), name="token_create"
    ),  # override sjwt stock token
    path("token/refresh/", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
]
