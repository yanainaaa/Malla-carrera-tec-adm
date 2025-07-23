// Materias obligatorias y opcionales para Tecnicatura en administración
const materiasData = [
  // [semestre, materia, créditos, área, requisitos, tipo]
  // OBLIGATORIAS
  [1, "Administración y Gestión de las organizaciones 1", 10, "Administración", [], "obligatoria"],
  [1, "Conceptos contables", 10, "Contabilidad e impuestos", [], "obligatoria"],
  [1, "Introducción a la microeconomía", 10, "Economía", [], "obligatoria"],
  [1, "Calculo 1", 10, "Métodos cuantitativos", [], "obligatoria"],
  [2, "Administración y Gestión de las organizaciones 2", 10, "Administración", ["Administración y Gestión de las organizaciones 1"], "obligatoria"],
  [2, "Contabilidad General 1", 10, "Contabilidad e impuestos", ["Conceptos contables"], "obligatoria"],
  [2, "Derecho Civil", 10, "Jurídica", [], "obligatoria"],
  [3, "Procesos y Sistemas de información", 10, "Administración", ["Administración y Gestión de las organizaciones 1"], "obligatoria"],
  [3, "Contabilidad General 2", 10, "Contabilidad e impuestos", ["Contabilidad General 1"], "obligatoria"],
  [3, "Derecho Comercial", 10, "Jurídica", ["Derecho Civil"], "obligatoria"],
  [3, "Introducción a la estadística", 10, "Métodos cuantitativos", ["Calculo 1"], "obligatoria"],
  [4, "Administración de Recursos humanos", 10, "Administración", ["Administración y Gestión de las organizaciones 2"], "obligatoria"],
  [4, "Diseño Organizacional", 10, "Administración", ["Procesos y Sistemas de información", "Administración y Gestión de las organizaciones 2"], "obligatoria"],
  [4, "Contabilidad General 3", 10, "Contabilidad e impuestos", ["Contabilidad General 2"], "obligatoria"],
  [4, "Matematica financiera", 10, "Métodos cuantitativos", ["Calculo 1"], "obligatoria"],
  [4, "Legislación laboral y seguridad social", 10, "Contabilidad e impuestos", ["Conceptos contables", "Derecho Civil"], "obligatoria"],
  [5, "Comportamiento Organizacional", 10, "Administración", ["170 créditos de avance"], "obligatoria"],

  // OPCIONALES
  [3, "Marketing Básico", 10, "CREDITOS DE DISTRIBUCIÓN FLEXIBLE", [], "opcional"],
  [4, "Compras Públicas para el Desarrollo", 10, "Administración", ["120 créditos de avance de la Carrera"], "opcional"],
  [4, "Economía Circular", 10, "ACTIVIDADES INTEGRADORAS", ["100 créditos"], "opcional"],
  [4, "EFI: Contabilidad en las Escuelas", 10, "ACTIVIDADES INTEGRADORAS", ["Contabilidad General 2"], "opcional"],
  [4, "EFI - Costos para la Gestión de Emprendimientos Sociales y Comunitarios", 10, "ACTIVIDADES INTEGRADORAS", ["Contabilidad Gerencial."], "opcional"],
  [4, "Derecho Público", 10, "CREDITOS DE DISTRIBUCIÓN FLEXIBLE", [], "opcional"],
  [4, "Gestión Financiera del Estado", 10, "CREDITOS DE DISTRIBUCIÓN FLEXIBLE", [
    "30 créditos del área contable",
    "20 créditos del área administración",
    "15 créditos del área jurídica",
    "180 créditos de avance de Carrera"
  ], "opcional"],
  [4, "Cambio Organizacional", 10, "Administración", ["Administración de las Organizaciones 1", "180 créditos de avance de carrera"], "opcional"],
  [4, "Marketing Estratégico", 10, "CREDITOS DE DISTRIBUCIÓN FLEXIBLE", ["Marketing Básico"], "opcional"],
  [5, "Transformación Cultural", 10, "ACTIVIDADES INTEGRADORAS", ["150 créditos de avance de carrera"], "opcional"],
  [5, "EFI: Cooperativas de trabajo y colectivos autogestionados", 10, "ACTIVIDADES INTEGRADORAS", ["180 créditos aprobados"], "opcional"],
  [5, "Taller de Gestión de Cargos y Remuneraciones", 5, "Administración", ["Administración de Recursos humanos"], "opcional"],
  [5, "EFI Microcecea", 10, "ACTIVIDADES INTEGRADORAS", ["Contar con 180 créditos aprobados"], "opcional"],
  [5, "Etica y ejercicio profesional", 5, "Actividades integradoras", ["Contabilidad General 2", "Derecho Comercial"], "opcional"],
  [5, "Análisis Institucional y Planificación en el Sector Público", 10, "CREDITOS DE DISTRIBUCIÓN FLEXIBLE", [
    "10 créditos en el Área Jurídica",
    "10 créditos en el Área Administración",
    "10 créditos en el Área Contabilidad e Impuestos",
    "90 créditos de avance de la Carrera"
  ], "opcional"],
  [5, "Marketing de Servicios", 10, "CREDITOS DE DISTRIBUCIÓN FLEXIBLE", ["Marketing Estratégico"], "opcional"],
  [5, "Marketing Digital", 10, "CREDITOS DE DISTRIBUCIÓN FLEXIBLE", ["Marketing Estratégico"], "opcional"],
  [5, "Costos para la Gestión", 10, "Contabilidad e impuestos", ["Contabilidad General 3"], "opcional"]
];

