import express from "express"

import { routes } from "./routes/index.js"

const App = express()
const PORT = 3000

App.use(routes)

App.get('/', (req, res) => {
  res.send('Hello World!')
})

App.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})