import "../styles/Statistics.css";
import { useEffect, useRef } from "react";
import { useApplicationsContext } from "../hooks/useApplicationsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28EFF",
  "#FF66B2",
];

function Statistics() {
  const { applications, dispatch } = useApplicationsContext();
  const { user } = useAuthContext();
  const hasFetched = useRef(false);

  useEffect(() => {
    document.title = "Dashboard | AppliSense";

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

    if (user && !hasFetched.current) {
      hasFetched.current = true;
      fetchApplications();
    }
  }, [dispatch, user]);

  const countOccurrences = (field) => {
    return applications.reduce((acc, app) => {
      const key = app[field] || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  };

  const statusCounts = countOccurrences("status");
  const jobTypeCounts = countOccurrences("jobType");
  const workTypeCounts = countOccurrences("workType");
  const sourceCounts = countOccurrences("applicationSource");

  const formatPieData = (counts) =>
    Object.entries(counts).map(([name, value]) => ({ name, value }));

  const renderPieChart = (data, title) => (
    <div className="chart-container">
      <p className="chart-title">{title}</p>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );

  return (
    <div className="statistics">
      {renderPieChart(formatPieData(statusCounts), "Application Status")}
      {renderPieChart(formatPieData(jobTypeCounts), "Job Types")}
      {renderPieChart(formatPieData(workTypeCounts), "Work Types")}
      {renderPieChart(formatPieData(sourceCounts), "Application Sources")}
    </div>
  );
}

export default Statistics;
