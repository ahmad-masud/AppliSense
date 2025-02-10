import "../styles/Application.css";
import { TrashFill, PencilFill, GeoAltFill } from "react-bootstrap-icons";
import { useApplicationsContext } from "../hooks/useApplicationsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useAlerts } from "../hooks/useAlerts";

function Application({ application, onSelect, selectedApplications }) {
  const navigate = useNavigate();
  const { dispatch } = useApplicationsContext();
  const { user } = useAuthContext();
  const { addAlert } = useAlerts();
  const location = useLocation();

  const handleDelete = async (e) => {
    e.stopPropagation();

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

  const handleEdit = (e) => {
    navigate(`/application/update/${application._id}`, {
      state: { from: location.pathname },
    });
    e.stopPropagation();
  };

  return (
    <div
      className="application"
      onClick={() => navigate(`/application/${application._id}`, {state: { from: location.pathname }})}
    >
      <div className="application-header">
        <div className="application-header-text">
          <p className="application-company">{application.company}</p>
          <p className="application-position">{application.position}</p>
        </div>
        <div className="application-buttons">
          <input
            type="checkbox"
            onClick={(e) => e.stopPropagation()}
            checked={selectedApplications.has(application._id)}
            onChange={() => onSelect(application._id)}
          />
          <PencilFill
            className="application-edit"
            size={15}
            onClick={(e) => handleEdit(e)}
          />
          <TrashFill
            className="application-delete"
            size={15}
            onClick={(e) => handleDelete(e)}
          />
        </div>
      </div>
      {application.location && (
        <p className="application-field application-location">
          <GeoAltFill size={15} /> {application.location}
        </p>
      )}
    </div>
  );
}

export default Application;
