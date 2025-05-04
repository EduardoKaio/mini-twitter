from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from ..models import User
from ..serializers.user_serializer import PublicUserSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['GET'])
def get_user(request, username):
    user = get_object_or_404(User, username=username)
    serializer = PublicUserSerializer(user)
    return Response(serializer.data)
