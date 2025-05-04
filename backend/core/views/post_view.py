from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ..models import Post
from core.serializers.post_serializer import PostSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    print("Dados recebidos:", request.data)  # Verifique os dados que estão sendo enviados
    if request.method == 'POST':
        serializer = PostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_post(request, id):
    post = get_object_or_404(Post, id=id)
    serializer = PostSerializer(post, context={'request': request})
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_post(request, id):
    post = get_object_or_404(Post, id=id)
    if post.user != request.user:
        return Response({'error': 'You do not have permission to edit this post'}, status=status.HTTP_403_FORBIDDEN)
    
    # Passando o contexto de request para o serializer
    serializer = PostSerializer(post, data=request.data, partial=True, context={'request': request})
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_post(request, id):
    post = get_object_or_404(Post, id=id)
    if post.user != request.user:
        return Response({'error': 'You do not have permission to delete this post'}, status=status.HTTP_403_FORBIDDEN)
    
    post.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_post(request, id):
    post = get_object_or_404(Post, id=id)
    # Aqui podemos criar uma relação de "curtidas", seja com um modelo "Like" ou manipulação de campo Many-to-Many
    if request.user in post.liked_by.all():
        post.liked_by.remove(request.user)
        return Response({'message': 'Post unliked'}, status=status.HTTP_200_OK)
    post.liked_by.add(request.user)
    return Response({'message': 'Post liked'}, status=status.HTTP_200_OK)

