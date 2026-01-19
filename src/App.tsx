import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import HomePage from "./pages/HomePage";
import SectionPage from "./pages/SectionPage";
import AdminPage from "./pages/AdminPage";
import Header from "./components/Header";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/section/:id" element={<SectionPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
        <Toaster theme="dark" />
      </div>
    </Router>
  );
}
