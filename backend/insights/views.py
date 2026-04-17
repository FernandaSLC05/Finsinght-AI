import os
import google.generativeai as genai
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Transaction

class GeminiSummaryView(APIView):
    def get(self, request):
        transactions = Transaction.objects.all().order_by('-date')[:50]
        if not transactions.exists():
            return Response({"summary": "Você ainda não tem gastos suficientes para gerar um insight. Adicione transações para começar!"})
        
        gastos_formatados = ", ".join([f"R$ {t.amount} em {t.category} ({t.description})" for t in transactions])
        
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return Response({"error": "A chave da API Gemini não está configurada corretamente no ambiente."}, status=500)
        
        genai.configure(api_key=api_key)
        
        model = genai.GenerativeModel('gemini-flash-latest')
        
        prompt = (f"Você é um consultor financeiro ultra moderno e astuto. Com base nestes dados recentes de gastos: "
                  f"[{gastos_formatados}], crie um resumo de no máximo 3 frases curtas destacando onde o usuário "
                  f"mais gastou, e dê uma dica de economia prática. "
                  f"Seja profissional, muito direto e levemente motivador.")
        
        try:
            response = model.generate_content(prompt)
            summary_text = response.text.replace('*', '').strip()
            return Response({"summary": summary_text})
        except Exception as e:
            return Response({"error": f"O serviço de IA está temporariamente indisponível. Detalhes: {str(e)}"}, status=502)

class TransactionListView(APIView):
    def get(self, request):
        transactions = Transaction.objects.all().order_by('-date')
        data = [
            {
                "id": t.id,
                "description": t.description,
                "amount": float(t.amount),
                "category": t.category,
                "date": t.date.isoformat()
            }
            for t in transactions
        ]
        return Response(data)
