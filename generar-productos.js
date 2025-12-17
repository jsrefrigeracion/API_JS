const precios = require("./precios-manuales.js");
const path = require("path");
const fs = require("fs/promises");

const calefaccion = {
  grupo1: ["1094", "798", "321", "1277", "1093", "712", "7815", "403", "565"],
  grupo2: ["280"],
  grupo3: ["968", "887", "1105", "7820", "7817", "7818", "7819"],
  grupo4: ["480", "3032", "223", "837"],
  grupo5: ["1425", "265", "1157", "1097", "1098", "1099", "1096", "1100"],
  grupo6: ["353", "354"],
  grupo7: ["588", "581", "567", "510"],
  grupo8: ["1453", "5587", "735", "1451", "26", "651", "736", "1452"],
};

const lavaSeca = {
  grupo1: ["420", "438", "428", "854", "1560", "431", "433", "423", "434"],
  grupo2: ["4288", "4289"],
  grupo3: ["7775", "7776", "7801", "7803", "7849", "7800"],
  grupo4: ["485", "486", "678", "667", "815"],
  grupo5: [
    "4056",
    "4055",
    "374",
    "4243",
    "578",
    "488",
    "489",
    "490",
    "491",
    "492",
    "493",
    "494",
    "1292",
  ],
  grupo6: [
    "4283",
    "971",
    "999",
    "1140",
    "1566",
    "973",
    "1138",
    "975",
    "27",
    "1512",
    "990",
  ],
  grupo7: ["33", "4206", "4210", "4209", "7768", "1725"],
  grupo8: ["4214", "4213", "1290", "63"],
  grupo9: [
    "2",
    "45",
    "110",
    "111",
    "1133",
    "117",
    "116",
    "236",
    "115",
    "112",
    "1578",
    "1577",
  ],
  grupo10: ["74", "508"],
  grupo11: ["59", "801", "4331", "670", "60", "4325", "4314", "4324", "4328"],
  grupo12: [
    "169",
    "170",
    "172",
    "3",
    "175",
    "4389",
    "179",
    "180",
    "181",
    "182",
    "4388",
    "177",
    "186",
  ],
  grupo13: [
    "1374",
    "928",
    "3026",
    "677",
    "1143",
    "344",
    "702",
    "206",
    "683",
    "1109",
    "5617",
    "5619",
  ],
  grupo14: ["676", "1311", "1076", "211", "774", "1257", "675"],
  grupo15: ["1354", "1353", "262", "5522", "258", "5595", "42", "5596", "1111"],
  grupo16: ["933", "7785", "7869"],
};

const RefAire = {
  grupo1: [
    "1046",
    "694",
    "693",
    "123",
    "124",
    "752",
    "4308",
    "495",
    "1077",
    "496",
  ],
  grupo2: ["28", "29", "30", "31", "159"],
  grupo3: ["103", "104", "205"],
  grupo4: ["346", "290", "1558", "342", "343"],

  grupo5: ["5441", "5440", "505", "5439"],
  grupo6: ["629", "1058", "1564", "1190"],
  grupo7: [
    "1373",
    "4138",
    "7877",
    "7878",
    "7879",
    "7880",
    "7881",
    "7882",
    "7884",
    "7885",
    "6712",
  ],
  grupo8: ["157", "4130", "4127", "8005"],
  grupo9: ["1628", "1627", "1156", "1155", "630", "1306"],
  grupo10: ["515", "513", "514"],
  grupo11: ["5456", "1479", "1654", "1366", "22", "4192"],
  grupo12: ["1675", "4089", "1677", "1674", "1676", "1561"],
  grupo13: ["65", "6758", "259", "639", "925", "1315"],
  grupo14: ["445", "7933", "7934", "1357", "1358"]
};

const RefHeladera = {
  grupo1: [
    "2000",
    "1679",
    "477",
    "1998",
    "4241",
    "545",
    "1997",
    "1999",
    "298",
    "227",
    "232",
    "835",
  ],
  grupo2: ["251", "250", "1230", "1599", "400", "627", "1694"],
  grupo3: [
    "1064",
    "1394",
    "4132",
    "1590",
    "1591",
    "1587",
    "18",
    "1592",
    "1593",
    "903",
    "1985",
  ],
  grupo4: ["516", "517", "1954", "256", "1331"],
  grupo5: ["556", "1653", "1067", "1967", "1650", "1073", "579"],
  grupo6: ["363", "1307", "364", "366", "365"],
  grupo7: [
    "81",
    "82",
    "83",
    "85",
    "86",
    "221",
    "222",
    "87",
    "746",
    "747",
    "753",
    "1248",
    "1249",
    "84",
    "1251",
  ],
};
const capacitores = {
  grupo1: ["1339", "1344", "1346", "1347", "1348", "4268"],
  grupo2: ["1419", "685", "125", "689", "1205", "1296"]
}

// Preparar los IDs de productos para la consulta
const arrRefAires = Object.values(RefAire);
const arrRefHeladeras = Object.values(RefHeladera);
const arrLavaSeca = Object.values(lavaSeca);
const arrCalefaccion = Object.values(calefaccion);
const arrCapacitores = Object.values(capacitores);
let arrProductos = [];

// Agregar IDs de aires acondicionados
arrRefAires.forEach((grupo) => {
  arrProductos.push(...grupo);
});

// Agregar IDs de heladeras
arrRefHeladeras.forEach((grupo) => {
  arrProductos.push(...grupo);
});

