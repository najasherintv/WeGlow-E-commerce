
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from .serializers import RegisterSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAdminUser
from .serializers import UserSerializer
from django.shortcuts import get_object_or_404

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            return Response({
                "message": "User registered successfully",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                },
               
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username and password required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user is None:
           
            if '@' in username:
                try:
                    user_obj = User.objects.get(email=username)
                    user = authenticate(username=user_obj.username, password=password)
                except User.DoesNotExist:
                    user = None
 
        if user is not None:
            tokens = get_tokens_for_user(user)
            return Response({
                "message": "Login successful",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": user.role,
                },
                "tokens": tokens
            }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self,request):
        token = request.data.get("token")

        if not token:
            return Response({"error": "Google token is required"}, status=status.HTTP_400_BAD_REQUEST)   
        try:
            idinfo = id_token.verify_oauth2_token(token, google_requests.Request()) 
            email = idinfo.get("email")
            username = email.split("@")[0]
        except Exception:
            return Response({"error": "Invalid or expired Google token"}, status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": username,
                "role":"user",
            }
        )

        tokens = get_tokens_for_user(user)

        return Response({
            "message": "Google login successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
            },
            "tokens": tokens
        }, status=status.HTTP_200_OK)
class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Find user using email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

        # Check password
        if not user.check_password(password):
            return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)

        # Check if admin
        if user.role != "admin":
            return Response({"error": "Not authorized as admin"}, status=status.HTTP_403_FORBIDDEN)

        # Generate tokens
        tokens = get_tokens_for_user(user)

        return Response({
            "message": "Admin login successful",
            "admin": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
            },
            "tokens": tokens
        }, status=status.HTTP_200_OK)

class AdminUserListView(ListAPIView):
    """
    GET: List all users (admin only)
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]


class AdminUserDetailView(RetrieveAPIView):
    """
    GET: Retrieve user details by id (admin only)
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'


class AdminUserUpdateView(UpdateAPIView):
  
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'


    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class AdminUserDeleteView(DestroyAPIView):
   
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    lookup_field = 'id'

        
        
            
