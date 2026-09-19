from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from shapely.geometry import shape
from geoalchemy2.shape import from_shape, to_shape

from app.database import get_db
from app.models.site import Site
from app.models.project import Project
from app.models.user import User
from app.schemas.site import (
    SiteCreate,
    SiteUpdate,
    SiteResponse
)
from app.utils.dependencies import get_current_user


# ==========================================
# ROUTER
# ==========================================

router = APIRouter()


# ==========================================
# CREATE SITE
# ==========================================

@router.post(
    "/projects/{project_id}/sites",
    response_model=SiteResponse,
    status_code=status.HTTP_201_CREATED
)
def create_site(
    project_id: int,
    site_data: SiteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check whether project belongs to current user
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # ======================================
    # Validate GeoJSON
    # ======================================

    try:
        polygon = shape(site_data.geometry)

        if polygon.geom_type != "Polygon":
            raise ValueError(
                "Geometry must be a Polygon"
            )

        if not polygon.is_valid:
            raise ValueError(
                "Invalid polygon geometry"
            )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid geometry: {str(e)}"
        )

    # ======================================
    # Convert Shapely Polygon to PostGIS
    # ======================================

    postgis_geometry = from_shape(
        polygon,
        srid=4326
    )

    # ======================================
    # Create Site
    # ======================================

    new_site = Site(
        project_id=project_id,
        name=site_data.name,
        description=site_data.description,
        geometry=postgis_geometry
    )

    db.add(new_site)
    db.commit()
    db.refresh(new_site)

    # ======================================
    # Calculate Area using PostGIS
    # ======================================
    #
    # EPSG:4326 = latitude/longitude
    # EPSG:6933 = equal-area projection
    # Result = square meters
    #

    area = db.query(
        func.ST_Area(
            func.ST_Transform(
                Site.geometry,
                6933
            )
        )
    ).filter(
        Site.id == new_site.id
    ).scalar()

    # Store area in database
    new_site.area = area

    db.commit()
    db.refresh(new_site)

    # ======================================
    # Convert geometry back to GeoJSON
    # ======================================

    geometry = to_shape(
        new_site.geometry
    ).__geo_interface__

    return {
        "id": new_site.id,
        "project_id": new_site.project_id,
        "name": new_site.name,
        "description": new_site.description,
        "area": new_site.area,
        "geometry": geometry
    }


# ==========================================
# GET ALL SITES FOR A PROJECT
# ==========================================

@router.get(
    "/projects/{project_id}/sites",
    response_model=list[SiteResponse]
)
def get_project_sites(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Check project ownership
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # Get sites
    sites = db.query(Site).filter(
        Site.project_id == project_id
    ).all()

    result = []

    for site in sites:

        geometry = to_shape(
            site.geometry
        ).__geo_interface__

        result.append({
            "id": site.id,
            "project_id": site.project_id,
            "name": site.name,
            "description": site.description,
            "area": site.area,
            "geometry": geometry
        })

    return result


# ==========================================
# GET SINGLE SITE
# ==========================================

@router.get(
    "/sites/{site_id}",
    response_model=SiteResponse
)
def get_site(
    site_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    site = db.query(Site).join(
        Project,
        Site.project_id == Project.id
    ).filter(
        Site.id == site_id,
        Project.user_id == current_user.id
    ).first()

    if not site:
        raise HTTPException(
            status_code=404,
            detail="Site not found"
        )

    geometry = to_shape(
        site.geometry
    ).__geo_interface__

    return {
        "id": site.id,
        "project_id": site.project_id,
        "name": site.name,
        "description": site.description,
        "area": site.area,
        "geometry": geometry
    }


# ==========================================
# UPDATE SITE
# ==========================================

@router.put(
    "/sites/{site_id}",
    response_model=SiteResponse
)
def update_site(
    site_id: int,
    site_data: SiteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    site = db.query(Site).join(
        Project,
        Site.project_id == Project.id
    ).filter(
        Site.id == site_id,
        Project.user_id == current_user.id
    ).first()

    if not site:
        raise HTTPException(
            status_code=404,
            detail="Site not found"
        )

    # Update name
    if site_data.name is not None:
        site.name = site_data.name

    # Update description
    if site_data.description is not None:
        site.description = site_data.description

    db.commit()
    db.refresh(site)

    geometry = to_shape(
        site.geometry
    ).__geo_interface__

    return {
        "id": site.id,
        "project_id": site.project_id,
        "name": site.name,
        "description": site.description,
        "area": site.area,
        "geometry": geometry
    }


# ==========================================
# DELETE SITE
# ==========================================

@router.delete(
    "/sites/{site_id}"
)
def delete_site(
    site_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    site = db.query(Site).join(
        Project,
        Site.project_id == Project.id
    ).filter(
        Site.id == site_id,
        Project.user_id == current_user.id
    ).first()

    if not site:
        raise HTTPException(
            status_code=404,
            detail="Site not found"
        )

    db.delete(site)
    db.commit()

    return {
        "message": "Site deleted successfully"
    }