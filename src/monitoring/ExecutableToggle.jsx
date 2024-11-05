import React from 'react';
import styles from './ExecutableToggle.module.css';

function ExecutableToggle() {
  return (
    <div className={styles.toggleWrapper}>
      <span className={styles.toggleLabel}>Executable Monitoring</span>
      <button className={styles.toggle} aria-label="Toggle Executable Monitoring">
        <span className={styles.toggleKnob}></span>
      </button>
    </div>
  );
}

export default ExecutableToggle;