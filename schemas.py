from pydantic import BaseModel


class TareaBase(BaseModel):
    titulo: str
    descripcion: str | None = None
    completada: bool = False

class TareaCrear(TareaBase):
    pass

class TareaRespuesta(TareaBase):
    id: int

    class Config:
        from_attributes = True