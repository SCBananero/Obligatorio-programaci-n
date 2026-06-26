// Santiago Coutinho (378832) y Ignacio Quiroga (385781)

let sistema = new Sistema();

function mostrarForm(id) {
    if (id === "form-venta" && (sistema.articulos.length === 0 || sistema.influencers.length === 0)) {
        alert("Debe haber al menos un artículo y un influencer para registrar ventas.");
        return;
    }
    document.getElementById(id).showModal();
}

function ocultarForm(id) {
    document.getElementById(id).close();
}

function formatMedio(medio) {
    let partes = medio.split("-");
    return partes[0] + " - " + partes.slice(1).join("-");
}

function renderInfluencers() {
    let tbody = document.getElementById("tbody-influencers");
    let etq = sistema.calcularEtiquetas();
    tbody.innerHTML = "";

    for (let i = 0; i < sistema.influencers.length; i++) {
        let inf = sistema.influencers[i];
        let total = sistema.getTotalInfluencer(inf.nombre);

        let tr = document.createElement("tr");
        let tdNom = document.createElement("td"); tdNom.textContent = inf.nombre;
        let tdMail = document.createElement("td"); tdMail.textContent = inf.mail;
        let tdCom = document.createElement("td"); tdCom.textContent = inf.comision + "%";
        let tdTot = document.createElement("td"); tdTot.textContent = "$ " + total;
        let tdEtq = document.createElement("td"); tdEtq.textContent = etq[inf.nombre];
        let tdBtn = document.createElement("td");
        let btn = document.createElement("button");
        btn.className = "btn-ventas";
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

function renderArticulos() {
    let tbody = document.getElementById("tbody-articulos");
    let masVendido = sistema.getMasVendido();
    tbody.innerHTML = "";

    for (let i = 0; i < sistema.articulos.length; i++) {
        let art = sistema.articulos[i];
        let tr = document.createElement("tr");
        let tdCod = document.createElement("td");
        let textoCodigo = art.codigo;
        if (art.codigo === masVendido) {
            textoCodigo = art.codigo + "⭐";
        }
        tdCod.textContent = textoCodigo;
        let tdDesc = document.createElement("td"); tdDesc.textContent = art.descripcion;
        let tdPre = document.createElement("td"); tdPre.textContent = "$" + art.precio;

        tr.appendChild(tdCod);
        tr.appendChild(tdDesc);
        tr.appendChild(tdPre);
        tbody.appendChild(tr);
    }
}

function renderVentas() {
    let tbody = document.getElementById("tbody-ventas");
    tbody.innerHTML = "";
    let ordenadas = sistema.getVentasOrdenadas();

    for (let i = 0; i < ordenadas.length; i++) {
        let v = ordenadas[i];
        let tr = document.createElement("tr");

        let tdNro = document.createElement("td"); tdNro.textContent = v.nro;
        let tdCod = document.createElement("td"); tdCod.textContent = v.codigo;
        let tdInf = document.createElement("td"); tdInf.textContent = v.influencer;
        let tdCant = document.createElement("td"); tdCant.textContent = v.cantidad;
        let tdMed = document.createElement("td"); tdMed.textContent = formatMedio(v.medio);
        let tdAcc = document.createElement("td");
        let btn = document.createElement("button");
        btn.className = "btn-eliminar";
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

function renderGrafico() {
    let div = document.getElementById("grafico-burbujas");
    div.innerHTML = "";

    let totales = sistema.getTotalesPorMedio();
    let maxVal = 0;
    for (let j = 0; j < totales.length; j++) {
        if (totales[j] > maxVal) maxVal = totales[j];
    }

    let maxDiametro = 120;
    let minDiametro = maxDiametro * 0.2;

    for (let k = 0; k < sistema.MEDIOS.length; k++) {
        let size = minDiametro;
        if (maxVal > 0) {
            size = minDiametro + (maxDiametro - minDiametro) * (totales[k] / maxVal);
        }

        let col = document.createElement("div");
        col.className = "burbuja-col";

        let burbuja = document.createElement("div");
        burbuja.className = "burbuja";
        burbuja.style.width = size + "px";
        burbuja.style.height = size + "px";
        burbuja.style.backgroundColor = sistema.COLORES[k];
        burbuja.textContent = totales[k];

        let label = document.createElement("div");
        label.className = "burbuja-label";
        label.textContent = formatMedio(sistema.MEDIOS[k]);

        col.appendChild(burbuja);
        col.appendChild(label);
        div.appendChild(col);
    }
}

function renderSelectArticulos() {
    let sel = document.getElementById("sel-articulo");
    sel.innerHTML = "";
    for (let i = 0; i < sistema.articulos.length; i++) {
        let opt = document.createElement("option");
        opt.value = sistema.articulos[i].codigo;
        opt.textContent = sistema.articulos[i].codigo;
        sel.appendChild(opt);
    }
}

function renderSelectInfluencers() {
    let sel = document.getElementById("sel-influencer");
    sel.innerHTML = "";
    for (let i = 0; i < sistema.influencers.length; i++) {
        let opt = document.createElement("option");
        opt.value = sistema.influencers[i].nombre;
        opt.textContent = sistema.influencers[i].nombre;
        sel.appendChild(opt);
    }
}

function actualizarNro() {
    document.getElementById("nro-venta").textContent = "Nro: " + sistema.contadorVentas;
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

function agregarInfluencer() {
    let nombre = document.getElementById("inf-nombre").value.trim();
    let mail = document.getElementById("inf-mail").value.trim();
    let comision = parseFloat(document.getElementById("inf-comision").value);

    if (nombre === "" || mail === "" || isNaN(comision)) {
        alert("Ingrese todos los datos del influencer.");
        return;
    }
    if (sistema.existeMail(mail)) {
        alert("Ya existe un influencer con ese mail.");
        return;
    }

    sistema.agregarInfluencer(nombre, mail, comision);
    document.getElementById("inf-nombre").value = "";
    document.getElementById("inf-mail").value = "";
    document.getElementById("inf-comision").value = "";
    renderInfluencers();
    renderSelectInfluencers();
}

function cancelarInfluencer() {
    document.getElementById("inf-nombre").value = "";
    document.getElementById("inf-mail").value = "";
    document.getElementById("inf-comision").value = "";
    ocultarForm("form-influencer");
}

function ordenarInfluencers() {
    sistema.ordenarInfluencers();
    renderInfluencers();
}

function mostrarVentas(nombre) {
    let comision = sistema.getComisionInfluencer(nombre);
    let lista = sistema.getVentasInfluencer(nombre);
    if (lista.length === 0) {
        alert(nombre + "\nVentas:\nSin ventas registradas.");
        return;
    }
    lista.sort(function(a, b) { return a.nro - b.nro; });
    let msg = nombre + "\nVentas:";
    for (let j = 0; j < lista.length; j++) {
        let v = lista[j];
        let precio = sistema.getPrecio(v.codigo);
        let total = v.cantidad * precio;
        let com = total * (comision / 100);
        msg += "\nNro " + v.nro + "-> " + v.cantidad + "->" + v.codigo +
               "-> $" + precio + "c/u  Total $" + total + "-> Comision: $" + com;
    }
    alert(msg);
}

function agregarArticulo() {
    let codigo = document.getElementById("art-codigo").value.trim();
    let descripcion = document.getElementById("art-descripcion").value.trim();
    let precio = parseFloat(document.getElementById("art-precio").value);

    if (codigo === "" || descripcion === "" || isNaN(precio)) {
        alert("Ingrese todos los datos del artículo.");
        return;
    }
    if (sistema.existeCodigo(codigo)) {
        alert("Ya existe un artículo con ese código.");
        return;
    }

    sistema.agregarArticulo(codigo, descripcion, precio);
    document.getElementById("art-codigo").value = "";
    document.getElementById("art-descripcion").value = "";
    document.getElementById("art-precio").value = "";
    renderArticulos();
    renderSelectArticulos();
}

function cancelarArticulo() {
    document.getElementById("art-codigo").value = "";
    document.getElementById("art-descripcion").value = "";
    document.getElementById("art-precio").value = "";
    ocultarForm("form-articulo");
}

function ordenarArticulos() {
    sistema.ordenarArticulos();
    renderArticulos();
}

function agregarVenta() {
    let codigo = document.getElementById("sel-articulo").value;
    let inf = document.getElementById("sel-influencer").value;
    let cantidad = parseInt(document.getElementById("ven-cantidad").value);
    let medio = document.getElementById("sel-medio").value;

    if (isNaN(cantidad) || cantidad < 1) {
        alert("Ingrese todos los datos de la venta.");
        return;
    }

    sistema.agregarVenta(codigo, inf, cantidad, medio);
    document.getElementById("ven-cantidad").value = "";
    renderAll();
}

function cancelarVenta() {
    document.getElementById("ven-cantidad").value = "";
    ocultarForm("form-venta");
}

function eliminarVenta(nro) {
    let confirmar = confirm("¿Confirma que desea eliminar la venta Nro " + nro + "?");
    if (!confirmar) {
        return;
    }
    sistema.eliminarVenta(nro);
    renderAll();
}

function inicializarEventos() {
    document.getElementById("btn-agregar-influencer").addEventListener("click", function() {
        mostrarForm("form-influencer");
    });

    document.getElementById("btn-agregar-articulo").addEventListener("click", function() {
        mostrarForm("form-articulo");
    });

    document.getElementById("btn-agregar-venta").addEventListener("click", function() {
        mostrarForm("form-venta");
    });

    document.getElementById("btn-cancelar-influencer").addEventListener("click", cancelarInfluencer);
    document.getElementById("btn-cancelar-articulo").addEventListener("click", cancelarArticulo);
    document.getElementById("btn-cancelar-venta").addEventListener("click", cancelarVenta);

    document.getElementById("btn-orden-influencers").addEventListener("click", ordenarInfluencers);
    document.getElementById("btn-orden-articulos").addEventListener("click", ordenarArticulos);

    document.getElementById("influencer-form").addEventListener("submit", function(e) {
        e.preventDefault();
        agregarInfluencer();
    });

    document.getElementById("articulo-form").addEventListener("submit", function(e) {
        e.preventDefault();
        agregarArticulo();
    });

    document.getElementById("venta-form").addEventListener("submit", function(e) {
        e.preventDefault();
        agregarVenta();
    });
}

inicializarEventos();
renderAll();