# accounts/urls.py
from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    UserProfileView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
)

urlpatterns = [
    path(
        "token/obtain/", CustomTokenObtainPairView.as_view(), name="token_create"
    ),  # override sjwt stock token
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("profile/update/", UserProfileView.as_view(), name="update_profile"),
    path("profile/", UserProfileView.as_view(), name="user-profile"),
]
