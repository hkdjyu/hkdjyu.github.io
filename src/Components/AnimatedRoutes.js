import React from "react";
import {Routes, Route, Navigate, useLocation} from "react-router-dom";
import Home from "../Pages/Home";
import Projects from "../Pages/Projects";
import Experience from "../Pages/Experience";
import ProjectDisplay from '../Pages/ProjectDisplay';
import {AnimatePresence} from "framer-motion";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/project/:id" element={<ProjectDisplay />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/*" element={ <Navigate to="/" /> } />
      </Routes>
    </AnimatePresence>
    
  );
}

export default AnimatedRoutes;