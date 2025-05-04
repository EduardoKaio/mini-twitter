from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from ..models.follow import Follow

User = get_user_model()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request, username):
    try:
        to_follow = User.objects.get(username=username)
        if request.user == to_follow:
            return Response({'detail': 'Você não pode seguir a si mesmo.'}, status=status.HTTP_400_BAD_REQUEST)

        follow, created = Follow.objects.get_or_create(follower=request.user, following=to_follow)
        if created:
            return Response({'detail': f'Você agora segue {username}.'}, status=status.HTTP_201_CREATED)
        return Response({'detail': f'Você já segue {username}.'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'detail': 'Usuário não encontrado.'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unfollow_user(request, username):
    try:
        to_unfollow = User.objects.get(username=username)
        deleted, _ = Follow.objects.filter(follower=request.user, following=to_unfollow).delete()
        if deleted:
            return Response({'detail': f'Você deixou de seguir {username}.'}, status=status.HTTP_200_OK)
        return Response({'detail': f'Você não segue {username}.'}, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'detail': 'Usuário não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_following(request):
    following = Follow.objects.filter(follower=request.user).select_related('following')
    data = [{'username': f.following.username, 'id': f.following.id} for f in following]
    return Response({'following': data})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_followers(request):
    followers = Follow.objects.filter(following=request.user).select_related('follower')
    data = [{'username': f.follower.username, 'id': f.follower.id} for f in followers]
    return Response({'followers': data})