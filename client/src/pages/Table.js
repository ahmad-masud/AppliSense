import "../styles/Table.css";
import { useEffect, useState } from "react";
import { useApplicationsContext } from "../hooks/useApplicationsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import {
  CaretUpFill,
  CaretDownFill,
  BoxArrowUpRight,
  TrashFill,
  PlusLg,
  PencilFill,
} from "react-bootstrap-icons";
import { useNavigate, Link } from "react-router-dom";

function Table() {
  const { applications, dispatch } = useApplicationsContext();
  const { user } = useAuthContext();
  const [sortConfig, setSortConfig] = useState({
    key: "dateApplied",
    direction: "desc",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [narrow, setNarrow] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setNarrow(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.title = "Table View | AppliSense";

    const fetchApplications = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/applications`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        dispatch({ type: "GET_APPLICATIONS", payload: data });
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [dispatch, user]);

  const filteredApplications = applications
    ?.filter(
      (app) =>
        app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((app) => (jobTypeFilter ? app.jobType === jobTypeFilter : true))
    .filter((app) => (statusFilter ? app.status === statusFilter : true))
    .filter((app) => (workTypeFilter ? app.workType === workTypeFilter : true))
    .filter((app) =>
      sourceFilter ? app.applicationSource === sourceFilter : true
    );

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortConfig.key === "dateApplied") {
      return sortConfig.direction === "asc"
        ? new Date(a.dateApplied) - new Date(b.dateApplied)
        : new Date(b.dateApplied) - new Date(a.dateApplied);
    }
    return sortConfig.direction === "asc"
      ? a[sortConfig.key]
          ?.toString()
          .localeCompare(b[sortConfig.key]?.toString())
      : b[sortConfig.key]
          ?.toString()
          .localeCompare(a[sortConfig.key]?.toString());
  });

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <CaretUpFill /> : <CaretDownFill />;
  };

  const handleSelect = (id) => {
    setSelectedApplications((prev) => {
      const newSelected = new Set(prev);
      newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
      return newSelected;
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedApplications.size === 0) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected applications?"
    );
    if (!confirmDelete) return;

    await fetch(
      `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/applications/deleteMultiple`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ ids: Array.from(selectedApplications) }),
      }
    );

    dispatch({
      type: "DELETE_APPLICATIONS",
      payload: Array.from(selectedApplications),
    });
    setSelectedApplications(new Set());
  };

  return (
    <div className="table-container">
      <div className="filters-container">
        <div className="filters">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input"
          />
          <select
            className="filter-select"
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
          >
            <option value="">All Job Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Co-op">Co-op</option>
            <option value="Apprenticeship">Apprenticeship</option>
          </select>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select
            className="filter-select"
            value={workTypeFilter}
            onChange={(e) => setWorkTypeFilter(e.target.value)}
          >
            <option value="">All Work Types</option>
            <option value="Remote">Remote</option>
            <option value="On-Site">On-Site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          <select
            className="filter-select"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="">All Sources</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Indeed">Indeed</option>
            <option value="Glassdoor">Glassdoor</option>
            <option value="ZipRecruiter">ZipRecruiter</option>
            <option value="Monster">Monster</option>
            <option value="AngelList">AngelList</option>
            <option value="Hired">Hired</option>
            <option value="CareerBuilder">CareerBuilder</option>
            <option value="Other">Other</option>
          </select>
          <Link to="/application/create" className="add-application-button ">
            <PlusLg size={20} />
          </Link>
          <button
            className="delete-selected-button"
            onClick={handleDeleteSelected}
            disabled={selectedApplications.size === 0}
          >
            <TrashFill size={20} />
          </button>
        </div>
      </div>
      <table className="applications-table">
        <thead>
          <tr>
            <th>
              <span className="th-text">Modify</span>
            </th>
            <th onClick={() => handleSort("company")}>
              <span className="th-text">Company {getSortIcon("company")}</span>
            </th>
            <th onClick={() => handleSort("position")}>
              <span className="th-text">
                Position {getSortIcon("position")}
              </span>
            </th>
            <th onClick={() => handleSort("dateApplied")}>
              <span className="th-text">Date {getSortIcon("dateApplied")}</span>
            </th>
            <th onClick={() => handleSort("location")}>
              <span className="th-text">
                Location {getSortIcon("location")}
              </span>
            </th>
            {!narrow && (
              <th onClick={() => handleSort("jobType")}>
                <span className="th-text">Job {getSortIcon("jobType")}</span>
              </th>
            )}
            {!narrow && (
              <th onClick={() => handleSort("status")}>
                <span className="th-text">Status {getSortIcon("status")}</span>
              </th>
            )}
            {!narrow && (
              <th onClick={() => handleSort("applicationSource")}>
                <span className="th-text">
                  Source {getSortIcon("applicationSource")}
                </span>
              </th>
            )}
            {!narrow && (
              <th onClick={() => handleSort("workType")}>
                <span className="th-text">Work {getSortIcon("workType")}</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {sortedApplications.map((app) => (
            <tr key={app._id}>
              <td>
                <div className="modify-buttons">
                  <input
                    type="checkbox"
                    checked={selectedApplications.has(app._id)}
                    onChange={() => handleSelect(app._id)}
                  />
                  <button
                    onClick={() => navigate(`/application/update/${app._id}`)}
                  >
                    <PencilFill size={15} />
                  </button>
                  <button
                    onClick={async () => {
                      if (
                        !window.confirm(
                          "Are you sure you want to delete this application?"
                        )
                      )
                        return;
                      await fetch(
                        `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/applications/delete/${app._id}`,
                        {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${user.token}` },
                        }
                      );
                      dispatch({
                        type: "DELETE_APPLICATION",
                        payload: app._id,
                      });
                    }}
                  >
                    <TrashFill size={15} />
                  </button>
                </div>
              </td>
              <td>{app.company}</td>
              <td>
                {app.position}{" "}
                <a
                  href={app.jobPostingURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BoxArrowUpRight size={15} />
                </a>
              </td>
              <td>{new Date(app.dateApplied).toLocaleDateString()}</td>
              <td>{app.location || "N/A"}</td>
              {!narrow && <td>{app.jobType || "N/A"}</td>}
              {!narrow && <td>{app.status}</td>}
              {!narrow && <td>{app.applicationSource || "N/A"}</td>}
              {!narrow && <td>{app.workType || "N/A"}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
