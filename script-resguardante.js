async function buscarEmpleado() {
  const idEmp = document.getElementById("idEmpInput").value.trim();
  if (!idEmp) {
    alert("Por favor ingresa un ID EMP válido.");
    return;
  }

  const url = `https://script.google.com/macros/s/AKfycbx6XbWnZoLgCQ8AzXLP-yxgFpz1eBh4-QSqwgwh7t_SLbCCQqtOtFfsOUxGKVe-G1Fb/exec?idEmp=${idEmp}&esPruebaLocal=true`;
  try {
    const response = await fetch(url);
    const data = await response.json();
  
    // 🛑 Validación si no se encontraron coincidencias
    if (!Array.isArray(data) || data.length === 0) {
      const resumenBox = document.getElementById("resumenBox");
      if (resumenBox) {
        resumenBox.textContent = "No se encontraron bienes para el ID ingresado.";
        resumenBox.style.color = "#a94442"; // rojo institucional
      }
      limpiarCampos();
      return;
    }

    // 🟩 Mostrar recuadro de confirmación antes de desplegar datos
mostrarRecuadroConfirmacion(idEmp, "(Nombre no disponible)", data.length);


// ✅ Mostrar el recuadro
document.getElementById("recuadroConfirmacion").style.display = "block";

// 🔍 Depuración
console.log("Mostrando recuadro de confirmación");
console.log("Recuadro visible:", document.getElementById("recuadroConfirmacion").style.display);

// Esperar confirmación del usuario
document.getElementById("botonAceptarConfirmacion").onclick = () => {
  document.getElementById("recuadroConfirmacion").style.display = "none"; // oculta el recuadro
  const r = document.getElementById("recuadroConfirmacion"); /* ultima modificacion*/
r.style.display = "block";
r.style.position = "fixed";
r.style.top = "100px";
r.style.left = "50%";
r.style.transform = "translateX(-50%)";
r.style.zIndex = "9999";
r.style.border = "2px solid red";

  // Mostrar resumen institucional y mensaje
  const resumenBox = document.getElementById("resumenBox");
  if (resumenBox) {
    resumenBox.textContent = `Se encontraron ${data.length} bienes para el ID EMP "${idEmp}". ${plantilla.nombre} cuenta con ${data.length} bienes a su resguardo.`;
    resumenBox.style.color = "#006341";
  }

  // Desplazar hacia la tabla
  document.getElementById("tablaBienes").scrollIntoView({ behavior: "smooth" });


      // Limpiar campos del resguardante (no disponibles en esta consulta)
      document.getElementById("nombreResguardante").textContent = "(No disponible)";
      document.getElementById("numeroEmpleado").textContent = idEmp;
      document.getElementById("rfcEmpleado").textContent = "(No disponible)";
      document.getElementById("puestoEmpleado").textContent = "(No disponible)";
      document.getElementById("regimenContratacion").textContent = "(No disponible)";
      document.getElementById("areaAdscripcion").textContent = "(No disponible)";
      document.getElementById("unidadAdscripcion").textContent = "(No disponible)";

      // Mostrar tabla de bienes
      const tabla = document.getElementById("tablaBienes");
      tabla.innerHTML = "";
      data.forEach((bien, index) => {
        const filaHTML = `
          <div class="fila-tabla">
            <div class="celda-tabla">${index + 1}</div>
            <div class="celda-tabla">${bien.claveCambs}</div>
            <div class="celda-tabla ancho-descripcion">${bien.descripcion}</div>
            <div class="celda-tabla">${bien.marca}</div>
            <div class="celda-tabla">${bien.modelo}</div>
            <div class="celda-tabla">${bien.serie}</div>
            <div class="celda-tabla">${bien.placas}</div>
            <div class="celda-tabla">${bien.motor}</div>
            <div class="celda-tabla ancho-costo">${bien.costo}</div>
            <div class="celda-tabla ancho-inventario">${bien.inventario}</div>
            <div class="celda-tabla ancho-observaciones">${bien.observaciones}</div>
        `;
        const fila = document.createElement("div");
fila.className = "fila-bien";
fila.innerHTML = filaHTML;
tabla.appendChild(fila);
      });
    };

  } catch (error) {
    alert("Error al consultar los datos.");
    console.error(error);
  }
}
function limpiarCampos() {
  document.getElementById("idEmpInput").value = "";
  document.getElementById("nombreResguardante").textContent = "";
  document.getElementById("numeroEmpleado").textContent = "";
  document.getElementById("rfcEmpleado").textContent = "";
  document.getElementById("puestoEmpleado").textContent = "";
  document.getElementById("regimenContratacion").textContent = "";
  document.getElementById("areaAdscripcion").textContent = "";
  document.getElementById("unidadAdscripcion").textContent = "";
  document.getElementById("tablaBienes").innerHTML = "";

  const resumenBox = document.getElementById("resumenBox");
  if (resumenBox) {
    resumenBox.textContent = "";
    resumenBox.style.color = "#000";
  }
}

// 🔙 Botón INICIO
document.querySelector(".boton-inicio").addEventListener("click", () => {
  window.location.href = "index.html";
});

