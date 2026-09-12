import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { RouteFallback } from "@/components/layout/RouteFallback";
import { ROUTES } from "@/routes/paths";

const HomeScreen = lazy(() =>
  import("@/screens/HomeScreen").then((m) => ({ default: m.HomeScreen }))
);
const ProcessingScreen = lazy(() =>
  import("@/screens/ProcessingScreen").then((m) => ({ default: m.ProcessingScreen }))
);
const WorkspaceScreen = lazy(() =>
  import("@/screens/WorkspaceScreen").then((m) => ({ default: m.WorkspaceScreen }))
);
const HistoryScreen = lazy(() =>
  import("@/screens/HistoryScreen").then((m) => ({ default: m.HistoryScreen }))
);
const HowItWorksScreen = lazy(() =>
  import("@/screens/HowItWorksScreen").then((m) => ({ default: m.HowItWorksScreen }))
);

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path={ROUTES.home} element={<HomeScreen />} />
            <Route path={ROUTES.workspace} element={<WorkspaceScreen />} />
            <Route path={ROUTES.history} element={<HistoryScreen />} />
            <Route path={ROUTES.howItWorks} element={<HowItWorksScreen />} />
          </Route>

          <Route path={ROUTES.processing} element={<ProcessingScreen />} />
          <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
