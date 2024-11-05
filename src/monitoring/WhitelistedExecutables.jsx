import React from 'react';
import styles from './WhitelistedExecutables.module.css';

function WhitelistedExecutables() {
  return (
    <div className={styles.whitelistWrapper}>
      <h3 className={styles.whitelistTitle}>View Whitelisted Executables</h3>
      <button className={styles.whitelistItem}>
        <span>Chrome.exe</span>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/7f80e7eae430e68967df2e9859776ff1ff12907a4eb985635ce9acca7de46fd3?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" alt="" className={styles.removeIcon} />
      </button>
    </div>
  );
}

export default WhitelistedExecutables;