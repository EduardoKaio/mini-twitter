from rest_framework import serializers
from ..models import Post

from django.contrib.auth import get_user_model

User = get_user_model()  # Isso irá buscar o modelo de usuário configurado

class PostSerializer(serializers.ModelSerializer):
    is_liked = serializers.SerializerMethodField()
    likes_count = serializers.SerializerMethodField()
    user = serializers.CharField(source='user.username', read_only=True)
    image = serializers.ImageField(use_url=True)
    is_following = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'text', 'image', 'user', 'is_following','created_at', 'is_liked', 'likes_count']
        read_only_fields = ['user']

    def get_is_liked(self, obj):
        user = self.context['request'].user
        return user in obj.liked_by.all()

    def get_likes_count(self, obj):
        return obj.liked_by.count()
    
    def get_is_following(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return request.user.following.filter(following=obj.user).exists()
        return False

