const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
const sucursales = [
  { cc: '329', nombre: 'AGUASCALIENTES', estatus: 'OPERATIVAS', entidad: 'AGUASCALIENTES' },
  { cc: '268', nombre: 'ENSENADA', estatus: 'OPERATIVAS', entidad: 'BAJA CALIFORNIA' },
  { cc: '408', nombre: 'SPM TIJUANA', estatus: 'NO OPERATIVAS', entidad: 'BAJA CALIFORNIA' }
];
app.get('/api/ping', (req, res) => { res.json({ ok: true }); });
app.get('/api/sucursales', (req, res) => { res.json(sucursales); });
app.listen(PORT, () => { console.log('Puerto ' + PORT); });