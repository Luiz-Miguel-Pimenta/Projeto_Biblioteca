import { Route, Routes } from "react-router";

import { Login } from "../pages/Login";
import { Cadastrar } from "../pages/Cadastrar";
import { AuthLayout } from "../components/AuthLayout";

export function LogarRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AuthLayout />}>
                <Route path="/" element={<Login />} />
                <Route path="/cadastrar" element={<Cadastrar />} />
            </Route>
        </Routes>
    )
}