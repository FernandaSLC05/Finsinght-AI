from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_onboarding_complete = models.BooleanField(default=False)
    name = models.CharField(max_length=255, blank=True)
    financial_goal = models.CharField(max_length=255, blank=True)
    monthly_income = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"Profile of {self.user.username}"
