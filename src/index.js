import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

// Suppress ResizeObserver loop error (benign error yang tidak mempengaruhi fungsionalitas)
const resizeObserverErr = window.onerror;
window.onerror = (message, ...args) => {
  if (typeof message === "string" && message.includes("ResizeObserver loop")) {
    return true;
  }
  if (resizeObserverErr) {
    return resizeObserverErr(message, ...args);
  }
  return false;
};

// Juga handle untuk unhandledrejection
window.addEventListener("error", (e) => {
  if (e.message && e.message.includes("ResizeObserver loop")) {
    e.stopPropagation();
    e.preventDefault();
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  React.createElement(
    React.StrictMode,
    null,
    React.createElement(BrowserRouter, null, React.createElement(App)),
  ),
);
