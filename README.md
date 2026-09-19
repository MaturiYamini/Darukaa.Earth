# Darukaa.Earth 🌍

## Geospatial Environmental Data Analytics Platform

Darukaa.Earth is a full-stack geospatial data analytics platform for managing and visualizing environmental projects focused on carbon sequestration and biodiversity.

The platform allows users to create environmental projects, add multiple geographical sites, draw site boundaries using an interactive map, store geospatial data using PostgreSQL/PostGIS, and visualize environmental performance through interactive analytics.

---

## 🚀 Features

### 🔐 User Authentication
- User registration
- User login
- JWT-based authentication
- Secure password hashing
- Protected application routes
- Logout functionality

### 🌱 Project Management
- Create environmental projects
- View all projects
- View project details
- Add project descriptions
- Specify project type and location
- Manage multiple geographical sites per project

### 🗺️ Geospatial Site Management
- Create geographical sites
- Draw polygon boundaries using Mapbox
- Validate polygon geometry
- Store geographical coordinates using PostGIS
- Automatically calculate site area
- View individual site details

### 📊 Environmental Analytics
- Carbon sequestration visualization
- Biodiversity index visualization
- Project performance comparison
- Total project statistics
- Total geographical site statistics
- Total site area
- Interactive Chart.js visualizations

### 🗺️ Interactive Maps
- Mapbox GL JS integration
- Polygon-based site boundaries
- Interactive site selection
- Site information popups
- Automatic map fitting

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- React Router
- Axios
- Mapbox GL JS
- Mapbox GL Draw
- Chart.js
- React Chart.js 2
- Lucide React
- CSS

## Backend

- Python
- FastAPI
- SQLAlchemy
- GeoAlchemy2
- Shapely
- PostgreSQL
- PostGIS
- JWT
- Passlib
- bcrypt
- Uvicorn
