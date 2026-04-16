from django.urls import path
from .views import GeminiSummaryView

urlpatterns = [
    path('ai-summary/', GeminiSummaryView.as_view(), name='ai-summary'),
]
