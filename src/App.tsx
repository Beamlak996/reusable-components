import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AllApps } from "./pages/all-apps";
import { Authentication } from "./pages/authentication";
import { Stroage } from "./pages/storage";
import { Settings } from "lucide-react";
import { Build } from "./pages/build";
import { Analytics } from "./pages/analytics";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AllApps />} />
        <Route path="/authentication" element={<Authentication />} />
        <Route path="/stroage" element={<Stroage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/build/:bID" element={<Build />} />
        <Route path="/analytics/:aID" element={<Analytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
