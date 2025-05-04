from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import generics
from core.serializers.user_serializer import UserSerializer
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from ..models import User

# Login (Token JWT)
class MyTokenObtainPairView(TokenObtainPairView):
    # Este view já vem configurado para gerar o token, mas se você precisar de personalização, adicione aqui
    pass

# Registro de Usuário
class RegisterUserView(generics.CreateAPIView):
    permission_classes = [AllowAny]  # <-- ESSA LINHA É IMPORTANTE

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)