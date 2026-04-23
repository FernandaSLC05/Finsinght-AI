"use client";

import { useState } from 'react';
import styles from './AddTransactionModal.module.css';
import { createTransaction } from '../../services/transactions';

interface Props {
  type: 'INCOME' | 'EXPENSE';
  onClose: () => void;
  onSuccess: (newTransaction: any) => void;
}

const CATEGORIES_EXPENSE = [
  'Alimentação',
  'Lazer',
  'Transporte',
  'Saúde',
  'Moradia',
  'Educação',
  'Assinaturas',
  'Outros'
];

const CATEGORIES_INCOME = [
  'Pix',
  'Dinheiro em espécie',
  'Transferência bancária',
  'Boleto',
  'Salário',
  'Outros'
];

export default function AddTransactionModal({ type, onClose, onSuccess }: Props) {
  const isIncome = type === 'INCOME';
  const categories = isIncome ? CATEGORIES_INCOME : CATEGORIES_EXPENSE;
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Aceita vírgula ou ponto no decimal
      const formattedAmount = parseFloat(amount.replace(',', '.'));
      if (isNaN(formattedAmount) || formattedAmount <= 0) {
        throw new Error('Valor inválido. Digite apenas números.');
      }

      const data = {
        transaction_type: type,
        description,
        amount: formattedAmount,
        category,
        date
      };
      const result = await createTransaction(data);
      onSuccess(result);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar transação.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <div className={styles.header}>
          <h2>{isIncome ? 'Adicionar Nova Receita' : 'Adicionar Nova Despesa'}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.formGroup}>
            <label>Descrição</label>
            <input 
              type="text" 
              className={styles.input} 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Ex: Almoço Restaurante X"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label>Categoria</label>
            <select 
              className={styles.input} 
              value={category} 
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Valor (R$)</label>
              <input 
                type="text" 
                className={styles.input} 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                placeholder="Ex: 45,00"
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Data</label>
              <input 
                type="date" 
                className={styles.input} 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn} 
            style={{ background: isIncome ? 'linear-gradient(to right, #10b981, #34d399)' : undefined }}
            disabled={loading}
          >
            {loading ? 'Salvando...' : (isIncome ? 'Adicionar Receita' : 'Adicionar Despesa')}
          </button>
        </form>
      </div>
    </div>
  );
}
