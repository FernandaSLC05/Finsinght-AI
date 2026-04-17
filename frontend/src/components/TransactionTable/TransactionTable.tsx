"use client";

import { useState, useEffect } from 'react';
import styles from './TransactionTable.module.css';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/transactions/`);
        
        if (!response.ok) {
          throw new Error('Falha ao carregar transações.');
        }

        const data = await response.json();
        setTransactions(data);
      } catch (err: any) {
        setError(err.message || 'Erro de rede.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Carregando transações...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Histórico de Gastos</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className={styles.row}>
                <td>{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                <td>{t.description}</td>
                <td>
                  <span className={styles.categoryBadge}>{t.category}</span>
                </td>
                <td className={styles.amount}>
                  {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={4} className={styles.empty}>
                  Nenhuma transação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
