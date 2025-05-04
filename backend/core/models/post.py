from django.db import models
from django.conf import settings

class Post(models.Model):
    text = models.TextField()
    image = models.ImageField(upload_to='posts/', blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    liked_by = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"Post by {self.user.username} on {self.created_at}"
