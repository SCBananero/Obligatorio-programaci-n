// Santiago Coutinho (378832) y Ignacio Quiroga (385781)

let influencers = [
    { nombre: "Ana Perez",      mail: "ana.perez@email.com",      comision: 20 },
    { nombre: "Juan Gomez",     mail: "juan.gomez@email.com",     comision: 10 },
    { nombre: "Lucia Martinez", mail: "lucia.martinez@email.com", comision: 95 }
];

let articulos = [
    { codigo: "A001", descripcion: "Remera algodon basica", precio: 1000 },
    { codigo: "A002", descripcion: "Zapatillas deportivas",  precio: 300  },
    { codigo: "A003", descripcion: "Gorra ajustable",        precio: 500  }
];

let ventas = [
    { nro: 1, codigo: "A001", influencer: "Ana Perez",  cantidad: 3, medio: "1-Instagram" },
    { nro: 2, codigo: "A002", influencer: "Juan Gomez", cantidad: 1, medio: "2-YouTube"   }
];

let contadorVentas = 3;
let ordenNombreAsc = true;
let ordenCodigoAsc = true;

let MEDIOS  = ["1-Instagram","2-YouTube","3-X","4-TikTok","5-Facebook","6-Otras"];
let COLORES = ["#e74c3c","#2980b9","#27ae60","#f39c12","#8e44ad","#7b241c"];

// ── MOSTRAR / OCULTAR FORMULARIOS ──────────────────────────
function mostrarForm(id) {
    if (id === "form-venta" && (articulos.length === 0 || influencers.length === 0)) {
        alert("Debe haber al menos un artículo y un influencer para registrar ventas.");
        return;
    }
    document.getElementById(id).showModal();
}

function formatMedio(medio) {
    let partes = medio.split("-");
    return partes[0] + " - " + partes.slice(1).join("-");
}

function existeMail(mail) {
    for (let i = 0; i < influencers.length; i++) {
        if (influencers[i].mail === mail) return true;
    }
    return false;
}

function existeCodigo(codigo) {
    for (let i = 0; i < articulos.length; i++) {
        if (articulos[i].codigo === codigo) return true;
    }
    return false;
}

function ocultarForm(id) {
    document.getElementById(id).close();
}

// ── HELPERS ────────────────────────────────────────────────
function getPrecio(codigo) {
    for (let i = 0; i < articulos.length; i++) {
        if (articulos[i].codigo === codigo) return articulos[i].precio;
    }
    return 0;
}

function getTotalInfluencer(nombre) {
    let comision = 0;
    for (let i = 0; i < influencers.length; i++) {
        if (influencers[i].nombre === nombre) { comision = influencers[i].comision; break; }
    }
    let total = 0;
    for (let j = 0; j < ventas.length; j++) {
        if (ventas[j].influencer === nombre) {
            total += ventas[j].cantidad * getPrecio(ventas[j].codigo) * (comision / 100);
        }
    }
    return total;
}

function getVentasInfluencer(nombre) {
    let resultado = [];
    for (let i = 0; i < ventas.length; i++) {
        if (ventas[i].influencer === nombre) resultado.push(ventas[i]);
    }
    return resultado;
}

function calcularEtiquetas() {
    // 🔥 influencer con mayor total a cobrar (solo si > 0)
    let maxTotal = 0;
    let topComision = "";
    for (let i = 0; i < influencers.length; i++) {
        let t = getTotalInfluencer(influencers[i].nombre);
        if (t > maxTotal) { maxTotal = t; topComision = influencers[i].nombre; }
    }

    // 🟢 influencer con la venta individual de mayor monto
    let maxVenta = 0;
    let topCara = "";
    for (let j = 0; j < ventas.length; j++) {
        let val = ventas[j].cantidad * getPrecio(ventas[j].codigo);
        if (val > maxVenta) { maxVenta = val; topCara = ventas[j].influencer; }
    }

    let etq = {};
    for (let k = 0; k < influencers.length; k++) {
        let nombre = influencers[k].nombre;
        etq[nombre] = "";
        if (nombre === topComision) etq[nombre] += "🔥";
        if (getVentasInfluencer(nombre).length === 0) etq[nombre] += "🧊";
        if (nombre === topCara)     etq[nombre] += "🟢";
    }
    return etq;
}

