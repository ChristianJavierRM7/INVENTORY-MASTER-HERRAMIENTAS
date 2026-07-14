const express = require("express")
require("dotenv").config()
const swaggerUi = require("swagger-ui-express")
const { errorHandler } = require("./middleware/error-handler")
const { sequelize } = require("./models")
const swaggerSpec = require("./config/swagger")

const app = express()
app.use(express.json())

// Custom CORS Middleware to allow frontend cross-domain requests
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if (req.method === "OPTIONS") {
    return res.sendStatus(200)
  }
  next()
})

const PORT = process.env.PORT || 3000

app.get("/api-docs.json", (req, res) => res.json(swaggerSpec))
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Herramientas Node API - Docs",
    swaggerOptions: { persistAuthorization: true },
  })
)

app.get("/", (req, res) => {
  res.json({
    name: "Herramientas Node API",
    version: "1.0.0",
    docs: `${req.protocol}://${req.get("host")}/docs`,
    openapi: `${req.protocol}://${req.get("host")}/api-docs.json`,
  })
})

app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/categorias", require("./routes/categoria.routes"))
app.use("/api/clientes", require("./routes/cliente.routes"))
app.use("/api/productos", require("./routes/producto.routes"))
app.use("/api/ventas", require("./routes/venta.routes"))

app.use(errorHandler)

const connectWithRetry = async (retries = 10, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate()
      console.log("Conexion a BD establecida")
      return;
    } catch (error) {
      console.error(`Intento ${i + 1} de ${retries} para conectar a la BD falló. Reintentando en ${delay / 1000}s...`)
      if (i === retries - 1) throw error;
      await new Promise(res => setTimeout(res, delay))
    }
  }
}

const start = async () => {
  try {
    await connectWithRetry()

    await sequelize.sync({ alter: process.env.DB_SYNC_ALTER === "true" })
    console.log("Modelos sincronizados")

    // Sembrar usuario administrador por defecto si no existe
    const User = require("./models/user")
    const adminExists = await User.findOne({ where: { email: "admin@empresa.com" } })
    if (!adminExists) {
      await User.create({
        email: "admin@empresa.com",
        password: "adminpassword",
        rol: "admin"
      })
      console.log("Usuario administrador inicial sembrado automáticamente.")
    }

    app.listen(PORT, () => {
      console.log("Servidor disponible en el puerto: " + PORT)
      console.log("Documentacion Swagger en: http://localhost:" + PORT + "/docs")
    })
  } catch (error) {
    console.error("Error al iniciar servidor:", error)
    process.exit(1)
  }
}

start()
