import { Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "@/auth/AuthContext";
import { GuestRoute } from "@/auth/GuestRoute";
import { ProtectedRoute } from "@/auth/ProtectedRoute";
import { LoginPage } from "@/pages/LoginPage";
import { ProjectsPlaceholderPage } from "@/pages/ProjectsPlaceholderPage";
import { RegisterPage } from "@/pages/RegisterPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/projects" replace />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/projects" element={<ProjectsPlaceholderPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/projects" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
