import React from "react";
import styles from './InfoBox.module.css';

function InfoBox() {
  return (
    <section className={styles.infoBox}>
      <div className={styles.infoContent}>
        <h3 className={styles.infoTitle}>How does Keyword Management work?</h3>
        <p className={styles.infoDescription}>
          The Keyword Management feature scans all documents or text content in your clipboard that are being copied or pasted. This helps to identify sensitive or flagged keywords that may represent confidential information or security risks. If any keyword matches a predefined list, the content can be flagged, restricted, or logged for further action. This feature ensures that sensitive data does not inadvertently leave your system, offering enhanced control over document security.
        </p>
      </div>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/633e66b87efaa1c8dab9073cf8c8ecb42e22c5e95c38eb73378e65940c54f7cc?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" alt="" className={styles.infoIcon} />
    </section>
  );
}

export default InfoBox;