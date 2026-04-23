"use client";

import { useState, useEffect } from 'react';
import styles from './TransactionTable.module.css';
import { getTransactions, TransactionData } from '../../services/transactions';
import AddTransactionModal from '../AddTransactionModal/AddTransactionModal';

interface Transaction extends TransactionData {
  id: number;
}

interface Props {
  onTransactionAdded?: (amount: number, type: 'INCOME' | 'EXPENSE') => void;
}

const CATEGORY_COLORS: Record<string, { bg: string, text: string, border: string }> = {
  // Despesas (Todas em vermelho claro)
  'Alimentação': { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' },
  'Lazer': { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' },
  'Transporte': { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' },
  'Saúde': { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' },
  'Moradia': { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' },
  'Educação': { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' },
  'Assinaturas': { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' },
  // Receitas
  'Pix': { bg: 'rgba(16, 185, 129, 0.15)', text: '#34D399', border: 'rgba(16, 185, 129, 0.3)' },
  'Dinheiro em espécie': { bg: 'rgba(52, 211, 153, 0.15)', text: '#6EE7B7', border: 'rgba(52, 211, 153, 0.3)' },
  'Transferência bancária': { bg: 'rgba(96, 165, 250, 0.15)', text: '#93C5FD', border: 'rgba(96, 165, 250, 0.3)' },
  'Boleto': { bg: 'rgba(251, 191, 36, 0.15)', text: '#FCD34D', border: 'rgba(251, 191, 36, 0.3)' },
  'Salário': { bg: 'rgba(5, 150, 105, 0.15)', text: '#10B981', border: 'rgba(5, 150, 105, 0.3)' },
  'Outros': { bg: 'rgba(156, 163, 175, 0.15)', text: '#9CA3AF', border: 'rgba(156, 163, 175, 0.3)' }
};

export default function TransactionTable({ onTransactionAdded }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalType, setModalType] = useState<'INCOME' | 'EXPENSE' | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const getCategoryStyle = (category: string) => {
    const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS['Outros'];
    return {
      background: colors.bg,
      color: colors.text,
      borderColor: colors.border
    };
  };

  const fetchData = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err: any) {
      setError('Ainda não configurado ou erro ao buscar.');
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionAdded = (newTx: Transaction) => {
    setTransactions([newTx, ...transactions]);
    setModalType(null);
    if (onTransactionAdded) {
      onTransactionAdded(newTx.amount, newTx.transaction_type);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Carregando histórico...</div>;
  }

  return (
    <div className={styles.container}>
      {modalType && (
        <AddTransactionModal 
          type={modalType}
          onClose={() => setModalType(null)} 
          onSuccess={handleTransactionAdded} 
        />
      )}

      <div className={styles.headerArea}>
        <h3 className={styles.title}>Histórico Financeiro</h3>
        <div>
          <button className={styles.addBtnIncome} onClick={() => setModalType('INCOME')}>
            + Nova Receita
          </button>
          <button className={styles.addBtn} onClick={() => setModalType('EXPENSE')}>
            - Nova Despesa
          </button>
        </div>
      </div>

      {error ? (
         <div className={styles.error}>{error}</div>
      ) : (
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
                  <td>{new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                  <td>{t.description}</td>
                  <td>
                    <span 
                      className={styles.categoryBadge} 
                      style={getCategoryStyle(t.category)}
                    >
                      {t.category}
                    </span>
                  </td>
                  <td className={t.transaction_type === 'INCOME' ? styles.amountIncome : styles.amountExpense}>
                    {t.transaction_type === 'INCOME' ? '+' : '-'} {Number(t.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={4} className={styles.empty}>
                    Seu histórico está limpo! Cadastre sua primeira despesa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
