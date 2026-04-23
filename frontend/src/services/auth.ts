// auth.ts - Funções de integração com a API de contas

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/api/accounts/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Falha no login. Verifique suas credenciais.');
  const data = await res.json();
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  return data;
}

export async function register(username: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/api/accounts/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) throw new Error('Erro ao se registrar.');
  return await res.json();
}

export async function getProfile() {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('Token ausente');
  
  const res = await fetch(`${API_URL}/api/accounts/profile/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (res.status === 401) {
      // Possible token expiration, needs refresh logic (simplified here)
      throw new Error('Não autorizado. Faça login novamente.');
  }
  
  if (!res.ok) throw new Error('Falha ao buscar perfil.');
  return await res.json();
}

export async function updateProfileOnboarding(data: { name: string; financial_goal: string; monthly_income: number }) {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('Token ausente');

  const res = await fetch(`${API_URL}/api/accounts/profile/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Erro ao salvar onboarding.');
  return await res.json();
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}
