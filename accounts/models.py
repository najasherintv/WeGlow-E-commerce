from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('admin', 'Admin')
    )
    email =models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    active = models.BooleanField(default=True)
    status = models.CharField(max_length=20, default='active')

    def __str__(self):
        return self.username
