import { RouterProvider } from "react-router"
import { SavedProvider, router } from "./routes"

export default function App() {
  return (
    <SavedProvider>
      <RouterProvider router={router} />
    </SavedProvider>
  )
}
