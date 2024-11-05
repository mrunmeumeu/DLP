import React from 'react';
import styles from './ExecutableInput.module.css';

function ExecutableInput() {
  return (
    <div className={styles.inputWrapper}>
      <label htmlFor="executablePath" className={styles.inputLabel}>
        Whitelist Executables
      </label>
      <input
        type="text"
        id="executablePath"
        className={styles.input}
        placeholder="Enter Executable Path here"
      />
    </div>
  );
}

export default ExecutableInput;