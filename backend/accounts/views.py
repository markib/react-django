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
from rest_framework.authtoken.models import Token

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
        username = request.data.get("username")
        password = request.data.get("password")
        # User = get_user_model()
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
            # Generate or retrieve the user's token
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.id,
                'email': user.email,
                'username': user.username
            }, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid credentials."}, status=400)
