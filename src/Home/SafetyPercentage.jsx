import React from "react";
import styles from './SafetyPercentage.module.css';

function SafetyPercentage() {
  const categories = [
    { name: "Category A", color: "blue" },
    { name: "Category B", color: "pink" },
    { name: "Category C", color: "green" }
  ];

  return (
    <section className={styles.safetyPercentage}>
      <h3 className={styles.sectionTitle}>Safety Percentage</h3>
      <div className={styles.chartContainer}>
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/4cf6cca0b868fec0c242347351011a0224c0e510a39ab34b8dfbb9cbf4d35d17?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" className={styles.pieChart} alt="Safety percentage pie chart" />
        <div className={styles.legend}>
          {categories.map((category, index) => (
            <div key={index} className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles[category.color]}`}></span>
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SafetyPercentage;