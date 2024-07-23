import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/home";
import { ApplicationMaster } from "./application-master/first.page";
import { SecondPage } from "./application-master/second.page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/first" element={<ApplicationMaster />} />
        <Route path="/second" element={<SecondPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

