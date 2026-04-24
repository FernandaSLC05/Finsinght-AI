<div align="center">
  <h1>🌟 Finsight AI</h1>
  <p><strong>A Next-Generation AI-Powered Financial Dashboard</strong></p>
  <p>
    <a href="https://github.com/FernandaSLC05/Finsinght-AI">Ver no GitHub</a>
  </p>
</div>

<br />

O **Finsight AI** é uma aplicação completa (Full-Stack) projetada para oferecer uma experiência *premium* no controle das suas finanças pessoais. Combinando um design super moderno em *Dark Mode* e *Glassmorphism* com a inteligência artificial generativa do Google (Gemini), o Finsight não apenas registra suas transações, mas **entende seus hábitos e oferece insights personalizados**.

---

## ✨ Funcionalidades Principais

*   📊 **Histórico Dinâmico:** Tabela interativa com filtros rápidos por categorias (basta clicar nas *tags*), busca inteligente em tempo real e paginação elegante.
*   🧠 **Insights com IA (Gemini):** Análise preditiva e recomendações financeiras geradas automaticamente com base no seu padrão de gastos e ganhos.
*   💰 **Gestão de Caixa Completa:** Controle total de Receitas e Despesas, com atualização instantânea do seu balanço atual.
*   🎨 **UI/UX Premium:** Interface focada em usabilidade, micro-interações responsivas e um esquema de cores vibrante contra um fundo escuro elegante.

---

## 🛠️ Tecnologias Utilizadas

A arquitetura do Finsight AI foi construída pensando em escalabilidade, segurança e performance:

**Frontend:**
*   [Next.js](https://nextjs.org/) (React Framework)
*   CSS Modules (Design System Customizado Premium)

**Backend:**
*   [Django](https://www.djangoproject.com/) & Django REST Framework
*   [Google Generative AI](https://ai.google.dev/) (Integração Gemini)
*   Autenticação via Simple JWT

**Infraestrutura:**
*   [PostgreSQL](https://www.postgresql.org/) (Banco de Dados Relacional)
*   [Docker](https://www.docker.com/) & Docker Compose (Ambiente Containerizado)
*   Gunicorn & dj-database-url (Preparado para Produção)

---

## 🚀 Como Executar o Projeto Localmente

A forma mais fácil e garantida de rodar o projeto é utilizando o Docker. 

### Pré-requisitos
*   [Docker](https://docs.docker.com/get-docker/) instalado
*   [Docker Compose](https://docs.docker.com/compose/install/) instalado
*   Uma chave da API do Google Gemini.

### Passos

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/FernandaSLC05/Finsinght-AI.git
   cd Finsinght-AI
   ```

2. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env` dentro da pasta `backend/` e adicione as seguintes variáveis (substitua pelo seu token do Gemini):
   ```env
   GEMINI_API_KEY=sua_chave_aqui_da_api_gemini
   DATABASE_URL=postgres://finsightuser:finsightpassword@db:5432/finsight
   ```

3. **Suba os containers:**
   Na raiz do projeto, execute:
   ```bash
   docker-compose up --build
   ```

4. **Acesse a Aplicação:**
   * **Frontend (Interface):** [http://localhost:3000](http://localhost:3000)
   * **Backend (API):** [http://localhost:8000](http://localhost:8000)

---

<div align="center">
  <p>Desenvolvido com 💜 e foco em Design & Performance.</p>
</div>
