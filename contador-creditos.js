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

function normalizarArea(area) {
  let a = area.trim().toUpperCase();
  if (a.startsWith("CONTABILIDAD")) return "CONTABILIDAD E IMPUESTOS";
  if (a.startsWith("ECONOMÍA")) return "ECONOMÍA";
  if (a === "MÉTODOS CUANTITATIVOS" || a === "METODOS CUANTITATIVOS") return "MÉTODOS CUANTITATIVOS";
  if (a.includes("FLEXIBLE")) return "CREDITOS DE DISTRIBUCIÓN FLEXIBLE";
  if (a.startsWith("JURÍDICA") || a.startsWith("JURIDICA")) return "JURÍDICA";
  if (a.startsWith("ACTIVIDADES")) return "ACTIVIDADES INTEGRADORAS";
  if (a.startsWith("ADMINISTRACIÓN") || a.startsWith("ADMINISTRACION")) return "ADMINISTRACIÓN";
  return a;
}

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

function renderContadorCreditos() {
  let contador = document.getElementById("contador-creditos");
  if (!contador) {
    contador = document.createElement("div");
    contador.id = "contador-creditos";
    document.body.appendChild(contador);
  }

  let materiasTachadas = JSON.parse(localStorage.getItem("materiasTachadas") || "{}");
  let creditosPorArea = calcularCreditosPorArea(materiasTachadas, materiasData);
  let creditosTotales = Object.values(creditosPorArea).reduce((a, b) => a + b, 0);

  let html = `
    <button id="toggle-creditos" aria-label="Ocultar/mostrar contador de créditos" title="Ocultar/mostrar contador de créditos" style="position:absolute;top:10px;left:10px;background:#e75480;color:#fff;border:none;border-radius:50%;width:32px;height:32px;font-size:1.2em;cursor:pointer;">☰</button>
    <div id="creditos-content" style="margin-top:38px;">
      <h2>Créditos obtenidos</h2>
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
  html += `
      </ul>
    </div>
  `;

  contador.innerHTML = html;

  // Botón ocultar/mostrar
  const btn = document.getElementById("toggle-creditos");
  const content = document.getElementById("creditos-content");
  let oculto = localStorage.getItem("creditosOcultos") === "true";
  if (oculto) content.style.display = "none";
  btn.onclick = () => {
    oculto = !oculto;
    content.style.display = oculto ? "none" : "";
    localStorage.setItem("creditosOcultos", oculto ? "true" : "false");
    btn.title = oculto ? "Mostrar contador de créditos" : "Ocultar contador de créditos";
    btn.innerText = oculto ? "🛈" : "☰";
  };
  btn.title = oculto ? "Mostrar contador de créditos" : "Ocultar contador de créditos";
  btn.innerText = oculto ? "🛈" : "☰";
}

// Actualiza el contador cada vez que se actualiza la malla
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

window.addEventListener("DOMContentLoaded", instalarContadorCreditos);

// Extra: CSS para la solapa
(function(){
  const style = document.createElement("style");
  style.innerHTML = `
    #contador-creditos {
      position: fixed;
      top: 70px;
      right: 0;
      width: 280px;
      background: #fff6fb;
      border-left: 3px solid #e75480;
      border-radius: 16px 0 0 16px;
      box-shadow: -2px 2px 8px #e7548020;
      padding: 16px 18px 18px 18px;
      z-index: 10000;
      font-size: 1em;
      color: #a5426c;
      max-height: 80vh;
      overflow-y: auto;
      min-height: 250px;
      transition: right 0.2s;
    }
    #contador-creditos h2 {
      margin-top: 0; color: #e75480; font-size: 1.15em; text-align: left;
      margin-bottom: 8px;
    }
    #contador-creditos .total-creditos {
      font-size: 1.08em; margin-bottom: 12px;
    }
    #contador-creditos ul.areas-creditos {
      list-style: none; margin: 0; padding: 0;
    }
    #contador-creditos ul.areas-creditos li {
      margin-bottom: 7px; display: flex; align-items: center; gap: 6px;
    }
    #contador-creditos .falta { color: #d85b8f; font-weight: bold; font-size: 0.93em;}
    #contador-creditos .ok { color: #3bbc7c; font-weight: bold; }
    #contador-creditos .area-nombre { flex: 1 1 auto; }
    #contador-creditos .area-valor { font-family: monospace; margin-right: 2px; }
    #toggle-creditos {
      position: absolute;
      top: 10px;
      left: 10px;
      background: #e75480;
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      font-size: 1.2em;
      cursor: pointer;
      transition: background 0.2s;
    }
    #toggle-creditos:hover {
      background: #d13a6f;
    }
    @media (max-width: 800px) {
      #contador-creditos { position: static; width: 100%; max-width: 95vw; border-radius: 0 0 14px 14px; border-left: none; border-top: 3px solid #e75480; }
    }
  `;
  document.head.appendChild(style);
})();
