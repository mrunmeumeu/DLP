import React from "react";
import styles from './UserProfile.module.css';

function UserProfile() {
  return (
    <div className={styles.userProfile}>
      <div className={styles.userInfo}>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/9b44e9048e231834d4a9fa74f02c365bb4a4b32e9dd7211c7769224d05111a73?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" alt="User avatar" className={styles.avatar} />
        <div className={styles.userDetails}>
          <span className={styles.userName}>Amanda</span>
          <a href="#" className={styles.profileLink}>View profile</a>
        </div>
      </div>
      <button className={styles.settingsButton} aria-label="Settings">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/ec4a02e94a9a3d5150358779f43db05c9c69923ebe9ca9bb72f40f6870f71638?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" alt="" className={styles.settingsIcon} />
      </button>
    </div>
  );
}

export default UserProfile;