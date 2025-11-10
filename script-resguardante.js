// 🟢 Botón INICIO
document.querySelector(".boton-inicio").addEventListener("click", () => {
  window.location.href = "index.html";
});

// 🔍 Función principal de búsqueda (Versión corregida y única)
async function buscarEmpleado() {
  console.log("🟢 buscarEmpleado() fue activado");

  const idEmp = document.getElementById("idEmpInput").value.trim();
  console.log("ID ingresado:", idEmp);

  if (!idEmp) {
    alert("Por favor ingresa un NÚMERO DE EMPLEADO válido.");
    return;
  }

  // Se usa la URL que me diste en el último mensaje
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

// 🧹 Función para limpiar campos (Versión única)
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

// 🟩 Función para mostrar recuadro de confirmación (Versión única)
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

// 🧾 Función para mostrar datos y construir tabla
function mostrarConfirmacion(plantilla, bienes) {
  console.log("✅ Mostrando datos del resguardante...");
  // Datos institucionales
  document.getElementById("nombreResguardante").textContent = plantilla.nombre;
  document.getElementById("numeroEmpleado").textContent = plantilla.idEmp; // Usaba plantilla.idEmp, lo cual es correcto
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
  
  // 🧮 Preparar ordenamiento y alineación (tu lógica avanzada)
  // ... (Tu código de ordenamiento y alineación va aquí, ya estaba bien)
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
    const indiceNumeroInventario = 9;
    // ← segunda celda en cada fila (ajustar si cambia estructura)

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
    resumenBox.textContent = `Se encontraron ${total} bienes para el ID EMP "${idEmp}".
${nombre} cuenta con ${total} bienes a su resguardo.`;
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

// ✅ Exponer funciones al ámbito global (si es necesario)
window.buscarEmpleado = buscarEmpleado;
window.limpiarCampos = limpiarCampos;