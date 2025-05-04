from django.contrib import admin
from .models import User, Post

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email')  # Exemplo de campos a exibir na lista

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'text', 'image', 'created_at')

# @admin.register(Follow)
# class FollowAdmin(admin.ModelAdmin):
#     list_display = ('follower', 'following')

# @admin.register(Like)
# class LikeAdmin(admin.ModelAdmin):
#     list_display = ('user', 'post')
