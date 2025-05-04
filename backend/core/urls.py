from django.urls import path
from core.views.auth_view import MyTokenObtainPairView, RegisterUserView
from rest_framework_simplejwt.views import TokenRefreshView
from core.views.post_view import create_post, get_post, update_post, delete_post, like_post
from core.views.follow_view import follow_user, unfollow_user, list_followers, list_following
from core.views.feed_view import feed_view, my_posts
from core.views.auth_view import UserProfileView
from core.views.user_view import get_user

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterUserView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    
    path('user/<str:username>/', get_user, name='get_user'),

    path('posts/', create_post, name='create_post'),
    path('posts/<int:id>/', get_post, name='get_post'),
    path('posts/<int:id>/edit/', update_post, name='update_post'),
    path('posts/<int:id>/delete/', delete_post, name='delete_post'),
    path('posts/<int:id>/like/', like_post, name='like_post'),
    
    path('follow/<str:username>/', follow_user, name='follow-user'),
    path('unfollow/<str:username>/', unfollow_user, name='unfollow-user'),
    path('followers/', list_followers, name='list-followers'),
    path('following/', list_following, name='list-following'),

    path('feed/', feed_view, name='feed'),
    path('my-posts/', my_posts, name='my-posts'),
]
