// Créditos mínimos por área y total
const CREDITOS_MINIMOS = {
  "ECONOMÍA": 10,
  "MÉTODOS CUANTITATIVOS": 30,
  "CONTABILIDAD E IMPUESTOS": 50,
  "CREDITOS DE DISTRIBUCIÓN FLEXIBLE": 30,
  "JURÍDICA": 30,
  "ACTIVIDADES INTEGRADORAS": 15,
  "ADMINISTRACIÓN": 60
};
const CREDITOS_TOTALES = 225;

// Normalización de nombres de áreas
function normalizarArea(area) {
  let a = area.trim().toUpperCase();
  if (a.startsWith("CONTABILIDAD")) return "CONTABILIDAD E IMPUESTOS";
  if (a.startsWith("ECONOMÍA")) return "ECONOMÍA";
  if (a === "MÉTODOS CUANTITATIVOS" || a === "METODOS CUANTITATIVOS") return "MÉTODOS CUANTITATIVOS";
  if (a.includes("FLEXIBLE")) return "CREDITOS DE DISTRIBUCIÓN FLEXIBLE";
  if (a.includes("HUMANÍSTICAS") || a.includes("HUMANISTICAS")) return "CIENCIAS SOCIALES Y HUMANÍSTICAS";
  if (a.startsWith("JURÍDICA") || a.startsWith("JURIDICA")) return "JURÍDICA";
  if (a.startsWith("ACTIVIDADES")) return "ACTIVIDADES INTEGRADORAS";
  if (a.startsWith("ADMINISTRACIÓN") || a.startsWith("ADMINISTRACION")) return "ADMINISTRACIÓN";
  return a;
}

// Calcula créditos por área
function calcularCreditosPorArea(materiasTachadas, materiasData) {
  let res = {};
  Object.keys(CREDITOS_MINIMOS).forEach(area => res[area] = 0);
  materiasData.forEach(([_, materia, creditos, area]) => {
    if (materiasTachadas[materia]) {
      let norm = normalizarArea(area);
      if (res.hasOwnProperty(norm)) res[norm] += creditos;
    }
  });
  return res;
}

// Render del contador lateral
function renderContadorCreditos() {
  // Si no existe, crear el div lateral
  let contador = document.getElementById("contador-creditos");
  if (!contador) {
    contador = document.createElement("div");
    contador.id = "contador-creditos";
    document.body.appendChild(contador);
  }

  // Tomar el estado actual
  let materiasTachadas = JSON.parse(localStorage.getItem("materiasTachadas") || "{}");
  let creditosPorArea = calcularCreditosPorArea(materiasTachadas, materiasData);
  let creditosTotales = Object.values(creditosPorArea).reduce((a, b) => a + b, 0);

  // Construir HTML
  let html = `<h2>Créditos obtenidos</h2>
    <div class="total-creditos"><b>Total:</b> ${creditosTotales} / ${CREDITOS_TOTALES}
      <span class="${creditosTotales >= CREDITOS_TOTALES ? 'ok' : 'falta'}">
        ${creditosTotales >= CREDITOS_TOTALES ? '✔' : (CREDITOS_TOTALES-creditosTotales)+' faltan'}
      </span>
    </div>
    <ul class="areas-creditos">`;
  Object.keys(CREDITOS_MINIMOS).forEach(area => {
    let obtenidos = creditosPorArea[area];
    let req = CREDITOS_MINIMOS[area];
    html += `<li>
      <span class="area-nombre">${area}:</span> 
      <span class="area-valor">${obtenidos} / ${req}</span> 
      <span class="${obtenidos >= req ? 'ok' : 'falta'}">
        ${obtenidos >= req ? '✔' : (req-obtenidos)+' faltan'}
      </span>
    </li>`;
  });
  html += "</ul>";

  contador.innerHTML = html;
}

// Lógica para actualizar al cambiar materias
function instalarContadorCreditos() {
  if (typeof renderMalla === "function") {
    let _oldRenderMalla = renderMalla;
    renderMalla = function() {
      _oldRenderMalla();
      renderContadorCreditos();
    };
  }
  renderContadorCreditos();
}

// Instalar contador al cargar
window.addEventListener("DOMContentLoaded", instalarContadorCreditos);
