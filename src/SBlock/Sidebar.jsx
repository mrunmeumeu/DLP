import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import styles from './AetherisHomepage.module.css';

const menuItems = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/e952f119c916e716f4a93171a48969ff341d047766d5c870e61f46e40f554413?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1", text: "Dashboard", link: "/", active: false },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/3aa412be8bccf6d101ee840cee87ae5b1f96cb9d72e76b88b7b880fe2d456c08?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1", text: "USB Monitoring", link: "/usb", active: false },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d046b6dc07ee19941d1127f57da9b7735b9677c00ec4aa3dc42273ea68466f3d?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1", text: "Keyword Management", link: "/keyword-management", active: false },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/77ab3f552c6c6cb0cfe67c22af4c22a96fe262bf126334fcdaaffa61d97450b1?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1", text: "Executable Monitoring", link: "/executable-monitoring", active: false },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/6a38aef342680e428b95e41021be631cf74dd9720cc5e2777d9943ca25e0135c?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1", text: "VA Scans", link: "/va-scans", active: false },
  
  
  
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/44adde0303a779cb69ed6d1f1b26c6e2656ad60fa84cf55fba32d12c9da09195?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1",link: "/reports", text: "Reports and Analysis",active: false },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ce875c513134a3c308932cf55de7605cb870f261e48ea6363eb424c98e610025?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1", link: "/ss-blocking", text: "Screenshot Blocking",active: true },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d714ee8b74cdf9532d5199fc62400791caf22429822f09749c954b8b2b35fcf4?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1", text: "Policies" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ede9ada030466c0e36b97103edd801b3d3f681d7798742dec6d3a7b5c133ce9c?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1", text: "White/Blacklist" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/3d07a0a8e8c8aa92ef2744f1b291057188aba041ae266cbd3c91bbb01bf6a074?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1", text: "System Maintainence" },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/79db2bfb16374d3d9fa3dbf4b4870efe78bac4951707021270a63be1f1126405?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1", text: "Support" }
];


const Sidebar = () => {
  return (
    <div className={styles.sidebarContainer}>
      <nav className={styles.sidebarMenu}>
        {menuItems.map((item, index) => (
          <Link 
            to={item.link} 
            key={index} 
            className={`${styles.menuItem} ${item.active ? styles.activeMenuItem : ''}`}
          >
            <img src={item.icon} alt={item.text} className={styles.menuIcon} />
            <div className={styles.menuText}>{item.text}</div>
          </Link>
        ))}
      </nav>
      <div className={styles.userProfile}>
        <div className={styles.profileInfo}>
          <img 
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/387d64609c0a9dca1cacd7291ab8f6d0461c81767860bca3771d9d2b64a191e4?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" 
            alt="User profile" 
            className={styles.profileImage} 
          />
          <div className={styles.profileDetails}>
            <div className={styles.userName}>Amanda</div>
            <div className={styles.profileLink}>View profile</div>
          </div>
        </div>
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/978503856409e6882b119628de93cdb6e6d70c9d645a68a8c8a0c1a4bd74077d?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1" 
          alt="Settings"
          className={styles.settingsIcon} 
        />
      </div>
    </div>
  );
};

export default Sidebar;