// Agregar IDs de lavadoras y secadoras
arrLavaSeca.forEach((grupo) => {
  arrProductos.push(...grupo);
});

// Agregar IDs de calefacción
arrCalefaccion.forEach((grupo) => {
  arrProductos.push(...grupo);
});

// Agregar IDs de capacitores
arrCapacitores.forEach((grupo) => {
  arrProductos.push(...grupo);
});

const mapGrupo = arrProductos.join(",");

console.log("🔍 IDs de productos a consultar:", mapGrupo);
console.log(
  `📊 Total de IDs: ${arrProductos.length} (Aires: ${
    arrRefAires.flat().length
  } + Heladeras: ${arrRefHeladeras.flat().length}) + Lavadoras y Secadoras: ${
    arrLavaSeca.flat().length
  } + Calefacción: ${arrCalefaccion.flat().length} + Capacitores: ${arrCapacitores.flat().length})`
);

// Función para obtener datos de la API
async function fetchRefAires() {
  try {
    console.log("📡 Consultando API...");
    const response = await fetch(
      `http://localhost:3000/api/productos?idsArticulos=${mapGrupo}`
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const dataObject = await response.json();
    console.log(`✅ Datos obtenidos: ${dataObject.data.length} productos`);

    return dataObject.data;
  } catch (error) {
    console.error("❌ Error al consultar la API:", error.message);
    throw error;
  }
}

// Función para generar el archivo JS
async function generarArchivoJS() {
  try {
    console.log("🚀 Iniciando generación de archivo...");

    // 1. Obtener datos de la API
    const datos = await fetchRefAires();

    // 2. Separar por tipo usando los IDs originales
    const idsAires = new Set(arrRefAires.flat().map(String));
    const idsHeladeras = new Set(arrRefHeladeras.flat().map(String));
    const idsLavaSeca = new Set(arrLavaSeca.flat().map(String));
    const idsCalefaccion = new Set(arrCalefaccion.flat().map(String));
    const idsCapacitores = new Set(arrCapacitores.flat().map(String));

    const productosAires = datos.filter((p) => idsAires.has(String(p.Codigo)));
    const productosHeladeras = datos.filter((p) =>
      idsHeladeras.has(String(p.Codigo))
    );
    const productosLavaSeca = datos.filter((p) =>
      idsLavaSeca.has(String(p.Codigo))
    );
    const productosCalefaccion = datos.filter((p) =>
      idsCalefaccion.has(String(p.Codigo))
    );
    const productosCapacitores = datos.filter((p) =>
      idsCapacitores.has(String(p.Codigo))
    );

    precios.map((precio) =>{
      for (const producto of productosLavaSeca) {
        if(precio.Codigo === producto.Codigo){
          producto.PrecioTecnico = precio.PrecioTecnico
        }
      }
    })


    // 3. Crear el contenido del archivo JS
    const fechaGeneracion = new Date().toLocaleString();
    const airesJSON = JSON.stringify(productosAires, null, 2);
    const heladerasJSON = JSON.stringify(productosHeladeras, null, 2);
    const lavaSecaJSON = JSON.stringify(productosLavaSeca, null, 2);
    const calefaccionJSON = JSON.stringify(productosCalefaccion, null, 2);
    const capacitoresJSON = JSON.stringify(productosCapacitores, null, 2);



    const contenido = `// Archivo generado automáticamente
// Fecha de generación: ${fechaGeneracion}
// Incluye: Aires acondicionados,  Heladeras y Lavadoras y Secadoras.

const productosAires = ${airesJSON};
const productosCapacitores = ${capacitoresJSON};
const productosHeladeras = ${heladerasJSON};
const productosLavaSeca = ${lavaSecaJSON};
const productosCalefaccion = ${calefaccionJSON};
const productos = [...productosAires, ...productosCapacitores, ...productosHeladeras, ...productosLavaSeca, ...productosCalefaccion];

// Exportar para uso en otros módulos
export { productosAires, productosCapacitores, productosHeladeras, productosLavaSeca, productosCalefaccion, productos };

console.log('Productos cargados:', productos.length);
`;

    // 3. Definir la ruta del archivo
     const directorio =
      "C:\\JSREFRIGERACION\\WEB\\listaDePreciosTecnicos\\src\\static";

    const rutaArchivo = path.join(directorio, "productos.js");

    // 4. Crear directorio si no existe
    await fs.mkdir(directorio, { recursive: true });

    // 5. Guardar archivo
    await fs.writeFile(rutaArchivo, contenido, "utf8");

    console.log(`✅ Archivo guardado en: ${rutaArchivo}`);
    console.log(`📊 Registros exportados: ${datos.length}`);

    return rutaArchivo;
  } catch (error) {
    console.error("❌ Error al generar archivo:", error);
    throw error;
  }
}

// Ejecutar el script
async function main() {
  try {
    console.log("🎯 Iniciando script de generación de productos...");
    const rutaArchivo = await generarArchivoJS();
    console.log("🎉 ¡Script completado exitosamente!");
    console.log(`📁 Archivo generado: ${rutaArchivo}`);
  } catch (error) {
    console.error("💥 Error en el script principal:", error);
    process.exit(1);
  }
}

// Ejecutar solo si este archivo se ejecuta directamente
if (require.main === module) {
  main();
}

// Exportar funciones para uso en otros módulos
module.exports = {
  fetchRefAires,
  generarArchivoJS,
};
