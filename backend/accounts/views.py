from django.shortcuts import render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from rest_framework import permissions
from rest_framework.views import APIView
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

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
                refresh = RefreshToken.for_user(user)
                return Response(
                    {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
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