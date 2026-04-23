"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './auth.module.css';
import { login, register } from '../../services/auth';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(username, password);
        router.push('/');
      } else {
        await register(username, email, password);
        // Após registrar com sucesso, loga o usuário automaticamente
        await login(username, password);
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authBox}>
        <div className={styles.header}>
          <h1>Finsight AI</h1>
          <p>{isLogin ? 'Faça login para continuar' : 'Crie sua conta para começar'}</p>
        </div>

        <div className={styles.tabs}>
          <div 
            className={`${styles.tab} ${isLogin ? styles.activeTab : ''}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Login
          </div>
          <div 
            className={`${styles.tab} ${!isLogin ? styles.activeTab : ''}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Cadastro
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formGroup}>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="Nome de Usuário" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className={styles.formGroup}>
              <input 
                type="email" 
                className={styles.input} 
                placeholder="E-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <input 
              type="password" 
              className={styles.input} 
              placeholder="Senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Aguarde...' : (isLogin ? 'Entrar no Finsight' : 'Criar Conta')}
          </button>
        </form>
      </div>
    </div>
  );
}
