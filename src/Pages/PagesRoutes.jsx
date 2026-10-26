
import { Routes, Route } from "react-router-dom";

import Features from "./Features/Feature";
import HowItWorks from "./HowItWorks/HowItWorks";
import Testimonials from "./Testimonial/Testimonial";

function PagesRoutes() {
  return (
    <Routes>
      {/* Home page */}
      <Route
        path="/"
        element={
          <>
            <Features />
          </>
        }
      />

      {/* Separate routes */}
      <Route path="/features" element={<Features />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/testimonials" element={<Testimonials />} />
    </Routes>
  );
}

export default PagesRoutes;
