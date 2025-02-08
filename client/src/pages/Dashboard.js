import "../styles/Dashboard.css";
import { useEffect, useState } from "react";
import Application from "../components/Application";
import Pagination from "../components/Pagination";
import ApplicationSkeleton from "../skeletons/ApplicationSkeleton";
import { Plus } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useApplicationsContext } from "../hooks/useApplicationsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { TrashFill } from "react-bootstrap-icons";

function Dashboard() {
  const { applications, dispatch } = useApplicationsContext();
  const { user } = useAuthContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [sortOption, setSortOption] = useState("date-desc");
  const [selectedApplications, setSelectedApplications] = useState(new Set());
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageLimit, setPageLimit] = useState(20);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard | AppliSense";

    const fetchApplications = async () => {
      const params = new URLSearchParams({
        search: searchQuery,
        jobType: jobTypeFilter,
        status: statusFilter,
        workType: workTypeFilter,
        applicationSource: sourceFilter,
        sort: sortOption,
        page,
        limit: pageLimit,
      });

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/applications?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        dispatch({ type: "GET_APPLICATIONS", payload: data.applications });
        setTotalResults(data.totalResults);
        setTotalPages(data.totalPages);
      }

      setLoading(false);
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
    sortOption,
    page,
    pageLimit,
  ]);

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
    <div className="dashboard">
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
            <option value="Freelance">Freelance</option>
            <option value="Temporary">Temporary</option>
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
            <option value="SimplyHired">SimplyHired</option>
            <option value="Snagajob">Snagajob</option>
            <option value="Dice (Tech Jobs)">Dice (Tech Jobs)</option>
            <option value="Stack Overflow Jobs">Stack Overflow Jobs</option>
            <option value="GitHub Jobs">GitHub Jobs</option>
            <option value="Direct Company Website">
              Direct Company Website
            </option>
            <option value="Employee Referral">Employee Referral</option>
            <option value="Networking Event">Networking Event</option>
            <option value="Career Fair">Career Fair</option>
            <option value="Freelance Platform">Freelance Platform</option>
            <option value="University Internship Portal">
              University Internship Portal
            </option>
            <option value="Government Job Portal">Government Job Portal</option>
            <option value="Other">Other</option>
          </select>

          <select
            className="filter-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="company-asc">Company A-Z</option>
            <option value="company-desc">Company Z-A</option>
          </select>
          <button
            className="delete-selected-button"
            onClick={handleDeleteSelected}
            disabled={selectedApplications.size === 0}
          >
            <TrashFill size={20} />
          </button>
        </div>
      </div>

      <div className="applications">
        <Link className="application-placeholder" to="/application/create">
          <Plus size={75} /> Add Application
        </Link>
        {loading &&
          [...Array(pageLimit)].map((_, index) => (
            <ApplicationSkeleton key={index} />
          ))}
        {!loading &&
          applications.length > 0 &&
          applications.map((application) => (
            <Application
              key={application._id}
              application={application}
              onSelect={handleSelect}
              selectedApplications={selectedApplications}
            />
          ))}
      </div>
      {totalResults > 20 && !loading && (
        <Pagination
          page={page}
          totalPages={totalPages}
          limit={pageLimit}
          totalResults={totalResults}
          onPageChange={setPage}
          onLimitChange={setPageLimit}
        />
      )}
    </div>
  );
}

export default Dashboard;
