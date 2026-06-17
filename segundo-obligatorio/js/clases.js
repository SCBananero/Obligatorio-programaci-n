// Santiago Coutinho (378832) y Ignacio Quiroga (385781)

class Influencer {
    constructor(nombre, mail, comision) {
        this.nombre = nombre;
        this.mail = mail;
        this.comision = comision;
    }
}

class Articulo {
    constructor(codigo, descripcion, precio) {
        this.codigo = codigo;
        this.descripcion = descripcion;
        this.precio = precio;
    }
}

class Venta {
    constructor(nro, codigo, influencer, cantidad, medio) {
        this.nro = nro;
        this.codigo = codigo;
        this.influencer = influencer;
        this.cantidad = cantidad;
        this.medio = medio;
    }
}

class Sistema {
    constructor() {
        this.influencers = [
            new Influencer("Ana Perez", "ana.perez@email.com", 20),
            new Influencer("Juan Gomez", "juan.gomez@email.com", 10),
            new Influencer("Lucia Martinez", "lucia.martinez@email.com", 95)
        ];

        this.articulos = [
            new Articulo("A001", "Remera algodon basica", 1000),
            new Articulo("A002", "Zapatillas deportivas", 300),
            new Articulo("A003", "Gorra ajustable", 500)
        ];

        this.ventas = [
            new Venta(1, "A001", "Ana Perez", 3, "1-Instagram"),
            new Venta(2, "A002", "Juan Gomez", 1, "2-YouTube")
        ];

        this.contadorVentas = 3;
        this.ordenNombreAsc = true;
        this.ordenCodigoAsc = true;

        this.MEDIOS = ["1-Instagram", "2-YouTube", "3-X", "4-TikTok", "5-Facebook", "6-Otras"];
        this.COLORES = ["#e74c3c", "#2980b9", "#27ae60", "#f39c12", "#8e44ad", "#7b241c"];
    }

    getPrecio(codigo) {
        for (let i = 0; i < this.articulos.length; i++) {
            if (this.articulos[i].codigo === codigo) return this.articulos[i].precio;
        }
        return 0;
    }

    existeMail(mail) {
        for (let i = 0; i < this.influencers.length; i++) {
            if (this.influencers[i].mail === mail) return true;
        }
        return false;
    }

    existeCodigo(codigo) {
        for (let i = 0; i < this.articulos.length; i++) {
            if (this.articulos[i].codigo === codigo) return true;
        }
        return false;
    }

    existeDescripcionYPrecio(descripcion, precio) {
        for (let i = 0; i < this.articulos.length; i++) {
            if (this.articulos[i].descripcion === descripcion && this.articulos[i].precio === precio) {
                return true;
            }
        }
        return false;
    }

    getTotalInfluencer(nombre) {
        let comision = 0;
        for (let i = 0; i < this.influencers.length; i++) {
            if (this.influencers[i].nombre === nombre) {
                comision = this.influencers[i].comision;
                break;
            }
        }
        let total = 0;
        for (let j = 0; j < this.ventas.length; j++) {
            if (this.ventas[j].influencer === nombre) {
                total += this.ventas[j].cantidad * this.getPrecio(this.ventas[j].codigo) * (comision / 100);
            }
        }
        return total;
    }

    getVentasInfluencer(nombre) {
        let resultado = [];
        for (let i = 0; i < this.ventas.length; i++) {
            if (this.ventas[i].influencer === nombre) resultado.push(this.ventas[i]);
        }
        return resultado;
    }

    calcularEtiquetas() {
        let maxTotal = 0;
        let topComision = "";
        for (let i = 0; i < this.influencers.length; i++) {
            let t = this.getTotalInfluencer(this.influencers[i].nombre);
            if (t > maxTotal) {
                maxTotal = t;
                topComision = this.influencers[i].nombre;
            }
        }

        let maxVenta = 0;
        let topCara = "";
        for (let j = 0; j < this.ventas.length; j++) {
            let val = this.ventas[j].cantidad * this.getPrecio(this.ventas[j].codigo);
            if (val > maxVenta) {
                maxVenta = val;
                topCara = this.ventas[j].influencer;
            }
        }

        let etq = {};
        for (let k = 0; k < this.influencers.length; k++) {
            let nombre = this.influencers[k].nombre;
            etq[nombre] = "";
            if (nombre === topComision) etq[nombre] += "🔥";
            if (this.getVentasInfluencer(nombre).length === 0) etq[nombre] += "🧊";
            if (nombre === topCara) etq[nombre] += "🟢";
        }
        return etq;
    }

    getMasVendido() {
        let conteo = {};
        for (let i = 0; i < this.articulos.length; i++) {
            conteo[this.articulos[i].codigo] = 0;
        }
        for (let j = 0; j < this.ventas.length; j++) {
            if (conteo[this.ventas[j].codigo] !== undefined) {
                conteo[this.ventas[j].codigo] += this.ventas[j].cantidad;
            }
        }
        let max = 0;
        let ganador = "";
        for (let cod in conteo) {
            if (conteo[cod] > max) {
                max = conteo[cod];
                ganador = cod;
            }
        }
        return ganador;
    }

    ordenarInfluencers() {
        this.influencers.sort(function(a, b) {
            if (this.ordenNombreAsc) {
                if (a.nombre < b.nombre) {
                    return -1;
                } else {
                    return 1;
                }
            } else {
                if (a.nombre > b.nombre) {
                    return -1;
                } else {
                    return 1;
                }
            }
        }.bind(this));
        this.ordenNombreAsc = !this.ordenNombreAsc;
    }

    ordenarArticulos() {
        this.articulos.sort(function(a, b) {
            if (this.ordenCodigoAsc) {
                if (a.codigo < b.codigo) {
                    return -1;
                } else {
                    return 1;
                }
            } else {
                if (a.codigo > b.codigo) {
                    return -1;
                } else {
                    return 1;
                }
            }
        }.bind(this));
        this.ordenCodigoAsc = !this.ordenCodigoAsc;
    }

    agregarInfluencer(nombre, mail, comision) {
        this.influencers.push(new Influencer(nombre, mail, comision));
    }

    agregarArticulo(codigo, descripcion, precio) {
        this.articulos.push(new Articulo(codigo, descripcion, precio));
    }

    agregarVenta(codigo, influencer, cantidad, medio) {
        this.ventas.push(new Venta(this.contadorVentas, codigo, influencer, cantidad, medio));
        this.contadorVentas++;
    }

    eliminarVenta(nro) {
        let nuevas = [];
        for (let i = 0; i < this.ventas.length; i++) {
            if (this.ventas[i].nro !== nro) nuevas.push(this.ventas[i]);
        }
        this.ventas = nuevas;
    }

    getVentasOrdenadas() {
        let ordenadas = this.ventas.slice();
        ordenadas.sort(function(a, b) { return a.nro - b.nro; });
        return ordenadas;
    }

    getComisionInfluencer(nombre) {
        for (let i = 0; i < this.influencers.length; i++) {
            if (this.influencers[i].nombre === nombre) return this.influencers[i].comision;
        }
        return 0;
    }

    getTotalesPorMedio() {
        let totales = [0, 0, 0, 0, 0, 0];
        for (let i = 0; i < this.ventas.length; i++) {
            let idx = this.MEDIOS.indexOf(this.ventas[i].medio);
            if (idx >= 0) {
                totales[idx] += this.ventas[i].cantidad * this.getPrecio(this.ventas[i].codigo);
            }
        }
        return totales;
    }
}