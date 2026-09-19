import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";

import { getDashboardData } from "../../services/projectService";

import "mapbox-gl/dist/mapbox-gl.css";
import "./Dashboard.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function Dashboard() {
  const navigate = useNavigate();

  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  const [dashboard, setDashboard] = useState({
    projects: [],
    sites: [],
    totalArea: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     LOAD DASHBOARD DATA
  ========================= */

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboardData();

        setDashboard(data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const {
    projects,
    sites,
    totalArea,
  } = dashboard;

  /* =========================
     MAPBOX DASHBOARD MAP
  ========================= */

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!sites.length) {
      return;
    }

    if (!mapContainer.current) {
      return;
    }

    if (!mapboxgl.accessToken) {
      return;
    }

    const validSites = sites.filter(
      (site) =>
        site.geometry &&
        site.geometry.type === "Polygon" &&
        site.geometry.coordinates
    );

    if (!validSites.length) {
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [80.648, 16.506],
      zoom: 5,
    });

    map.addControl(
      new mapboxgl.NavigationControl(),
      "top-right"
    );

    map.on("load", () => {
      const features = validSites.map((site) => ({
        type: "Feature",
        properties: {
          id: site.id,
          name: site.name,
          area: site.area || 0,
        },
        geometry: site.geometry,
      }));

      /* Add site polygons */

      map.addSource("dashboard-sites", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features,
        },
      });

      /* Polygon fill */

      map.addLayer({
        id: "dashboard-site-fill",
        type: "fill",
        source: "dashboard-sites",
        paint: {
          "fill-opacity": 0.35,
        },
      });

      /* Polygon border */

      map.addLayer({
        id: "dashboard-site-outline",
        type: "line",
        source: "dashboard-sites",
        paint: {
          "line-width": 3,
        },
      });

      /* Automatically fit map to sites */

      const bounds = new mapboxgl.LngLatBounds();

      features.forEach((feature) => {
        feature.geometry.coordinates[0].forEach(
          (coordinate) => {
            bounds.extend(coordinate);
          }
        );
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, {
          padding: 70,
          maxZoom: 13,
        });
      }

      /* Change cursor when hovering */

      map.on(
        "mouseenter",
        "dashboard-site-fill",
        () => {
          map.getCanvas().style.cursor =
            "pointer";
        }
      );

      map.on(
        "mouseleave",
        "dashboard-site-fill",
        () => {
          map.getCanvas().style.cursor = "";
        }
      );

      /* Click polygon */

      map.on(
        "click",
        "dashboard-site-fill",
        (event) => {
          const feature =
            event.features?.[0];

          if (!feature) {
            return;
          }

          const siteId =
            feature.properties.id;

          const siteName =
            feature.properties.name;

          const area = Number(
            feature.properties.area || 0
          );

          new mapboxgl.Popup()
            .setLngLat(event.lngLat)
            .setHTML(`
              <div style="min-width: 150px;">
                <strong>${siteName}</strong>
                <br />
                <span style="font-size: 11px;">
                  Area: ${area.toFixed(2)} m²
                </span>
                <br />
                <span style="font-size: 10px; color: #39804c;">
                  Opening site...
                </span>
              </div>
            `)
            .addTo(map);

          setTimeout(() => {
            navigate(`/sites/${siteId}`);
          }, 1000);
        }
      );
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [sites, loading, navigate]);

  /* =========================
     STATISTICS
  ========================= */

  const stats = [
    {
      title: "Total Projects",
      value: projects.length,
      icon: "◈",
    },
    {
      title: "Geographical Sites",
      value: sites.length,
      icon: "⌖",
    },
    {
      title: "Total Site Area",
      value:
        totalArea >= 1000000
          ? `${(
              totalArea / 1000000
            ).toFixed(2)} km²`
          : `${totalArea.toFixed(0)} m²`,
      icon: "🌍",
    },
    {
      title: "Active Projects",
      value: projects.length,
      icon: "🌱",
    },
  ];

  return (
    <div className="dashboard-page">

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          🌍

          <span>
            Darukaa<span>.Earth</span>
          </span>
        </div>

        <nav>

          <Link
            to="/dashboard"
            className="active"
          >
            ▦ Dashboard
          </Link>

          <Link to="/projects">
            ◈ Projects
          </Link>

          <Link to="/sites">
            ⌖ Sites
          </Link>

          <Link to="/analytics">
            ◫ Analytics
          </Link>

        </nav>

        <div className="dashboard-sidebar-bottom">

          <Link to="/">
            ← Home
          </Link>

          <Link to="/login">
            ↪ Logout
          </Link>

        </div>

      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="dashboard-main">

        {/* Header */}

        <div className="dashboard-header">

          <div>

            <p className="dashboard-label">
              OVERVIEW
            </p>

            <h1>
              Environmental Dashboard
            </h1>

            <p className="dashboard-subtitle">
              Monitor your environmental projects
              and geographical sites.
            </p>

          </div>

          <Link
            to="/projects/new"
            className="dashboard-create-btn"
          >
            + Create Project
          </Link>

        </div>

        {/* Error */}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* =========================
            STATISTICS
        ========================= */}

        <section className="dashboard-stats">

          {stats.map((stat) => (
            <div
              className="dashboard-stat-card"
              key={stat.title}
            >

              <div className="dashboard-stat-icon">
                {stat.icon}
              </div>

              <div>

                <span>
                  {stat.title}
                </span>

                <strong>
                  {loading
                    ? "..."
                    : stat.value}
                </strong>

              </div>

            </div>
          ))}

        </section>

        {/* =========================
            MAIN CONTENT GRID
        ========================= */}

        <section className="dashboard-content-grid">

          {/* =========================
              MAP
          ========================= */}

          <div className="dashboard-panel dashboard-map-panel">

            <div className="dashboard-panel-header">

              <div>

                <h2>
                  Geographical Sites
                </h2>

                <p>
                  Your registered environmental
                  project sites.
                </p>

              </div>

              <Link to="/sites">
                View Sites →
              </Link>

            </div>

            <div className="dashboard-map-container">

              {loading ? (

                <div className="dashboard-map-loading">
                  Loading geographical sites...
                </div>

              ) : sites.length === 0 ? (

                <div className="dashboard-map-empty">

                  <div className="dashboard-map-icon">
                    🌍
                  </div>

                  <h3>
                    No geographical sites yet
                  </h3>

                  <p>
                    Create a project and add a
                    geographical site to see it
                    on the map.
                  </p>

                  <Link
                    to="/projects/new"
                    className="dashboard-action-btn"
                  >
                    Create Project
                  </Link>

                </div>

              ) : (

                <div
                  ref={mapContainer}
                  className="dashboard-map"
                />

              )}

            </div>

          </div>

          {/* =========================
              RECENT PROJECTS
          ========================= */}

          <div className="dashboard-panel">

            <div className="dashboard-panel-header">

              <div>

                <h2>
                  Recent Projects
                </h2>

                <p>
                  Your environmental projects.
                </p>

              </div>

              <Link to="/projects">
                View All →
              </Link>

            </div>

            <div className="dashboard-project-list">

              {loading ? (

                <div className="dashboard-empty">
                  Loading projects...
                </div>

              ) : projects.length === 0 ? (

                <div className="dashboard-empty">

                  <div className="dashboard-empty-icon">
                    ◈
                  </div>

                  <h3>
                    No projects yet
                  </h3>

                  <p>
                    Start by creating your first
                    environmental project.
                  </p>

                  <Link
                    to="/projects/new"
                    className="dashboard-action-btn"
                  >
                    + Create Project
                  </Link>

                </div>

              ) : (

                projects
                  .slice(0, 5)
                  .map((project) => (

                    <Link
                      key={project.id}
                      to={`/projects/${project.id}`}
                      className="dashboard-project-item"
                    >

                      <div className="dashboard-project-icon">
                        🌱
                      </div>

                      <div className="dashboard-project-info">

                        <h3>
                          {project.name}
                        </h3>

                        <p>
                          {project.project_type}

                          {project.location
                            ? ` • ${project.location}`
                            : ""}
                        </p>

                      </div>

                      <span className="dashboard-arrow">
                        →
                      </span>

                    </Link>

                  ))

              )}

            </div>

          </div>

        </section>

        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <section className="dashboard-quick-actions">

          <div>

            <p className="dashboard-label">
              QUICK ACTIONS
            </p>

            <h2>
              Manage your environmental data
            </h2>

          </div>

          <div className="dashboard-actions">

            <Link
              to="/projects/new"
              className="dashboard-quick-card"
            >

              <span>
                ＋
              </span>

              <div>

                <strong>
                  Create Project
                </strong>

                <p>
                  Start a new environmental project
                </p>

              </div>

            </Link>

            <Link
              to="/sites"
              className="dashboard-quick-card"
            >

              <span>
                ⌖
              </span>

              <div>

                <strong>
                  Explore Sites
                </strong>

                <p>
                  View your geographical sites
                </p>

              </div>

            </Link>

            <Link
              to="/analytics"
              className="dashboard-quick-card"
            >

              <span>
                📊
              </span>

              <div>

                <strong>
                  View Analytics
                </strong>

                <p>
                  Analyze project performance
                </p>

              </div>

            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;