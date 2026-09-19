import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // Call FastAPI registration API
      await registerUser(formData);

      setSuccess("Account created successfully!");

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
      });

      // Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Background */}
      <div className="auth-background"></div>
      <div className="auth-overlay"></div>

      {/* Register Card */}
      <div className="auth-card">

        {/* Login / Register Tabs */}
        <div className="auth-tabs">
          <Link to="/login">
            Login
          </Link>

          <Link
            to="/register"
            className="active"
          >
            Register
          </Link>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h1>Create Account</h1>

          <p>
            Join Darukaa.Earth and start managing
            your projects.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="input-group">
            <label>Full Name</label>

            <div className="input-wrapper">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label>Email Address</label>

            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label>Password</label>

            <div className="input-wrapper">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          {/* Success Message */}
          {success && (
            <p className="auth-success">
              {success}
            </p>
          )}

          {/* Register Button */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* Login Link */}
        <p className="auth-bottom-text">
          Already have an account?
          <Link to="/login">
            {" "}Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;