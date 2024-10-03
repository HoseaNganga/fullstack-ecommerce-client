import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { DataProvider } from "./DataContext/DataContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <DataProvider>
                <App />
              </DataProvider>
            </>
          }
        />
      </Routes>
    </Router>
    <Toaster />
  </React.StrictMode>
);
