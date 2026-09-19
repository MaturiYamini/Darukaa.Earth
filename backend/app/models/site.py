from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Float,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from datetime import datetime

from app.database import Base


class Site(Base):
    __tablename__ = "sites"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False
    )

    name = Column(
        String(150),
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    area = Column(
        Float,
        nullable=True
    )

    geometry = Column(
        Geometry(
            geometry_type="POLYGON",
            srid=4326
        ),
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    project = relationship(
        "Project",
        back_populates="sites"
    )