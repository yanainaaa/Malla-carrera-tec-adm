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

  // Solapa con flecha
  let html = `
    <button id="toggle-creditos" aria-label="Mostrar/Ocultar contador de créditos" title="Mostrar/Ocultar contador de créditos">
      <svg viewBox="0 0 32 32" width="30" height="30" style="vertical-align:middle;">
        <polygon id="arrow-shape" points="10,8 22,16 10,24" fill="#a5426c"/>
      </svg>
    </button>
    <div id="creditos-content">
      <h2>Contador de créditos</h2>
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

  // Ocultar/desplegar de modo horizontal
  const btn = document.getElementById("toggle-creditos");
  const content = document.getElementById("creditos-content");
  let oculto = localStorage.getItem("creditosOcultos") === "true";
  if (oculto) {
    contador.classList.add("collapsed");
    content.style.display = "none";
    btn.querySelector('#arrow-shape').setAttribute('points', '10,16 22,8 22,24'); // flecha derecha
  } else {
    contador.classList.remove("collapsed");
    content.style.display = "";
    btn.querySelector('#arrow-shape').setAttribute('points', '10,8 22,16 10,24'); // flecha izquierda
  }
  btn.onclick = () => {
    oculto = !oculto;
    if (oculto) {
      contador.classList.add("collapsed");
      content.style.display = "none";
      btn.querySelector('#arrow-shape').setAttribute('points', '10,16 22,8 22,24');
    } else {
      contador.classList.remove("collapsed");
      content.style.display = "";
      btn.querySelector('#arrow-shape').setAttribute('points', '10,8 22,16 10,24');
    }
    localStorage.setItem("creditosOcultos", oculto ? "true" : "false");
  };
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

// CSS para la solapa horizontal y flecha
(function(){
  const style = document.createElement("style");
  style.innerHTML = `
    #contador-creditos {
      position: fixed;
      top: 80px;
      right: 0;
      height: auto;
      min-height: 80px;
      width: 320px;
      background: #fff6fb;
      border-left: 3px solid #e75480;
      border-radius: 16px 0 0 16px;
      box-shadow: -2px 2px 8px #e7548020;
      color: #a5426c;
      font-size: 1em;
      z-index: 10000;
      transition: right 0.3s, width 0.3s;
      padding: 0;
      overflow: visible;
    }
    #contador-creditos.collapsed {
      width: 54px !important;
      min-width: 54px !important;
      box-shadow: -2px 2px 8px #e7548020;
      background: none;
      border-radius: 16px 0 0 16px;
      overflow: visible;
    }
    #toggle-creditos {
      position: absolute;
      left: -38px;
      top: 30px;
      width: 42px;
      height: 42px;
      background: #fff6fb;
      border: 3px solid #e75480;
      border-radius: 26px 0 0 26px;
      box-shadow: -2px 2px 8px #e7548020;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 10001;
      transition: background 0.2s;
    }
    #toggle-creditos:hover {
      background: #ffe6fa;
    }
    #creditos-content {
      padding: 20px 20px 20px 18px;
      transition: opacity 0.2s;
    }
    #contador-creditos.collapsed #creditos-content {
      display: none !important;
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
    @media (max-width: 800px) {
      #contador-creditos {
        position: fixed;
        bottom: 0;
        right: 0;
        top: unset;
        left: unset;
        width: 98vw;
        border-radius: 16px 16px 0 0;
        border-left: none;
        border-top: 3px solid #e75480;
        min-height: 0;
        max-height: 60vh;
        box-shadow: 0 -2px 8px #e7548020;
      }
      #toggle-creditos {
        left: 50%;
        top: -38px;
        border-radius: 16px 16px 0 0;
        border-left: none;
        border-top: 3px solid #e75480;
        background: #fff6fb;
        box-shadow: 0 -2px 8px #e7548020;
        transform: translateX(-50%);
      }
    }
  `;
  document.head.appendChild(style);
})();
