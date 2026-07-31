const express = require('express');
const cors = require('cors');
const path = require('path');
const XLSX = require('xlsx');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const excelFecha = (valor) => {
    if (!valor) return '';
    if (typeof valor === 'number') {
        const fecha = new Date((valor - 25569) * 86400 * 1000);
        return fecha.toLocaleDateString('es-MX');
    }
    return String(valor);
};

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
        idCajeros: String(fila["ID'S CAJEROS"] || ''),
        ventanillas: fila['VENTANILLAS ACT'] || 0,
        transaccionalidad: String(fila[' TRANSACCIONALIDAD MAYO'] || ''),
        entornoSocio: String(fila['ENTORNO SOCIODEMOGRÁFICO'] || ''),
        claveSedena: String(fila['CLAVE SEDENA'] || ''),
        fechaApertura: excelFecha(fila['FECHA DE APERTURA UBD']),
    }));
};

const filtrarSucursales = (sucursales, query) => {
    const busqueda = (query.busqueda || '').toLowerCase();
    const entidad = query.entidad || '';
    const estatus = query.estatus || '';
    const formato = query.formato || '';

    let filtradas = sucursales;
    if (busqueda) filtradas = filtradas.filter(s =>
        s.nombre.toLowerCase().includes(busqueda) ||
        s.cc.includes(busqueda) ||
        s.municipio.toLowerCase().includes(busqueda)
    );
    if (entidad) filtradas = filtradas.filter(s => s.entidad === entidad);
    if (estatus) filtradas = filtradas.filter(s => s.estatus === estatus);
    if (formato) filtradas = filtradas.filter(s => s.formato === formato);
    return filtradas;
};

app.get('/api/ping', (req, res) => {
    res.json({ ok: true });
});

app.get('/api/sucursales', (req, res) => {
    const sucursales = cargarSucursales();
    const filtradas = filtrarSucursales(sucursales, req.query);
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 50;
    const inicio = (pagina - 1) * limite;
    res.json({ total: filtradas.length, pagina, limite, datos: filtradas.slice(inicio, inicio + limite) });
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

app.get('/api/exportar-excel', (req, res) => {
    const sucursales = cargarSucursales();
    const filtradas = filtrarSucursales(sucursales, req.query);

    const datos = filtradas.map(s => ({
        'CC': s.cc,
        'Nombre': s.nombre,
        'Formato': s.formato,
        'Estatus': s.estatus,
        'Entidad': s.entidad,
        'Municipio': s.municipio,
        'Localidad': s.localidad,
        'Dirección completa': s.direccionCompleta,
        'Subdirección': s.subdireccion,
        'Subdirectora': s.nombreSubdirectora,
        'Gerencia': s.gerencia,
        'Gerente': s.nombreGerente,
        'Coordinación': s.coordinacion,
        'Coordinador': s.nombreCoordinador,
        'Cajeros ATM': s.cajeros,
        'ID Cajeros': s.idCajeros,
        'Ventanillas': s.ventanillas,
        'Transaccionalidad': s.transaccionalidad,
        'Entorno': s.entornoSocio,
        'Clave SEDENA': s.claveSedena,
        'Fecha Apertura': s.fechaApertura,
        'Link Google Maps': s.maps
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(datos);
    ws['!cols'] = [
        { wch: 8 }, { wch: 35 }, { wch: 12 }, { wch: 14 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 50 },
        { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 25 },
        { wch: 20 }, { wch: 30 }, { wch: 10 }, { wch: 15 },
        { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
        { wch: 15 }, { wch: 40 }
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Sucursales UBS');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename=sucursales_ubs.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
});

app.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:' + PORT);
});