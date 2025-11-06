// Espera a que el contenido del documento HTML esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {

  // Obtiene referencias a los elementos del formulario y la tabla
  const btnConsultar = document.getElementById("consultarBtn");      // Botón de consulta
  const inputNumero = document.getElementById("numeroEmpleado");     // Campo de entrada
  const tabla = document.getElementById("datosEmpleado");            // Tabla de resultados

  // Asigna una función al evento click del botón "Consultar"
  btnConsultar.addEventListener("click", () => {

    // Obtiene el número ingresado y elimina espacios en blanco
    const numero = inputNumero.value.trim();

    // Verifica que se haya ingresado un número válido
    if (!numero) {
      alert("Ingresa un número de empleado válido");
      return;
    }

    // Realiza una consulta a la API de Apps Script usando el número ingresado
    fetch(`https://script.google.com/macros/s/AKfycbx6XbWnZoLgCQ8AzXLP-yxgFpz1eBh4-QSqwgwh7t_SLbCCQqtOtFfsOUxGKVe-G1Fb/exec?numeroEmpleado=${numero}`)
      .then(response => response.json()) // Convierte la respuesta en formato JSON
      .then(data => {

        // Si la API devuelve un error, muestra alerta y oculta la tabla
        if (data.error) {
          alert(data.error);
          tabla.style.display = "none";
          return;
        }

        // Si los datos son válidos, los inserta en las celdas correspondientes
        document.getElementById("nombre").textContent = data.nombre;
        document.getElementById("folio").textContent = data.folio;
        document.getElementById("rfc").textContent = data.rfc;
        document.getElementById("puesto").textContent = data.puesto;
        document.getElementById("contrato").textContent = data.contrato;
        document.getElementById("area").textContent = data.area;
        document.getElementById("unidad").textContent = data.unidad;

        // Muestra la tabla con los datos del empleado
        tabla.style.display = "table";
      })
      .catch(error => {
        // Si ocurre un error en la conexión o en el código, lo muestra en consola y alerta al usuario
        console.error("Error al consultar:", error);
        alert("Hubo un problema al consultar los datos.");
      });
  });
});