// Utilidades para obtener créditos por área y avance total
function calcularCreditosArea(materiasTachadas, area) {
  return materiasData
    .filter(([_, materia, creditos, areaMateria]) =>
      materiasTachadas[materia] && areaMateria === area
    )
    .reduce((acc, [,,creditos]) => acc + creditos, 0);
}
function calcularCreditosTotal(materiasTachadas) {
  return materiasData
    .filter(([_, materia]) => materiasTachadas[materia])
    .reduce((acc, [,,creditos]) => acc + creditos, 0);
}

// Estado: materias tachadas
let materiasTachadas = JSON.parse(localStorage.getItem("materiasTachadas") || "{}");

// Helper para doble toque en móvil
function addDoubleTapListener(element, singleTapFn, doubleTapFn) {
  let lastTap = 0;
  element.addEventListener("touchend", function(e) {
    let currentTime = new Date().getTime();
    let tapLength = currentTime - lastTap;
    if (tapLength < 400 && tapLength > 0) {
      doubleTapFn(e);
      e.preventDefault();
    } else {
      setTimeout(() => {
        if (!element._doubleTapHandled) singleTapFn(e);
        element._doubleTapHandled = false;
      }, 350);
    }
    lastTap = currentTime;
    element._doubleTapHandled = true;
  });
}

