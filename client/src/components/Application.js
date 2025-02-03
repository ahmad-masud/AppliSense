import "../styles/Application.css";
import { TrashFill } from "react-bootstrap-icons";
import { useApplicationsContext } from "../hooks/useApplicationsContext";
import { useAuthContext } from "../hooks/useAuthContext";

function Application({ application }) {
  const formatTime = (isoDateString) => {
    const date = new Date(isoDateString);
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "2-digit",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const formattedTime = application.date
    ? formatTime(application.date)
    : "No time provided";
  const formattedDate = application.date
    ? formatDate(application.date)
    : "No date provided";

  const { dispatch } = useApplicationsContext();
  const { user } = useAuthContext();

  const handleClick = async () => {
    if (!user) {
      return;
    }
    const response = await fetch(`/api/applications/delete/${application._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (response.ok) {
      dispatch({ type: "DELETE_APPLICATION", payload: application._id });
    }
  };

  return (
    <div className="application">
      <p className="application-title">
        {application.title}{" "}
        <TrashFill
          className="application-delete"
          size={20}
          onClick={handleClick}
        />
      </p>
      <p className="application-time">{formattedTime}</p>
      <p className="application-date">{formattedDate}</p>
    </div>
  );
}

export default Application;
