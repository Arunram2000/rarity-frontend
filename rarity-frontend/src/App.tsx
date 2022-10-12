import React from "react";
import { Route, Routes } from "react-router-dom";

import { Header } from "./components";
import { About, Collection, ContactUs, Home, ListYourProject } from "./pages";

const App: React.FC = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/list-your-project" element={<ListYourProject />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/:collection/*" element={<Collection />} />
      </Routes>
    </div>
  );
};

export default App;
