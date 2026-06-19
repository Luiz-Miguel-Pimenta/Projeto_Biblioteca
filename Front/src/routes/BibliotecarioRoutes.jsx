import { Route, Routes } from "react-router";
import { PainelBibliotecario } from "../pages/PainelBibliotecario";
import { AppLayout } from "../components/AppLayout";
import { NotFound } from "../pages/NotFound";

export function BibliotecarioRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
          
          <Route index element={<PainelBibliotecario />} />
          
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}