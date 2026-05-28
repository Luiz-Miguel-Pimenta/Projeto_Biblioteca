import express from "express"

import { routes } from "./routes/index.js"
import { database } from "./database/db.js"

const App = express()
const PORT = 3000

App.use(express.json())
App.use(routes)

App.get('/', (req, res) => {
  res.send('Hello World!')
})

App.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})