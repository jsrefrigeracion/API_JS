const { API_URL } = require("./variables");
const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


const dbConfig = {
  server: "SERVER-S\\SQLEXPRESS",
  database: "GeVe",
  user: "geve",
  password: "geve015",
  options: {
    encrypt: false, // Por defecto en conexiones locales
    trustServerCertificate: true, // Para desarrollo
  },
};

const queryActualizarStock = (idArticulo, stock) =>
  `UPDATE [GeVe].[dbo].[Articulo] SET StockActual = ${stock} WHERE IdArticulo = ${idArticulo}`;

const queryProductos = (
  idsArticulos
) => `SELECT a.IdArticulo AS Codigo, a.Descripcion AS Nombre, 
          dp.Precio AS PrecioTecnico, 
          r.Descripcion AS Rubro 
          FROM [GeVe].[dbo].[Articulo] AS a 
          INNER JOIN [GeVe].[dbo].[Rubro] AS r ON a.IdRUbro = r.IdRUbro 
          INNER JOIN [GeVe].[dbo].[DetallePrecio] AS dp ON dp.IdArticulo = a.IdArticulo 
          WHERE a.Eliminado = 0 AND a.Descripcion <> '.' AND dp.IdListaPrecio IN (5) 
          AND a.IdArticulo IN (${idsArticulos})
          ORDER BY a.Descripcion`;

const queryProductosCodigo = `SELECT DISTINCT 
    a.IdArticulo AS Codigo,
    a.Descripcion AS Nombre,
    a.StockActual,
    a.PrecioCompraDolar,
    a.PrecioCompra,
    MAX(CASE WHEN dp.IdListaPrecio = 1 THEN dp.Precio END) AS PrecioPublico,
    MAX(CASE WHEN dp.IdListaPrecio = 5 THEN dp.Precio END) AS PrecioTecnico,
    MAX(CASE WHEN dp.IdListaPrecio = 2 THEN dp.Precio END) AS PrecioMayorista,
    a.CoeficienteIVADif AS IVA,
    r.Descripcion AS Rubro
FROM [GeVe].[dbo].[Articulo] AS a
JOIN [GeVe].[dbo].[Rubro] AS r ON a.IdRUbro = r.IdRUbro
JOIN [GeVe].[dbo].[DetallePrecio] AS dp ON dp.IdArticulo = a.IdArticulo
WHERE a.Eliminado = 0
  AND dp.IdListaPrecio IN (1, 2, 5)
GROUP BY 
    a.IdArticulo, 
    a.Descripcion, 
    a.StockActual,  
    a.PrecioCompraDolar, 
    a.PrecioCompra, 
    a.CoeficienteIVADif, 
    r.Descripcion
  ORDER BY 2`;

const queryProductosImagen = (idArticulo) => `
SELECT 
    a.IdArticulo, 
    MAX(ai.Imagen) AS Imagen
FROM [GeVe].[dbo].[Articulo] AS a
LEFT JOIN [GeVe].[dbo].[ArticuloImagen] AS ai 
    ON a.IdArticulo = ai.IdArticulo
WHERE a.Eliminado = 0
AND a.IdArticulo IN (${idArticulo})
GROUP BY a.IdArticulo;`;

const queryProductosStock = (idArticulo) => `
SELECT 
    a.IdArticulo, 
    a.StockActual
FROM [GeVe].[dbo].[Articulo] AS a
WHERE a.Eliminado = 0
AND a.IdArticulo IN (${idArticulo})`;
// 📦 Endpoint para obtener productos
app.get("/api/productos", async (req, res) => {
  let pool;

  // Obtener y procesar los grupos
  let { idsArticulos } = req.query;
  try {
    // Convertir a array si es un string único
    if (typeof idsArticulos === "string") {
      idsArticulos = [idsArticulos];
    }

    pool = await sql.connect(dbConfig);

    const request = await pool.request().query(queryProductos(idsArticulos));

    const result = await request;

    res.json({
      success: true,
      data: await result.recordset,
      total: await result.recordset.length,
      gruposConsultados: idsArticulos,
    });
  } catch (error) {
    console.log("Request: ", req);
    console.error("❌ Error detallado:");
    console.error("Mensaje:", error.message);
    console.error("Código:", error.code);
    console.error("Número de error:", error.number);
    console.log("📥 Parámetro grupo recibido:", idsArticulos);

    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      detalle: error.message,
    });
  } finally {
    if (pool) {
      await pool.close();
    }
  }
});

//API PRODUCTOS CODIGO
app.get("/api/productosCodigo", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const request = await pool.request().query(queryProductosCodigo);
    const result = await request;
    res.json({
      success: true,
      data: await result.recordset,
      total: await result.recordset.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      detalle: error.message,
    });
  } finally {
    if (pool) {
      await pool.close();
    }
  }
});

app.get("/api/productosImagen", async (req, res) => {
  let { idArticulo } = req.query;
  try {
    const pool = await sql.connect(dbConfig);
    const request = await pool
      .request()
      .query(queryProductosImagen(idArticulo));
    const result = await request;
    res.json({
      success: true,
      data: await result.recordset,
      total: await result.recordset.length,
      idArticulo: idArticulo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      detalle: error.message,
    });
  } finally {
    if (pool) {
      await pool.close();
    }
  }
});

app.get("/api/productosStock", async (req, res) => {
  let { idArticulo } = req.query;
  try {
    const pool = await sql.connect(dbConfig);
    const request = await pool.request().query(queryProductosStock(idArticulo));
    const result = await request;
    res.json({
      success: true,
      data: await result.recordset,
      total: await result.recordset.length,
      idArticulo: idArticulo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      detalle: error.message,
    });
  } finally {
    if (pool) {
      await pool.close();
    }
  }
});

// Endpoint de prueba de conexión simple
app.get("/api/test-connection", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .query("SELECT 1 as test, @@VERSION as version");
    await pool.close();

    res.json({
      status: "✅ Conexión exitosa",
      version: result.recordset[0].version,
    });
  } catch (error) {
    res.status(500).json({
      status: "❌ Error de conexión",
      error: error.message,
    });
  }
});

app.post("/api/actualizar-stock", async (req, res) => {
  const { idArticulo, stock } = req.body;

  if (!idArticulo || stock === undefined) {
    return res.status(400).json({
      success: false,
      error: "Faltan datos: idArticulo o stock.",
    });
  }

  let pool; // declaramos acá para poder cerrarlo luego

  try {
    pool = await sql.connect(dbConfig);

    const query = queryActualizarStock(idArticulo, stock);
    const result = await pool.request().query(query);

    res.json({
      success: true,
      message: "Stock actualizado correctamente",
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error al actualizar el stock:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      detalle: error.message,
    });
  } finally {
    if (pool) {
      await pool.close();
    }
  }
});

// Servidor corriendo en puerto 3000
app.listen(3000, () => {
  console.log("🚀 Servidor backend escuchando en http://localhost:3000");
  console.log("📊 Endpoints disponibles:");
  console.log(`   /api/productos`);
  console.log(`   /api/productosCodigo`);
  console.log(`   /api/productosImagen`);
  console.log(`   /api/productosStock`);
  console.log(`   /api/test-connection`);
});
