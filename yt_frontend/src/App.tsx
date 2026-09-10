import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { HomeScreen } from "@/screens/HomeScreen";
import { ProcessingScreen } from "@/screens/ProcessingScreen";
import { WorkspaceScreen } from "@/screens/WorkspaceScreen";
import { HistoryScreen } from "@/screens/HistoryScreen";
import { ROUTES } from "@/routes/paths";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={ROUTES.home} element={<HomeScreen />} />
        <Route path={ROUTES.workspace} element={<WorkspaceScreen />} />
        <Route path={ROUTES.history} element={<HistoryScreen />} />
      </Route>

      <Route path={ROUTES.processing} element={<ProcessingScreen />} />
      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  );
}
