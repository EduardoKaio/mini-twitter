from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from core.models import Post, Follow
from core.serializers.post_serializer import PostSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def feed_view(request):
    following_users = Follow.objects.filter(follower=request.user).values_list('following', flat=True)
    posts = Post.objects.filter(user__in=following_users).order_by('-created_at')
    
    paginator = PageNumberPagination()
    paginator.page_size = 10
    result_page = paginator.paginate_queryset(posts, request)
    
    serializer = PostSerializer(result_page, many=True, context={'request': request})
    
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_posts(request):
    posts = Post.objects.filter(user=request.user).order_by('-created_at')
    serializer = PostSerializer(posts, many=True, context={'request': request})
    return Response(serializer.data)