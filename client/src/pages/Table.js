import "../styles/Table.css";
import { useEffect, useState } from "react";
import { useApplicationsContext } from "../hooks/useApplicationsContext";
import Pagination from "../components/Pagination";
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [pageLimit, setPageLimit] = useState(20);

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
      const params = new URLSearchParams({
        search: searchQuery,
        jobType: jobTypeFilter,
        status: statusFilter,
        workType: workTypeFilter,
        applicationSource: sourceFilter,
        sort: `${sortConfig.key}-${sortConfig.direction}`,
        page,
        limit: pageLimit,
      });

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/applications?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      const data = await response.json();

      if (response.ok) {
        dispatch({ type: "GET_APPLICATIONS", payload: data.applications });
        setTotalPages(data.totalPages);
        setTotalResults(data.totalResults);
      }
    };

    if (user) {
      fetchApplications();
      setSelectedApplications(new Set());
    }
  }, [
    dispatch,
    user,
    searchQuery,
    jobTypeFilter,
    statusFilter,
    workTypeFilter,
    sourceFilter,
    sortConfig,
    page,
    pageLimit,
  ]);

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
          {applications.map((app) => (
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
                {app.jobPostingURL && (
                  <a
                    href={app.jobPostingURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BoxArrowUpRight size={15} />
                  </a>
                )}
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
      <Pagination
        page={page}
        totalPages={totalPages}
        limit={pageLimit}
        totalResults={totalResults}
        onPageChange={setPage}
        onLimitChange={setPageLimit}
      />
    </div>
  );
}

export default Table;
