from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
from database import Base, SessionLocal, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # para desarrollo local está bien "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/", tags=["Home"])
def read_root():
    return {"mensaje": "API de tareas funcionando"}


@app.post(
    "/tareas",
    tags=["Tareas"],
    status_code=status.HTTP_201_CREATED,
    response_model=schemas.TareaRespuesta,
)
def crear_tarea(tarea: schemas.TareaCrear, db: Session = Depends(get_db)):  # noqa: B008
    nueva_tarea = models.Tarea(**tarea.model_dump())
    db.add(nueva_tarea)
    db.commit()
    db.refresh(nueva_tarea)
    return nueva_tarea


@app.get("/tareas", tags=["Tareas"], response_model=list[schemas.TareaRespuesta])
def listar_tareas(db: Session = Depends(get_db)):  # noqa: B008
    return db.query(models.Tarea).all()


@app.get("/tareas/{tarea_id}", tags=["Tareas"], response_model=schemas.TareaRespuesta)
def obtener_tarea(tarea_id: int, db: Session = Depends(get_db)):  # noqa: B008
    tarea = db.query(models.Tarea).filter(models.Tarea.id == tarea_id).first()
    if not tarea:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return tarea


@app.put("/tareas/{tarea_id}", tags=["Tareas"], response_model=schemas.TareaRespuesta)
def actualizar_tarea(
    tarea_id: int, tarea_actualizada: schemas.TareaCrear, db: Session = Depends(get_db)# noqa: B008
):  
    tarea = db.query(models.Tarea).filter(models.Tarea.id == tarea_id).first()
    if not tarea:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    tarea.titulo = tarea_actualizada.titulo
    tarea.descripcion = tarea_actualizada.descripcion
    tarea.completada = tarea_actualizada.completada
    db.commit()
    db.refresh(tarea)
    return tarea


@app.delete("/tareas/{tarea_id}", tags=["Tareas"], status_code=status.HTTP_200_OK)
def eliminar_tarea(tarea_id: int, db: Session = Depends(get_db)):  # noqa: B008
    tarea = db.query(models.Tarea).filter(models.Tarea.id == tarea_id).first()
    if not tarea:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")

    db.delete(tarea)
    db.commit()
    return db.query(models.Tarea).all()
