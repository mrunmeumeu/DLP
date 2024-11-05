// ClientDetailsTable.jsx
import React from 'react';
import styles from './VulnerabilityAssessment.module.css';

function ClientDetailsTable({ clientDetails }) {
  return (
    clientDetails && (
      <table className={styles.detailsTable}>
        <tbody>
          <tr>
            <th>Client IP:</th>
            <td>{clientDetails.ip}</td>
          </tr>
          <tr>
            <th>Client ID:</th>
            <td>{clientDetails.client_id}</td>
          </tr>
          <tr>
            <th>Username:</th>
            <td>{clientDetails.user_name}</td>
          </tr>
          <tr>
            <th>Device ID:</th>
            <td>{clientDetails.device_id}</td>
          </tr>
          <tr>
            <th>Windows Version:</th>
            <td>{clientDetails.windows_version}</td>
          </tr>
          <tr>
            <th>Status:</th>
            <td>{clientDetails.status}</td>
          </tr>
        </tbody>
      </table>
    )
  );
}

export default ClientDetailsTable;
