import { RouterProvider } from "react-router"
import { SavedProvider, router } from "./routes"
import { ResourceProvider } from "./resourceStore"

export default function App() {
  return (
    <ResourceProvider>
      <SavedProvider>
        <RouterProvider router={router} />
      </SavedProvider>
    </ResourceProvider>
  )
}
