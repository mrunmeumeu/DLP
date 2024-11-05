import React from 'react';
import styles from './UserProfile.module.css';

function UserProfile() {
  return (
    <div className={styles.userProfile}>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/387d64609c0a9dca1cacd7291ab8f6d0461c81767860bca3771d9d2b64a191e4?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" alt="User avatar" className={styles.avatar} />
      <div className={styles.userInfo}>
        <span className={styles.userName}>Amanda</span>
        <a href="#" className={styles.profileLink}>View profile</a>
      </div>
      <button aria-label="User settings" className={styles.settingsButton}>
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/3369174fb4c5dbcc92ad5cd4fe7901dca5bc08459bf17fc5f020dbe990b1b8c9?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" alt="" className={styles.settingsIcon} />
      </button>
    </div>
  );
}

export default UserProfile;