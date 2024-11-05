import React from 'react';
import styles from './AetherisHomepage.module.css';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import SideContent from './SideContent';

const AetherisHomepageP = () => {
  return (
    <div className={styles.homepage}>
      <div className={styles.mainContainer}>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0f0da2d6c991a5a2c9db667f66215f583c06068e29d82202f889f9211c01f06d?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" 
          alt="Background" 
          className={styles.backgroundImage} 
        />
        <header className={styles.header}>
          <div className={styles.logoText}>Raksha 1</div>
          <div className={styles.brandName}>AETHERIS</div>
        </header>
        <div className={styles.contentWrapper}>
          <div className={styles.columnLayout}>
            <div className={styles.sidebarColumn}>
              <Sidebar />
            </div>
            <div className={styles.mainColumn}>
              <MainContent />
            </div>
            <div className={styles.sideColumn}>
              {/* <SideContent /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AetherisHomepageP;