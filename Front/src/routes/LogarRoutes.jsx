import { Route, Routes } from "react-router";

import { AuthLayout } from "../components/AuthLayout";

import { Login } from "../pages/Login";
import { Cadastrar } from "../pages/Cadastrar";
import { NotFound } from "../pages/NotFound";

export function LogarRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AuthLayout />}>
                <Route path="/" element={<Login />} />
                <Route path="/cadastrar" element={<Cadastrar />} />
            </Route>

            <Route path="*" element={<NotFound />}/>
        </Routes>
    )
}