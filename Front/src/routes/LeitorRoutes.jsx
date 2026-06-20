import { Route, Routes } from "react-router";

import { AppLayout } from "../components/AppLayout";

import { NotFound } from "../pages/NotFound"
import { Catalogo } from "../pages/Catalogo";
import { Emprestimos } from "../pages/Emprestimos";

export function LeitorRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<Catalogo />} />
                <Route path="/meus-emprestimos" element={<Emprestimos />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}