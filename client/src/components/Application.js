import "../styles/Application.css";
import { useState } from "react";
import {
  TrashFill,
  PencilFill,
  BriefcaseFill,
  CalendarFill,
  GeoAltFill,
  BoxArrowUpRight,
} from "react-bootstrap-icons";
import { useApplicationsContext } from "../hooks/useApplicationsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { useAlerts } from "../hooks/useAlerts";

function Application({ application, onSelect, selectedApplications }) {
  const navigate = useNavigate();
  const { dispatch } = useApplicationsContext();
  const { user } = useAuthContext();
  const { addAlert } = useAlerts();

  const [showFullNotes, setShowFullNotes] = useState(false);
  const maxNoteLength = 50;

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      const options = { year: "numeric", month: "long", day: "2-digit" };
      return new Intl.DateTimeFormat("en-US", options).format(date);
    } else if (diffDays === 1) {
      return `${diffDays} day ago`;
    } else if (diffDays > 0) {
      return `${diffDays} days ago`;
    } else {
      return "Today";
    }
  };

  const formattedDate = application.dateApplied
    ? formatDate(application.dateApplied)
    : "No date provided";

  const handleDelete = async () => {
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

  const handleEdit = () => {
    navigate(`/application/update/${application._id}`);
  };

  return (
    <div className="application">
      <div className="application-header">
        <div className="application-header-text">
          <p className="application-company">{application.company}</p>
          <p className="application-position">
            {application.position}
            {application.jobPostingURL && (
              <BoxArrowUpRight
                className="application-link"
                size={15}
                onClick={() => window.open(application.jobPostingURL, "_blank")}
              />
            )}
          </p>
        </div>
        <div className="application-buttons">
          <input
            type="checkbox"
            checked={selectedApplications.has(application._id)}
            onChange={() => onSelect(application._id)}
          />
          <PencilFill
            className="application-edit"
            size={15}
            onClick={handleEdit}
          />
          <TrashFill
            className="application-delete"
            size={15}
            onClick={handleDelete}
          />
        </div>
      </div>
      <hr className="application-divider" />
      {application.jobType && (
        <p className="application-field application-jobType">
          <BriefcaseFill size={20} /> {application.jobType}
        </p>
      )}
      <p className="application-field application-date">
        <CalendarFill size={20} /> {formattedDate}
      </p>
      {application.location && (
        <p className="application-field application-location">
          <GeoAltFill size={20} /> {application.location}
        </p>
      )}
      <div className="application-tags">
        <p className="application-field application-status">
          {application.status}
        </p>
        {application.applicationSource && (
          <p className="application-field application-source">
            {application.applicationSource}
          </p>
        )}
        {application.workType && (
          <p className="application-field application-workType">
            {application.workType}
          </p>
        )}
      </div>
      {application.notes && (
        <div>
          <p className="application-field application-notes">
            {showFullNotes || application.notes.length <= maxNoteLength
              ? application.notes
              : `${application.notes.slice(0, maxNoteLength)}...`}
          </p>
          {application.notes.length > maxNoteLength && (
            <span
              className="application-notes-read-more"
              onClick={() => setShowFullNotes(!showFullNotes)}
            >
              {showFullNotes ? " Read Less" : " Read More"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default Application;
