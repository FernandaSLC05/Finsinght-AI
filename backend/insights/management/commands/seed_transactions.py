from django.core.management.base import BaseCommand
from insights.models import Transaction
from datetime import date, timedelta
from decimal import Decimal

class Command(BaseCommand):
    help = 'Seeds the database with test transactions'

    def handle(self, *args, **kwargs):
        Transaction.objects.all().delete()
        
        today = date.today()
        
        transactions_data = [
            {'description': 'Supermercado Extra', 'amount': Decimal('450.00'), 'category': 'Alimentação', 'date': today - timedelta(days=2)},
            {'description': 'Netflix', 'amount': Decimal('55.90'), 'category': 'Lazer', 'date': today - timedelta(days=5)},
            {'description': 'Uber', 'amount': Decimal('35.00'), 'category': 'Transporte', 'date': today - timedelta(days=1)},
            {'description': 'Restaurante Japonês', 'amount': Decimal('120.00'), 'category': 'Alimentação', 'date': today - timedelta(days=7)},
            {'description': 'Conta de Luz', 'amount': Decimal('180.50'), 'category': 'Moradia', 'date': today - timedelta(days=10)},
            {'description': 'Academia', 'amount': Decimal('110.00'), 'category': 'Saúde', 'date': today - timedelta(days=15)},
        ]
        
        for t_data in transactions_data:
            Transaction.objects.create(**t_data)
            
        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {len(transactions_data)} transactions!'))