function getMasVendido() {
    let conteo = {};
    for (let i = 0; i < articulos.length; i++) conteo[articulos[i].codigo] = 0;
    for (let j = 0; j < ventas.length; j++) {
        if (conteo[ventas[j].codigo] !== undefined) conteo[ventas[j].codigo] += ventas[j].cantidad;
    }
    let max = 0;
    let ganador = "";
    for (let cod in conteo) {
        if (conteo[cod] > max) { max = conteo[cod]; ganador = cod; }
    }
    return ganador;
}

// ── RENDER INFLUENCERS ──────────────────────────────────────
function renderInfluencers() {
    let tbody = document.getElementById("tbody-influencers");
    let etq   = calcularEtiquetas();
    tbody.innerHTML = "";

    for (let i = 0; i < influencers.length; i++) {
        let inf   = influencers[i];
        let total = getTotalInfluencer(inf.nombre);

        let tr      = document.createElement("tr");
        let tdNom   = document.createElement("td"); tdNom.textContent  = inf.nombre;
        let tdMail  = document.createElement("td"); tdMail.textContent = inf.mail;
        let tdCom   = document.createElement("td"); tdCom.textContent  = inf.comision + "%";
        let tdTot   = document.createElement("td"); tdTot.textContent  = "$ " + total;
        let tdEtq   = document.createElement("td"); tdEtq.textContent  = etq[inf.nombre];
        let tdBtn   = document.createElement("td");
        let btn     = document.createElement("button");
        btn.className   = "btn-ventas";
        btn.textContent = "Ventas";
        (function(n) { btn.onclick = function() { mostrarVentas(n); }; })(inf.nombre);
        tdBtn.appendChild(btn);

        tr.appendChild(tdNom);
        tr.appendChild(tdMail);
        tr.appendChild(tdCom);
        tr.appendChild(tdTot);
        tr.appendChild(tdEtq);
        tr.appendChild(tdBtn);
        tbody.appendChild(tr);
    }
}

// ── RENDER ARTICULOS ────────────────────────────────────────
function renderArticulos() {
    let tbody      = document.getElementById("tbody-articulos");
    let masVendido = getMasVendido();
    tbody.innerHTML = "";

    for (let i = 0; i < articulos.length; i++) {
        let art  = articulos[i];
        let tr   = document.createElement("tr");
        let tdCod  = document.createElement("td");
        tdCod.textContent = art.codigo + (art.codigo === masVendido ? "⭐" : "");
        let tdDesc = document.createElement("td"); tdDesc.textContent = art.descripcion;
        let tdPre  = document.createElement("td"); tdPre.textContent  = "$" + art.precio;

        tr.appendChild(tdCod);
        tr.appendChild(tdDesc);
        tr.appendChild(tdPre);
        tbody.appendChild(tr);
    }
}

// ── RENDER VENTAS ───────────────────────────────────────────
function renderVentas() {
    let tbody = document.getElementById("tbody-ventas");
    tbody.innerHTML = "";

    let ordenadas = ventas.slice();
    ordenadas.sort(function(a, b) { return a.nro - b.nro; });

    for (let i = 0; i < ordenadas.length; i++) {
        let v  = ordenadas[i];
        let tr = document.createElement("tr");

        let tdNro  = document.createElement("td"); tdNro.textContent  = v.nro;
        let tdCod  = document.createElement("td"); tdCod.textContent  = v.codigo;
        let tdInf  = document.createElement("td"); tdInf.textContent  = v.influencer;
        let tdCant = document.createElement("td"); tdCant.textContent = v.cantidad;
        let tdMed  = document.createElement("td"); tdMed.textContent  = formatMedio(v.medio);
        let tdAcc  = document.createElement("td");
        let btn    = document.createElement("button");
        btn.className   = "btn-eliminar";
        btn.textContent = "❌";
        (function(n) { btn.onclick = function() { eliminarVenta(n); }; })(v.nro);
        tdAcc.appendChild(btn);

        tr.appendChild(tdNro);
        tr.appendChild(tdCod);
        tr.appendChild(tdInf);
        tr.appendChild(tdCant);
        tr.appendChild(tdMed);
        tr.appendChild(tdAcc);
        tbody.appendChild(tr);
    }
}

