import "../styles/Form.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApplicationsContext } from "../hooks/useApplicationsContext";
import { useAuthContext } from "../hooks/useAuthContext";

function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const { dispatch } = useApplicationsContext();

  const navigate = useNavigate();

  const { user } = useAuthContext();

  useEffect(() => {
    document.title = "Create Application | AppliSense";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      setError("You must be logged in to create a application");
      return;
    }

    const dateTime = new Date(`${date}T${time}`);

    if (dateTime <= new Date()) {
      setError("Date must be in the future");
      return;
    }

    const response = await fetch(`/api/applications/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        title,
        description,
        date: dateTime.toISOString(),
      }),
    });
    const data = await response.json();

    if (response.ok) {
      setTitle("");
      setDescription("");
      setTime("");
      setDate("");
      setError("");
      dispatch({ type: "CREATE_APPLICATION", payload: data });
      navigate("/dashboard");
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="form-container">
      <div className="form-sub-container">
        <form className="form" onSubmit={handleSubmit}>
          <p className="form-title">Create Application</p>
          <div className="form-group">
            <label className="label required" htmlFor="title">
              Title
            </label>
            <input
              className="input"
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Remind me to..."
              required
            />
          </div>
          <div className="form-group">
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              className="input textarea"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description..."
            />
          </div>
          <div className="form-group">
            <label className="label required" htmlFor="time">
              Time
            </label>
            <input
              className="input"
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="label required" htmlFor="date">
              Date
            </label>
            <input
              className="input"
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <button className="submit-button" type="submit">
            Submit
          </button>
          {error && <p className="form-error">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Create;
