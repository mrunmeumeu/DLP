import React from 'react';
import styles from './ExecutableMonitoring.module.css';
import SidebarMenu from './SidebarMenu';
import UserProfile from './UserProfile';
import ExecutableToggle from './ExecutableToggle';
import ExecutableInput from './ExecutableInput';
// import ExecutableList from './ExecutableList';
import ExecutableStats from './ExecutableStats';
import InfoCard from './InfoCard';


function ExecutableMonitoring() {
    return (
      <div className={styles.homepage}>
        <main className={styles.mainContent}>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/b8935b75327cad0c706c17a676d42793ba2dd0b097d93e7a69ed5d903793b020?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" alt="" className={styles.backgroundImage} />
          <header className={styles.header}>
            <h1 className={styles.title}>Raksha 1</h1>
            <span className={styles.brandName}>AETHERIS</span>
          </header>
          <div className={styles.contentWrapper}>
            <aside className={styles.sidebar}>
              <SidebarMenu />
              <UserProfile />
            </aside>
            <section className={styles.monitoringSection}>
              <h2 className={styles.sectionTitle}>Executable Monitoring</h2>
              <ExecutableToggle />
            <ExecutableInput />
            {/* <ExecutableList /> */}
            <ExecutableStats />
            <InfoCard />
          </section>
        </div>
      </main>
    </div>
  );
}

export default ExecutableMonitoring;