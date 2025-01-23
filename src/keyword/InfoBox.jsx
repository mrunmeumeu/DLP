import React from "react";
import styles from './InfoBox.module.css';

function InfoBox() {
  return (
    <section className={styles.infoBox}>
      <div className={styles.infoContent}>
        <h3 className={styles.infoTitle}>Keyword Management Overview</h3>
        <p className={styles.infoDescription}>
          The Keyword Management feature allows you to monitor and control sensitive or flagged keywords within your system. It scans all documents or text content in your clipboard during copy or paste operations. If any keyword matches a predefined list, the content can be flagged, restricted, or logged for further action. This feature helps prevent confidential information or security risks from leaving your system, enhancing data security.
        </p>
        <p className={styles.infoDescription}>
          <strong>Note:</strong> If you wish to modify keywords for individual clients, please navigate to the Dashboard → IP → Keyword Management
        </p>
      </div>
      <img 
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/633e66b87efaa1c8dab9073cf8c8ecb42e22c5e95c38eb73378e65940c54f7cc?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" 
        alt="Keyword Management Icon" 
        className={styles.infoIcon} 
      />
    </section>
  );
}

export default InfoBox;