// ── RENDER GRAFICO ──────────────────────────────────────────
function renderGrafico() {
    let div = document.getElementById("grafico-burbujas");
    div.innerHTML = "";

    let totales = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < ventas.length; i++) {
        let idx = MEDIOS.indexOf(ventas[i].medio);
        if (idx >= 0) totales[idx] += ventas[i].cantidad * getPrecio(ventas[i].codigo);
    }

    let maxVal = 0;
    for (let j = 0; j < totales.length; j++) {
        if (totales[j] > maxVal) maxVal = totales[j];
    }

    let maxDiametro = 120;
    let minDiametro = maxDiametro * 0.2;

    for (let k = 0; k < MEDIOS.length; k++) {
        let size = (maxVal > 0)
            ? minDiametro + (maxDiametro - minDiametro) * (totales[k] / maxVal)
            : minDiametro;

        let col = document.createElement("div");
        col.className = "burbuja-col";

        let burbuja = document.createElement("div");
        burbuja.className = "burbuja";
        burbuja.style.width           = size + "px";
        burbuja.style.height          = size + "px";
        burbuja.style.backgroundColor = COLORES[k];
        burbuja.textContent = totales[k];

        let label = document.createElement("div");
        label.className   = "burbuja-label";
        label.textContent = formatMedio(MEDIOS[k]);

        col.appendChild(burbuja);
        col.appendChild(label);
        div.appendChild(col);
    }
}

// ── RENDER SELECTS ──────────────────────────────────────────
function renderSelectArticulos() {
    let sel = document.getElementById("sel-articulo");
    sel.innerHTML = "";
    for (let i = 0; i < articulos.length; i++) {
        let opt = document.createElement("option");
        opt.value       = articulos[i].codigo;
        opt.textContent = articulos[i].codigo;
        sel.appendChild(opt);
    }
}

function renderSelectInfluencers() {
    let sel = document.getElementById("sel-influencer");
    sel.innerHTML = "";
    for (let i = 0; i < influencers.length; i++) {
        let opt = document.createElement("option");
        opt.value       = influencers[i].nombre;
        opt.textContent = influencers[i].nombre;
        sel.appendChild(opt);
    }
}

function actualizarNro() {
    document.getElementById("nro-venta").textContent = "Nro: " + contadorVentas;
}

function renderAll() {
    renderInfluencers();
    renderArticulos();
    renderVentas();
    renderGrafico();
    renderSelectArticulos();
    renderSelectInfluencers();
    actualizarNro();
}

// ── ACCIONES INFLUENCERS ────────────────────────────────────
function agregarInfluencer() {
    let nombre   = document.getElementById("inf-nombre").value.trim();
    let mail     = document.getElementById("inf-mail").value.trim();
    let comision = parseFloat(document.getElementById("inf-comision").value);

    if (nombre === "" || mail === "" || isNaN(comision) || comision < 0 || comision > 100) {
        alert("Completa todos los campos correctamente.");
        return;
    }
    if (existeMail(mail)) {
        alert("Ya existe un influencer con ese mail.");
        return;
    }

    influencers.push({ nombre: nombre, mail: mail, comision: comision });
    cancelarInfluencer();
    renderInfluencers();
    renderSelectInfluencers();
}

