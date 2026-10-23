import {
  createContext,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react"
import {
  createBrowserRouter,
  Link,
  Navigate,
  NavLink,
  Outlet,
  ScrollRestoration,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router"
import { categories, categoryBySlug, collections, type Resource } from "./data"
import { useFilterSheet } from "./useFilterSheet"
import { useProgressiveResults } from "./useProgressiveResults"
import { useResources } from "./resourceStore"

type IconName = "arrow" | "bookmark" | "book" | "check" | "chevron" | "code" | "external" | "filter" | "layers" | "menu" | "search" | "spark" | "user" | "video" | "x"

const monthNumbers: Record<string, number> = {
  jan: 0,
  january: 0,
  feb: 1,
  february: 1,
  mar: 2,
  march: 2,
  apr: 3,
  april: 3,
  may: 4,
  jun: 5,
  june: 5,
  jul: 6,
  july: 6,
  aug: 7,
  august: 7,
  sep: 8,
  sept: 8,
  september: 8,
  oct: 9,
  october: 9,
  nov: 10,
  november: 10,
  dec: 11,
  december: 11,
}

function eventDate(resource: Resource) {
  if (resource.type !== "Event") return null

  const dateText = [
    resource.dateTile?.primary,
    resource.dateTile?.secondary,
    resource.meta,
  ]
    .filter(Boolean)
    .join(" ")
  const monthPattern =
    "January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec"
  const fullDate = dateText.match(
    new RegExp(`\\b(${monthPattern})\\s+(\\d{1,2})(?:\\s*[–—-]\\s*\\d{1,2})?[,\\s·]+(20\\d{2})\\b`, "i"),
  )
  const monthAndYear = dateText.match(
    new RegExp(`\\b(${monthPattern})\\s+(20\\d{2})\\b`, "i"),
  )

  if (fullDate) {
    const month = monthNumbers[fullDate[1].toLowerCase()]
    return new Date(Number(fullDate[3]), month, Number(fullDate[2])).getTime()
  }
  if (monthAndYear) {
    const month = monthNumbers[monthAndYear[1].toLowerCase()]
    return new Date(Number(monthAndYear[2]), month, 1).getTime()
  }
  return null
}

function prioritizeUpcomingEvents(matches: Resource[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTime = today.getTime()

  return matches
    .map((resource, index) => {
      const date = eventDate(resource)
      const rank =
        date !== null && date >= todayTime
          ? 0
          : date === null && resource.type === "Event" && resource.eventStatus === "upcoming"
            ? 1
            : 2
      return { resource, index, date, rank }
    })
    .sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank
      if (a.rank === 0 && a.date !== b.date) return (a.date ?? 0) - (b.date ?? 0)
      return a.index - b.index
    })
    .map(({ resource }) => resource)
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m14 7 5 5-5 5" />
      </>
    ),
    bookmark: (
      <path d="M6 4.8A1.8 1.8 0 0 1 7.8 3h8.4A1.8 1.8 0 0 1 18 4.8V21l-6-3.5L6 21Z" />
    ),
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5Z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5Z" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    code: (
      <>
        <path d="m9 8-4 4 4 4" />
        <path d="m15 8 4 4-4 4" />
      </>
    ),
    external: (
      <>
        <path d="M14 5h5v5" />
        <path d="m19 5-9 9" />
        <path d="M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" />
      </>
    ),
    filter: (
      <>
        <path d="M4 6h16" />
        <path d="M7 12h10" />
        <path d="M10 18h4" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 17h16" />
      </>
    ),
    spark: (
      <>
        <path d="M12 3c.7 4.7 2.3 6.3 7 7-4.7.7-6.3 2.3-7 7-.7-4.7-2.3-6.3-7-7 4.7-.7 6.3-2.3 7-7Z" />
        <path d="M5 17c.3 2 1 2.7 3 3-2 .3-2.7 1-3 3-.3-2-1-2.7-3-3 2-.3 2.7-1 3-3Z" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21a7 7 0 0 1 14 0" />
      </>
    ),
    video: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m10 9 5 3-5 3Z" />
      </>
    ),
    x: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),
  }
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

type SavedContextType = {
  saved: string[]
  toggleSaved: (id: string) => void
}

const SavedContext = createContext<SavedContextType>({
  saved: [],
  toggleSaved: () => undefined,
})

const savedResourceIdAliases: Record<string, string> = {
  "typescript-deep-dive": "rockstar-developer-2025",
  "beautiful-portfolios": "godly-web-design-inspiration",
  "inclusive-components": "api-book-ei-maung",
  "land-book": "visuelle-graphic-design",
  "accessibility-workshop": "fde-career-webinar",
}

