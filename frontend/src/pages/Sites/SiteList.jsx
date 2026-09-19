import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProjects } from "../../services/projectService";
import { getSites } from "../../services/siteService";

import "./Sites.css";

function SiteList() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSites = async () => {
      try {
        setLoading(true);
        setError("");

        const projects = await getProjects();

        const results = await Promise.all(
          projects.map(async (project) => {
            try {
              const projectSites = await getSites(project.id);

              return projectSites.map((site) => ({
                ...site,
                projectName: project.name,
              }));
            } catch {
              return [];
            }
          })
        );

        setSites(results.flat());
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Unable to load geographical sites."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSites();
  }, []);

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

          <Link to="/projects">
            ◈ Projects
          </Link>

          <Link
            to="/sites"
            className="active"
          >
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

        <div className="sites-header">

          <div>
            <p className="sites-label">
              GEOGRAPHICAL DATA
            </p>

            <h1>
              Geographical Sites
            </h1>

            <p>
              Explore all geographical sites
              associated with your projects.
            </p>
          </div>

          <Link
            to="/projects"
            className="create-project-btn"
          >
            View Projects
          </Link>

        </div>

        {error && (
          <div className="site-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="sites-loading">
            Loading geographical sites...
          </div>
        ) : sites.length === 0 ? (
          <div className="sites-empty">

            <div className="empty-project-icon">
              ⌖
            </div>

            <h3>
              No geographical sites yet
            </h3>

            <p>
              Create a project and add a
              geographical site to get started.
            </p>

            <Link
              to="/projects"
              className="create-project-btn"
            >
              Go to Projects
            </Link>

          </div>
        ) : (
          <div className="site-list-grid">

            {sites.map((site) => (
              <Link
                key={site.id}
                to={`/sites/${site.id}`}
                className="site-list-card"
              >

                <div className="site-list-icon">
                  ⌖
                </div>

                <div className="site-list-content">

                  <h3>
                    {site.name}
                  </h3>

                  <p className="site-project-name">
                    {site.projectName}
                  </p>

                  <p>
                    {site.description ||
                      "No description provided."}
                  </p>

                  <span>
                    Area:{" "}
                    {site.area
                      ? `${site.area.toFixed(2)} m²`
                      : "Not calculated"}
                  </span>

                </div>

                <div className="site-list-arrow">
                  →
                </div>

              </Link>
            ))}

          </div>
        )}

      </main>

    </div>
  );
}

export default SiteList;