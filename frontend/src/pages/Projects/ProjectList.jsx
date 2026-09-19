import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProjects,
  deleteProject,
} from "../../services/projectService";
import "./Projects.css";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();

      setProjects(data);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProject(projectId);

      setProjects((currentProjects) =>
        currentProjects.filter(
          (project) => project.id !== projectId
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to delete project."
      );
    }
  };

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
        <div className="projects-header">

          <div>
            <p className="projects-label">
              PROJECT MANAGEMENT
            </p>

            <h1>
              Environmental Projects
            </h1>

            <p>
              Create and manage your carbon and
              biodiversity projects.
            </p>
          </div>

          <Link
            to="/projects/new"
            className="create-project-btn"
          >
            + Create Project
          </Link>

        </div>


        {/* Error */}
        {error && (
          <div className="projects-error">
            {error}
          </div>
        )}


        {/* Loading */}
        {loading && (
          <div className="projects-loading">
            Loading projects...
          </div>
        )}


        {/* Empty */}
        {!loading && projects.length === 0 && !error && (
          <div className="projects-empty">

            <div className="empty-project-icon">
              ◈
            </div>

            <h2>
              No projects yet
            </h2>

            <p>
              Create your first environmental project
              to begin monitoring geographical sites.
            </p>

            <Link
              to="/projects/new"
              className="create-project-btn"
            >
              + Create Your First Project
            </Link>

          </div>
        )}


        {/* Project Cards */}
        {!loading && projects.length > 0 && (
          <div className="projects-grid">

            {projects.map((project) => (

              <div
                className="project-card"
                key={project.id}
              >

                <div className="project-card-top">

                  <div className="project-icon">
                    🌱
                  </div>

                  <span className="project-type">
                    {project.project_type}
                  </span>

                </div>

                <h2>
                  {project.name}
                </h2>

                <p className="project-description">
                  {project.description ||
                    "No description provided."}
                </p>

                <div className="project-location">
                  📍{" "}
                  {project.location ||
                    "Location not specified"}
                </div>

                <div className="project-card-actions">

                  <Link
                    to={`/projects/${project.id}`}
                    className="view-project-btn"
                  >
                    View Project
                  </Link>

                  <button
                    className="delete-project-btn"
                    onClick={() =>
                      handleDelete(project.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </main>

    </div>
  );
}

export default ProjectList;