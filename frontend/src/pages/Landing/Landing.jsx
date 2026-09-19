import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing-page">

      {/* ================= NAVBAR ================= */}
      <nav className="landing-navbar">
        <Link to="/" className="landing-logo">
          Darukaa<span>.Earth</span>
        </Link>

        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>

          <Link to="/login">Login</Link>

          <Link to="/register" className="nav-signup">
            Sign Up
          </Link>
        </div>
      </nav>


      {/* ================= HERO ================= */}
      <section className="landing-hero">

        <div className="hero-content">

          <div className="hero-badge">
            Geospatial Intelligence for a Greener Future
          </div>

          <h1>
            Understand the Earth.
            <br />
            <span>Protect Its Future.</span>
          </h1>

          <p>
            Darukaa.Earth is a geospatial data analytics
            platform for managing environmental projects,
            geographical sites, and project performance.
          </p>

          <div className="hero-buttons">

            <Link
              to="/register"
              className="hero-primary-btn"
            >
              Get Started →
            </Link>

            <a
              href="#features"
              className="hero-secondary-btn"
            >
              Explore Features
            </a>

          </div>

        </div>


        {/* RIGHT SIDE IMAGE */}
        <div className="hero-visual">
          <div className="hero-image-card">

            <img
              src="/right-img.png"
              alt="Sustainable Earth"
            />

          </div>
        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section
        className="features-section"
        id="features"
      >

        <div className="section-heading">

          <div className="section-label">
            PLATFORM FEATURES
          </div>

          <h2>
            Everything you need to
            <br />
            understand your projects
          </h2>

          <p>
            Manage environmental projects, visualize
            geographical boundaries, and analyze
            project performance.
          </p>

        </div>


        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">
              🌍
            </div>

            <h3>Interactive Mapping</h3>

            <p>
              Visualize geographical project sites
              using interactive maps.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-icon">
              📊
            </div>

            <h3>Data Analytics</h3>

            <p>
              Monitor environmental metrics and
              project performance.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-icon">
              🌱
            </div>

            <h3>Carbon & Biodiversity</h3>

            <p>
              Manage projects focused on carbon
              and biodiversity.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-icon">
              🔐
            </div>

            <h3>Secure Access</h3>

            <p>
              Secure your project data with
              authenticated access.
            </p>
          </div>

        </div>

      </section>


      {/* ================= ABOUT ================= */}
      <section
        className="about-section"
        id="about"
      >

        {/* BOTTOM LEFT IMAGE */}
        <div className="about-image">
          <img
            src="/left-img.png"
            alt="Environmental project"
          />
        </div>


        <div className="about-content">

          <div className="section-label">
            ABOUT DARUKAA.EARTH
          </div>

          <h2>
            Turning geographical data
            into environmental insights.
          </h2>

          <p>
            Darukaa.Earth brings geographical and
            analytical information together into
            one platform for environmental projects.
          </p>

          <p>
            Define project sites, visualize their
            boundaries, and track environmental
            performance over time.
          </p>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="cta-section">

        <div className="cta-content">

          <h2>
            Ready to explore your
            environmental projects?
          </h2>

          <p>
            Create your account and start managing
            projects with Darukaa.Earth.
          </p>

          <Link
            to="/register"
            className="hero-primary-btn"
          >
            Create Your Account →
          </Link>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="landing-footer">

        <div className="footer-logo">
          Darukaa<span>.Earth</span>
        </div>

        <p>
          Geospatial intelligence for a greener future.
        </p>

        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        <div className="footer-bottom">
          © 2026 Darukaa.Earth. All rights reserved.
        </div>

      </footer>

    </div>
  );
}

export default Landing;