function cancelarInfluencer() {
    document.getElementById("inf-nombre").value   = "";
    document.getElementById("inf-mail").value     = "";
    document.getElementById("inf-comision").value = "";
    ocultarForm("form-influencer");
}

function ordenarInfluencers() {
    influencers.sort(function(a, b) {
        if (ordenNombreAsc) return a.nombre < b.nombre ? -1 : 1;
        else                return a.nombre > b.nombre ? -1 : 1;
    });
    ordenNombreAsc = !ordenNombreAsc;
    renderInfluencers();
}

function mostrarVentas(nombre) {
    let comision = 0;
    for (let i = 0; i < influencers.length; i++) {
        if (influencers[i].nombre === nombre) { comision = influencers[i].comision; break; }
    }
    let lista = getVentasInfluencer(nombre);
    if (lista.length === 0) {
        alert(nombre + "\nVentas:\nSin ventas registradas.");
        return;
    }
    lista.sort(function(a, b) { return a.nro - b.nro; });
    let msg = nombre + "\nVentas:";
    for (let j = 0; j < lista.length; j++) {
        let v      = lista[j];
        let precio = getPrecio(v.codigo);
        let total  = v.cantidad * precio;
        let com    = total * (comision / 100);
        msg += "\nNro " + v.nro + "-> " + v.cantidad + "->" + v.codigo +
               "-> $" + precio + "c/u  Total $" + total + "-> Comision: $" + com;
    }
    alert(msg);
}

// ── ACCIONES ARTICULOS ──────────────────────────────────────
function agregarArticulo() {
    let codigo      = document.getElementById("art-codigo").value.trim();
    let descripcion = document.getElementById("art-descripcion").value.trim();
    let precio      = parseFloat(document.getElementById("art-precio").value);

    if (codigo === "" || descripcion === "" || isNaN(precio) || precio < 0) {
        alert("Completa todos los campos correctamente.");
        return;
    }
    if (existeCodigo(codigo)) {
        alert("Ya existe un artículo con ese código.");
        return;
    }

    articulos.push({ codigo: codigo, descripcion: descripcion, precio: precio });
    cancelarArticulo();
    renderArticulos();
    renderSelectArticulos();
}

function cancelarArticulo() {
    document.getElementById("art-codigo").value      = "";
    document.getElementById("art-descripcion").value = "";
    document.getElementById("art-precio").value      = "";
    ocultarForm("form-articulo");
}

function ordenarArticulos() {
    articulos.sort(function(a, b) {
        if (ordenCodigoAsc) return a.codigo < b.codigo ? -1 : 1;
        else                return a.codigo > b.codigo ? -1 : 1;
    });
    ordenCodigoAsc = !ordenCodigoAsc;
    renderArticulos();
}

// ── ACCIONES VENTAS ─────────────────────────────────────────
function agregarVenta() {
    let codigo   = document.getElementById("sel-articulo").value;
    let inf      = document.getElementById("sel-influencer").value;
    let cantidad = parseInt(document.getElementById("ven-cantidad").value);
    let medio    = document.getElementById("sel-medio").value;

    if (codigo === "" || inf === "" || isNaN(cantidad) || cantidad < 1) {
        alert("Ingresa una cantidad valida (minimo 1).");
        return;
    }

    ventas.push({ nro: contadorVentas, codigo: codigo, influencer: inf, cantidad: cantidad, medio: medio });
    contadorVentas++;
    cancelarVenta();
    renderAll();
}

function cancelarVenta() {
    document.getElementById("ven-cantidad").value = "";
    ocultarForm("form-venta");
}

function eliminarVenta(nro) {
    if (!confirm("¿Confirma que desea eliminar la venta Nro " + nro + "?")) return;

    let nuevas = [];
    for (let i = 0; i < ventas.length; i++) {
        if (ventas[i].nro !== nro) nuevas.push(ventas[i]);
    }
    ventas = nuevas;
    renderAll();
}


renderAll();