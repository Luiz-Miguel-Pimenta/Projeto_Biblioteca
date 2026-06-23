import express from "express"
import cors from "cors";

import { rotasApp } from "./routes/index.js"
import { capturadorError } from "./middlewares/CapturadorError.js"

const PORT = 3000;
const App = express();

App.use(cors()) 
App.use(express.json());
App.use(rotasApp);

App.use(capturadorError);

App.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})