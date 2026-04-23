"use client";

import { useState, useEffect } from 'react';
import styles from './InsightCard.module.css';

export default function InsightCard() {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [error, setError] = useState('');

  const generateInsight = async () => {
    setLoading(true);
    setError('');
    setInsight('');
    setDisplayedText('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const token = localStorage.getItem('access_token');

      const response = await fetch(`${apiUrl}/api/ai-summary/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 502) {
          throw new Error('Serviço da IA indisponível. Tente novamente mais tarde.');
        } else if (response.status === 500) {
          throw new Error('Erro interno do servidor. Verifique as configurações (ex: API_KEY).');
        }
        throw new Error('Falha ao obter dados do servidor.');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setInsight(data.summary);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro de rede. Verifique se o Backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  // Tying effect logic
  useEffect(() => {
    if (!insight) return;
    
    let i = 0;
    setDisplayedText('');
    
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + insight.charAt(i));
      i++;
      if (i >= insight.length) {
        clearInterval(intervalId);
      }
    }, 25); // Typing speed

    return () => clearInterval(intervalId);
  }, [insight]);

  return (
    <div className={styles.container}>
      <button 
        className={styles.button} 
        onClick={generateInsight} 
        disabled={loading}
      >
        {loading ? <span className={styles.spinner}></span> : 'Gerar Insight com IA'}
      </button>

      {error && <p className={styles.error}>{error}</p>}

      {(loading || displayedText) && (
        <div className={styles.bubbleContainer}>
           {loading ? (
             <div className={styles.typingIndicator}>
               <span></span>
               <span></span>
               <span></span>
             </div>
           ) : (
             <div className={styles.bubble}>
               <p>
                 {displayedText}
                 <span className={styles.cursor}>|</span>
               </p>
             </div>
           )}
        </div>
      )}
    </div>
  );
}
