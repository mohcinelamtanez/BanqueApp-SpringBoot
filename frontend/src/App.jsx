import { Routes, Route } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import ClientRoutes from "./routes/ClientRoutes";
export default function App() {
  return (
    <Routes>
      <Route path="/client/*" element={<ClientRoutes />} />
      <Route path="/*" element={<AppRoutes />} />
    </Routes>
  );
}
