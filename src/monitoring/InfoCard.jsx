import React from 'react';
import styles from './InfoCard.module.css';

function InfoCard() {
  return (
    <article className={styles.infoCard}>
      <h3 className={styles.infoTitle}>How does Executable Management work?</h3>
      <p className={styles.infoContent}>
        The Executable Management feature blocks the execution of all applications on your system, except for those explicitly whitelisted. This ensures that only trusted and pre-approved programs can run, preventing unauthorized or malicious software from being executed. With this feature, you can maintain a high level of security by having full control over which applications are allowed to operate, protecting your system from potential threats while ensuring essential apps continue functioning smoothly.
      </p>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/7d5dfa9263f46c427ac149a235460a587593dc01fe44dec86940edc4ac0cd8da?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" alt="" className={styles.infoIcon} />
    </article>
  );
}

export default InfoCard;