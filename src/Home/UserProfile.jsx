import React from "react";
import styles from './UserProfile.module.css';

function UserProfile() {
  return (
    <div className={styles.userProfile}>
      <div className={styles.userInfo}>
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/387d64609c0a9dca1cacd7291ab8f6d0461c81767860bca3771d9d2b64a191e4?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" className={styles.avatar} alt="User avatar" />
        <div className={styles.userDetails}>
          <span className={styles.userName}>Amanda</span>
          <button className={styles.viewProfileButton}>View profile</button>
        </div>
      </div>
      <button className={styles.settingsButton} aria-label="Settings">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/978503856409e6882b119628de93cdb6e6d70c9d645a68a8c8a0c1a4bd74077d?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" alt="" />
      </button>
    </div>
  );
}

export default UserProfile;