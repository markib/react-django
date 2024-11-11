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
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

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
                access_token = str(tokens.access_token)

                return Response(
                    {
                        "refresh": str(tokens),
                        "access": access_token,
                        "user_id": user.id,
                        "email": user.email,
                        "username": user.username,
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"detail": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST
                )
        except ValidationError as e:
            # Handle validation errors (e.g., missing data fields)
            return Response({"message": f"Validation error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        except DatabaseError:
            # Handle database errors
            return Response(
                    {"message": "A database error occurred. Please try again later."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
            # Catch any other unexpected exceptions
            return Response(
                    {"message": f"An error occurred: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

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


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        serializer = TokenRefreshSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            data = serializer.validated_data

            # Decode the new access token to get user info
            access_token = data.get("access")
            user_id = self.get_user_id_from_token(access_token)

            # Fetch the latest user data
            user = User.objects.get(id=user_id)
            user_data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_active": user.is_active,
            }

            # Add user data to the response
            data["user"] = user_data
            print(data)

            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_user_id_from_token(self, token):
        from rest_framework_simplejwt.tokens import AccessToken

        decoded_token = AccessToken(token)
        return decoded_token["user_id"]
