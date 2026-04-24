"use client";

import { useState, useEffect, useMemo } from 'react';
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

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'THIS_MONTH' | 'LAST_MONTH' | 'CUSTOM'>('ALL');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter, customStartDate, customEndDate, categoryFilter]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // 1. Categoria
      if (categoryFilter && t.category !== categoryFilter) return false;

      // 2. Busca por descrição
      if (searchTerm && !t.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;

      // 3. Filtro de Data
      if (dateFilter !== 'ALL') {
        const txDate = new Date(t.date);
        const today = new Date();
        
        if (dateFilter === 'THIS_MONTH') {
          if (txDate.getUTCMonth() !== today.getMonth() || txDate.getUTCFullYear() !== today.getFullYear()) return false;
        } else if (dateFilter === 'LAST_MONTH') {
          let lastMonth = today.getMonth() - 1;
          let year = today.getFullYear();
          if (lastMonth < 0) {
            lastMonth = 11;
            year -= 1;
          }
          if (txDate.getUTCMonth() !== lastMonth || txDate.getUTCFullYear() !== year) return false;
        } else if (dateFilter === 'CUSTOM') {
          if (customStartDate && txDate < new Date(customStartDate)) return false;
          if (customEndDate) {
            const endD = new Date(customEndDate);
            endD.setUTCHours(23, 59, 59, 999);
            if (txDate > endD) return false;
          }
        }
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, dateFilter, customStartDate, customEndDate, categoryFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    fetchData();
  }, []);

  const getCategoryStyle = (category: string, type: 'INCOME' | 'EXPENSE') => {
    if (category === 'Outros' || !CATEGORY_COLORS[category]) {
      if (type === 'INCOME') {
        return {
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#34D399',
          borderColor: 'rgba(16, 185, 129, 0.3)'
        };
      } else {
        return {
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#F87171',
          borderColor: 'rgba(239, 68, 68, 0.3)'
        };
      }
    }
    const colors = CATEGORY_COLORS[category];
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

      <div className={styles.filtersArea}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Buscar por descrição..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.dateFilters}>
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value as any)}
            className={styles.selectInput}
          >
            <option value="ALL">Tudo</option>
            <option value="THIS_MONTH">Este Mês</option>
            <option value="LAST_MONTH">Mês Passado</option>
            <option value="CUSTOM">Personalizado</option>
          </select>

          {dateFilter === 'CUSTOM' && (
            <div className={styles.customDateInputs}>
              <input 
                type="date" 
                value={customStartDate} 
                onChange={(e) => setCustomStartDate(e.target.value)}
                className={styles.dateInput}
              />
              <span>até</span>
              <input 
                type="date" 
                value={customEndDate} 
                onChange={(e) => setCustomEndDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>
          )}
        </div>
      </div>

      {categoryFilter && (
        <div className={styles.activeFilters}>
          <span className={styles.filterTag}>
            Categoria: {categoryFilter}
            <button onClick={() => setCategoryFilter(null)} title="Remover filtro">×</button>
          </span>
        </div>
      )}

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
              {paginatedTransactions.map((t) => (
                <tr key={t.id} className={styles.row}>
                  <td>{new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                  <td>{t.description}</td>
                  <td>
                    <span 
                      className={`${styles.categoryBadge} ${styles.clickable}`} 
                      style={getCategoryStyle(t.category, t.transaction_type)}
                      onClick={() => setCategoryFilter(t.category)}
                      title="Filtrar por esta categoria"
                    >
                      {t.category}
                    </span>
                  </td>
                  <td className={t.transaction_type === 'INCOME' ? styles.amountIncome : styles.amountExpense}>
                    {t.transaction_type === 'INCOME' ? '+' : '-'} {Number(t.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.empty}>
                    Seu histórico está limpo! Cadastre sua primeira transação.
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className={styles.empty}>
                    Nenhuma transação encontrada para os filtros selecionados.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      )}

      {!error && totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.pageBtn} 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Anterior
          </button>
          
          <div className={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`${styles.pageNumber} ${currentPage === page ? styles.activePage : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            className={styles.pageBtn} 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Próximo
          </button>
        </div>
      )}
    </div>
  );
}
