import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProject } from "../../services/projectService";
import "./Projects.css";

function CreateProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    project_type: "",
    location: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.name ||
      !formData.project_type
    ) {
      setError(
        "Project name and project type are required."
      );
      return;
    }

    try {
      setLoading(true);

      await createProject(formData);

      navigate("/projects");

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to create project."
      );
    } finally {
      setLoading(false);
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


      {/* Main Content */}
      <main className="projects-main">

        {/* Header */}
        <div className="projects-header">

          <div>
            <p className="projects-label">
              PROJECT MANAGEMENT
            </p>

            <h1>
              Create Project
            </h1>

            <p>
              Add a new environmental project to
              Darukaa.Earth.
            </p>
          </div>

          <Link
            to="/projects"
            className="back-project-btn"
          >
            ← Back to Projects
          </Link>

        </div>


        {/* Form Card */}
        <div className="create-project-card">

          <form onSubmit={handleSubmit}>

            {/* Project Name */}
            <div className="form-group">

              <label>
                Project Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
              />

            </div>


            {/* Project Type */}
            <div className="form-group">

              <label>
                Project Type *
              </label>

              <select
                name="project_type"
                value={formData.project_type}
                onChange={handleChange}
              >
                <option value="">
                  Select project type
                </option>

                <option value="Carbon">
                  Carbon
                </option>

                <option value="Biodiversity">
                  Biodiversity
                </option>

                <option value="Carbon & Biodiversity">
                  Carbon & Biodiversity
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

            </div>


            {/* Location */}
            <div className="form-group">

              <label>
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Andhra Pradesh, India"
              />

            </div>


            {/* Description */}
            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your environmental project..."
                rows="5"
              />

            </div>


            {/* Error */}
            {error && (
              <div className="projects-error">
                {error}
              </div>
            )}


            {/* Buttons */}
            <div className="form-actions">

              <Link
                to="/projects"
                className="cancel-project-btn"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="create-project-btn"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create Project"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default CreateProject;