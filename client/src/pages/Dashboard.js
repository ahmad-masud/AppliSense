import "../styles/Dashboard.css";
import { useEffect, useRef } from "react";
import Application from "../components/Application";
import { Plus } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useApplicationsContext } from "../hooks/useApplicationsContext";
import { useAuthContext } from "../hooks/useAuthContext";

function Dashboard() {
  const { applications, dispatch } = useApplicationsContext();
  const { user } = useAuthContext();
  const hasFetched = useRef(false);

  useEffect(() => {
    document.title = "Dashboard | AppliSense";
  
    const fetchApplications = async () => {
      const response = await fetch(`/api/applications`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        dispatch({ type: "GET_APPLICATIONS", payload: data });
      }
    };
  
    if (user && !hasFetched.current) {
      hasFetched.current = true;
      fetchApplications();
    }
  }, [dispatch, user]);

  return (
    <div className="dashboard">
      <div className="applications">
        {applications &&
          applications.map((application) => (
            <Application key={application._id} application={application} />
          ))}
        <Link className="application-placeholder" to="/create">
          <Plus size={100} />
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