// 🔍 Función principal de búsqueda
async function buscarEmpleado() {
  console.log("🟢 buscarEmpleado() fue activado");

  const idEmp = document.getElementById("idEmpInput").value.trim();
  console.log("ID ingresado:", idEmp);

  if (!idEmp) {
    alert("Por favor ingresa un NÚMERO DE EMPLEADO válido.");
    return;
  }

  const url = `https://script.google.com/macros/s/AKfycbx6XbWnZoLgCQ8AzXLP-yxgFpz1eBh4-QSqwgwh7t_SLbCCQqtOtFfsOUxGKVe-G1Fb/exec?idEmp=${idEmp}&esPruebaLocal=true`;
  console.log("URL generada:", url);

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    console.log("📦 Datos recibidos:", datos);

    if (datos.plantilla && datos.general) {
      mostrarConfirmacion(datos.plantilla, datos.general);
    } else if (datos.estado === "sinCoincidencias") {
      alert(datos.mensaje);
      limpiarCampos();
    } else {
      alert("No se encontraron registros para el NÚMERO DE EMPLEADO ingresado.");
      limpiarCampos();
    }
  } catch (error) {
    alert("Error al consultar los datos.");
    console.error("❌ Error en fetch:", error);
  }
}

// 🧹 Función para limpiar campos
function mostrarRecuadroConfirmacion(idEmp, nombre, totalBienes) {
  const r = document.getElementById("recuadroConfirmacion");
  document.getElementById("idConfirmado").textContent = idEmp;
  document.getElementById("nombreConfirmado").textContent = nombre || "(Nombre no disponible)";
  document.getElementById("totalBienes").textContent = totalBienes;

  r.style.display = "block";
  r.style.position = "fixed";
  r.style.top = "100px";
  r.style.left = "50%";
  r.style.transform = "translateX(-50%)";
  r.style.zIndex = "9999";
  r.style.border = "2px solid #666";
  r.style.backgroundColor = "#f9f9f9";
  r.style.padding = "20px";
  r.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
  r.style.borderRadius = "6px";
}

function limpiarCampos() {
  document.getElementById("idEmpInput").value = "";
  document.getElementById("nombreResguardante").textContent = "";
  document.getElementById("numeroEmpleado").textContent = "";
  document.getElementById("rfcEmpleado").textContent = "";
  document.getElementById("puestoEmpleado").textContent = "";
  document.getElementById("regimenContratacion").textContent = "";
  document.getElementById("areaAdscripcion").textContent = "";
  document.getElementById("unidadAdscripcion").textContent = "";
  document.getElementById("tablaBienes").innerHTML = "";
}