// Construye la UI
function renderMalla() {
  const cont = document.getElementById("malla-container");
  cont.innerHTML = "";

  // Semestres 1 al 3 arriba, 4 y 5 abajo
  const filas = [
    { nombre: "Semestres 1 al 3", desde: 1, hasta: 3 },
    { nombre: "Semestres 4 y 5", desde: 4, hasta: 5 }
  ];

  filas.forEach((fila, filaIdx) => {
    const filaDiv = document.createElement("div");
    filaDiv.className = "fila-semestres";
    for (let sem = fila.desde; sem <= fila.hasta; sem++) {
      const col = document.createElement("div");
      col.className = "semestre-col";
      const semTitle = document.createElement("div");
      semTitle.className = "semestre-title";
      semTitle.textContent = `Semestre ${sem}`;
      col.appendChild(semTitle);

      // Subtítulo Obligatorias
      const obligT = document.createElement("div");
      obligT.className = "subtitulo-materia";
      obligT.textContent = "Obligatorias";
      col.appendChild(obligT);

      // Materias obligatorias
      let obligatorias = materiasData.filter(([s, , , , , tipo]) => s === sem && tipo === "obligatoria");
      if (obligatorias.length === 0) {
        const v = document.createElement("div");
        v.textContent = "(Ninguna)";
        v.className = "sin-materias";
        col.appendChild(v);
      } else {
        obligatorias.forEach(([_, materia, creditos, area, requisitos]) => {
          const div = document.createElement("div");
          div.className = "materia";
          if (materiasTachadas[materia]) div.classList.add("tachada");
          else if (!cumpleRequisitos(materia)) div.classList.add("bloqueada");
          div.dataset.nombre = materia;
          div.innerHTML = `
            <b>${materia}</b> <span class="creditos">${creditos}cr</span>
            <span class="area">${area}</span>
            <div class="requisitos">${requisitos.length > 0 ? "Requisitos: " + requisitos.join(", ") : ""}</div>
          `;
          if (!div.classList.contains("bloqueada")) {
            // Click y doble click escritorio
            div.addEventListener("click", (e) => {
              if (!materiasTachadas[materia]) {
                materiasTachadas[materia] = true;
                localStorage.setItem("materiasTachadas", JSON.stringify(materiasTachadas));
                renderMalla();
              }
            });
            div.addEventListener("dblclick", (e) => {
              if (materiasTachadas[materia]) {
                materiasTachadas[materia] = false;
                localStorage.setItem("materiasTachadas", JSON.stringify(materiasTachadas));
                renderMalla();
              }
            });
            // Doble toque móvil
            addDoubleTapListener(div,
              () => {
                if (!materiasTachadas[materia]) {
                  materiasTachadas[materia] = true;
                  localStorage.setItem("materiasTachadas", JSON.stringify(materiasTachadas));
                  renderMalla();
                }
              },
              () => {
                if (materiasTachadas[materia]) {
                  materiasTachadas[materia] = false;
                  localStorage.setItem("materiasTachadas", JSON.stringify(materiasTachadas));
                  renderMalla();
                }
              }
            );
          }
          col.appendChild(div);
        });
      }

      // Subtítulo Opcionales
      const opcT = document.createElement("div");
      opcT.className = "subtitulo-materia";
      opcT.textContent = "Opcionales";
      col.appendChild(opcT);

      // Materias opcionales
      let opcionales = materiasData.filter(([s, , , , , tipo]) => s === sem && tipo === "opcional");
      if (opcionales.length === 0) {
        const v = document.createElement("div");
        v.textContent = "(Ninguna)";
        v.className = "sin-materias";
        col.appendChild(v);
      } else {
        opcionales.forEach(([_, materia, creditos, area, requisitos]) => {
          const div = document.createElement("div");
          div.className = "materia opcional";
          if (materiasTachadas[materia]) div.classList.add("tachada");
          else if (!cumpleRequisitos(materia)) div.classList.add("bloqueada");
          div.dataset.nombre = materia;
          div.innerHTML = `
            <b>${materia}</b> <span class="creditos">${creditos}cr</span>
            <span class="area">${area}</span>
            <div class="requisitos">${requisitos.length > 0 ? "Requisitos: " + requisitos.join(", ") : ""}</div>
          `;
          if (!div.classList.contains("bloqueada")) {
            div.addEventListener("click", (e) => {
              if (!materiasTachadas[materia]) {
                materiasTachadas[materia] = true;
                localStorage.setItem("materiasTachadas", JSON.stringify(materiasTachadas));
                renderMalla();
              }
            });
            div.addEventListener("dblclick", (e) => {
              if (materiasTachadas[materia]) {
                materiasTachadas[materia] = false;
                localStorage.setItem("materiasTachadas", JSON.stringify(materiasTachadas));
                renderMalla();
              }
            });
            addDoubleTapListener(div,
              () => {
                if (!materiasTachadas[materia]) {
                  materiasTachadas[materia] = true;
                  localStorage.setItem("materiasTachadas", JSON.stringify(materiasTachadas));
                  renderMalla();
                }
              },
              () => {
                if (materiasTachadas[materia]) {
                  materiasTachadas[materia] = false;
                  localStorage.setItem("materiasTachadas", JSON.stringify(materiasTachadas));
                  renderMalla();
                }
              }
            );
          }
          col.appendChild(div);
        });
      }

      filaDiv.appendChild(col);
    }
    cont.appendChild(filaDiv);
  });
}

