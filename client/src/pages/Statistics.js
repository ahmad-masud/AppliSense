import "../styles/Statistics.css";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import StatisticSkeleton from "../skeletons/StatisticSkeleton";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28EFF",
  "#FF66B2",
];

function Statistics() {
  const { user } = useAuthContext();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Statistics | AppliSense";

    const fetchStatistics = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || "http://localhost:4000"}/applications/stats`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setStats(data);
      }
      setLoading(false);
    };

    if (user) {
      fetchStatistics();
    }
  }, [user]);

  const formatPieData = (dataObj) => {
    if (!dataObj) return [];
    return Object.entries(dataObj)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  };

  const renderPieChart = (data, title, showLegend = true) => {
    if (!data || data.length === 0) return null;

    return (
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
            label
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          {showLegend && <Legend />}
        </PieChart>
      </div>
    );
  };

  if (loading) return <p className="chart-fallback">Loading statistics...</p>;

  if (!stats || stats.totalApplications === 0) {
    return <p className="chart-fallback">Add applications to see statistics</p>;
  }

  return (
    <div className="statistics">
      {loading &&
        [...Array(7)].map((_, index) => <StatisticSkeleton key={index} />)}

      {!loading &&
        renderPieChart(formatPieData(stats.companyData), "Companies", false)}
      {!loading &&
        renderPieChart(formatPieData(stats.positionData), "Positions", false)}
      {!loading &&
        renderPieChart(formatPieData(stats.locationData), "Locations", false)}
      {!loading &&
        renderPieChart(formatPieData(stats.statusData), "Application Status")}
      {!loading &&
        renderPieChart(formatPieData(stats.jobTypeData), "Job Types")}
      {!loading &&
        renderPieChart(formatPieData(stats.workTypeData), "Work Types")}
      {!loading &&
        renderPieChart(
          formatPieData(stats.sourceData),
          "Application Sources",
          false
        )}
    </div>
  );
}

export default Statistics;
