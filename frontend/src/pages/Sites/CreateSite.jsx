import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

import { createSite } from "../../services/siteService";

import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import "./Sites.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function CreateSite() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const drawRef = useRef(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [geometry, setGeometry] = useState(null);

  const [loading, setLoading] = useState(false);
  const [mapError, setMapError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mapboxgl.accessToken) {
      setMapError("Mapbox token is missing.");
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [80.648, 16.506],
      zoom: 10,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    map.addControl(draw, "top-left");

    const updateGeometry = () => {
      const data = draw.getAll();

      if (data.features.length > 0) {
        setGeometry(data.features[0].geometry);
      } else {
        setGeometry(null);
      }
    };

    map.on("draw.create", updateGeometry);
    map.on("draw.update", updateGeometry);
    map.on("draw.delete", updateGeometry);

    map.on("load", () => {
      map.resize();
    });

    mapRef.current = map;
    drawRef.current = draw;

    return () => {
      map.remove();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Site name is required.");
      return;
    }

    if (!geometry) {
      setError("Please draw the geographical boundary on the map.");
      return;
    }

    try {
      setLoading(true);

      await createSite(projectId, {
        name: name.trim(),
        description: description.trim(),
        geometry,
      });

      navigate(`/projects/${projectId}`);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to create geographical site."
      );
    } finally {
      setLoading(false);
    }
  };

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
          <Link to="/dashboard">▦ Dashboard</Link>
          <Link to="/projects" className="active">
            ◈ Projects
          </Link>
          <Link to="/sites">⌖ Sites</Link>
          <Link to="/analytics">◫ Analytics</Link>
        </nav>

        <div className="sites-sidebar-bottom">
          <Link to="/">← Home</Link>
          <Link to="/login">↪ Logout</Link>
        </div>
      </aside>

      <main className="sites-main">
        <div className="sites-header">
          <div>
            <Link
              to={`/projects/${projectId}`}
              className="back-site-link"
            >
              ← Back to Project
            </Link>

            <p className="sites-label">
              GEOGRAPHICAL SITE
            </p>

            <h1>Add New Site</h1>

            <p>
              Define the geographical boundary of your
              environmental site.
            </p>
          </div>
        </div>

        <form
          className="create-site-layout"
          onSubmit={handleSubmit}
        >
          <section className="site-form-card">
            <h2>Site Information</h2>

            <div className="site-form-group">
              <label>Site Name *</label>

              <input
                type="text"
                placeholder="e.g. Krishna Forest Site"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="site-form-group">
              <label>Description</label>

              <textarea
                placeholder="Describe this geographical site..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows="6"
              />
            </div>

            <div className="site-instruction">
              <span>⌖</span>

              <div>
                <strong>Draw the site boundary</strong>

                <p>
                  Use the polygon tool on the map to
                  define the geographical boundary.
                </p>
              </div>
            </div>

            {geometry && (
              <div className="geometry-success">
                ✓ Geographical boundary selected
              </div>
            )}

            {error && (
              <div className="site-error">
                {error}
              </div>
            )}

            <div className="site-form-actions">
              <Link
                to={`/projects/${projectId}`}
                className="cancel-site-btn"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="save-site-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Site"}
              </button>
            </div>
          </section>

          <section className="map-card">
            <div className="map-card-header">
              <div>
                <h2>Site Boundary</h2>

                <p>
                  Click the polygon tool and draw around
                  your site.
                </p>
              </div>

              <span className="map-status">
                {geometry ? "Boundary selected" : "Draw polygon"}
              </span>
            </div>

            <div
              ref={mapContainer}
              className="site-map"
            />

            {mapError && (
              <div className="map-error">
                {mapError}
              </div>
            )}
          </section>
        </form>
      </main>
    </div>
  );
}

export default CreateSite;