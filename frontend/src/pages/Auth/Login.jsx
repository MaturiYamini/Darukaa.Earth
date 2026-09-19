import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // Call FastAPI login API
      await loginUser(formData);

      // Login successful
      navigate("/dashboard");

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Invalid email or password."
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

      {/* Login Card */}
      <div className="auth-card">

        {/* Tabs */}
        <div className="auth-tabs">
          <Link
            to="/login"
            className="active"
          >
            Login
          </Link>

          <Link to="/register">
            Register
          </Link>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <h1>Welcome Back</h1>

          <p>
            Sign in to your Darukaa.Earth account.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

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
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login"}
          </button>

        </form>

        {/* Register Link */}
        <p className="auth-bottom-text">
          Don't have an account?
          <Link to="/register">
            {" "}Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;