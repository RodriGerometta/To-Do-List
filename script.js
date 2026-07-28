const API_URL = "http://127.0.0.1:8000";

const lista = document.getElementById("lista");
const form = document.getElementById("form-nueva");
const inputTitulo = document.getElementById("input-titulo");
const inputDesc = document.getElementById("input-desc");
const contador = document.getElementById("contador");
const btnCrear = document.getElementById("btn-crear");

async function cargarTareas() {
    lista.innerHTML = `<li class="vacio">Cargando...</li>`;
    try {
        const res = await fetch(`${API_URL}/tareas`);
        if (!res.ok) throw new Error("Error al obtener tareas");
        const tareas = await res.json();
        renderizar(tareas);
    } catch (err) {
        lista.innerHTML = `<li class="error">No se pudo conectar con la API en ${API_URL}.<br>¿Está corriendo el servidor y con CORS habilitado?</li>`;
    }
}

function renderizar(tareas) {
    if (tareas.length === 0) {
        lista.innerHTML = `<li class="vacio">No hay tareas todavía.</li>`;
        contador.textContent = "0 pendientes";
        return;
    }

    lista.innerHTML = "";
    tareas.forEach(t => {
        const li = document.createElement("li");
        li.className = "tarea" + (t.completada ? " completada" : "");
        li.innerHTML = `
        <input type="checkbox" class="chk" ${t.completada ? "checked" : ""} data-id="${t.id}">
        <div class="contenido">
          <div class="titulo"><span class="id-tag">#${t.id}</span>${escapeHtml(t.titulo)}</div>
          ${t.descripcion ? `<div class="desc">${escapeHtml(t.descripcion)}</div>` : ""}
        </div>
        <button class="borrar" data-id="${t.id}">Borrar</button>
      `;
        lista.appendChild(li);
    });

    const pendientes = tareas.filter(t => !t.completada).length;
    contador.textContent = `${pendientes} pendiente${pendientes === 1 ? "" : "s"}`;
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const titulo = inputTitulo.value.trim();
    if (!titulo) return;

    btnCrear.disabled = true;
    btnCrear.textContent = "...";

    try {
        const res = await fetch(`${API_URL}/tareas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                titulo,
                descripcion: inputDesc.value.trim() || null,
                completada: false
            })
        });
        if (!res.ok) throw new Error("Error al crear tarea");
        inputTitulo.value = "";
        inputDesc.value = "";
        await cargarTareas();
    } catch (err) {
        alert("No se pudo crear la tarea. Revisá que la API esté corriendo.");
    } finally {
        btnCrear.disabled = false;
        btnCrear.textContent = "Agregar";
    }
});

lista.addEventListener("change", async (e) => {
    if (!e.target.classList.contains("chk")) return;
    const id = e.target.dataset.id;
    const li = e.target.closest("li");

    try {
        const resActual = await fetch(`${API_URL}/tareas/${id}`);
        const tareaActual = await resActual.json();

        const res = await fetch(`${API_URL}/tareas/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                titulo: tareaActual.titulo,
                descripcion: tareaActual.descripcion,
                completada: e.target.checked
            })
        });
        if (!res.ok) throw new Error("Error al actualizar");
        li.classList.toggle("completada", e.target.checked);
        const pendientes = document.querySelectorAll("li.tarea:not(.completada)").length;
        contador.textContent = `${pendientes} pendiente${pendientes === 1 ? "" : "s"}`;
    } catch (err) {
        alert("No se pudo actualizar la tarea.");
        cargarTareas();
    }
});

lista.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("borrar")) return;
    const id = e.target.dataset.id;

    try {
        const res = await fetch(`${API_URL}/tareas/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al borrar");
        await cargarTareas();
    } catch (err) {
        alert("No se pudo borrar la tarea.");
    }
});

cargarTareas();