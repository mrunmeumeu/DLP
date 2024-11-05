import React from "react";
import styles from './DashboardSection.module.css';

function DashboardSection() {
  return (
    <section className={styles.dashboardSection}>
      <h2 className={styles.sectionTitle}>Dashboard</h2>
      <div className={styles.managedDevices}>
        <h3 className={styles.subsectionTitle}>Managed Devices</h3>
        {/* Content for managed devices */}
      </div>
    </section>
  );
}

export default DashboardSection;