// Evalúa requisitos de una materia
function cumpleRequisitos(materia) {
  const matObj = materiasData.find(m => m[1] === materia);
  if (!matObj) return true;
  const requisitos = matObj[4];
  for (let req of requisitos) {
    if (
      req.match(/créditos.*contable/) ||
      req.match(/créditos.*Área de Contabilidad e Impuestos/) ||
      req.match(/créditos.*contabilidad e impuestos/) ||
      req.match(/créditos.*contable,/) ||
      req.match(/créditos.*contabilidad/)
    ) {
      let cantidad = parseInt(req);
      let area = "Contabilidad e impuestos";
      if (calcularCreditosArea(materiasTachadas, area) < cantidad) return false;
    } else if (
      req.match(/créditos.*jurídica/) ||
      req.match(/créditos.*Jurídica/)
    ) {
      let cantidad = parseInt(req);
      let area = "Jurídica";
      if (calcularCreditosArea(materiasTachadas, area) < cantidad) return false;
    } else if (
      req.match(/créditos.*administración/) ||
      req.match(/créditos.*Administración/)
    ) {
      let cantidad = parseInt(req);
      let area = "Administración";
      if (calcularCreditosArea(materiasTachadas, area) < cantidad) return false;
    } else if (
      req.match(/créditos.*economía/) ||
      req.match(/créditos.*Economía/)
    ) {
      let cantidad = parseInt(req);
      let area = "Economía";
      if (calcularCreditosArea(materiasTachadas, area) < cantidad) return false;
    } else if (
      req.match(/créditos.*ACTIVIDADES INTEGRADORAS/) ||
      req.match(/créditos.*actividades integradoras/)
    ) {
      let cantidad = parseInt(req);
      let area = "ACTIVIDADES INTEGRADORAS";
      if (calcularCreditosArea(materiasTachadas, area) < cantidad) return false;
    } else if (
      req.match(/créditos.*DISTRIBUCIÓN FLEXIBLE/) ||
      req.match(/créditos.*distribución flexible/)
    ) {
      let cantidad = parseInt(req);
      let area = "CREDITOS DE DISTRIBUCIÓN FLEXIBLE";
      if (calcularCreditosArea(materiasTachadas, area) < cantidad) return false;
    } else if (
      req.match(/créditos de avance( de la carrera| de Carrera| de carrera)?/) ||
      req.match(/créditos mínimos de avance/) ||
      req.match(/créditos totales,?/)
    ) {
      let cantidad = parseInt(req);
      if (calcularCreditosTotal(materiasTachadas) < cantidad) return false;
    } else if (materiasData.find(m => m[1].toLowerCase() === req.toLowerCase())) {
      if (!materiasTachadas[req]) return false;
    } else if (req.includes("ó")) {
      const opciones = req.split("ó").map(r => r.trim());
      if (!opciones.some(r => materiasTachadas[r])) return false;
    } else if (req.includes("o")) {
      const opciones = req.split("o").map(r => r.trim());
      if (!opciones.some(r => materiasTachadas[r])) return false;
    } else if (req.match(/un mínimo de (\d+) créditos en el Área de Administración/i)) {
      let cantidad = parseInt(RegExp.$1);
      if (calcularCreditosArea(materiasTachadas, "Administración") < cantidad) return false;
    } else if (req.match(/un mínimo de (\d+) créditos aprobados/i)) {
      let cantidad = parseInt(RegExp.$1);
      if (calcularCreditosTotal(materiasTachadas) < cantidad) return false;
    } else if (req.match(/(\d+) creditos en economia/i)) {
      let cantidad = parseInt(RegExp.$1);
      if (calcularCreditosArea(materiasTachadas, "Economía") < cantidad) return false;
    } else if (req.match(/incluyendo (\d+) créditos de contabilidad e impuestos/i)) {
      let cantidad = parseInt(RegExp.$1);
      if (calcularCreditosArea(materiasTachadas, "Contabilidad e impuestos") < cantidad) return false;
    } else {
      continue;
    }
  }
  return true;
}

// Resetear progreso
document.getElementById("reset-progress").onclick = () => {
  if (confirm("¿Seguro que quieres reiniciar todo el progreso?")) {
    materiasTachadas = {};
    localStorage.removeItem("materiasTachadas");
    renderMalla();
  }
};

// Inicializa
renderMalla();
