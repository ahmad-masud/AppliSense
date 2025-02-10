import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../styles/ApplicationPage.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { useApplicationsContext } from "../hooks/useApplicationsContext";
import { useAlerts } from "../hooks/useAlerts";
import {
  BuildingFill,
  GeoAltFill,
  ClockFill,
  Link45deg,
} from "react-bootstrap-icons";

const ApplicationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [infoLoading, setinfoLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { dispatch } = useApplicationsContext();
  const { addAlert } = useAlerts();
  const [stats, setStats] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/applications/${id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch application");

        const data = await response.json();
        setApplication(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setinfoLoading(false);
      }
    };

    const fetchStatistics = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/applications/stats`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStats(data);
      }
      setStatsLoading(false);
    };

    if (user) {
      fetchStatistics();
      fetchApplication();
    }
  }, [id, user]);

  const handleDelete = async (e) => {
    if (!user) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );
    if (!confirmDelete) return;

    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/applications/delete/${application._id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    if (response.ok) {
      dispatch({ type: "DELETE_APPLICATION", payload: application._id });
      addAlert("Application deleted successfully", "success");
    }
  };

  if (infoLoading || statsLoading) return (
    <div className="application-page-container loading"></div>
  );
  if (error) return null;
  if (!application) return null;

  return (
    <div className="application-page-container">
      <div className="application-page-info">
        <p className="application-page-title">{application.position}</p>
        <p className="application-page-subtitle">Details</p>
        <div className="application-page-details">
          <p className="application-page-detail">
            <BuildingFill size={20} />
            {application.company}
          </p>
          {application.location && (
            <p className="application-page-detail">
              <GeoAltFill size={20} />
              {application.location}
            </p>
          )}
          <p className="application-page-detail">
            <ClockFill size={20} />
            Applied on {new Date(application.dateApplied).toLocaleDateString()}
          </p>
          {application.jobPostingURL && (
            <p className="application-page-detail">
              <Link45deg size={20} />
              <a
                href={application.jobPostingURL}
                target="_blank"
                rel="noopener noreferrer"
                className="application-page-link"
              >
                View Job Posting
              </a>
            </p>
          )}
          {application.notes && (
            <p className="application-page-detail">{application.notes}</p>
          )}
        </div>
        <div className="application-page-tags">
          {application.status && (
            <span className="application-page-tag">{application.status}</span>
          )}
          {application.jobType && (
            <span className="application-page-tag">{application.jobType}</span>
          )}
          {application.workType && (
            <span className="application-page-tag">{application.workType}</span>
          )}
          {application.applicationSource && (
            <span className="application-page-tag">
              {application.applicationSource}
            </span>
          )}
        </div>
        <div className="application-page-buttons">
          <button
            onClick={() =>
              navigate(`/application/update/${id}`, {
                state: { from: location.pathname },
              })
            }
            className="application-page-button"
          >
            Edit
          </button>
          <button onClick={handleDelete} className="application-page-button">
            Delete
          </button>
        </div>
      </div>
      {stats && (
        <div className="application-page-stats">
          <p className="application-page-subtitle">Statistics</p>
          <div className="application-page-stats-container">
            <div className="application-page-stat">
              <p className="application-page-stat-value">
                <strong>{stats.companyData?.[application.company] || 0}</strong>{" "}
                applications with <strong>{application.company}</strong>
              </p>
            </div>
            <div className="application-page-stat">
              <p className="application-page-stat-value">
                <strong>
                  {stats.positionData?.[application.position] || 0}
                </strong>{" "}
                applications for <strong>{application.position}</strong> roles
              </p>
            </div>
            <div className="application-page-stat">
              <p className="application-page-stat-value">
                <strong>
                  {stats.locationData?.[application.location] || 0}
                </strong>{" "}
                applications in <strong>{application.location}</strong>
              </p>
            </div>
            <div className="application-page-stat">
              <p className="application-page-stat-value">
                <strong>{stats.statusData?.[application.status] || 0}</strong>{" "}
                applications in the <strong>{application.status}</strong> stage
              </p>
            </div>
            <div className="application-page-stat">
              <p className="application-page-stat-value">
                <strong>{stats.jobTypeData?.[application.jobType] || 0}</strong>{" "}
                applications that are <strong>{application.jobType}</strong>
              </p>
            </div>
            <div className="application-page-stat">
              <p className="application-page-stat-value">
                <strong>
                  {stats.workTypeData?.[application.workType] || 0}
                </strong>{" "}
                applications that are <strong>{application.workType}</strong>
              </p>
            </div>
            <div className="application-page-stat">
              <p className="application-page-stat-value">
                <strong>
                  {stats.sourceData?.[application.applicationSource] || 0}
                </strong>{" "}
                applications sourced from{" "}
                <strong>{application.applicationSource}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationPage;
