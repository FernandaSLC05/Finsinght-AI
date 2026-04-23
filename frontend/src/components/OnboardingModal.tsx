"use client";

import { useState } from 'react';
import styles from './OnboardingModal.module.css';
import { updateProfileOnboarding } from '../services/auth';

interface Props {
  onComplete: (updatedProfile: any) => void;
}

export default function OnboardingModal({ onComplete }: Props) {
  const [name, setName] = useState('');
  const [financialGoal, setFinancialGoal] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const updatedProfile = await updateProfileOnboarding({
        name,
        financial_goal: financialGoal,
        monthly_income: parseFloat(monthlyIncome) || 0
      });
      onComplete(updatedProfile); // Passa o profile atualizado
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar os dados.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Bem-vindo ao Finsight AI! 🚀</h2>
          <p>Para começarmos a personalizar suas análises financeiras, conte um pouco sobre você.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.formGroup}>
            <label htmlFor="name">Como podemos te chamar?</label>
            <input 
              id="name"
              type="text" 
              className={styles.input} 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Ex: João Silva"
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="goal">Qual seu principal objetivo financeiro?</label>
            <input 
              id="goal"
              type="text" 
              className={styles.input} 
              value={financialGoal} 
              onChange={e => setFinancialGoal(e.target.value)} 
              placeholder="Ex: Juntar para viajar, Sair das dívidas..."
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="income">Renda mensal aproximada (R$)</label>
            <input 
              id="income"
              type="number" 
              className={styles.input} 
              value={monthlyIncome} 
              onChange={e => setMonthlyIncome(e.target.value)} 
              placeholder="Ex: 5000"
              required 
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Iniciar Jornada Finsight'}
          </button>
        </form>
      </div>
    </div>
  );
}
