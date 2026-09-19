import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProject } from "../../services/projectService";
import { getSites } from "../../services/siteService";
import "./Projects.css";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        setError("");

        const projectData = await getProject(id);
        setProject(projectData);

        try {
          const sitesData = await getSites(id);
          setSites(sitesData);
        } catch {
          setSites([]);
        }

      } catch (err) {
        setError(
          err.response?.data?.detail ||
          "Unable to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="projects-loading">
        Loading project...
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-page">
        <main className="projects-main">
          <div className="projects-error">
            {error}
          </div>

          <Link
            to="/projects"
            className="back-project-btn"
          >
            ← Back to Projects
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="projects-page">

      {/* Sidebar */}
      <aside className="projects-sidebar">

        <div className="projects-logo">
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

        <div className="projects-sidebar-bottom">

          <Link to="/">
            ← Home
          </Link>

          <Link to="/login">
            ↪ Logout
          </Link>

        </div>

      </aside>


      {/* Main */}
      <main className="projects-main">

        {/* Header */}
        <div className="project-details-header">

          <div>

            <Link
              to="/projects"
              className="back-project-link"
            >
              ← Back to Projects
            </Link>

            <div className="project-details-title">

              <div className="project-large-icon">
                🌱
              </div>

              <div>
                <p className="projects-label">
                  ENVIRONMENTAL PROJECT
                </p>

                <h1>
                  {project.name}
                </h1>

                <span className="project-type">
                  {project.project_type}
                </span>
              </div>

            </div>

          </div>

          <Link
            to={`/projects/${id}/sites/new`}
            className="create-project-btn"
          >
            + Add Site
          </Link>

        </div>


        {/* Project Information */}
        <section className="project-info-grid">

          <div className="project-info-card">

            <h2>Project Information</h2>

            <div className="project-info-row">
              <span>Project Name</span>
              <strong>{project.name}</strong>
            </div>

            <div className="project-info-row">
              <span>Project Type</span>
              <strong>{project.project_type}</strong>
            </div>

            <div className="project-info-row">
              <span>Location</span>
              <strong>
                {project.location || "Not specified"}
              </strong>
            </div>

          </div>


          <div className="project-info-card">

            <h2>Overview</h2>

            <p className="project-full-description">
              {project.description ||
                "No project description has been added."}
            </p>

          </div>

        </section>


        {/* Sites */}
        <section className="project-sites-section">

          <div className="project-section-header">

            <div>
              <h2>
                Geographical Sites
              </h2>

              <p>
                Sites associated with this project.
              </p>
            </div>

            <Link
              to={`/projects/${id}/sites/new`}
              className="create-project-btn"
            >
              + Add Site
            </Link>

          </div>


          {sites.length === 0 ? (

            <div className="sites-empty">

              <div className="empty-project-icon">
                ⌖
              </div>

              <h3>
                No geographical sites yet
              </h3>

              <p>
                Add a site by defining its geographical
                boundary on the map.
              </p>

              <Link
                to={`/projects/${id}/sites/new`}
                className="create-project-btn"
              >
                + Add Geographical Site
              </Link>

            </div>

          ) : (

            <div className="sites-grid">

              {sites.map((site) => (

                <Link
                  key={site.id}
                  to={`/sites/${site.id}`}
                  className="site-card"
                >

                  <div className="site-card-icon">
                    ⌖
                  </div>

                  <div>
                    <h3>
                      {site.name}
                    </h3>

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

                </Link>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default ProjectDetails;