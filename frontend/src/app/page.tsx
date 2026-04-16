import InsightCard from '@/components/InsightCard/InsightCard';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className={styles.logomark}>
          <div className={styles.dot}></div>
          <h1>Finsight AI</h1>
        </div>
        <div className={styles.userIcon}>US</div>
      </header>

      <section className={styles.dashboard}>
        <div className={styles.balanceCard}>
          <h2>Saldo Atual</h2>
          <p className={styles.amount}>R$ 5.430,20</p>
          <span className={styles.trend}>+12.5% em relação ao mês passado</span>
        </div>
        
        <div className={styles.aiSection}>
          <div className={styles.sparkle}>✨</div>
          <h3>Inteligência Financeira</h3>
          <p>Deixe nossa IA analisar seu comportamento de gastos.</p>
          <InsightCard />
        </div>
      </section>
    </main>
  );
}
