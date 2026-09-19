from pydantic import BaseModel
from typing import Optional


class SiteCreate(BaseModel):
    name: str
    description: Optional[str] = None
    geometry: dict


class SiteUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class SiteResponse(BaseModel):
    id: int
    project_id: int
    name: str
    description: Optional[str]
    area: Optional[float]
    geometry: dict