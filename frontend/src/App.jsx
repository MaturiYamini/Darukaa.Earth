import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing/Landing";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import Dashboard from "./pages/Dashboard/Dashboard";

import ProjectList from "./pages/Projects/ProjectList";
import CreateProject from "./pages/Projects/CreateProject";
import ProjectDetails from "./pages/Projects/ProjectDetails";

import CreateSite from "./pages/Sites/CreateSite";
import SiteList from "./pages/Sites/SiteList";
import SiteDetails from "./pages/Sites/SiteDetails";

import Analytics from "./pages/Analytics/Analytics";

function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <Routes>

          {/* Public Pages */}

          <Route
            path="/"
            element={<Landing />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* Protected Pages */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/new"
            element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:id/sites/new"
            element={
              <ProtectedRoute>
                <CreateSite />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sites"
            element={
              <ProtectedRoute>
                <SiteList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sites/:id"
            element={
              <ProtectedRoute>
                <SiteDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          {/* Unknown route */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;