import { useEffect } from "react"
import { Link } from "react-router"
import "./contact.css"

const contactEmail = "hsumyatm7308@gmail.com"

const messageTypes = [
  {
    title: "Suggest a resource",
    description: "Share a useful book, event, course, or website.",
    subject: "Resource suggestion for Resources For You",
    body: "Resource name:\nLink:\nWhy should it be included?",
  },
  {
    title: "Report a correction",
    description: "Let us know about a broken link or outdated detail.",
    subject: "Correction for Resources For You",
    body: "Resource link:\nWhat needs to be corrected?",
  },
  {
    title: "Ask a question",
    description: "Get in touch about the library or a listing.",
    subject: "Question for Resources For You",
    body: "",
  },
]

function mailto(subject: string, body: string) {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function ContactPage() {
  useEffect(() => {
    const previousTitle = document.title
    const pageDescription =
      "Suggest a resource, report an outdated detail, or get in touch with Resources For You."
    const selectors = [
      'meta[name="description"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:url"]',
      'meta[name="twitter:title"]',
      'meta[name="twitter:description"]',
    ]
    const previousContent = selectors.map((selector) =>
      document.querySelector<HTMLMetaElement>(selector)?.content,
    )
    const canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    )
    const previousCanonical = canonical?.href
    document.title = "Contact | Resources For You"
    const nextContent = [
      pageDescription,
      "Contact | Resources For You",
      pageDescription,
      `${window.location.origin}/contact`,
      "Contact | Resources For You",
      pageDescription,
    ]
    selectors.forEach((selector, index) => {
      const element = document.querySelector<HTMLMetaElement>(selector)
      if (element) element.content = nextContent[index]
    })
    if (canonical) canonical.href = `${window.location.origin}/contact`

    return () => {
      document.title = previousTitle
      selectors.forEach((selector, index) => {
        const element = document.querySelector<HTMLMetaElement>(selector)
        const previous = previousContent[index]
        if (element && previous !== undefined) element.content = previous
      })
      if (canonical && previousCanonical) canonical.href = previousCanonical
    }
  }, [])

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-copy">
          <span className="contact-eyebrow">Resources For You · Contact</span>
          <h1>
            Help make the
            <br />
            resource shelf <em>better.</em>
          </h1>
          <p>
            Found something worth sharing? Send a suggestion, flag a detail that
            needs attention, or ask us a question.
          </p>
          <div className="contact-signoff">
            <span aria-hidden="true" />
            Built for curious people who learn, build, and create.
          </div>
        </div>

        <aside className="contact-card" aria-labelledby="contact-card-title">
          <div className="contact-card-topline">
            <span>COMMUNITY INBOX</span>
            <span>RFU ↗</span>
          </div>
          <h2 id="contact-card-title">Start with a note.</h2>
          <p className="contact-card-intro">
            Choose what you’re writing about. Your email app will open with a
            useful subject and a few prompts.
          </p>

          <div className="contact-options">
            {messageTypes.map((message) => (
              <a
                className="contact-option"
                href={mailto(message.subject, message.body)}
                key={message.title}
              >
                <span className="contact-option-copy">
                  <strong>{message.title}</strong>
                  <small>{message.description}</small>
                </span>
                <span className="contact-option-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>

          <div className="contact-email">
            <span>Email</span>
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          </div>
          <div className="contact-channel">
            <span>Telegram channel</span>
            <a
              href="https://t.me/resourcesforyoubyjv"
              target="_blank"
              rel="noreferrer"
            >
              @resourcesforyoubyjv <span aria-hidden="true">↗</span>
            </a>
          </div>
        </aside>
      </section>

      <section className="contact-bottom">
        <p>Good resources travel by recommendation.</p>
        <Link to="/explore">Explore the library <span aria-hidden="true">↗</span></Link>
      </section>
    </div>
  )
}
