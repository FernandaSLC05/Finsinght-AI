import os
import google.generativeai as genai
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Transaction

class GeminiSummaryView(APIView):
    def get(self, request):
        transactions = Transaction.objects.all()
        if not transactions.exists():
            return Response({"summary": "Você ainda não tem gastos suficientes para gerar um insight. Adicione transações para começar!"})
        
        gastos_formatados = ", ".join([f"R$ {t.amount} em {t.description}" for t in transactions])
        
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return Response({"error": "A chave da API GEMINI_API_KEY não foi encontrada no ambiente."}, status=500)
        
        genai.configure(api_key=api_key)
        
        # gemini-1.5-pro is the recommended current model instead of gemini-pro
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = (f"Você é um consultor financeiro ultra moderno. Com base nestes dados de gastos do mês: "
                  f"[{gastos_formatados}], crie um resumo de no máximo 3 frases curtas destacando onde o usuário "
                  f"mais gastou, e dê uma dica de economia para o próximo mês. Seja muito motivador e profissional.")
        
        try:
            response = model.generate_content(prompt)
            # Extrair texto limpo
            summary_text = response.text.replace('*', '').strip()
            return Response({"summary": summary_text})
        except Exception as e:
            return Response({"error": f"Erro ao consultar a API: {str(e)}"}, status=500)
