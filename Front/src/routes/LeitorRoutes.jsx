import { Route, Routes } from "react-router";

import { AppLayout } from "../components/AppLayout";

import { NotFound } from "../pages/NotFound"
import { Catalogo } from "../pages/Catalogo";

export function LeitorRoutes() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route path="/" element={<Catalogo />} />
            
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}