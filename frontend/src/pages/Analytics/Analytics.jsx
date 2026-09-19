import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

import { getDashboardData } from "../../services/projectService";

import "./Analytics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

function Analytics() {
  const [data, setData] = useState({
    projects: [],
    sites: [],
    totalArea: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);

        const result = await getDashboardData();

        setData(result);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Unable to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const carbonData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Carbon Sequestration",
      data: [120, 145, 165, 190, 220, 248],
      borderColor: "#2e7d32",
      backgroundColor: "rgba(46, 125, 50, 0.15)",
      borderWidth: 3,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: "#2e7d32",
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
      fill: true,
    },
  ],
};

  const biodiversityData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Biodiversity Index",
      data: [62, 66, 69, 73, 78, 82],
      borderColor: "#00897b",
      backgroundColor: "rgba(0, 137, 123, 0.14)",
      borderWidth: 3,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: "#00897b",
      pointBorderColor: "#ffffff",
      pointBorderWidth: 2,
      fill: true,
    },
  ],
};

  const progressValues = [76, 61, 84, 69, 91, 73];

const progressData = {
  labels: data.projects
    .slice(0, 6)
    .map((project) => project.name),

  datasets: [
    {
      label: "Project Progress",
      data: data.projects
        .slice(0, 6)
        .map((_, index) => progressValues[index]),

      backgroundColor: "#86efac",

      borderColor: "#16a34a",
      borderWidth: 1,
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
};

   const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      display: false,
    },

    tooltip: {
      backgroundColor: "#173b2a",
      titleColor: "#ffffff",
      bodyColor: "#e8f5e9",
      padding: 12,
      cornerRadius: 8,
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#6b7d72",
      },
    },

    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(46, 125, 50, 0.08)",
      },
      ticks: {
        color: "#6b7d72",
      },
    },
  },
};
  return (
    <div className="analytics-page">

      {/* Sidebar */}

      <aside className="analytics-sidebar">

        <div className="analytics-logo">
          🌍

          <span>
            Darukaa<span>.Earth</span>
          </span>
        </div>

        <nav>

          <Link to="/dashboard">
            ▦ Dashboard
          </Link>

          <Link to="/projects">
            ◈ Projects
          </Link>

          <Link to="/sites">
            ⌖ Sites
          </Link>

          <Link
            to="/analytics"
            className="active"
          >
            ◫ Analytics
          </Link>

        </nav>

        <div className="analytics-sidebar-bottom">

          <Link to="/">
            ← Home
          </Link>

          <Link to="/login">
            ↪ Logout
          </Link>

        </div>

      </aside>

      {/* Main */}

      <main className="analytics-main">

        <div className="analytics-header">

          <div>

            <p className="analytics-label">
              ENVIRONMENTAL INSIGHTS
            </p>

            <h1>
              Analytics Dashboard
            </h1>

            <p>
              Monitor environmental performance
              across your projects and sites.
            </p>

          </div>

        </div>

        {error && (
          <div className="analytics-error">
            {error}
          </div>
        )}

        {/* Summary */}

        <section className="analytics-stats">

          <div className="analytics-stat-card">
            <div className="analytics-stat-icon">
              ◈
            </div>

            <div>
              <span>Total Projects</span>
              <strong>
                {loading
                  ? "..."
                  : data.projects.length}
              </strong>
            </div>
          </div>

          <div className="analytics-stat-card">
            <div className="analytics-stat-icon">
              ⌖
            </div>

            <div>
              <span>Total Sites</span>
              <strong>
                {loading
                  ? "..."
                  : data.sites.length}
              </strong>
            </div>
          </div>

          <div className="analytics-stat-card">
            <div className="analytics-stat-icon">
              🌍
            </div>

            <div>
              <span>Total Area</span>
              <strong>
                {loading
                  ? "..."
                  : data.totalArea >= 1000000
                  ? `${(
                      data.totalArea / 1000000
                    ).toFixed(2)} km²`
                  : `${data.totalArea.toFixed(
                      0
                    )} m²`}
              </strong>
            </div>
          </div>

          <div className="analytics-stat-card">
            <div className="analytics-stat-icon">
              🌱
            </div>

            <div>
              <span>Carbon Stored</span>
              <strong>
                248 tCO₂e
              </strong>
            </div>
          </div>

        </section>

        {/* Environmental Metrics */}

        <section className="environment-metrics">

          <div className="environment-card carbon-performance-card">

            <div className="environment-card-top">
              <span>CARBON PERFORMANCE</span>
              <strong>+18.4%</strong>
            </div>

            <h2>
              248 tCO₂e
            </h2>

            <p>
              Total carbon sequestration
            </p>

          </div>

          <div className="environment-card carbon-performance-card">

            <div className="environment-card-top">
              <span>BIODIVERSITY</span>
              <strong>+12.7%</strong>
            </div>

            <h2>
              82 / 100
            </h2>

            <p>
              Current biodiversity index
            </p>

          </div>

          <div className="environment-card carbon-performance-card">

            <div className="environment-card-top">
              <span>PROJECT PROGRESS</span>
              <strong>+8.2%</strong>
            </div>

            <h2>
              76%
            </h2>

            <p>
              Overall project progress
            </p>

          </div>

        </section>

        {/* Charts */}

        <section className="analytics-charts-grid">

          <div className="analytics-chart-card">

            <div className="analytics-chart-header">

              <div>
                <h2>
                  Carbon Sequestration
                </h2>

                <p>
                  Environmental carbon performance
                  over time.
                </p>
              </div>

              <span>
                tCO₂e
              </span>

            </div>

            <div className="analytics-chart">
              <Line
                data={carbonData}
                options={chartOptions}
              />
            </div>

          </div>

          <div className="analytics-chart-card">

            <div className="analytics-chart-header">

              <div>
                <h2>
                  Biodiversity Index
                </h2>

                <p>
                  Biodiversity health over time.
                </p>
              </div>

              <span>
                / 100
              </span>

            </div>

            <div className="analytics-chart">
              <Line
                data={biodiversityData}
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                    },
                  },
                }}
              />
            </div>

          </div>

        </section>

        {/* Project Performance */}

        <section className="analytics-chart-card analytics-full-chart">

          <div className="analytics-chart-header">

            <div>
              <h2>
                Project Performance
              </h2>

              <p>
                Current progress across your
                environmental projects.
              </p>
            </div>

            <span>
              %
            </span>

          </div>

          <div className="analytics-chart">
            {data.projects.length > 0 ? (
              <Bar
                data={progressData}
                options={{
                  ...chartOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                    },
                  },
                }}
              />
            ) : (
              <div className="analytics-empty">
                No projects available.
              </div>
            )}
          </div>

        </section>

      </main>

    </div>
  );
}

export default Analytics;