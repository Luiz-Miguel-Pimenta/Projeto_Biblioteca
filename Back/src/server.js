import express from "express"

import { rotasApp } from "./routes/index.js"
import { errorApp } from "./middlewares/errorApp.js"
import { livrosRoutes } from "./routes/livros-routes.js"

const PORT = 3000
const App = express()

App.use(express.json())
App.use(rotasApp)


App.get('/', (req, res) => {
  res.send('Hello World!')
})

App.use(errorApp);

App.use(livrosRoutes)

App.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})