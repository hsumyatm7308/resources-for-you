import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react"
import { Link } from "react-router"
import {
  adminApiConfigured,
  adminRequest,
  type AdminResourceRecord,
  type PublishStatus,
} from "./adminApi"
import { adminEmail, authClient } from "./auth"
import { categories, type Resource } from "./data"
import { useResources } from "./resourceStore"
import "./admin.css"

const statusLabels: Record<PublishStatus, string> = {
  published: "Published",
  draft: "Draft",
  archived: "Archived",
}

type Owner = {
  email: string
  name?: string
  image?: string | null
}

type ResourceForm = {
  resource: Resource
  status: PublishStatus
  detailsText: string
  topicsText: string
  speakersText: string
  prizesText: string
  linksText: string
}

function todayLabel() {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function emptyResource(): Resource {
  return {
    id: "",
    title: "",
    description: "",
    category: categories[0].name,
    type: "Event",
    source: "",
    meta: "",
    added: todayLabel(),
    image: "",
    imageAlt: "",
    color: "blue",
    tags: [],
    opportunity: true,
    eventStatus: "upcoming",
  }
}

function toForm(record?: AdminResourceRecord): ResourceForm {
  const resource = record ? { ...record.resource } : emptyResource()
  return {
    resource,
    status: record?.status || "draft",
    detailsText: resource.details?.paragraphs.join("\n\n") || "",
    topicsText: resource.topics?.join("\n") || "",
    speakersText:
      resource.speakers
        ?.map((speaker) => `${speaker.name} | ${speaker.role}`)
        .join("\n") || "",
    prizesText:
      resource.prizes
        ?.map((prize) => `${prize.place} | ${prize.amount}`)
        .join("\n") || "",
    linksText:
      resource.links?.map((link) => `${link.label} | ${link.url}`).join("\n") ||
      "",
  }
}

function lines(value: string) {
  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
}

function pairs(value: string) {
  return lines(value)
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter((parts) => parts.length >= 2 && parts[0] && parts[1])
}

function toResource(form: ResourceForm): Resource {
  const resource = {
    ...form.resource,
    tags: form.resource.tags.map((tag) => tag.trim()).filter(Boolean),
  }
  const paragraphs = form.detailsText
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  if (paragraphs.length || resource.details?.heading) {
    resource.details = {
      heading: resource.details?.heading || resource.title,
      paragraphs,
    }
  } else {
    delete resource.details
  }

  const speakers = pairs(form.speakersText).map(([name, role]) => ({
    name,
    role,
  }))
  if (speakers.length) resource.speakers = speakers
  else delete resource.speakers

  const topics = lines(form.topicsText)
  if (topics.length) resource.topics = topics
  else delete resource.topics

  const prizes = pairs(form.prizesText).map(([place, amount]) => ({
    place,
    amount,
  }))
  if (prizes.length) resource.prizes = prizes
  else delete resource.prizes

  const links = pairs(form.linksText).map(([label, url]) => ({ label, url }))
  if (links.length) resource.links = links
  else delete resource.links

  return resource
}

function resourceSummary(resource: Resource) {
  return [resource.category, resource.source, resource.type]
    .filter(Boolean)
    .join(" · ")
}

export default function AdminPage() {
  const { replaceResources } = useResources()
  const [owner, setOwner] = useState<Owner | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [loadingRecords, setLoadingRecords] = useState(false)
  const [records, setRecords] = useState<AdminResourceRecord[]>([])
  const [view, setView] = useState<"all" | PublishStatus>("all")
  const [query, setQuery] = useState("")
  const [editing, setEditing] =
    useState<AdminResourceRecord | null | undefined>()
  const [form, setForm] = useState<ResourceForm>(() => toForm())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  useEffect(() => {
    if (!authClient) {
      setCheckingSession(false)
      return
    }
    let active = true
    authClient
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (!active) return
        if (sessionError) setError(sessionError.message || "Could not check your sign-in session.")
        const user = data?.user
        if (user?.email) {
          setOwner({
            email: user.email,
            name: user.name,
            image: user.image,
          })
        }
      })
      .catch(() => {
        if (active) setError("Could not check your sign-in session.")
      })
      .finally(() => {
        if (active) setCheckingSession(false)
      })
    return () => {
      active = false
    }
  }, [])

  const isOwner = Boolean(owner && owner.email.toLowerCase() === adminEmail)

  useEffect(() => {
    if (!isOwner) return
    let active = true
    setLoadingRecords(true)
    adminRequest<AdminResourceRecord[]>("/admin/resources")
      .then((nextRecords) => {
        if (active) setRecords(nextRecords)
      })
      .catch((cause) => {
        if (active)
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not load resources.",
          )
      })
      .finally(() => {
        if (active) setLoadingRecords(false)
      })
    return () => {
      active = false
    }
  }, [isOwner])

  const filteredRecords = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return records.filter(({ resource, status }) => {
      const matchesStatus = view === "all" || status === view
      const matchesQuery =
        !normalized ||
        `${resource.title} ${resource.description} ${resource.category} ${resource.source}`
          .toLowerCase()
          .includes(normalized)
      return matchesStatus && matchesQuery
    })
  }, [records, query, view])

  const counts = useMemo(
    () => ({
      all: records.length,
      published: records.filter((record) => record.status === "published")
        .length,
      draft: records.filter((record) => record.status === "draft").length,
      archived: records.filter((record) => record.status === "archived").length,
    }),
    [records],
  )

  function syncPublicResources(nextRecords: AdminResourceRecord[]) {
    replaceResources(
      nextRecords
        .filter((record) => record.status === "published")
        .map((record) => record.resource),
    )
  }

  async function signIn() {
    if (!authClient) return
    setError("")
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/admin`,
        loginHint: adminEmail,
        additionalParams: { prompt: "select_account" },
      })
      if (result.error) setError(result.error.message || "Google sign-in could not start.")
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Google sign-in could not start.",
      )
    }
  }

  async function signOut() {
    if (!authClient) return
    await authClient.signOut()
    setOwner(null)
    setRecords([])
  }

  async function switchGoogleAccount() {
    await signOut()
    await signIn()
  }

  function openNewResource() {
    setForm(toForm())
    setEditing(null)
    setError("")
  }

  function openEditor(record: AdminResourceRecord) {
    setForm(toForm(record))
    setEditing(record)
    setError("")
  }

  function closeEditor() {
    if (busy) return
    setEditing(undefined)
    setError("")
  }

  function updateResource<K extends keyof Resource>(
    key: K,
    value: Resource[K],
  ) {
    setForm((current) => ({
      ...current,
      resource: { ...current.resource, [key]: value },
    }))
  }

  async function saveResource(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const resource = toResource(form)
    if (!resource.id.trim() || !resource.title.trim()) {
      setError("Add a title and URL slug before saving.")
      return
    }
    setBusy(true)
    setError("")
    try {
      const body = JSON.stringify({ resource, status: form.status })
      const record = await adminRequest<AdminResourceRecord>(
        editing
          ? `/admin/resources/${encodeURIComponent(editing.resource.id)}`
          : "/admin/resources",
        { method: editing ? "PUT" : "POST", body },
      )
      const nextRecords = editing
        ? records.map((item) =>
            item.resource.id === record.resource.id ? record : item,
          )
        : [record, ...records]
      setRecords(nextRecords)
      syncPublicResources(nextRecords)
      setEditing(undefined)
      setNotice(editing ? "Resource updated." : "Resource added.")
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The resource could not be saved.",
      )
    } finally {
      setBusy(false)
    }
  }

  async function changeStatus(
    record: AdminResourceRecord,
    status: PublishStatus,
  ) {
    setBusy(true)
    setError("")
    try {
      const updated = await adminRequest<AdminResourceRecord>(
        `/admin/resources/${encodeURIComponent(record.resource.id)}`,
        {
          method: "PUT",
          body: JSON.stringify({ resource: record.resource, status }),
        },
      )
      const nextRecords = records.map((item) =>
        item.resource.id === updated.resource.id ? updated : item,
      )
      setRecords(nextRecords)
      syncPublicResources(nextRecords)
      setNotice(
        status === "published"
          ? "Resource published."
          : `Moved to ${statusLabels[status].toLowerCase()}.`,
      )
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The resource status could not be changed.",
      )
    } finally {
      setBusy(false)
    }
  }

  async function removeResource(record: AdminResourceRecord) {
    const accepted = window.confirm(
      `Remove “${record.resource.title}” permanently?`,
    )
    if (!accepted) return
    setBusy(true)
    setError("")
    try {
      await adminRequest(
        `/admin/resources/${encodeURIComponent(record.resource.id)}`,
        {
          method: "DELETE",
        },
      )
      const nextRecords = records.filter(
        (item) => item.resource.id !== record.resource.id,
      )
      setRecords(nextRecords)
      syncPublicResources(nextRecords)
      setNotice("Resource removed.")
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "The resource could not be removed.",
      )
    } finally {
      setBusy(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="admin-gate">
        <span className="admin-loader" />
        Checking your session
      </div>
    )
  }

  if (!owner || !isOwner) {
    return (
      <main className="admin-gate">
        <section className="admin-login-card">
          <Link className="admin-brand" to="/">
            <img src="/favicon.svg" alt="" />
            <span>Resources For You</span>
          </Link>
          <span className="admin-eyebrow">Private workspace</span>
          <h1>
            {owner
              ? "This account can’t manage resources."
              : "Sign in to manage resources."}
          </h1>
          <p>
            {owner
              ? "This signed-in account does not have admin access. Switch to the Google account assigned to this workspace."
              : "The admin area is limited to the site owner’s Google account."}
          </p>
          {owner && (
            <div className="admin-account-mismatch">
              <span>Currently signed in as</span>
              <strong>{owner.email}</strong>
              <span>Admin account: {adminEmail || "not configured"}</span>
            </div>
          )}
          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}
          {!authClient || !adminApiConfigured ? (
            <div className="admin-setup-note">
              {!authClient
                ? "Sign-in is not connected yet. Add the Neon Auth URL to the app environment."
                : "The private content service needs to be deployed before admin sign-in is enabled."}
            </div>
          ) : owner ? (
            <button
              className="admin-primary-button"
              type="button"
              onClick={switchGoogleAccount}
            >
              <span className="google-mark" aria-hidden="true">
                G
              </span>
              Switch Google account
            </button>
          ) : (
            <button
              className="admin-primary-button"
              type="button"
              onClick={signIn}
            >
              <span className="google-mark" aria-hidden="true">
                G
              </span>
              Continue with Google
            </button>
          )}
          <Link className="admin-back-link" to="/">
            Back to Resources For You
          </Link>
        </section>
      </main>
    )
  }

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <Link className="admin-brand" to="/">
          <img src="/favicon.svg" alt="" />
          <span>Resources For You</span>
        </Link>
        <div className="admin-sidebar-label">Workspace</div>
        <div className="admin-side-item is-current">
          <span className="admin-side-icon">▦</span> Resources
          <span className="admin-side-count">{counts.all}</span>
        </div>
        <div className="admin-sidebar-bottom">
          <div className="admin-owner">
            {owner.image ? (
              <img src={owner.image} alt="" />
            ) : (
              <span>{owner.name?.[0] || "R"}</span>
            )}
            <div>
              <strong>{owner.name || "Site owner"}</strong>
              <small>{owner.email}</small>
            </div>
          </div>
          <button
            className="admin-quiet-button"
            type="button"
            onClick={signOut}
          >
            Sign out
          </button>
          <Link className="admin-quiet-link" to="/">
            View public site <AdminIcon name="arrow" size={15} />
          </Link>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <span>Content management</span>
          <span className="admin-session">
            <i /> Signed in as owner
          </span>
        </header>
        <section className="admin-content">
          <div className="admin-page-heading">
            <div>
              <span className="admin-eyebrow">Resources For You · Admin</span>
              <h1>Resources</h1>
              <p>Keep the listings accurate and ready for people to explore.</p>
            </div>
            <button
              className="admin-primary-button"
              type="button"
              onClick={openNewResource}
            >
              <span aria-hidden="true">＋</span> Add resource
            </button>
          </div>

          <div className="admin-stat-row">
            <div>
              <span>All resources</span>
              <strong>{counts.all}</strong>
            </div>
            <div>
              <span>Published</span>
              <strong>{counts.published}</strong>
            </div>
            <div>
              <span>Drafts</span>
              <strong>{counts.draft}</strong>
            </div>
          </div>

          <section className="admin-list-panel" aria-label="Manage resources">
            <div className="admin-list-heading">
              <div>
                <h2>Content library</h2>
                <span>{filteredRecords.length} shown</span>
              </div>
              <label className="admin-search">
                <AdminIcon name="search" size={17} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search resources"
                  aria-label="Search resources"
                />
              </label>
            </div>
            <div
              className="admin-tabs"
              role="tablist"
              aria-label="Resource status"
            >
              {([
                ["all", "All", counts.all],
                ["published", "Published", counts.published],
                ["draft", "Drafts", counts.draft],
                ["archived", "Archived", counts.archived],
              ] as const).map(([key, label, count]) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={view === key}
                  className={view === key ? "is-active" : ""}
                  key={key}
                  onClick={() => setView(key)}
                >
                  {label}
                  <span>{count}</span>
                </button>
              ))}
            </div>

            {error && (
              <div className="admin-error admin-inline-error" role="alert">
                {error}
              </div>
            )}
            {notice && (
              <div className="admin-notice" role="status">
                {notice}
                <button
                  type="button"
                  onClick={() => setNotice("")}
                  aria-label="Dismiss message"
                >
                  ×
                </button>
              </div>
            )}

            {loadingRecords ? (
              <div className="admin-empty">
                <span className="admin-loader" />
                Loading resources
              </div>
            ) : filteredRecords.length ? (
              <div className="admin-resource-list">
                {filteredRecords.map((record) => (
                  <article
                    className="admin-resource-row"
                    key={record.resource.id}
                  >
                    <img
                      className="admin-resource-image"
                      src={record.resource.image}
                      alt=""
                    />
                    <div className="admin-resource-copy">
                      <div className="admin-resource-title-row">
                        <h3>{record.resource.title}</h3>
                        <span
                          className={`admin-status status-${record.status}`}
                        >
                          {statusLabels[record.status]}
                        </span>
                      </div>
                      <p>{resourceSummary(record.resource)}</p>
                      <small>
                        {record.resource.meta || "No date or summary added"}
                      </small>
                    </div>
                    <div className="admin-row-actions">
                      <button type="button" onClick={() => openEditor(record)}>
                        Edit
                      </button>
                      {record.status === "published" ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => changeStatus(record, "draft")}
                        >
                          Unpublish
                        </button>
                      ) : record.status === "draft" ? (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => changeStatus(record, "published")}
                        >
                          Publish
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => changeStatus(record, "published")}
                        >
                          Restore
                        </button>
                      )}
                      <button
                        className="admin-more"
                        type="button"
                        aria-label={`More actions for ${record.resource.title}`}
                        onClick={() => removeResource(record)}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="admin-empty">
                <strong>
                  {query ? "No matching resources" : "Nothing here yet"}
                </strong>
                <span>
                  {query
                    ? "Try another title or source."
                    : "Add a resource to start building the library."}
                </span>
                {!query && (
                  <button
                    className="admin-primary-button"
                    type="button"
                    onClick={openNewResource}
                  >
                    Add resource
                  </button>
                )}
              </div>
            )}
          </section>
        </section>
      </main>

      {editing !== undefined && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEditor()
          }}
        >
          <section
            className="admin-editor"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resource-editor-title"
          >
            <header className="admin-editor-header">
              <div>
                <span className="admin-eyebrow">
                  {editing ? "Update listing" : "New listing"}
                </span>
                <h2 id="resource-editor-title">
                  {editing ? "Edit resource" : "Add a resource"}
                </h2>
              </div>
              <button
                className="admin-close-button"
                type="button"
                onClick={closeEditor}
                aria-label="Close editor"
              >
                ×
              </button>
            </header>
            <form className="admin-editor-form" onSubmit={saveResource}>
              <div className="admin-form-grid">
                <Field label="Title" required>
                  <input
                    value={form.resource.title}
                    onChange={(event) => {
                      const title = event.target.value
                      updateResource("title", title)
                      if (!editing && !form.resource.id)
                        updateResource("id", slugify(title))
                    }}
                    placeholder="Event or resource title"
                    required
                  />
                </Field>
                <Field label="URL slug" required>
                  <input
                    value={form.resource.id}
                    onChange={(event) =>
                      updateResource("id", slugify(event.target.value))
                    }
                    placeholder="resource-title"
                    readOnly={Boolean(editing)}
                    required
                  />
                </Field>
                <Field label="Category" required>
                  <select
                    value={form.resource.category}
                    onChange={(event) =>
                      updateResource(
                        "category",
                        event.target.value as Resource["category"],
                      )
                    }
                  >
                    {categories.map((item) => (
                      <option key={item.slug} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Type" required>
                  <select
                    value={form.resource.type}
                    onChange={(event) =>
                      updateResource(
                        "type",
                        event.target.value as Resource["type"],
                      )
                    }
                  >
                    {[
                      "Event",
                      "Website",
                      "Book",
                      "Article",
                      "Challenge",
                      "Course",
                    ].map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Organizer / source" required>
                  <input
                    value={form.resource.source}
                    onChange={(event) =>
                      updateResource("source", event.target.value)
                    }
                    placeholder="Who created this?"
                    required
                  />
                </Field>
                <Field label="Date or short metadata">
                  <input
                    value={form.resource.meta}
                    onChange={(event) =>
                      updateResource("meta", event.target.value)
                    }
                    placeholder="October 2026 · Online"
                  />
                </Field>
                <Field label="Access cost">
                  <select
                    value={form.resource.cost || ""}
                    onChange={(event) =>
                      updateResource(
                        "cost",
                        (event.target.value || undefined) as Resource["cost"],
                      )
                    }
                  >
                    <option value="">Not specified</option>
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </Field>
                <Field label="Price or fee label">
                  <input
                    value={form.resource.priceLabel || ""}
                    onChange={(event) =>
                      updateResource("priceLabel", event.target.value || undefined)
                    }
                    placeholder="10,000 MMK · Lunch included"
                  />
                </Field>
                <Field label="Publication status">
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        status: event.target.value as PublishStatus,
                      }))
                    }
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </Field>
                <Field label="Card color">
                  <select
                    value={form.resource.color}
                    onChange={(event) =>
                      updateResource("color", event.target.value)
                    }
                  >
                    {["blue", "purple", "orange", "green", "pink"].map(
                      (color) => (
                        <option key={color}>{color}</option>
                      ),
                    )}
                  </select>
                </Field>
                <Field label="Description" wide required>
                  <textarea
                    value={form.resource.description}
                    onChange={(event) =>
                      updateResource("description", event.target.value)
                    }
                    rows={3}
                    placeholder="A concise summary for the resource card"
                    required
                  />
                </Field>
                <Field label="Image URL" wide required>
                  <input
                    value={form.resource.image}
                    onChange={(event) =>
                      updateResource("image", event.target.value)
                    }
                    placeholder="https://… or /resources/image.jpg"
                    required
                  />
                </Field>
                <Field label="Image description" wide>
                  <input
                    value={form.resource.imageAlt || ""}
                    onChange={(event) =>
                      updateResource("imageAlt", event.target.value)
                    }
                    placeholder="Short description for screen readers"
                  />
                </Field>
                <Field label="Tags · comma separated" wide>
                  <input
                    value={form.resource.tags.join(", ")}
                    onChange={(event) =>
                      updateResource(
                        "tags",
                        event.target.value
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter(Boolean),
                      )
                    }
                    placeholder="AI, Yangon, Workshop"
                  />
                </Field>
              </div>

              <div className="admin-form-section">
                <div>
                  <span className="admin-eyebrow">Links</span>
                  <h3>Choose the next action</h3>
                  <p>
                    Application and announcement links stay in consistent places
                    on the public page.
                  </p>
                </div>
                <div className="admin-form-grid">
                  <Field label="Apply or register URL">
                    <input
                      type="url"
                      value={form.resource.ctaUrl || ""}
                      onChange={(event) =>
                        updateResource(
                          "ctaUrl",
                          event.target.value || undefined,
                        )
                      }
                      placeholder="https://forms.gle/…"
                    />
                  </Field>
                  <Field label="Button label">
                    <input
                      value={form.resource.ctaLabel || ""}
                      onChange={(event) =>
                        updateResource(
                          "ctaLabel",
                          event.target.value || undefined,
                        )
                      }
                      placeholder="Apply via Google Form"
                    />
                  </Field>
                  <Field label="Announcement URL" wide>
                    <input
                      type="url"
                      value={form.resource.announcementUrl || ""}
                      onChange={(event) =>
                        updateResource(
                          "announcementUrl",
                          event.target.value || undefined,
                        )
                      }
                      placeholder="https://facebook.com/…"
                    />
                  </Field>
                </div>
              </div>

              {form.resource.type === "Event" && (
                <div className="admin-form-section">
                  <div>
                    <span className="admin-eyebrow">Event information</span>
                    <h3>When and where</h3>
                    <p>
                      Past events keep their announcement link; application
                      links appear only while registration is relevant.
                    </p>
                  </div>
                  <div className="admin-form-grid">
                    <Field label="Event status">
                      <select
                        value={form.resource.eventStatus || "upcoming"}
                        onChange={(event) =>
                          updateResource(
                            "eventStatus",
                            event.target.value as Resource["eventStatus"],
                          )
                        }
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past</option>
                      </select>
                    </Field>
                    <Field label="Registration deadline">
                      <input
                        value={form.resource.deadline || ""}
                        onChange={(event) =>
                          updateResource(
                            "deadline",
                            event.target.value || undefined,
                          )
                        }
                        placeholder="Registration closes…"
                      />
                    </Field>
                    <Field label="Format">
                      <input
                        value={form.resource.format || ""}
                        onChange={(event) =>
                          updateResource(
                            "format",
                            event.target.value || undefined,
                          )
                        }
                        placeholder="Online · 7–8 PM"
                      />
                    </Field>
                    <Field label="Location">
                      <input
                        value={form.resource.location || ""}
                        onChange={(event) =>
                          updateResource(
                            "location",
                            event.target.value || undefined,
                          )
                        }
                        placeholder="Yangon or online"
                      />
                    </Field>
                    <Field label="Date tile · top line">
                      <input
                        value={form.resource.dateTile?.primary || ""}
                        onChange={(event) =>
                          updateResource("dateTile", {
                            primary: event.target.value,
                            secondary: form.resource.dateTile?.secondary || "",
                          })
                        }
                        placeholder="OCT"
                      />
                    </Field>
                    <Field label="Date tile · lower line">
                      <input
                        value={form.resource.dateTile?.secondary || ""}
                        onChange={(event) =>
                          updateResource("dateTile", {
                            primary: form.resource.dateTile?.primary || "",
                            secondary: event.target.value,
                          })
                        }
                        placeholder="25 · 2026"
                      />
                    </Field>
                  </div>
                </div>
              )}

              <details className="admin-advanced-fields">
                <summary>More details</summary>
                <div className="admin-form-grid">
                  <Field label="About this resource · heading" wide>
                    <input
                      value={form.resource.details?.heading || ""}
                      onChange={(event) =>
                        updateResource("details", {
                          heading: event.target.value,
                          paragraphs: form.resource.details?.paragraphs || [],
                        })
                      }
                      placeholder="Optional details heading"
                    />
                  </Field>
                  <Field
                    label="Long description · separate paragraphs with a blank line"
                    wide
                  >
                    <textarea
                      value={form.detailsText}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          detailsText: event.target.value,
                        }))
                      }
                      rows={6}
                      placeholder="Add the full event or resource description."
                    />
                  </Field>
                  <Field label="Speaker name">
                    <input
                      value={form.resource.speaker?.name || ""}
                      onChange={(event) =>
                        updateResource(
                          "speaker",
                          event.target.value
                            ? {
                                name: event.target.value,
                                role: form.resource.speaker?.role || "",
                              }
                            : undefined,
                        )
                      }
                    />
                  </Field>
                  <Field label="Speaker role">
                    <input
                      value={form.resource.speaker?.role || ""}
                      onChange={(event) =>
                        updateResource("speaker", {
                          name: form.resource.speaker?.name || "",
                          role: event.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="Panel speakers · one Name | Role per line" wide>
                    <textarea
                      value={form.speakersText}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          speakersText: event.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </Field>
                  <Field label="Discussion topics · one per line" wide>
                    <textarea
                      value={form.topicsText}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          topicsText: event.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </Field>
                  <Field label="Prizes · Place | Amount per line" wide>
                    <textarea
                      value={form.prizesText}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          prizesText: event.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </Field>
                  <Field label="Other links · Label | URL per line" wide>
                    <textarea
                      value={form.linksText}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          linksText: event.target.value,
                        }))
                      }
                      rows={3}
                    />
                  </Field>
                  <Field label="License or usage notes" wide>
                    <input
                      value={form.resource.license || ""}
                      onChange={(event) =>
                        updateResource("license", event.target.value || undefined)
                      }
                      placeholder="Optional license or usage notes"
                    />
                  </Field>
                </div>
              </details>

              <div className="admin-checkbox-row">
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(form.resource.opportunity)}
                    onChange={(event) =>
                      updateResource("opportunity", event.target.checked)
                    }
                  />{" "}
                  Show in opportunities
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={Boolean(form.resource.featured)}
                    onChange={(event) =>
                      updateResource("featured", event.target.checked)
                    }
                  />{" "}
                  Feature on home page
                </label>
              </div>

              {error && (
                <div className="admin-error" role="alert">
                  {error}
                </div>
              )}
              <footer className="admin-editor-footer">
                <button
                  className="admin-secondary-button"
                  type="button"
                  onClick={closeEditor}
                  disabled={busy}
                >
                  Cancel
                </button>
                <button
                  className="admin-primary-button"
                  type="submit"
                  disabled={busy}
                >
                  {busy
                    ? "Saving…"
                    : form.status === "published"
                      ? "Save and publish"
                      : "Save resource"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function Field({
  label,
  required = false,
  wide = false,
  children,
}: {
  label: string
  required?: boolean
  wide?: boolean
  children: ReactNode
}) {
  return (
    <label className={`admin-field ${wide ? "field-wide" : ""}`}>
      <span>
        {label}
        {required && <i> · required</i>}
      </span>
      {children}
    </label>
  )
}

function AdminIcon({
  name,
  size = 20,
}: {
  name: "arrow" | "search"
  size?: number
}) {
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
      {name === "search" ? (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </>
      ) : (
        <>
          <path d="M5 12h14" />
          <path d="m14 7 5 5-5 5" />
        </>
      )}
    </svg>
  )
}
