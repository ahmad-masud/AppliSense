import "../styles/Form.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApplicationsContext } from "../hooks/useApplicationsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useAlerts } from "../hooks/useAlerts";

function ApplicationForm() {
  const { id } = useParams();
  const isEditMode = !!id;

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Applied");
  const [dateApplied, setDateApplied] = useState("");
  const [jobPostingURL, setJobPostingURL] = useState("");
  const [notes, setNotes] = useState("");
  const [applicationSource, setApplicationSource] = useState("");
  const [workType, setWorkType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const { addAlert } = useAlerts();

  const { dispatch } = useApplicationsContext();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  // Fetch application data if editing
  useEffect(() => {
    if (isEditMode) {
      const fetchApplication = async () => {
        const response = await fetch(`/api/applications/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setCompany(data.company);
          setPosition(data.position);
          setJobType(data.jobType);
          setLocation(data.location);
          setStatus(data.status);
          setDateApplied(data.dateApplied?.split("T")[0] || "");
          setJobPostingURL(data.jobPostingURL || "");
          setNotes(data.notes || "");
          setApplicationSource(data.applicationSource || "");
          setWorkType(data.workType || "");
          setLoading(false);
        } else {
          setError("Failed to fetch application data.");
        }
      };

      fetchApplication();
    } else {
      // Set default date for new application
      const today = new Date().toISOString().split("T")[0];
      setDateApplied(today);
    }
  }, [isEditMode, id, user]);

  useEffect(() => {
    document.title = isEditMode
      ? "Edit Application | AppliSense"
      : "Create Application | AppliSense";
  }, [isEditMode]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setError("You must be logged in to manage applications.");
      return;
    }

    const applicationData = {
      company,
      position,
      jobType,
      location,
      status,
      dateApplied,
      jobPostingURL,
      notes,
      applicationSource,
      workType,
    };

    const endpoint = isEditMode
      ? `/api/applications/update/${id}`
      : "/api/applications/create";
    const method = isEditMode ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(applicationData),
    });

    const data = await response.json();

    if (response.ok) {
      dispatch({
        type: isEditMode ? "UPDATE_APPLICATION" : "CREATE_APPLICATION",
        payload: data,
      });
      if (!isEditMode) {
        addAlert("Application saved successfully", "success");
      } else {
        addAlert("Application updated successfully", "success");
      }
      navigate("/dashboard");
    } else {
      setError(data.error);
      addAlert("An error occurred", "error");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="form-container">
      <div className="form-sub-container">
        <form className="form" onSubmit={handleSubmit}>
          <p className="form-title">
            {isEditMode ? "Edit Application" : "Create Application"}
          </p>

          <div className="form-group">
            <label className="label required" htmlFor="company">
              Company
            </label>
            <input
              className="input"
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="company name..."
              required
            />
          </div>

          <div className="form-group">
            <label className="label required" htmlFor="position">
              Position
            </label>
            <input
              className="input"
              type="text"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="position..."
              required
            />
          </div>

          <div className="form-group">
            <label className="label required" htmlFor="status">
              Application Status
            </label>
            <select
              className="input"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label required" htmlFor="dateApplied">
              Date Applied
            </label>
            <input
              className="input"
              type="date"
              id="dateApplied"
              value={dateApplied}
              onChange={(e) => setDateApplied(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="label required" htmlFor="jobType">
              Job Type
            </label>
            <select
              className="input"
              id="jobType"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Co-op">Co-op</option>
              <option value="Apprenticeship">Apprenticeship</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label required" htmlFor="location">
              Location
            </label>
            <input
              className="input"
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="city, state, country"
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="jobPostingURL">
              Job Posting URL
            </label>
            <input
              className="input"
              type="url"
              id="jobPostingURL"
              value={jobPostingURL}
              onChange={(e) => setJobPostingURL(e.target.value)}
              placeholder="https://job.com"
            />
          </div>

          <div className="form-group">
            <label className="label required" htmlFor="applicationSource">
              Application Source
            </label>
            <select
              className="input"
              id="applicationSource"
              value={applicationSource}
              onChange={(e) => setApplicationSource(e.target.value)}
            >
              <option value="">Select</option>
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
              <option value="Government Job Portal">
                Government Job Portal
              </option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label required" htmlFor="workType">
              Work Type
            </label>
            <select
              className="input"
              id="workType"
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
            >
              <option value="">Select</option>
              <option value="Remote">Remote</option>
              <option value="On-Site">On-Site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label" htmlFor="notes">
              Additional Notes
            </label>
            <textarea
              className="input textarea"
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="notes..."
            ></textarea>
          </div>

          <button className="submit-button" type="submit">
            {isEditMode ? "Update" : "Submit"}
          </button>
          {error && <p className="form-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default ApplicationForm;