export function SavedProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      const stored: unknown = JSON.parse(
        localStorage.getItem("rfu-saved") || "[]",
      )
      if (!Array.isArray(stored)) return []
      const migratedIds = stored
        .filter((id): id is string => typeof id === "string")
        .map((id) => savedResourceIdAliases[id] || id)
      return [...new Set(migratedIds)]
    } catch {
      return []
    }
  })
  useEffect(
    () => localStorage.setItem("rfu-saved", JSON.stringify(saved)),
    [saved],
  )
  const toggleSaved = (id: string) =>
    setSaved((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id],
    )

  return (
    <SavedContext.Provider value={{ saved, toggleSaved }}>
      {children}
    </SavedContext.Provider>
  )
}

function useSaved() {
  return useContext(SavedContext)
}

function getSavedResources(savedIds: string[], resources: Resource[]) {
  return resources.filter((resource) => savedIds.includes(resource.id))
}

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const location = useLocation()
  const { saved } = useSaved()
  const { resources } = useResources()
  const savedResourceCount = getSavedResources(saved, resources).length

  useEffect(() => {
    if (!menuOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [menuOpen])

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection(null)
      return
    }

    const sectionIds = ["categories", "collections", "about"]
    const updateActiveSection = () => {
      const currentSection = sectionIds.find((id) => {
        const section = document.getElementById(id)
        if (!section) return false
        const bounds = section.getBoundingClientRect()
        return bounds.top <= 120 && bounds.bottom > 120
      })
      setActiveSection(currentSection ?? null)
    }

    updateActiveSection()
    window.addEventListener("scroll", updateActiveSection, { passive: true })
    window.addEventListener("resize", updateActiveSection)
    return () => {
      window.removeEventListener("scroll", updateActiveSection)
      window.removeEventListener("resize", updateActiveSection)
    }
  }, [location.pathname])

  return (
    <div className="site-shell">
      <header className="topbar">
        <Link className="wordmark" to="/" onClick={() => setMenuOpen(false)}>
          <img className="brand-monogram" src="/favicon.svg" alt="" />
          <span className="logo-copy">
            <strong>Resources For You</strong>
            <small>Discover. Learn. Create.</small>
          </span>
        </Link>
        <button
          className="mobile-menu"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? "x" : "menu"} />
        </button>
        <nav
          id="primary-navigation"
          className={menuOpen ? "open" : ""}
          aria-label="Main navigation"
        >
          <NavLink to="/explore" onClick={() => setMenuOpen(false)}>
            Explore
          </NavLink>
          <Link
            to="/#categories"
            className={activeSection === "categories" ? "active" : undefined}
            aria-current={
              activeSection === "categories" ? "location" : undefined
            }
            onClick={() => setMenuOpen(false)}
          >
            Categories
          </Link>
          <Link
            to="/#collections"
            className={activeSection === "collections" ? "active" : undefined}
            aria-current={
              activeSection === "collections" ? "location" : undefined
            }
            onClick={() => setMenuOpen(false)}
          >
            Collections
          </Link>
          <Link
            to="/#about"
            className={activeSection === "about" ? "active" : undefined}
            aria-current={activeSection === "about" ? "location" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
        </nav>
        <div className="header-actions">
          <Link to="/explore" className="icon-button" aria-label="Search">
            <Icon name="search" size={19} />
          </Link>
          <Link to="/saved" className="saved-link" aria-label="Saved resources">
            <Icon name="bookmark" size={19} />
            <span>Saved</span>
            {savedResourceCount > 0 && <b>{savedResourceCount}</b>}
          </Link>
          <Link className="avatar-button" to="/admin" aria-label="Admin panel">
            <Icon name="user" size={18} />
          </Link>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer" id="about">
      <div className="footer-top">
        <div className="footer-intro">
          <Link className="wordmark footer-logo" to="/">
            <img className="brand-monogram" src="/favicon.svg" alt="" />
            <span className="logo-copy">
              <strong>Resources For You</strong>
              <small>Discover. Learn. Create.</small>
            </span>
          </Link>
          <p>
            A curated home for resources that help curious people learn, build,
            and create meaningful work.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <strong>Explore</strong>
            <Link to="/explore">All resources</Link>
            <Link to="/#categories">Categories</Link>
            <Link to="/#collections">Collections</Link>
          </div>
          <div>
            <strong>Topics</strong>
            <Link to="/explore/workshops-webinars">Events & workshops</Link>
            <Link to="/explore/hackathons-challenges">Hackathons</Link>
            <Link to="/explore/books-knowledge">Books & guides</Link>
          </div>
          <div>
            <strong>More</strong>
            <Link to="/explore/design-references">Design references</Link>
            <Link to="/explore/graphic-design">Graphic design</Link>
            <Link to="/saved">Saved resources</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          Good resources can change your next step. Let&apos;s find them
          together.
        </p>
        <span>© {new Date().getFullYear()} RFU</span>
      </div>
    </footer>
  )
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  link,
  linkLabel,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  link?: string
  linkLabel?: string
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {link && (
        <Link className="text-link" to={link}>
          {linkLabel} <Icon name="arrow" size={17} />
        </Link>
      )}
    </div>
  )
}

