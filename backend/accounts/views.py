from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    UserSerializer,
    CustomTokenObtainPairSerializer,
    UserProfileUpdateSerializer,
)
from rest_framework import permissions
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt import (
    exceptions as jwt_exceptions,
)
from datetime import datetime, timedelta
from django.core.exceptions import ValidationError
from accounts.authentication import CookieJWTAuthentication
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from django.middleware import csrf
from django.db import DatabaseError


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # Allow any user to access this view

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "user": serializer.data,
                    "message": "User created successfully. You can now log in.",
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]  # Allow any user to access this view

    def post(self, request):
        try:
            username = request.data.get("username")
            password = request.data.get("password")
            # Check if username and password are provided
            if not username:
                return Response(
                    {"message": "Username is required."}, status=status.HTTP_400_BAD_REQUEST
                )

            if not password:
                return Response(
                    {"message": "Password is required."}, status=status.HTTP_400_BAD_REQUEST
                )
            User = get_user_model()
            # Check if the user exists with the given username
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response(
                    {"message": "Username is incorrect."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if the password is correct
            if not user.check_password(password):
                return Response(
                    {"message": "Password is incorrect."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # user = User.objects.filter(username=username).first()  # Replace with your email
            # print(f"User Password: {user.password}" )
            # is_password_correct = user.check_password(
            #     password
            # )
            # Replace with your password
            # print(f"This should return True if the password is correct: {is_password_correct}" )  # This should return True if the password is correct
            # print(f"Username: {username}, Password: {password}")  # Debugging line
            user = authenticate(request, username=username, password=password)
            # print(f"If not None its ok: {user}")
            if user is not None:
                login(request, user)
                # Generate JWT tokens
                # refresh = RefreshToken.for_user(user)
                # Use the custom serializer to get tokens
                serializer = CustomTokenObtainPairSerializer()
                tokens = serializer.get_token(user)
                # print(f"tokens: {tokens.access_token}")
                access_token = str(tokens.access_token)
                refresh_token = str(tokens)

                response = Response(
                    {
                        # "refresh": str(tokens),
                        "access": access_token,
                        "user_id": user.id,
                        "email": user.email,
                        "username": user.username,
                    },
                    status=status.HTTP_200_OK,
                )
                # Set custom cookie
                response.set_cookie(
                    key=settings.SIMPLE_JWT["AUTH_COOKIE"],
                    value=access_token,
                    expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                    secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                    httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                    samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
                )

                # Optionally set refresh token cookie
                response.set_cookie(
                    key=settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"],
                    value=refresh_token,
                    expires=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                    secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                    httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                    samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
                )

                response["X-CSRFToken"] = csrf.get_token(request)
                return response
            else:
                return Response(
                    {"detail": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST
                )
        except ValidationError as e:
            # Handle validation errors (e.g., missing data fields)
            return Response({"message": f"Validation error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError as e:
            # Handle database errors
            return Response(
                    {"message":f"Validation error: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
            # Catch any other unexpected exceptions
            return Response(
                    {"message": f"An error occurred: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )


class LogoutView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get(
                settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"]
            )
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

            response = Response(status=status.HTTP_205_RESET_CONTENT)

            # Clear access token cookie
            response.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE"])

            # Clear refresh token cookie
            response.delete_cookie(settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"])

            response.delete_cookie("X-CSRFToken")
            response.delete_cookie("csrftoken")
            response["X-CSRFToken"] = None

            return response
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileUpdateSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user  # Get the authenticated user
        serializer = UserProfileUpdateSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs["refresh"] = self.context["request"].COOKIES.get("refresh")
        if attrs["refresh"]:
            return super().validate(attrs)
        else:
            raise jwt_exceptions.InvalidToken("No valid token found in cookie 'refresh'")


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get("refresh"):
            response.set_cookie(
                key=settings.SIMPLE_JWT["AUTH_COOKIE_REFRESH"],
                value=response.data["refresh"],
                expires=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            )

            del response.data["refresh"]
        response["X-CSRFToken"] = request.COOKIES.get("csrftoken")
        return super().finalize_response(request, response, *args, **kwargs)

    def get_user_id_from_token(self, token):
        decoded_token = AccessToken(token)
        return decoded_token["user_id"]


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data["access"]
            refresh_token = response.data["refresh"]

            # Set refresh token in HttpOnly cookie
            response.set_cookie(
                "refresh_token",
                refresh_token,
                httponly=True,
                samesite="Lax",  # or 'Strict'
                secure=True,  # Use only in HTTPS
                expires=datetime.utcnow() + timedelta(days=14),  # 14 days expiry
            )

            # Only return access token in response body
            response.data = {
                "access": access_token,
                "user": response.data.get("user", {}),  # Include user data if available
            }

        return response
