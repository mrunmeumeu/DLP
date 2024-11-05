import React from 'react';
import styles from './ExecutableStats.module.css';

function ExecutableStats() {
  return (
    <section className={styles.statsSection}>
      <h3 className={styles.statsTitle}>Executable Statistics</h3>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>15</span>
          <span className={styles.statLabel}>Total Whitelisted</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>3</span>
          <span className={styles.statLabel}>Blocked Today</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>99.9%</span>
          <span className={styles.statLabel}>System Protection</span>
        </div>
      </div>
    </section>
  );
}

export default ExecutableStats;