function SearchForm({
  initial = "",
  compact = false,
  onQueryChange,
}: {
  initial?: string
  compact?: boolean
  onQueryChange?: (query: string) => void
}) {
  const [query, setQuery] = useState(initial)
  const [isFocused, setIsFocused] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const navigate = useNavigate()
  const { resources } = useResources()
  const suggestionListId = useId()

  useEffect(() => setQuery(initial), [initial])

  const matchingResources = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (compact || normalized.length < 2) return []

    return prioritizeUpcomingEvents(
      resources.filter((resource) =>
        [
          resource.title,
          resource.description,
          resource.category,
          resource.source,
          ...resource.tags,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalized),
      ),
    ).slice(0, 5)
  }, [compact, query, resources])

  const showSuggestions = !compact && isFocused && query.trim().length >= 2

  function openResource(resource: Resource) {
    setIsFocused(false)
    navigate(`/resource/${resource.id}`)
  }

  function handleSearchKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (!showSuggestions) return

    if (event.key === "Escape") {
      setIsFocused(false)
      setActiveSuggestion(-1)
      return
    }

    if (matchingResources.length === 0) return

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveSuggestion((current) => (current + 1) % matchingResources.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveSuggestion((current) =>
        current <= 0 ? matchingResources.length - 1 : current - 1,
      )
    } else if (event.key === "Enter" && matchingResources[activeSuggestion]) {
      event.preventDefault()
      openResource(matchingResources[activeSuggestion])
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    if (onQueryChange) {
      onQueryChange(query)
      return
    }
    const term = query.trim()
    navigate(`/explore${term ? `?q=${encodeURIComponent(term)}` : ""}`)
  }

  return (
    <form
      className={`global-search ${compact ? "compact" : "home-search"}`}
      onSubmit={submit}
    >
      <Icon name="search" size={22} />
      <input
        value={query}
        role={!compact ? "combobox" : undefined}
        aria-autocomplete={!compact ? "list" : undefined}
        aria-haspopup={!compact ? "listbox" : undefined}
        aria-expanded={!compact ? showSuggestions : undefined}
        aria-controls={!compact ? suggestionListId : undefined}
        aria-activedescendant={
          showSuggestions && activeSuggestion >= 0
            ? `${suggestionListId}-option-${activeSuggestion}`
            : undefined
        }
        onChange={(event) => {
          const value = event.target.value
          setQuery(value)
          setActiveSuggestion(-1)
          onQueryChange?.(value)
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => window.setTimeout(() => setIsFocused(false), 120)}
        onKeyDown={handleSearchKeyDown}
        autoComplete="off"
        placeholder="Search resources or topics…"
        aria-label="Search resources"
      />
      {query && (
        <button
          type="button"
          className="clear-search"
          onClick={() => {
            setQuery("")
            setActiveSuggestion(-1)
            onQueryChange?.("")
          }}
          aria-label="Clear search"
        >
          <Icon name="x" size={17} />
        </button>
      )}
      <button
        className="search-submit"
        type="submit"
        aria-label="Search resources"
      >
        <span>Search</span> <Icon name="arrow" size={17} />
      </button>
      {!compact && showSuggestions && (
        <div className="home-search-dropdown">
          <div className="home-search-dropdown-title">
            {matchingResources.length
              ? "Matching resources"
              : "No matching resources"}
          </div>
          <div
            className="home-search-options"
            id={suggestionListId}
            role="listbox"
            aria-label="Matching resources"
          >
            {matchingResources.map((resource, index) => (
              <button
                className="home-search-option"
                id={`${suggestionListId}-option-${index}`}
                key={resource.id}
                type="button"
                role="option"
                aria-selected={activeSuggestion === index}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => openResource(resource)}
              >
                <span className="home-search-result-copy">
                  <strong>{resource.title}</strong>
                  <small>
                    {resource.category} <i /> {resource.type}
                  </small>
                </span>
                <Icon name="arrow" size={17} />
              </button>
            ))}
          </div>
          {!matchingResources.length && (
            <p className="home-search-empty">
              Try another title, topic, or category.
            </p>
          )}
          <button
            className="home-search-all"
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() =>
              navigate(`/explore?q=${encodeURIComponent(query.trim())}`)
            }
          >
            Search all resources <Icon name="arrow" size={15} />
          </button>
        </div>
      )}
    </form>
  )
}

function SaveButton({ id }: { id: string }) {
  const { saved, toggleSaved } = useSaved()
  const isSaved = saved.includes(id)
  return (
    <button
      className={`save-button ${isSaved ? "saved" : ""}`}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleSaved(id)
      }}
      aria-label={isSaved ? "Remove from saved" : "Save resource"}
      title={isSaved ? "Remove from saved" : "Save resource"}
    >
      <Icon name={isSaved ? "check" : "bookmark"} size={18} />
    </button>
  )
}

