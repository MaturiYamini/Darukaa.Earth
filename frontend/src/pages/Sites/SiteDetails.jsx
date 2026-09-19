import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

import { getSite } from "../../services/siteService";

import "mapbox-gl/dist/mapbox-gl.css";
import "./Sites.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function SiteDetails() {
  const { id } = useParams();

  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSite = async () => {
      try {
        setLoading(true);

        const data = await getSite(id);
        setSite(data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Unable to load site."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSite();
  }, [id]);

  useEffect(() => {
    if (!site || !mapContainer.current) {
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [80.648, 16.506],
      zoom: 10,
    });

    map.addControl(
      new mapboxgl.NavigationControl(),
      "top-right"
    );

    map.on("load", () => {
      const geometry = site.geometry;

      if (!geometry) {
        return;
      }

      map.addSource("site-boundary", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: geometry,
        },
      });

      map.addLayer({
        id: "site-fill",
        type: "fill",
        source: "site-boundary",
        paint: {
          "fill-opacity": 0.35,
        },
      });

      map.addLayer({
        id: "site-outline",
        type: "line",
        source: "site-boundary",
        paint: {
          "line-width": 3,
        },
      });

      const coordinates = geometry.coordinates[0];

      const bounds = new mapboxgl.LngLatBounds();

      coordinates.forEach((coordinate) => {
        bounds.extend(coordinate);
      });

      map.fitBounds(bounds, {
        padding: 70,
        maxZoom: 15,
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, [site]);

  if (loading) {
    return (
      <div className="sites-loading">
        Loading site...
      </div>
    );
  }

  if (error) {
    return (
      <div className="sites-page">
        <main className="sites-main">
          <div className="site-error">
            {error}
          </div>

          <Link
            to="/projects"
            className="back-site-link"
          >
            ← Back to Projects
          </Link>
        </main>
      </div>
    );
  }

  /*
   * Mock analytics data.
   * This can later be replaced with real
   * analytics API data from the backend.
   */

  const carbonData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ],
    datasets: [
      {
        label: "Carbon Sequestration (tCO₂e)",
        data: [120, 145, 165, 190, 220, 248],
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const biodiversityData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ],
    datasets: [
      {
        label: "Biodiversity Index",
        data: [62, 66, 69, 73, 78, 82],
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const carbonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const biodiversityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const metrics = [
    {
      title: "Site Area",
      value: site.area
        ? `${site.area.toFixed(2)} m²`
        : "N/A",
      icon: "⌖",
    },
    {
      title: "Carbon Stored",
      value: "248 tCO₂e",
      icon: "🌱",
    },
    {
      title: "Biodiversity Index",
      value: "82 / 100",
      icon: "🦋",
    },
    {
      title: "Project Progress",
      value: "76%",
      icon: "📈",
    },
  ];

  return (
    <div className="sites-page">
      <aside className="sites-sidebar">
        <div className="sites-logo">
          🌍
          <span>
            Darukaa<span>.Earth</span>
          </span>
        </div>

        <nav>
          <Link to="/dashboard">
            ▦ Dashboard
          </Link>

          <Link
            to="/projects"
            className="active"
          >
            ◈ Projects
          </Link>

          <Link to="/sites">
            ⌖ Sites
          </Link>

          <Link to="/analytics">
            ◫ Analytics
          </Link>
        </nav>

        <div className="sites-sidebar-bottom">
          <Link to="/">
            ← Home
          </Link>

          <Link to="/login">
            ↪ Logout
          </Link>
        </div>
      </aside>

      <main className="sites-main">

        <div className="site-details-header">

          <div>
            <Link
              to={`/projects/${site.project_id}`}
              className="back-site-link"
            >
              ← Back to Project
            </Link>

            <p className="sites-label">
              GEOGRAPHICAL SITE
            </p>

            <h1>{site.name}</h1>

            <p>
              {site.description ||
                "Environmental monitoring site"}
            </p>
          </div>

          <div className="site-status">
            ● Active Site
          </div>

        </div>

        {/* Metrics */}

        <section className="site-metrics-grid">

          {metrics.map((metric) => (
            <div
              className="site-metric-card"
              key={metric.title}
            >
              <div className="site-metric-icon">
                {metric.icon}
              </div>

              <div>
                <span>
                  {metric.title}
                </span>

                <strong>
                  {metric.value}
                </strong>
              </div>
            </div>
          ))}

        </section>

        {/* Map */}

        <section className="site-map-section">

          <div className="site-section-heading">
            <div>
              <h2>
                Geographical Boundary
              </h2>

              <p>
                Interactive view of the
                registered site boundary.
              </p>
            </div>
          </div>

          <div
            ref={mapContainer}
            className="site-details-map"
          />

        </section>

        {/* Analytics */}

        <section className="analytics-heading">

          <div>
            <p className="sites-label">
              ENVIRONMENTAL ANALYTICS
            </p>

            <h2>
              Site Performance
            </h2>

            <p>
              Monitor carbon and biodiversity
              performance over time.
            </p>
          </div>

        </section>

        <section className="charts-grid">

          <div className="chart-card">

            <div className="chart-header">
              <div>
                <h3>
                  Carbon Sequestration
                </h3>

                <p>
                  Measured in tCO₂e
                </p>
              </div>

              <span className="chart-value">
                248 tCO₂e
              </span>
            </div>

            <div className="chart-container">
              <Line
                data={carbonData}
                options={carbonOptions}
              />
            </div>

          </div>

          <div className="chart-card">

            <div className="chart-header">
              <div>
                <h3>
                  Biodiversity Index
                </h3>

                <p>
                  Environmental health score
                </p>
              </div>

              <span className="chart-value">
                82 / 100
              </span>
            </div>

            <div className="chart-container">
              <Line
                data={biodiversityData}
                options={biodiversityOptions}
              />
            </div>

          </div>

        </section>

        {/* Additional chart */}

        <section className="chart-card full-chart">

          <div className="chart-header">

            <div>
              <h3>
                Monthly Environmental Progress
              </h3>

              <p>
                Overall project performance
              </p>
            </div>

            <span className="chart-value">
              76%
            </span>

          </div>

          <div className="chart-container">
            <Bar
              data={{
                labels: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                ],
                datasets: [
                  {
                    label: "Progress %",
                    data: [
                      35,
                      44,
                      51,
                      60,
                      68,
                      76,
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                  },
                },
              }}
            />
          </div>

        </section>

      </main>
    </div>
  );
}

export default SiteDetails;