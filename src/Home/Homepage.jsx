import React from "react";
import styles from './Homepage.module.css';
import SidebarMenu from './SidebarMenu';
import UserProfile from './UserProfile';
import DashboardSection from "./DashboardSection";
import VulnerabilityChecks from './VulnerabilityChecks';
import SafetyPercentage from './SafetyPercentage';

function Homepage() {
  return (
    <div className={styles.homepage}>
      <div className={styles.content}>
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/0f0da2d6c991a5a2c9db667f66215f583c06068e29d82202f889f9211c01f06d?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" className={styles.backgroundImage} alt="" />
        <header className={styles.header}>
          <h1 className={styles.title}>Raksha 1</h1>
          <h2 className={styles.subtitle}>AETHERIS</h2>
        </header>
        <main className={styles.mainContent}>
          <aside className={styles.sidebar}>
            <SidebarMenu />
            <UserProfile />
          </aside>
          <section className={styles.centralSection}>
            <DashboardSection />
            <VulnerabilityChecks />
          </section>
          <aside className={styles.rightSidebar}>
            <SafetyPercentage />
          </aside>
        </main>
      </div>
    </div>
  );
}

export default Homepage;