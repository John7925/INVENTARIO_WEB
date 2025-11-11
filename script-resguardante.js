// ===== Sesión de autorización (localStorage) =====
const CLAVE_SESION = "inventario_estado_autorizacion";
const TTL_MINUTOS = 60; // tiempo para revalidar en segundo plano

function obtenerEstado() {
  try {
    const raw = localStorage.getItem(CLAVE_SESION);
    return raw ? JSON.parse(raw) : null;
  } catch (_e) {
    return null;
  }
}

function guardarEstado({ correo, autorizado }) {
  const estado = {
    correo: String(correo || "").trim(),
    autorizado: !!autorizado,
    timestamp: Date.now()
  };
  localStorage.setItem(CLAVE_SESION, JSON.stringify(estado));
  return estado;
}

function limpiarEstado() {
  localStorage.removeItem(CLAVE_SESION);
}

function minutosDesde(ts) {
  return (Date.now() - ts) / (1000 * 60);
}

function requiereRevalidar(estado) {
  if (!estado || !estado.autorizado) return true;
  return minutosDesde(estado.timestamp) >= TTL_MINUTOS;
}

// 🟢 Botón INICIO
const botonInicio = document.querySelector(".boton-inicio");
if (botonInicio) {
  botonInicio.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// ===== Validación con Apps Script =====
const URL_BASE = "https://script.google.com/macros/s/AKfycbxu6fuNY-Vc4fIYiPNTGhobaAsbkgBOD9koCgOvbZPUNy6skr2YTuZ_FE3WGVDbXlFm/exec";

function validarAcceso(correo) {
  const url = `${URL_BASE}?accion=validar&correo=${encodeURIComponent(correo)}`;
  return fetch(url)
    .then(r => r.text())
    .then(texto => {
      if (texto.trim() === "autorizado") return true;
      throw new Error("denegado");
    });
}

function revalidar(correo) {
  return validarAcceso(correo).then(() => {
    guardarEstado({ correo, autorizado: true });
  });
}

function enviarSolicitud({ nombre, correo }) {
  const url = `${URL_BASE}?accion=solicitud&nombre=${encodeURIComponent(nombre)}&correo=${encodeURIComponent(correo)}`;
  return fetch(url).then(r => r.text());
}

// ===== Control de pantallas =====
function mostrarCargando(mensaje = "Validando acceso…") {
  document.getElementById("loader").textContent = mensaje;
  document.getElementById("loader").style.display = "block";
  document.getElementById("solicitud").style.display = "none";
  document.getElementById("menuPrincipal").style.display = "none";
}

function mostrarSolicitud() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("solicitud").style.display = "block";
  document.getElementById("menuPrincipal").style.display = "none";
}

function mostrarMenu() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("solicitud").style.display = "none";
  document.getElementById("menuPrincipal").style.display = "block";
}

// ===== Flujo principal =====
document.addEventListener("DOMContentLoaded", () => {
  const estado = obtenerEstado();

  if (estado && estado.autorizado) {
    mostrarMenu();

    // 🟩 Mensaje institucional de bienvenida
    const resumenBox = document.getElementById("resumenBox");
    if (resumenBox) {
      resumenBox.textContent = `Bienvenido, ${estado.correo}. Tu sesión está activa.`;
      resumenBox.style.color = "#006341";
      resumenBox.style.fontWeight = "bold";
      resumenBox.style.padding = "10px 0";
    }

    if (requiereRevalidar(estado)) {
      revalidar(estado.correo).catch(() => {
        mostrarSolicitud();
        limpiarEstado();
      });
    }
  } else if (estado && estado.correo) {
    mostrarCargando("Validando acceso…");
    revalidar(estado.correo)
      .then(() => {
        guardarEstado({ correo: estado.correo, autorizado: true });
        mostrarMenu();
      })
      .catch(() => {
        mostrarSolicitud();
        limpiarEstado();
      });
  } else {
    mostrarSolicitud();
  }

  // 🔹 Botón de logout
  const botonLogout = document.getElementById("botonLogout");
  if (botonLogout) {
    botonLogout.addEventListener("click", () => {
      limpiarEstado();
      mostrarSolicitud();
      alert("Sesión cerrada correctamente.");
    });
  }

  // 🔹 Manejo del formulario de solicitud
  const form = document.getElementById("formSolicitud");
  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();

      const nombre = document.getElementById("nombre").value.trim();
      const correo = document.getElementById("correo").value.trim();

      if (!nombre || !correo) {
        alert("Por favor ingresa nombre y correo.");
        return;
      }

      mostrarCargando("Enviando solicitud…");

      enviarSolicitud({ nombre, correo })
        .then(msg => {
          document.getElementById("mensajeSolicitud").textContent = msg;
          guardarEstado({ correo, autorizado: false });
          return revalidar(correo);
        })
        .then(() => {
          guardarEstado({ correo, autorizado: true });
          mostrarMenu();
        })
        .catch(() => {
          mostrarSolicitud();
          limpiarEstado();
        });
    });
  }
});

// ✅ Exponer funciones globales
window.buscarEmpleado = buscarEmpleado;
window.limpiarCampos = limpiarCampos;
