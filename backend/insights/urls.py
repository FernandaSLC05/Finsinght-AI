from django.urls import path
from .views import GeminiSummaryView, TransactionListView

urlpatterns = [
    path('ai-summary/', GeminiSummaryView.as_view(), name='ai-summary'),
    path('transactions/', TransactionListView.as_view(), name='transactions'),
]
