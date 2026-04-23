"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProfile, logout } from '../services/auth';
import OnboardingModal from '@/components/OnboardingModal';
import InsightCard from '@/components/InsightCard/InsightCard';
import TransactionTable from '@/components/TransactionTable/TransactionTable';
import styles from './page.module.css';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        // Se der erro ou não estiver logado, manda pro Auth
        router.push('/auth');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleOnboardingComplete = (updatedProfile: any) => {
    setProfile(updatedProfile);
  };

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  const onTransactionAdded = (amount: number, type: 'INCOME' | 'EXPENSE') => {
    if (profile && profile.current_balance !== undefined) {
      const numAmount = Number(amount);
      setProfile({
        ...profile,
        current_balance: type === 'INCOME' ? profile.current_balance + numAmount : profile.current_balance - numAmount
      });
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <h2>Carregando Finsight...</h2>
      </div>
    );
  }

  return (
    <>
      {profile && !profile.is_onboarding_complete && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.logomark}>
            <div className={styles.dot}></div>
            <h1>Finsight AI</h1>
          </div>
          <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
            <span style={{color: '#a1a1aa', fontSize: '0.9rem'}}>Olá, {profile?.name || profile?.username || 'Usuário'}</span>
            <div className={styles.userIconWrapper} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <div className={styles.userIcon}>
                {profile?.name 
                  ? profile.name.slice(0, 2).toUpperCase() 
                  : (profile?.username ? profile.username.slice(0, 2).toUpperCase() : 'US')}
              </div>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button onClick={handleLogout} className={styles.dropdownItem}>
                    Sair da conta
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <section className={styles.topCards}>
          <div className={styles.balanceCard}>
            <h2>Saldo Atual</h2>
            <p className={styles.amount}>
              {profile?.current_balance !== undefined
                ? Number(profile.current_balance).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
                : 'R$ 0,00'}
            </p>
            <span className={styles.trend}>Líquido após as despesas</span>
          </div>

          <div className={styles.aiSection}>
            <div className={styles.sparkle}>✨</div>
            <h3>Inteligência Financeira</h3>
            <p>Deixe nossa IA analisar seu comportamento de gastos.</p>
            <InsightCard />
          </div>
        </section>

        <TransactionTable onTransactionAdded={onTransactionAdded} />
      </main>
    </>
  );
}
