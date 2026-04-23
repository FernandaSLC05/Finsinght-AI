import os
import google.generativeai as genai
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Transaction
from .serializers import TransactionSerializer

class GeminiSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user).order_by('-date')[:50]
        if not transactions.exists():
            return Response({"summary": "Você ainda não tem gastos suficientes para gerar um insight. Adicione transações para começar!"})
        
        gastos_formatados = ", ".join([f"{'Receita' if t.transaction_type == 'INCOME' else 'Despesa'}: R$ {t.amount} em {t.category} ({t.description})" for t in transactions])
        
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return Response({"error": "A chave da API Gemini não está configurada corretamente no ambiente."}, status=500)
        
        genai.configure(api_key=api_key)
        
        model = genai.GenerativeModel('gemini-flash-latest')
        
        prompt = (f"Você é um consultor financeiro ultra moderno e astuto. Com base nestes dados recentes de fluxo de caixa do usuário: "
                  f"[{gastos_formatados}], crie um resumo de no máximo 3 frases curtas destacando onde o usuário "
                  f"mais gastou ou recebeu, e dê uma dica de economia ou investimento prático. "
                  f"Seja profissional, muito direto e levemente motivador.")
        
        try:
            response = model.generate_content(prompt)
            summary_text = response.text.replace('*', '').strip()
            return Response({"summary": summary_text})
        except Exception as e:
            return Response({"error": f"O serviço de IA está temporariamente indisponível. Detalhes: {str(e)}"}, status=502)

class TransactionListView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
