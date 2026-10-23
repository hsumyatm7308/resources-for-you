import React from "react"
import ReactDOM from "react-dom/client"
import App from "./app/App"
import "./index.css"
import "./app/explore.css"
import "./app/home-search.css"
import "./app/resource-details.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
