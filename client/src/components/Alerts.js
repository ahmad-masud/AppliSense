import React from "react";
import { useAlerts } from "../hooks/useAlerts";
import { createPortal } from "react-dom";
import "../styles/Alerts.css";
import {
  CheckCircleFill,
  ExclamationCircleFill,
  ExclamationTriangleFill,
  InfoCircleFill,
  XLg,
} from "react-bootstrap-icons";

const Alerts = () => {
  const { alerts, removeAlert } = useAlerts();

  const getAlertIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircleFill size={15} />;
      case "warning":
        return <ExclamationCircleFill size={15} />;
      case "error":
        return <ExclamationTriangleFill size={15} />;
      default:
        return <InfoCircleFill size={15} />;
    }
  };

  const getAlertClass = (type) => {
    switch (type) {
      case "success":
        return "alert alert-success";
      case "warning":
        return "alert alert-warning";
      case "error":
        return "alert alert-error";
      default:
        return "alert alert-info";
    }
  };

  return createPortal(
    <div className="alerts">
      {alerts.map((alert) => (
        <div key={alert.id} className={getAlertClass(alert.type)}>
          {getAlertIcon(alert.type)}
          <span>{alert.message}</span>
          <button
            className="alert-delete-button"
            onClick={() => removeAlert(alert.id)}
          >
            <XLg size={15} />
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
};

export default Alerts;