function ResourceCard({
  resource,
  layout = "card",
}: {
  resource: Resource
  layout?: "card" | "row"
}) {
  return (
    <article className={`resource-card ${layout === "row" ? "row-card" : ""}`}>
      <Link className="resource-image" to={`/resource/${resource.id}`}>
        <img src={resource.image} alt="" />
        <span className={`category-badge tone-${resource.color}`}>
          {resource.category}
        </span>
      </Link>
      <div className="resource-content">
        <div className="resource-meta">
          <span>{resource.type}</span>
          <i />
          <span>
            {resource.priceLabel || resource.cost || "Fee not listed"}
          </span>
          <span className="meta-detail">{resource.meta}</span>
        </div>
        <Link to={`/resource/${resource.id}`}>
          <h3>{resource.title}</h3>
        </Link>
        <p>{resource.description}</p>
        <div className="resource-footer">
          <span>By {resource.source}</span>
          <div>
            <SaveButton id={resource.id} />
            <Link
              className="external-button"
              to={`/resource/${resource.id}`}
              aria-label={`View ${resource.title}`}
            >
              <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

function Home() {
  const navigate = useNavigate()
  const { resources } = useResources()
  const featuredResource =
    resources.find((resource) => resource.featured) || resources[0]
  const opportunities = resources
    .filter(
      (resource) => resource.opportunity && resource.eventStatus !== "past",
    )
    .slice(0, 4)

  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <span className="hero-kicker">
            <Icon name="spark" size={15} /> Curated knowledge for curious minds
          </span>
          <h1>
            Find your next source
            <br />
            of <em>inspiration.</em>
          </h1>
          <p>
            Explore workshops, hackathons, books, design inspiration, and
            resources to help you grow.
          </p>
          <SearchForm />
          <div className="suggestions">
            <span>Try:</span>
            {[
              "App Development",
              "AI Career",
              "Workshops",
              "Hackathons",
              "Books",
              "Design Inspiration",
            ].map((term) => (
              <button
                key={term}
                onClick={() =>
                  navigate(`/explore?q=${encodeURIComponent(term)}`)
                }
              >
                {term}
              </button>
            ))}
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="visual-window">
            <div className="window-bar">
              <span />
              <span />
              <span />
            </div>
            <img src={featuredResource?.image || "/favicon.svg"} alt="" />
            <div className="visual-card">
              <span>{featuredResource?.category || "Explore the library"}</span>
              <strong>
                {featuredResource?.title ||
                  "Find your next source of inspiration."}
              </strong>
            </div>
          </div>
          <div className="floating-chip chip-one">2.5-month program</div>
          <div className="floating-chip chip-two">
            <Icon name="bookmark" size={15} /> Save for later
          </div>
        </div>
      </section>

      <section className="page-section" id="categories">
        <SectionHeading
          eyebrow="Browse your way"
          title="Explore by category"
          subtitle="Find the resources you need for your next step."
          link="/explore"
          linkLabel="View all resources"
        />
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              to={`/explore/${category.slug}`}
              className={`category-card tone-${category.tone}`}
              key={category.name}
            >
              <span className="category-icon">
                <Icon name={category.icon as IconName} size={23} />
              </span>
              <div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>
              <footer>
                <span>
                  {
                    resources.filter(
                      (resource) => resource.category === category.name,
                    ).length
                  }{" "}
                  resources
                </span>
                <span className="card-arrow">
                  <Icon name="arrow" size={17} />
                </span>
              </footer>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section tinted-section">
        <SectionHeading
          eyebrow="Editor’s selection"
          title="Featured resources"
          subtitle="Handpicked resources worth exploring."
          link="/explore"
          linkLabel="Explore everything"
        />
        <div className="resource-grid featured-grid">
          {resources
            .filter((resource) => resource.featured)
            .slice(0, 6)
            .map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
        </div>
      </section>

      <section className="page-section opportunities-section">
        <SectionHeading
          eyebrow="Upcoming"
          title="Don’t miss these opportunities"
          subtitle="Events and challenges with dates worth remembering."
          link="/explore?type=Event"
          linkLabel="View all opportunities"
        />
        <div className="opportunity-list">
          {opportunities.map((resource) => (
            <Link
              className="opportunity-row"
              to={`/resource/${resource.id}`}
              key={resource.id}
            >
              <div className={`date-tile tone-${resource.color}`}>
                <strong>
                  {resource.dateTile?.primary ||
                    resource.meta.split(" ")[1]?.replace(/[^0-9]/g, "") ||
                    "21"}
                </strong>
                <span>
                  {resource.dateTile?.secondary || resource.meta.split(" ")[0]}
                </span>
              </div>
              <div className="opportunity-info">
                <span>
                  {resource.format} ·{" "}
                  {resource.priceLabel || resource.cost || "Fee not listed"}
                </span>
                <h3>{resource.title}</h3>
                <p>{resource.source}</p>
              </div>
              <div className="deadline">
                <span>{resource.deadline ? "Registration" : "Location"}</span>
                <strong>
                  {resource.deadline || resource.location || "See details"}
                </strong>
              </div>
              <span className="details-action">
                View details <Icon name="chevron" size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section collections-section" id="collections">
        <SectionHeading
          eyebrow="Curated pathways"
          title="Collections to get you started"
          subtitle="Not sure where to begin? Start with a path made for you."
        />
        <div className="collection-grid">
          {collections.map((collection, index) => (
            <Link
              to={`/collections/${collection.id}`}
              className={`collection-card tone-${collection.tone}`}
              key={collection.id}
            >
              <div className="collection-cover">
                {collection.resourceIds.slice(0, 3).map((id, imageIndex) => {
                  const resource = resources.find((item) => item.id === id)
                  return (
                    <img
                      key={id}
                      src={resource?.image}
                      alt=""
                      className={`cover-${imageIndex + 1}`}
                    />
                  )
                })}
                <span>0{index + 1}</span>
              </div>
              <div className="collection-copy">
                <span>{collection.resourceIds.length} resources</span>
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
                <b>
                  Open collection <Icon name="arrow" size={16} />
                </b>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="page-section fresh-section">
        <SectionHeading
          eyebrow="New this week"
          title="Freshly added"
          link="/explore?sort=recent"
          linkLabel="See all resources"
        />
        <div className="fresh-list">
          {resources.slice(0, 6).map((resource) => (
            <Link to={`/resource/${resource.id}`} key={resource.id}>
              <span className={`fresh-icon tone-${resource.color}`}>
                <Icon
                  name={
                    resource.type === "Book"
                      ? "book"
                      : resource.type === "Event"
                        ? "video"
                        : "spark"
                  }
                  size={18}
                />
              </span>
              <div>
                <strong>{resource.title}</strong>
                <span>
                  {resource.category} · {resource.source}
                </span>
              </div>
              <time>{resource.added}</time>
              <Icon name="chevron" size={18} />
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

function Explore() {
  const { resources } = useResources()
  const { categorySlug } = useParams()
  const pathCategory = categoryBySlug(categorySlug)
  const [params, setParams] = useSearchParams()
  const filterSheet = useFilterSheet()
  const query = params.get("q") || ""
  const type = params.get("type") || ""
  const cost = params.get("cost") || ""
  const sort = params.get("sort") || "relevant"
  const selectedCategories = pathCategory
    ? [pathCategory.name]
    : params.getAll("category")

  function updateParam(
    key: string,
    value: string,
    { replace = false }: { replace?: boolean } = {},
  ) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace })
  }

  function updateSearchQuery(value: string) {
    updateParam("q", value.trim(), { replace: true })
  }

  function toggleCategory(name: string) {
    const next = new URLSearchParams(params)
    const current = next.getAll("category")
    next.delete("category")
    const updated = current.includes(name)
      ? current.filter((item) => item !== name)
      : [...current, name]
    updated.forEach((item) => next.append("category", item))
    setParams(next)
  }

  const results = useMemo(() => {
    const normalized = query.toLowerCase()
    const filtered = resources.filter((resource) => {
      const searchable = [
        resource.title,
        resource.description,
        resource.category,
        resource.source,
        ...resource.tags,
      ]
        .join(" ")
        .toLowerCase()
      return (
        (!query || searchable.includes(normalized)) &&
        (!selectedCategories.length ||
          selectedCategories.includes(resource.category)) &&
        (!type || resource.type === type) &&
        (!cost || resource.cost === cost)
      )
    })
    if (sort === "alphabetical")
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title))
    if (sort === "upcoming")
      return [...filtered].sort(
        (a, b) =>
          Number(b.opportunity && b.eventStatus !== "past") -
          Number(a.opportunity && a.eventStatus !== "past"),
      )
    return query ? prioritizeUpcomingEvents(filtered) : filtered
  }, [query, selectedCategories.join(","), type, cost, sort])

  const {
    visibleItems: visibleResults,
    hasMore,
    isLoadingMore,
    sentinelRef,
    loadMore,
  } = useProgressiveResults(results)

  const clearAll = () => setParams({})
  const activeFilters = [
    ...selectedCategories.map((value) => ({ key: "category", value })),
    ...(type ? [{ key: "type", value: type }] : []),
    ...(cost ? [{ key: "cost", value: cost }] : []),
  ]

  return (
    <>
      <section className="explore-hero">
        <div>
          <span className="eyebrow">Resource library</span>
          <h1>{pathCategory?.name || "Explore all resources"}</h1>
          <p>
            {pathCategory?.description ||
              "Search and filter our curated library to find exactly what helps you move forward."}
          </p>
        </div>
        <SearchForm initial={query} compact onQueryChange={updateSearchQuery} />
      </section>
      <section className="explore-layout">
        {filterSheet.isOpen && (
          <button
            className="filter-backdrop"
            type="button"
            aria-label="Close filters"
            onClick={filterSheet.close}
          />
        )}
        <aside
          ref={filterSheet.panelRef}
          id="resource-filters"
          className={filterSheet.isOpen ? "filters-open" : ""}
          role={filterSheet.isOpen ? "dialog" : "complementary"}
          aria-modal={filterSheet.isOpen ? true : undefined}
          aria-labelledby="filter-panel-title"
        >
          <div className="filter-title">
            <strong id="filter-panel-title">Filters</strong>
            <button
              ref={filterSheet.closeRef}
              type="button"
              onClick={filterSheet.close}
              aria-label="Close filters"
            >
              <Icon name="x" size={19} />
            </button>
          </div>
          {!pathCategory && (
            <fieldset>
              <legend>Category</legend>
              {categories.map((category) => (
                <label key={category.name}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.name)}
                    onChange={() => toggleCategory(category.name)}
                  />
                  <span>{category.name}</span>
                  <small>{category.count}</small>
                </label>
              ))}
            </fieldset>
          )}
          <fieldset>
            <legend>Resource type</legend>
            {["Website", "Event", "Book", "Article", "Challenge", "Course"].map(
              (item) => (
                <label key={item}>
                  <input
                    type="radio"
                    name="type"
                    checked={type === item}
                    onChange={() =>
                      updateParam("type", type === item ? "" : item)
                    }
                  />
                  <span>{item}</span>
                </label>
              ),
            )}
          </fieldset>
          <fieldset>
            <legend>Access</legend>
            {["Free", "Paid"].map((item) => (
              <label key={item}>
                <input
                  type="radio"
                  name="cost"
                  checked={cost === item}
                  onChange={() =>
                    updateParam("cost", cost === item ? "" : item)
                  }
                />
                <span>{item}</span>
              </label>
            ))}
          </fieldset>
          <button className="clear-filters" type="button" onClick={clearAll}>
            Reset all filters
          </button>
        </aside>
        <div className="results-area">
          <div className="results-toolbar">
            <div>
              <strong>
                Showing {visibleResults.length} of {results.length} resources
              </strong>
              {query && (
                <span>
                  for “<b>{query}</b>”
                </span>
              )}
            </div>
            <label className="sort-control desktop-sort-control">
              <span>Sort by</span>
              <select
                value={sort}
                onChange={(event) => updateParam("sort", event.target.value)}
              >
                <option value="relevant">Most relevant</option>
                <option value="recent">Recently added</option>
                <option value="upcoming">Upcoming deadlines</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </label>
          </div>
          <div className="explore-controls">
            <label className="sort-control mobile-sort-control">
              <span>Sort by</span>
              <select
                aria-label="Sort resources by"
                value={sort}
                onChange={(event) => updateParam("sort", event.target.value)}
              >
                <option value="relevant">Most relevant</option>
                <option value="recent">Recently added</option>
                <option value="upcoming">Upcoming deadlines</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </label>
            <button
              ref={filterSheet.triggerRef}
              className="mobile-filter-button"
              type="button"
              aria-expanded={filterSheet.isOpen}
              aria-haspopup="dialog"
              aria-controls="resource-filters"
              onClick={filterSheet.open}
            >
              <Icon name="filter" size={18} /> Filters
              {activeFilters.length > 0 && <b>{activeFilters.length}</b>}
            </button>
          </div>
          {activeFilters.length > 0 && (
            <div className="active-filters">
              {activeFilters.map((filter) => (
                <button
                  key={`${filter.key}-${filter.value}`}
                  onClick={() =>
                    filter.key === "category"
                      ? toggleCategory(filter.value)
                      : updateParam(filter.key, "")
                  }
                >
                  {filter.value} <Icon name="x" size={14} />
                </button>
              ))}
              <button className="clear-link" onClick={clearAll}>
                Clear all
              </button>
            </div>
          )}
          {results.length ? (
            <div className="resource-grid results-grid">
              {visibleResults.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No resources found"
              copy="Try a broader search or remove one of your active filters."
              action="Reset search & filters"
              onAction={clearAll}
            />
          )}
          {hasMore && (
            <div
              className={`load-more-status ${
                isLoadingMore ? "is-loading" : ""
              }`}
              ref={sentinelRef}
              aria-live="polite"
            >
              {isLoadingMore ? (
                <span className="loading-message">
                  <span className="loading-spinner" aria-hidden="true" />
                  Loading more resources…
                </span>
              ) : (
                <button type="button" onClick={loadMore}>
                  Load 6 more resources
                </button>
              )}
            </div>
          )}
          {!hasMore && results.length > 6 && (
            <p className="end-of-results" role="status">
              You’ve reached the end of the resources.
            </p>
          )}
        </div>
      </section>
    </>
  )
}

function EmptyState({
  title,
  copy,
  action,
  onAction,
}: {
  title: string
  copy: string
  action: string
  onAction?: () => void
}) {
  return (
    <div className="empty-state">
      <span>
        <Icon name="search" size={26} />
      </span>
      <h2>{title}</h2>
      <p>{copy}</p>
      {onAction ? (
        <button className="primary-button" onClick={onAction}>
          {action}
        </button>
      ) : (
        <Link className="primary-button" to="/explore">
          {action}
        </Link>
      )}
    </div>
  )
}

function ResourceDetail() {
  const { resources } = useResources()
  const { resourceId } = useParams()
  if (resourceId === "typescript-deep-dive") {
    return <Navigate to="/resource/rockstar-developer-2025" replace />
  }

  const resource = resources.find((item) => item.id === resourceId)
  if (!resource) return <NotFound />
  const related = resources
    .filter(
      (item) => item.category === resource.category && item.id !== resource.id,
    )
    .slice(0, 3)

  return (
    <>
      <section className="detail-hero">
        <div className="breadcrumbs">
          <Link to="/">Home</Link>
          <Icon name="chevron" size={14} />
          <Link to="/explore">Resources</Link>
          <Icon name="chevron" size={14} />
          <span>{resource.type}</span>
        </div>
        <div className="detail-grid">
          <div className="detail-copy">
            <span className={`category-badge tone-${resource.color}`}>
              {resource.category}
            </span>
            <h1>{resource.title}</h1>
            <p>{resource.description}</p>
            <div className="tag-row">
              {resource.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <div className="detail-actions">
              {resource.ctaUrl &&
                !(
                  resource.type === "Event" && resource.eventStatus === "past"
                ) && (
                  <a
                    className="primary-button"
                    href={resource.ctaUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {resource.ctaLabel ||
                      (resource.type === "Event" ? "Register now" : "Apply")}
                    <Icon name="external" size={17} />
                  </a>
                )}
              {resource.announcementUrl && (
                <a
                  className="announcement-button"
                  href={resource.announcementUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View event announcement
                  <Icon name="external" size={16} />
                </a>
              )}
              <SaveButton id={resource.id} />
            </div>
          </div>
          <div
            className={`detail-image ${
              resource.imageFit === "contain" ? "poster-detail-image" : ""
            }`}
          >
            <img
              className={resource.imageFit === "contain" ? "poster-image" : ""}
              src={resource.image}
              alt={resource.imageAlt || ""}
            />
          </div>
        </div>
      </section>
      <section className="detail-body">
        <div className="detail-description">
          <span className="eyebrow">About this resource</span>
          <h2>{resource.details?.heading || resource.title}</h2>
          {resource.details ? (
            resource.details.paragraphs.map((paragraph) => (
              <p key={paragraph} lang="my">
                {paragraph}
              </p>
            ))
          ) : (
            <>
              <p>{resource.description}</p>
            </>
          )}
          {resource.speaker && (
            <div className="resource-speaker" lang="my">
              <span className="eyebrow">Speaker</span>
              <strong>{resource.speaker.name}</strong>
              <p>{resource.speaker.role}</p>
            </div>
          )}
          {resource.speakers && resource.speakers.length > 0 && (
            <div className="resource-speaker" lang="my">
              <span className="eyebrow">Panel speakers</span>
              {resource.speakers.map((speaker) => (
                <div className="resource-speaker-entry" key={speaker.name}>
                  <strong>{speaker.name}</strong>
                  <p>{speaker.role}</p>
                </div>
              ))}
            </div>
          )}
          {resource.topics && resource.topics.length > 0 && (
            <div className="resource-topics" lang="my">
              <span className="eyebrow">Discussion topics</span>
              <ul>
                {resource.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </div>
          )}
          {resource.prizes && resource.prizes.length > 0 && (
            <div className="resource-prizes" lang="my">
              <span className="eyebrow">Hackathon awards</span>
              <ul>
                {resource.prizes.map((prize) => (
                  <li key={prize.place}>
                    <span>{prize.place}</span>
                    <strong>{prize.amount}</strong>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {resource.links && resource.links.length > 0 && (
            <div className="resource-links" lang="my">
              <span className="eyebrow">More information</span>
              {resource.links.map((item) => (
                <a
                  className="resource-link"
                  href={item.url}
                  key={item.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.label}
                  <Icon name="external" size={15} />
                </a>
              ))}
            </div>
          )}
        </div>
        <aside className="resource-facts">
          <h3>Resource details</h3>
          <dl>
            <div>
              <dt>Source</dt>
              <dd>{resource.source}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>{resource.type}</dd>
            </div>
            <div>
              <dt>Access</dt>
              <dd>{resource.priceLabel || resource.cost || "Not specified"}</dd>
            </div>
            {resource.license && (
              <div>
                <dt>License</dt>
                <dd>{resource.license}</dd>
              </div>
            )}
            <div>
              <dt>{resource.opportunity ? "Date" : "Details"}</dt>
              <dd>{resource.meta}</dd>
            </div>
            {resource.deadline && (
              <div>
                <dt>Deadline</dt>
                <dd>{resource.deadline}</dd>
              </div>
            )}
            {resource.format && (
              <div>
                <dt>Format</dt>
                <dd>{resource.format}</dd>
              </div>
            )}
            {resource.location && (
              <div>
                <dt>Location</dt>
                <dd>{resource.location}</dd>
              </div>
            )}
          </dl>
        </aside>
      </section>
      <section className="page-section related-section">
        <SectionHeading
          title="Related resources"
          subtitle="Keep exploring this topic."
        />
        <div className="resource-grid">
          {related.map((item) => (
            <ResourceCard key={item.id} resource={item} />
          ))}
        </div>
      </section>
    </>
  )
}

function CollectionDetail() {
  const { resources } = useResources()
  const { collectionId } = useParams()
  const collection = collections.find((item) => item.id === collectionId)
  if (!collection) return <NotFound />
  const items = collection.resourceIds
    .map((id) => resources.find((resource) => resource.id === id))
    .filter(Boolean) as Resource[]

  return (
    <>
      <section className={`collection-detail-hero tone-${collection.tone}`}>
        <div>
          <span className="eyebrow">Curated collection</span>
          <h1>{collection.title}</h1>
          <p>{collection.description}</p>
          <span>{items.length} thoughtfully selected resources</span>
        </div>
        <div className="collection-stack">
          {items.slice(0, 3).map((item, index) => (
            <img
              key={item.id}
              src={item.image}
              alt=""
              className={`stack-${index + 1}`}
            />
          ))}
        </div>
      </section>
      <section className="page-section">
        <SectionHeading
          title="Inside this collection"
          subtitle="A focused set of resources to help you make progress."
        />
        <div className="resource-grid">
          {items.map((item) => (
            <ResourceCard key={item.id} resource={item} />
          ))}
        </div>
      </section>
    </>
  )
}

function SavedPage() {
  const { saved } = useSaved()
  const { resources } = useResources()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const allSavedResources = getSavedResources(saved, resources)
  const filteredSavedResources = allSavedResources.filter(
    (resource) =>
      (!query ||
        `${resource.title} ${resource.description}`
          .toLowerCase()
          .includes(query.toLowerCase())) &&
      (!category || resource.category === category),
  )
  const savedResources = query
    ? prioritizeUpcomingEvents(filteredSavedResources)
    : filteredSavedResources

  return (
    <>
      <section className="simple-page-hero">
        <span className="eyebrow">Your personal library</span>
        <h1>Saved resources</h1>
        <p>Everything you bookmarked, ready when you are.</p>
      </section>
      <section className="saved-section page-section">
        {allSavedResources.length > 0 ? (
          <>
            <div
              className="saved-toolbar"
              role="search"
              aria-label="Filter saved resources"
            >
              <label
                className="saved-search-field"
                htmlFor="saved-resource-search"
              >
                <span className="saved-control-label">Search saved</span>
                <span className="saved-search-input">
                  <Icon name="search" size={18} />
                  <input
                    id="saved-resource-search"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Title or description"
                  />
                </span>
              </label>
              <label className="saved-category-field" htmlFor="saved-category">
                <span className="saved-control-label">Category</span>
                <span className="saved-category-select">
                  <select
                    id="saved-category"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    <option value="">All categories</option>
                    {categories.map((item) => (
                      <option key={item.name}>{item.name}</option>
                    ))}
                  </select>
                  <Icon name="chevron" size={16} />
                </span>
              </label>
              <span
                className="saved-result-count"
                role="status"
                aria-live="polite"
              >
                <strong>{savedResources.length}</strong>
                <span>saved</span>
              </span>
            </div>
            {savedResources.length ? (
              <div className="resource-grid">
                {savedResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Nothing matches"
                copy="Try a different search or category."
                action="Explore all resources"
              />
            )}
          </>
        ) : (
          <EmptyState
            title="Your saved list is ready for ideas"
            copy="Bookmark useful resources while you explore and they’ll appear here."
            action="Find resources to save"
          />
        )}
      </section>
    </>
  )
}

function NotFound() {
  return (
    <section className="not-found">
      <span>404</span>
      <h1>This resource wandered off.</h1>
      <p>Let’s get you back to something useful.</p>
      <Link className="primary-button" to="/">
        Return home
      </Link>
    </section>
  )
}

export const router = createBrowserRouter([
  {
    path: "/admin",
    lazy: async () => ({ Component: (await import("./AdminPage")).default }),
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "explore", Component: Explore },
      { path: "explore/:categorySlug", Component: Explore },
      { path: "resource/:resourceId", Component: ResourceDetail },
      { path: "collections/:collectionId", Component: CollectionDetail },
      { path: "saved", Component: SavedPage },
      { path: "*", Component: NotFound },
    ],
  },
])
