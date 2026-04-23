const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface TransactionData {
  transaction_type: 'INCOME' | 'EXPENSE';
  description: string;
  amount: number;
  category: string;
  date: string;
}

export async function getTransactions() {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('Token ausente');

  const res = await fetch(`${API_URL}/api/transactions/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error('Falha ao buscar transações.');
  return await res.json();
}

export async function createTransaction(data: TransactionData) {
  const token = localStorage.getItem('access_token');
  if (!token) throw new Error('Token ausente');

  const res = await fetch(`${API_URL}/api/transactions/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!res.ok) throw new Error('Falha ao adicionar transação.');
  return await res.json();
}
