from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile
from insights.models import Transaction
from django.db.models import Sum

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    current_balance = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['is_onboarding_complete', 'name', 'financial_goal', 'monthly_income', 'username', 'current_balance']

    def get_current_balance(self, obj):
        expenses = Transaction.objects.filter(user=obj.user, transaction_type='EXPENSE').aggregate(Sum('amount'))['amount__sum'] or 0
        incomes = Transaction.objects.filter(user=obj.user, transaction_type='INCOME').aggregate(Sum('amount'))['amount__sum'] or 0
        return float(obj.monthly_income) + float(incomes) - float(expenses)

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        # Create an empty profile for the new user
        Profile.objects.create(user=user)
        return user
