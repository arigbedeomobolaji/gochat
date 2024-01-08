import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import Auth from "@screens/Auth";
import Home from "./screens/Home";
import About from "./screens/About";
const App: React.FC = () => {
  return (
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  );
};
export default App;
