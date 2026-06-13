import { Route, Routes } from "react-router";

import { Login } from "../pages/Login";
import { Cadastrar } from "../pages/Cadastrar";

export function LogarRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/cadastrar" element={<Cadastrar />} />
        </Routes>
    )
}