const express = require('express');
const cors = require('cors');
const path = require('path');
const XLSX = require('xlsx');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const cargarSucursales = () => {
    const ruta = path.join(__dirname, 'sucursales.xlsx');
    const workbook = XLSX.readFile(ruta);
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const datos = XLSX.utils.sheet_to_json(hoja);

    return datos.map(fila => ({
        cc: String(fila['CENTRO DE COSTOS'] || ''),
        nombre: String(fila['NOMBRE DE SUCURSAL'] || ''),
        formato: String(fila['FORMATO DE SUCURSAL'] || ''),
        estatus: String(fila['ESTATUS DE SUCURSAL'] || ''),
        entidad: String(fila['ENTIDAD'] || ''),
        municipio: String(fila['MUNICIPIO'] || ''),
        localidad: String(fila['LOCALIDAD'] || ''),
        latitud: fila['LATITUD'] || null,
        longitud: fila['LONGITUD'] || null,
        maps: String(fila['LINK GOOGLE MAPS'] || ''),
        direccionCompleta: String(fila['DOMICILIO COMPLETO'] || ''),
        vialidad: String(fila['VIALIDAD'] || ''),
        exterior: String(fila['N° EXTERIOR'] || ''),
        colonia: String(fila['COLONIA'] || ''),
        cp: String(fila['C.P.'] || ''),
        referencias: String(fila['REFERENCIAS'] || ''),
        direccion: String(fila['DIRECCIÓN'] || ''),
        subdireccion: String(fila['SUBDIRECIÓN'] || ''),
        nombreSubdirectora: String(fila['NOMBRE DE LA SUBDIRECTORA'] || ''),
        gerencia: String(fila['GERENCIA'] || ''),
        nombreGerente: String(fila['NOMBRE DEL (LA) GERENTE'] || ''),
        coordinacion: String(fila['COORDINACIÓN ESTATAL'] || ''),
        nombreCoordinador: String(fila['NOMBRE DEL (LA) COORDINADOR(A) REGIONAL/ESTATAL'] || ''),
        cajeros: fila['TOTAL DE CAJEROS ATM'] || 0,
        ventanillas: fila['VENTANILLAS ACT'] || 0,
        transaccionalidad: String(fila[' TRANSACCIONALIDAD MAYO'] || ''),
        entornoSocio: String(fila['ENTORNO SOCIODEMOGRÁFICO'] || ''),
        claveSedena: String(fila['CLAVE SEDENA'] || ''),
        fechaApertura: String(fila['FECHA DE APERTURA UBD'] || '')
    }));
};

app.get('/api/ping', (req, res) => {
    res.json({ ok: true });
});

app.get('/api/sucursales', (req, res) => {
    const sucursales = cargarSucursales();
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 50;
    const busqueda = (req.query.busqueda || '').toLowerCase();
    const entidad = req.query.entidad || '';
    const estatus = req.query.estatus || '';
    const formato = req.query.formato || '';
    const direccion = req.query.direccion || '';

    let filtradas = sucursales;

    if (busqueda) {
        filtradas = filtradas.filter(s =>
            s.nombre.toLowerCase().includes(busqueda) ||
            s.cc.includes(busqueda) ||
            s.municipio.toLowerCase().includes(busqueda)
        );
    }
    if (entidad) filtradas = filtradas.filter(s => s.entidad === entidad);
    if (estatus) filtradas = filtradas.filter(s => s.estatus === estatus);
    if (formato) filtradas = filtradas.filter(s => s.formato === formato);
    if (direccion) filtradas = filtradas.filter(s => s.direccion === direccion);

    const total = filtradas.length;
    const inicio = (pagina - 1) * limite;
    const datos = filtradas.slice(inicio, inicio + limite);

    res.json({ total, pagina, limite, datos });
});

app.get('/api/resumen', (req, res) => {
    const sucursales = cargarSucursales();
    const operativas = sucursales.filter(s => s.estatus === 'OPERATIVAS').length;
    const noOperativas = sucursales.filter(s => s.estatus === 'NO OPERATIVAS').length;

    const porEntidad = sucursales.reduce((acc, s) => {
        if (!acc[s.entidad]) acc[s.entidad] = { total: 0, operativas: 0, noOperativas: 0 };
        acc[s.entidad].total++;
        if (s.estatus === 'OPERATIVAS') acc[s.entidad].operativas++;
        else acc[s.entidad].noOperativas++;
        return acc;
    }, {});

    res.json({ total: sucursales.length, operativas, noOperativas, porEntidad });
});

app.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:' + PORT);
});