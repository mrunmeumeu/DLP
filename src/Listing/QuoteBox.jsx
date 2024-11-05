// QuoteBox.jsx
import React from 'react';
import styles from './QuoteBox.module.css';

function QuoteBox() {
  return (
    <div className={styles.quoteBox}>
      <p className={styles.quoteText}>"Sharing is not caring when it comes to your data"</p>
      <p className={styles.quoteAuthor}>- AETHERIS</p>
    </div>
  );
}

export default QuoteBox;
