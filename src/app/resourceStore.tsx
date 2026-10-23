import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import { resources as builtInResources, type Resource } from "./data"

type ResourceContextValue = {
  resources: Resource[]
  replaceResources: (items: Resource[]) => void
}

const ResourceContext = createContext<ResourceContextValue>({
  resources: builtInResources,
  replaceResources: () => undefined,
})

const apiUrl = import.meta.env.VITE_RFU_API_URL?.replace(/\/$/, "")

export function ResourceProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState(builtInResources)

  useEffect(() => {
    if (!apiUrl) return
    let active = true

    fetch(`${apiUrl}/resources`)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load resources")
        return response.json() as Promise<Resource[]>
      })
      .then((nextItems) => {
        if (active && Array.isArray(nextItems)) setItems(nextItems)
      })
      .catch(() => undefined)

    return () => {
      active = false
    }
  }, [])

  return (
    <ResourceContext.Provider
      value={{ resources: items, replaceResources: setItems }}
    >
      {children}
    </ResourceContext.Provider>
  )
}

export function useResources() {
  return useContext(ResourceContext)
}
