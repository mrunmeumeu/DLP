import React from "react";
import { Link, useParams } from 'react-router-dom';
import styles from './SidebarMenu.module.css';

function SidebarMenu() {
  const { ip } = useParams();

  // Define the menu items with dynamic links based on the IP
  const menuItems = [
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/e952f119c916e716f4a93171a48969ff341d047766d5c870e61f46e40f554413?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1", text: "Dashboard", link: `/client/${ip}`, active: false },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/3aa412be8bccf6d101ee840cee87ae5b1f96cb9d72e76b88b7b880fe2d456c08?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1", text: "USB Monitoring", link: `/client/${ip}/usb-monitoring`, active: false },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d046b6dc07ee19941d1127f57da9b7735b9677c00ec4aa3dc42273ea68466f3d?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1", text: "Keyword Management", link: `/client/${ip}/keyword-management`, active: true },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/77ab3f552c6c6cb0cfe67c22af4c22a96fe262bf126334fcdaaffa61d97450b1?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1", text: "Executable Monitoring", link: `/client/${ip}/executable-monitoring`, active: false },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/6a38aef342680e428b95e41021be631cf74dd9720cc5e2777d9943ca25e0135c?placeholderIfAbsent=true&apiKey=6780ef7663fb420989788dbe5af024d1", text: "VA Scans", link: `/client/${ip}/va-scans`, active: false },
  ];
  
  return (
    <nav className={styles.sidebarMenu}>
      {menuItems.map((item, index) => (
        <Link
          key={index}
          to={item.link}
          className={`${styles.menuItem} ${item.active ? styles.active : ''}`}
        >
          <img src={item.icon} alt={item.text} className={styles.menuIcon} />
          <span className={styles.menuLabel}>{item.text}</span>  {/* Updated from item.label to item.text */}
        </Link>
      ))}
    </nav>
  );
}

export default SidebarMenu;