// 🧾 Función para mostrar datos y construir tabla
function mostrarConfirmacion(plantilla, bienes) {
  console.log("✅ Mostrando datos del resguardante...");

  // Datos institucionales
  document.getElementById("nombreResguardante").textContent = plantilla.nombre;
  document.getElementById("numeroEmpleado").textContent = plantilla.idEmp;
  document.getElementById("rfcEmpleado").textContent = plantilla.rfc;
  document.getElementById("puestoEmpleado").textContent = plantilla.puesto;
  document.getElementById("regimenContratacion").textContent = plantilla.regimen;
  document.getElementById("areaAdscripcion").textContent = plantilla.area;
  document.getElementById("unidadAdscripcion").textContent = plantilla.adscripcion;

  // 🟩 Mostrar recuadro de confirmación
  mostrarRecuadroConfirmacion(plantilla.idEmp, plantilla.nombre, bienes.length);
  document.getElementById("contenedorBotonExcel").style.display = bienes.length > 0 ? "block" : "none"; //boton de descarga//

  // Construcción de tabla
  const contenedor = document.getElementById("tablaBienes");
  contenedor.innerHTML = "";


  // 🔷 Encabezado de columnas
  const encabezado = document.createElement("div");
  encabezado.className = "encabezado-tabla";
  encabezado.innerHTML = `
    <div class="celda-encabezado">CON.</div>
    <div class="celda-encabezado">CLAVE CAMB.</div>
    <div class="celda-encabezado ancho-descripcion">DESCRIPCIÓN</div>
    <div class="celda-encabezado">MARCA</div>
    <div class="celda-encabezado">MODELO</div>
    <div class="celda-encabezado">SERIE</div>
    <div class="celda-encabezado">PLACAS</div>
    <div class="celda-encabezado">MOTOR</div>
    <div class="celda-encabezado ancho-costo">COSTO</div>
    <div class="celda-encabezado ancho-inventario">NÚMERO DE INVENTARIO</div>
    <div class="celda-encabezado ancho-observaciones">OBSERVACIONES</div>
  `;
  contenedor.appendChild(encabezado);

  // 🔷 Filas de bienes
bienes.forEach((bien, index) => {
  const fila = document.createElement("div");
  fila.className = "fila-bien";
  fila.innerHTML = `
    <div class="celda-dato">${index + 1}</div>
    <div class="celda-dato">${bien.claveCambs}</div>
    <div class="celda-dato celda-descripcion">${bien.descripcion}</div>
    <div class="celda-dato">${bien.marca}</div>
    <div class="celda-dato">${bien.modelo}</div>
    <div class="celda-dato">${bien.serie}</div>
    <div class="celda-dato">${bien.placas}</div>
    <div class="celda-dato">${bien.motor}</div>
    <div class="celda-dato ancho-costo">${bien.costo}</div>
    <div class="celda-dato ancho-inventario">${bien.inventario}</div>
    <div class="celda-dato ancho-observaciones">${bien.observaciones}</div>
  `;
  contenedor.appendChild(fila);
});

// 🧭 Ajuste dinámico de alineación vertical en DESCRIPCIÓN
document.querySelectorAll(".celda-descripcion").forEach(celda => {
  const lineHeight = parseFloat(getComputedStyle(celda).lineHeight);
  const contentHeight = celda.scrollHeight;

  // 🧪 Diagnóstico en consola
  console.log("contentHeight:", contentHeight);
  console.log("lineHeight:", lineHeight);

  // 📏 Evaluar número de líneas y altura real
  const lines = celda.textContent.split('\n').length;

  if (lines > 1 || contentHeight > lineHeight * 2) {
    celda.classList.add("arriba");
    celda.classList.remove("centrada");
  } else {
    celda.classList.add("centrada");
    celda.classList.remove("arriba");
  }
});
// 🧮 Preparar ordenamiento por Numero de inventario
const filas = Array.from(document.querySelectorAll(".fila-bien"));

// Detectar índice de columna Numero de inventario
const indiceNumeroInventario = 9; // ← segunda celda en cada fila (ajustar si cambia estructura)

// 🧮 Separar filas por tipo de dato en Numero de inventario
const numericos = [];
const alfabeticos = [];

filas.forEach(fila => {
  const celdas = fila.querySelectorAll(".celda-dato");
if (celdas.length <= indiceNumeroInventario) return;
const celda = celdas[indiceNumeroInventario];
  const valor = celda?.textContent?.trim() || "";

  if (/^\d/.test(valor)) {
    numericos.push({ fila, valor });
  } else {
    alfabeticos.push({ fila, valor });
  }
});
// 🔢 Ordenar cada grupo por valor ascendente
numericos.sort((a, b) => a.valor.localeCompare(b.valor));
alfabeticos.sort((a, b) => a.valor.localeCompare(b.valor));
// 🧱 Reconstruir tabla ordenada
contenedor.innerHTML = "";
if (encabezado) contenedor.appendChild(encabezado);

[...numericos, ...alfabeticos].forEach(obj => contenedor.appendChild(obj.fila));
// 🔁 Reasignar numeración consecutiva en columna CON.
const filasFinales = contenedor.querySelectorAll(".fila-bien");
filasFinales.forEach((fila, index) => {
  const celdaConsecutivo = fila.querySelector(".celda-dato");
  if (celdaConsecutivo) {
    celdaConsecutivo.textContent = index + 1;
  }
});
}
// 🟢 Botón ACEPTAR del recuadro de confirmación
document.getElementById("botonAceptarConfirmacion").onclick = () => {
  // Ocultar el recuadro
  document.getElementById("recuadroConfirmacion").style.display = "none";

  // Mostrar resumen institucional
  const idEmp = document.getElementById("idConfirmado").textContent;
  const nombre = document.getElementById("nombreConfirmado").textContent;
  const total = document.getElementById("totalBienes").textContent;

  const resumenBox = document.getElementById("resumenBox");
  if (resumenBox) {
    resumenBox.textContent = `Se encontraron ${total} bienes para el ID EMP "${idEmp}". ${nombre} cuenta con ${total} bienes a su resguardo.`;
    resumenBox.style.color = "#006341";
    resumenBox.style.fontWeight = "bold";
    resumenBox.style.padding = "10px 0";
  }

  // Desplazar hacia la tabla
  document.getElementById("tablaBienes").scrollIntoView({ behavior: "smooth" });
};

// 📥 Función para generar y descargar Excel
document.getElementById("botonDescargarExcel").onclick = () => {
  const idEmp = document.getElementById("idConfirmado").textContent;
  const nombre = document.getElementById("nombreConfirmado").textContent;
  const total = document.getElementById("totalBienes").textContent;

  const filas = Array.from(document.querySelectorAll(".fila-bien"));
  const datos = filas.map(fila => {
    const celdas = fila.querySelectorAll(".celda-dato");
    return Array.from(celdas).map(celda => celda.textContent.trim());
  });

  const encabezados = [
    "CONSECUTIVO", "CLAVE CAMBS", "DESCRIPCIÓN", "MARCA", "MODELO",
    "SERIE", "PLACAS", "MOTOR", "COSTO", "NÚMERO DE INVENTARIO", "OBSERVACIONES"
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([encabezados, ...datos]);

  XLSX.utils.book_append_sheet(wb, ws, "Bienes");

  const nombreArchivo = `Bienes_${idEmp}_${nombre.replace(/\s+/g, "_")}.xlsx`;
  XLSX.writeFile(wb, nombreArchivo);
};


// ✅ Exponer funciones al ámbito global
window.buscarEmpleado = buscarEmpleado;
window.limpiarCampos = limpiarCampos;