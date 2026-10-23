export type Category = "Workshops & Webinars" | "Hackathons & Challenges" | "Books & Knowledge" | "Design Reference Websites" | "Graphic Design"

export type Resource = {
  id: string
  title: string
  description: string
  category: Category
  type: "Website" | "Event" | "Book" | "Article" | "Challenge" | "Course"
  source: string
  meta: string
  cost?: "Free" | "Paid"
  priceLabel?: string
  added: string
  image: string
  color: string
  tags: string[]
  featured?: boolean
  opportunity?: boolean
  eventStatus?: "upcoming" | "past"
  deadline?: string
  format?: string
  location?: string
  dateTile?: {
    primary: string
    secondary: string
  }
  ctaUrl?: string
  ctaLabel?: string
  imageAlt?: string
  imageFit?: "cover" | "contain"
  details?: {
    heading: string
    paragraphs: string[]
  }
  speaker?: {
    name: string
    role: string
  }
  speakers?: {
    name: string
    role: string
  }[]
  topics?: string[]
  prizes?: {
    place: string
    amount: string
  }[]
  links?: {
    label: string
    url: string
  }[]
  license?: string
}

export const photos = {
  workshop:
    "https://images.unsplash.com/photo-1719159381981-1327b22aff9b?auto=format&fit=crop&w=1200&q=82",
}

const categoryDefinitions: {
  name: Category
  slug: string
  description: string
  icon: string
  tone: string
}[] = [
  {
    name: "Workshops & Webinars",
    slug: "workshops-webinars",
    description: "Learn from experts, live sessions, and practical workshops.",
    icon: "video",
    tone: "blue",
  },
  {
    name: "Hackathons & Challenges",
    slug: "hackathons-challenges",
    description:
      "Discover competitions, coding challenges, and opportunities to build.",
    icon: "code",
    tone: "purple",
  },
  {
    name: "Books & Knowledge",
    slug: "books-knowledge",
    description: "Explore books, guides, articles, and learning materials.",
    icon: "book",
    tone: "orange",
  },
  {
    name: "Graphic Design",
    slug: "graphic-design",
    description:
      "Explore visual identity, typography, illustration, and editorial design.",
    icon: "layers",
    tone: "orange",
  },
  {
    name: "Design Reference Websites",
    slug: "design-references",
    description:
      "Find inspiring websites, UI patterns, and creative portfolios.",
    icon: "spark",
    tone: "pink",
  },
]

export const resources: Resource[] = [
  {
    id: "appcube-developers-bootcamp",
    title: "AppCube Developers Bootcamp with Hackathon · Batch 2",
    description:
      "KBZPay Mini Apps invites aspiring developers in Yangon to learn AppCube and build a Mini App with a team.",
    category: "Workshops & Webinars",
    type: "Event",
    source: "KBZPay Mini Apps",
    meta: "November 2026 · 2.5 months",
    added: "October 23, 2026",
    image: "/resources/appcube-developers-bootcamp.jpg",
    imageAlt:
      "KBZPay AppCube Developers Bootcamp with Hackathon program poster",
    imageFit: "contain",
    color: "blue",
    tags: ["AppCube", "Mini Apps", "Low-code", "Hackathon", "Yangon"],
    featured: true,
    opportunity: true,
    format: "Online + in-person",
    location: "Yangon",
    dateTile: { primary: "NOV", secondary: "2026" },
    ctaUrl: "https://forms.gle/TYgb5jHuUAKk9m177",
    ctaLabel: "Apply via Google Form",
    details: {
      heading: "Build your Mini App with AppCube",
      paragraphs: [
        "အမြဲတိုးတက်ပြောင်းလဲနေတဲ့ AI ခေတ်ကြီးထဲမှာ ကိုယ့်ရဲ့ နည်းပညာစွမ်းရည်တွေကို မြှင့်တင်ဖို့ အဆင်သင့်ဖြစ်နေပြီလား? KBZPay Mini Apps က ရန်ကုန်မြို့မှာ AppCube Developers Bootcamp with Hackathon Program အမှတ်စဉ် (၂) ကို ဖွင့်လှစ်ပြီး ကိုယ့်ရဲ့ အိပ်မက်တွေကို အကောင်အထည်ဖော်ဖို့ ဖိတ်ခေါ်ထားပါတယ်။",
        "AppCube Basic Level မှာ AppCube Platform ရဲ့ Core Architecture ကို နားလည်စေပြီး UI Builder, Workflow Designer နဲ့ Data Modeling Tools တွေကို အသုံးပြုကာ functional Mini Apps တွေ ဖန်တီးနည်းကို လေ့လာရမှာပါ။",
        "Advanced Level မှာ Custom Business Logic, Advanced Workflows, APIs နဲ့ Payment Integration တွေကို ချိတ်ဆက်တည်ဆောက်နည်းကို သင်ယူရမှာပါ။ Reusability, Security, Performance နဲ့ Scalability ကိုလည်း လက်တွေ့လေ့လာနိုင်ပါတယ်။",
        "သင်တန်းကာလအတွင်း အဖွဲ့လိုက် Mini App တစ်ခု တည်ဆောက်ပြီး Hackathon မှာ ယှဉ်ပြိုင်ရပါမယ်။ AppCube Professional Instructor တွေက Online မှတစ်ဆင့် Live သင်ကြားပေးမှာဖြစ်ပြီး လူတွေ့ Recap Session တွေနဲ့ Project ကာလအတွင်း Supervisor တွေရဲ့ လမ်းညွှန်မှုလည်း ပါဝင်ပါတယ်။ ရွေးချယ်ခံရသူတွေကို အချိန်ဇယားအတိအကျ ပေးပို့သွားမှာဖြစ်ပြီး သင်တန်းဆင်းပွဲကို ရန်ကုန်မြို့ရှိ နိုင်ငံတကာအဆင့်မီ ဟိုတယ်တစ်ခုမှာ ကျင်းပမယ်လို့ ဖော်ပြထားပါတယ်။",
      ],
    },
    prizes: [
      { place: "ပထမဆု", amount: "၂၀ သိန်း" },
      { place: "ဒုတိယဆု", amount: "၁၅ သိန်း" },
      { place: "တတိယဆု", amount: "၁၀ သိန်း" },
    ],
    links: [
      {
        label: "AppCube အကြောင်း လေ့လာရန် · Facebook video",
        url: "https://www.facebook.com/share/v/1BW67AEQYF/",
      },
      {
        label: "Batch 1 photos · LinkedIn",
        url: "https://lnkd.in/p/gzQfue2t",
      },
      {
        label: "Batch 1 photos · Facebook",
        url: "https://www.facebook.com/share/1LgARDJQX4/?mibextid=wwXIfr",
      },
    ],
  },
  {
    id: "one-project-one-week-hackathon-2026",
    title: "One Project, One Week Hackathon · AI Edition 2026",
    description:
      "Past event · A free, in-person, seven-day team hackathon at Technortal Campus in Yangon, with AI workshops and industry mentorship.",
    category: "Hackathons & Challenges",
    type: "Challenge",
    source: "Technortal",
    meta: "Past event · May 25–31, 2026 · 7 days",
    cost: "Free",
    added: "October 23, 2026",
    image: "/resources/one-project-one-week-2026.svg",
    imageAlt: "One Project, One Week Hackathon 2026 · AI Edition",
    color: "purple",
    tags: ["Hackathon", "AI Edition", "Team project", "Yangon"],
    opportunity: true,
    eventStatus: "past",
    deadline: "Registration closed May 10, 2026",
    format: "In-person · 9am–4pm",
    location: "Technortal Campus, Times City, Yangon",
    dateTile: { primary: "MAY", secondary: "25–31 · 2026" },
    ctaUrl:
      "https://www.facebook.com/technortal/posts/pfbid02HgpASfmVFLvGiJoA2xc7dQ5DY22Z2JpacKP7UiT97Fut466HS3ctJrM9AT8uT4fyl",
    ctaLabel: "View event announcement",
    details: {
      heading: "Build a working project with a real team and deadline",
      paragraphs: [
        "One Project, One Week Hackathon ကို ၂၀၂၆ ခုနှစ်မှာ AI Edition အဖြစ် ပြန်လည်ကျင်းပပါတယ်။ မနှစ်က UAB Tower မှာ ၇ ရက်အတွင်း လူ ၃၆ ယောက်က တစ်ယောက်တည်းလာပြီး အသင်းဖွဲ့ကာ idea ကနေ working project အထိ တည်ဆောက်ခဲ့ကြပါတယ်။ ဒီနှစ်မှာ AI tools တွေကို project ထဲ ထည့်သုံးနိုင်သလို traditional project ပုံစံနဲ့လည်း ဝင်ပြိုင်နိုင်ပြီး AI ကို build process မှာ အသုံးချနည်းကို workshop နဲ့ mentor session တွေကနေ လေ့လာနိုင်ပါတယ်။",
        "Coding, programming, web သို့မဟုတ် mobile development လေ့လာထားသူတွေ၊ UI/UX designer တွေ၊ tutorial တွေကနေ လက်တွေ့ team project ဆီတက်ချင်သူတွေ၊ solo ကနေ team နဲ့ အလုပ်လုပ်ကြည့်ချင်သူတွေ၊ AI tools ကို စမ်းသုံးချင်သူတွေ၊ tech career သို့မဟုတ် ကိုယ်ပိုင် idea တွေကို တည်ဆောက်လိုသူတွေ ပါဝင်နိုင်ပါတယ်။ ကျွမ်းကျင်ပြီးသားဖြစ်ဖို့ မလိုဘဲ လေ့လာထားပြီး တကယ်ပါဝင်တည်ဆောက်ချင်စိတ်ရှိဖို့ အဓိကဖြစ်ပါတယ်။",
        "ဒီပွဲကို Technortal Campus, Times City, Yangon မှာ လူကိုယ်တိုင်တက်ရောက်ရမှာဖြစ်ပြီး ၂၀၂၆ မေလ ၂၅ ရက်မှ ၃၁ ရက်အထိ မနက် ၉ နာရီကနေ ညနေ ၄ နာရီအထိ ကျင်းပပါတယ်။ Registration ပိတ်ရက်က မေလ ၁၀ ရက်ဖြစ်ပြီး လျှောက်ထားသူတွေထဲမှ လူ ၃၀ ကို မေလ ၁၁ ရက်မှာ interview လုပ်ကာ ရွေးချယ်ဖို့ ကြေညာထားပါတယ်။ Solo လာသူတွေကို skill ကိုက်ညီတဲ့ အသင်းတွေနဲ့ ဖွဲ့စည်းပေးဖို့ interview လုပ်တာဖြစ်ပြီး စာမေးပွဲမဟုတ်ပါဘူး။ ပါဝင်သူတွေက ပွဲအစမှအဆုံးအထိ တက်ရောက်နိုင်ဖို့ လိုပါတယ်။",
        "ပါဝင်ကြေး အခမဲ့ဖြစ်ပြီး programming language မည်သည့်ဘာသာစကားကိုမဆို အသုံးပြုနိုင်ပါတယ်။ စီစဉ်သူတွေက အချိန်ပြည့် Wi-Fi၊ လျှပ်စစ်မီးနဲ့ brainstorming အတွက် နေရာများ ပြင်ဆင်ပေးကာ industry ထဲက senior များနဲ့ workshop၊ knowledge sharing နဲ့ mentorship session တွေ ပြုလုပ်မယ်လို့ ဖော်ပြထားပါတယ်။ ပွဲပြီးချိန်မှာ အဖွဲ့လိုက်တည်ဆောက်ထားတဲ့ working project၊ portfolio အတွေ့အကြုံနဲ့ လုပ်ငန်းခွင်က mentor တွေဆီက network ရရှိဖို့ ရည်ရွယ်ထားပါတယ်။",
      ],
    },
    links: [
      {
        label: "Registration form · deadline passed",
        url: "https://forms.gle/qnwAPvsM9wTtKtWL8",
      },
      {
        label: "Contact Technortal by email",
        url: "mailto:technortal@gmail.com",
      },
    ],
  },
  {
    id: "godly-web-design-inspiration",
    title: "Godly — Web Design Inspiration",
    description:
      "A curated source for discovering distinctive website design and digital experiences.",
    category: "Design Reference Websites",
    type: "Website",
    source: "Godly",
    meta: "Web design inspiration",
    added: "October 23, 2026",
    image: "/resources/godly-web-design.svg",
    imageAlt: "Godly web design inspiration resource artwork",
    ctaUrl: "https://godly.website/",
    ctaLabel: "Explore Godly",
    color: "pink",
    tags: ["Web design", "Digital experiences", "Inspiration"],
    featured: true,
    details: {
      heading: "Discover web design references",
      paragraphs: [
        "Godly is a design reference website for browsing web design examples and finding ideas for digital projects.",
        "Use it to explore visual directions, interactions, and page layouts while planning a website of your own.",
      ],
    },
  },
  {
    id: "smart-event-graphics-ai-workshop",
    title: "Smart Event Graphics with AI (Workshop)",
    description:
      "A hands-on Yangon-MCPA workshop for active members to create print-ready event graphics with Photoshop, Canva, and AI tools.",
    category: "Workshops & Webinars",
    type: "Event",
    source: "Yangon-MCPA",
    meta: "October 30, 2026 · 10 AM–2 PM · 20 seats",
    cost: "Paid",
    priceLabel: "10,000 MMK",
    added: "October 23, 2026",
    image: photos.workshop,
    imageAlt: "Design workshop workspace",
    color: "blue",
    tags: [
      "AI",
      "Graphic Design",
      "Event Materials",
      "Photoshop",
      "Canva",
      "Yangon",
    ],
    opportunity: true,
    eventStatus: "upcoming",
    deadline: "Registration closes when 20 seats are filled",
    format: "In-person · 10 AM–2 PM",
    location: "Building 14, Room 301, MICT Park, Hlaing Township, Yangon",
    dateTile: { primary: "OCT", secondary: "30 · 2026" },
    ctaUrl: "https://forms.gle/FP1Zhe33G2Td8oY46",
    ctaLabel: "Register via Google Form",
    details: {
      heading: "Create print-ready event graphics with AI",
      paragraphs: [
        "ရန်ကုန်တိုင်းဒေသကြီး ကွန်ပျူတာပညာရှင်အသင်း (Yangon-MCPA) အသင်းသားရေးရာကော်မတီက အသင်းသားများအတွက် ဖွင့်လှစ်မည့် စာတွေ့လက်တွေ့ workshop ဖြစ်ပါတယ်။ Photoshop, Canva နဲ့ AI tools တွေကို hybrid workflow အဖြစ် အသုံးပြုပြီး event backdrop, banner, vinyl stand နဲ့ certificate တွေအတွက် print-ready, pixel-perfect visual တွေ ဖန်တီးနည်းကို လေ့လာနိုင်ပါတယ်။",
        "Workshop ကို ၂၀၂၆ ခုနှစ် အောက်တိုဘာ ၃၀ ရက်၊ သောကြာနေ့ မနက် ၁၀ နာရီမှ နေ့လယ် ၂ နာရီအထိ MICT Park, အဆောင် (၁၄)၊ ဒုတိယထပ်၊ အခန်း (၃၀၁) မှာ ကျင်းပမှာဖြစ်ပါတယ်။ ကြေညာချက်အရ Active Member ၂၀ ဦးသာ လက်ခံပြီး တက်ရောက်သူတွေကို နေ့လယ်စာနဲ့ Certificate ပေးအပ်မှာဖြစ်ပါတယ်။ Laptop ယူလာရန် လိုအပ်ပါတယ်။",
        "Registration ဖွင့်ချိန်က ၂၀၂၆ အောက်တိုဘာ ၂၁ ရက် နေ့လယ် ၁၂ နာရီဖြစ်ပြီး လူဦးရေပြည့်ပါက form ကို ပိတ်မယ်လို့ ဖော်ပြထားပါတယ်။ တက်ရောက်ကြေးမှာ ၁၀,၀၀၀ ကျပ်ဖြစ်ပါတယ်။",
      ],
    },
    links: [
      {
        label: "Yangon-MCPA office · Email",
        url: "mailto:yrcpaoffice@gmail.com",
      },
      { label: "Yangon-MCPA office · Phone", url: "tel:+9519339220" },
    ],
  },
  {
    id: "workadventure-tiled-map-workshop",
    title: "WA – Tiled Map Workshop",
    description:
      "A free online session on building WorkAdventure virtual maps for VarCamp with Tiled, game assets, and practical mapping guidance.",
    category: "Workshops & Webinars",
    type: "Event",
    source: "VarCamp · VibeCode.Tours",
    meta: "Past event · October 17, 2026 · 7:30–8:30 AM",
    cost: "Free",
    added: "October 23, 2026",
    image: photos.workshop,
    imageAlt: "Online map design workshop",
    color: "blue",
    tags: [
      "WorkAdventure",
      "Tiled",
      "Virtual Events",
      "Game Assets",
      "VarCamp",
    ],
    opportunity: true,
    eventStatus: "past",
    format: "Online · Google Meet",
    location: "Online · Google Meet",
    dateTile: { primary: "OCT", secondary: "17 · 2026" },
    ctaUrl: "https://workadventu.re/",
    ctaLabel: "Explore WorkAdventure",
    details: {
      heading: "Design a virtual event map with WorkAdventure",
      paragraphs: [
        "ဒီအခမဲ့ online session မှာ WorkAdventure virtual map ပေါ်မှာ VarCamp ကို ဖန်တီးခဲ့တဲ့ အတွေ့အကြုံကို မျှဝေပြီး event အတွက် map နဲ့ room ပုံစံတွေ စီစဉ်နည်းကို လေ့လာနိုင်ပါတယ်။ ဒီနှစ်ကစပြီး VarCamp အတွက် map ကို team က တာဝန်ယူရေးဆွဲသွားမှာဖြစ်ပြီး အလားတူ event တွေ စီစဉ်သူတွေအတွက်လည်း အထောက်အကူဖြစ်စေဖို့ ရည်ရွယ်ထားပါတယ်။",
        "အဓိကအားဖြင့် Tiled နဲ့ map ဆွဲနည်း၊ game assets အသုံးပြုနည်း၊ WorkAdventure rooms, admins, links နဲ့ Web Editor အကြောင်းတွေ ပါဝင်ပါတယ်။ Google Meet session ကို ၂၀၂၆ အောက်တိုဘာ ၁၇ ရက်၊ စနေနေ့ မနက် ၇:၃၀ မှ ၈:၃၀ အထိ Calendar မှာ စီစဉ်ထားပြီး ကြေညာချက်စာသားမှာ တစ်နာရီ tutorial နဲ့ မိနစ် ၃၀ Q&A ပါမယ်လို့ ဖော်ပြထားပါတယ်။",
        "ကြိုတင်ပြင်ဆင်ရန် WorkAdventure account ဖွင့်ထားပြီး WA Starter Maps, Tiled Map Editor နဲ့ Node.js/npm သို့မဟုတ် NVM ကို အသင့်ပြင်ထားရန် အကြံပြုထားပါတယ်။ Session ပြီးနောက် ကိုယ်တိုင်ဆွဲထားတဲ့ map တွေ review လုပ်ဖို့ ၁၅ မိနစ် သို့မဟုတ် မိနစ် ၃၀ booking လုပ်နိုင်ပါတယ်။",
      ],
    },
    links: [
      { label: "VarCamp", url: "https://var.camp/" },
      { label: "VibeCode.Tours", url: "https://vibecode.tours/" },
      { label: "WorkAdventure", url: "https://workadventu.re/" },
      {
        label: "Download WA Starter Maps",
        url: "https://github.com/workadventure/map-starter-kit",
      },
      {
        label: "Download Tiled Map Editor",
        url: "https://www.mapeditor.org/download.html",
      },
      { label: "Install NVM", url: "https://github.com/nvm-sh/nvm" },
      {
        label: "Install Node.js and npm",
        url: "https://docs.npmjs.com/downloading-and-installing-node-js-and-npm",
      },
    ],
  },
  {
    id: "api-book-ei-maung",
    title: "API လိုတိုရှင်း",
    description:
      "အိမောင် (Fairway) ရဲ့ မြန်မာဘာသာ API guide။ HTTP, RESTful API, MongoDB, Node.js, Express, CORS နဲ့ authentication ကို လိုရင်းတိုရှင်း လေ့လာနိုင်ပါတယ်။",
    category: "Books & Knowledge",
    type: "Book",
    source: "Ei Maung · Fairway",
    meta: "Burmese · 114 pages · 2020",
    priceLabel: "Price not listed",
    added: "October 23, 2026",
    image: "/resources/api-lo-to-shin-ei-maung.png",
    imageAlt: "API လိုတိုရှင်း by Ei Maung, published by Fairway",
    ctaUrl: "https://eimaung.com/api",
    ctaLabel: "View book page",
    color: "orange",
    tags: ["API", "HTTP", "REST", "Node.js", "Express", "MongoDB"],
    details: {
      heading: "API နဲ့ web service တည်ဆောက်ခြင်း",
      paragraphs: [
        "အိမောင် (Fairway) ရေးသားထားတဲ့ မြန်မာဘာသာနဲ့ API မိတ်ဆက်စာအုပ်ဖြစ်ပါတယ်။ စာအုပ်မှာ API နဲ့ service အခြေခံ၊ HTTP request နဲ့ response၊ RESTful API နဲ့ response structure တို့ကို အဆင့်လိုက်ရှင်းပြထားပါတယ်။",
        "နောက်ပိုင်းအခန်းတွေမှာ MongoDB, Node.js, Express, CORS နဲ့ authentication ကို ဆက်လက်လေ့လာနိုင်ပါတယ်။ PDF ထဲမှာ စာမျက်နှာ ၁၁၄ မျက်နှာပါဝင်ပြီး မူပိုင်ခွင့်စာမျက်နှာမှာ ၂၀၂၀ ခုနှစ်အဖြစ် ဖော်ပြထားပါတယ်။",
      ],
    },
    links: [
      {
        label: "Book source code · GitHub",
        url: "https://github.com/eimg/api-book",
      },
    ],
  },
  {
    id: "visuelle-graphic-design",
    title: "Visuelle — Graphic Design and everything in between",
    description:
      "An independent graphic design and visual communications publication showcasing curated creative work from around the world.",
    category: "Graphic Design",
    type: "Website",
    source: "Visuelle",
    meta: "Graphic design · Branding · Typography",
    added: "October 23, 2026",
    image: "/resources/visuelle-graphic-design.svg",
    imageAlt: "Visuelle graphic design resource artwork",
    ctaUrl: "https://visuelle.co.uk/",
    ctaLabel: "Explore Visuelle",
    color: "orange",
    tags: [
      "Graphic Design",
      "Branding",
      "Typography",
      "Editorial",
      "Illustration",
      "Motion",
    ],
    featured: true,
    details: {
      heading: "Graphic design and visual communication",
      paragraphs: [
        "Visuelle is a graphic design and visual communications platform that curates work by creative studios, branding agencies, and designers.",
        "Browse examples across visual identity, packaging, typography, publishing, illustration, and digital design. The site says it was established in 2007 by David Bennett.",
      ],
    },
  },
  {
    id: "rockstar-developer-2025",
    title: "Rockstar Developer 2025",
    description:
      "အိမောင် (Fairway) ရဲ့ Full Stack JavaScript စာအုပ်။ React, Node.js, Express, database, React Native နဲ့ Next.js ကို project-based ပုံစံနဲ့ လေ့လာနိုင်ပါတယ်။",
    category: "Books & Knowledge",
    type: "Book",
    source: "Ei Maung · Fairway",
    meta: "Full Stack JavaScript · Burmese · 435 pages",
    priceLabel: "Price not listed",
    added: "October 23, 2026",
    image: "/resources/rockstar-developer-2025.png",
    imageAlt: "Rockstar Developer 2025 by Ei Maung, published by Fairway",
    ctaUrl: "https://eimaung.com/rockstar-developer/",
    ctaLabel: "View book page",
    color: "orange",
    tags: [
      "JavaScript",
      "React",
      "Node.js",
      "Express",
      "React Native",
      "Next.js",
    ],
    featured: true,
    license: "CC BY-NC-SA 4.0",
    details: {
      heading: "Full Stack JavaScript ကို project တွေနဲ့ လေ့လာပါ",
      paragraphs: [
        "Rockstar Developer 2025 ဟာ Full Stack JavaScript ကို အဓိကထားတဲ့ မြန်မာဘာသာစာအုပ်ဖြစ်ပြီး စာမျက်နှာ ၄၃၅ မျက်နှာ ပါဝင်ပါတယ်။",
        "မာတိကာမှာ Node.js နဲ့ npm, Vite ဖြင့် React project စတင်ခြင်း, React components နဲ့ state, forms, Context Provider, MUI, React Router, async/await တို့ ပါဝင်ပါတယ်။",
        "နောက်ထပ်အပိုင်းတွေမှာ SQLite နဲ့ Prisma, Express backend API, React Query, Expo နဲ့ React Native, API authentication, WebSocket, notifications နဲ့ Next.js server-side rendering project တို့ကို ဖော်ပြထားပါတယ်။ PDF ရဲ့ မူပိုင်ခွင့်စာမျက်နှာမှာ CC BY-NC-SA လိုင်စင်ကို ဖော်ပြထားပါတယ်။",
      ],
    },
    links: [
      {
        label: "Rockstar Developer 2025 source code · GitHub",
        url: "https://github.com/eimg/rsd25",
      },
      {
        label: "CC BY-NC-SA 4.0 license",
        url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
      },
    ],
  },
  {
    id: "ai-agent-cli-guide",
    title: "AI Agent CLI Guide",
    description:
      "A Burmese guide to using Claude Code, Codex CLI, OpenCode, and Qwen CLI, including a collaborative Claude Code + OpenCode workflow.",
    category: "Books & Knowledge",
    type: "Article",
    source: "saturngod · GitHub",
    meta: "Burmese guide · 4 AI coding CLIs",
    cost: "Free",
    added: "October 23, 2026",
    image: "/resources/ai-agent-cli-guide.svg",
    imageAlt:
      "AI Agent CLI Guide covering Claude Code, Codex, OpenCode, and Qwen CLI",
    color: "blue",
    tags: ["AI Agents", "CLI", "Claude Code", "Codex", "OpenCode", "Qwen"],
    featured: true,
    ctaUrl: "https://github.com/saturngod/ai_agent_cli_guide",
    ctaLabel: "Open GitHub guide",
    details: {
      heading: "AI coding agents တွေကို terminal မှာ အသုံးပြုခြင်း",
      paragraphs: [
        "saturngod ရေးသားထားတဲ့ မြန်မာဘာသာ AI Agent Guide ဖြစ်ပါတယ်။ Claude Code နဲ့ Codex CLI တို့မှာ ပါဝင်တဲ့ function တွေ၊ အသုံးပြုပုံနဲ့ လက်တွေ့အသုံးချနည်းတွေကို ဖော်ပြထားပါတယ်။",
        "Repository ထဲမှာ Claude Code, Codex, OpenCode နဲ့ Qwen CLI အတွက် သီးခြားလမ်းညွှန်တွေ ပါဝင်ပါတယ်။ Project instruction, configuration, tools, agents, MCP နဲ့ CLI workflows တွေအကြောင်းကို agent အလိုက် လေ့လာနိုင်ပါတယ်။",
        "Claude Code နဲ့ OpenCode ကို implementation နဲ့ review အတွက် ပူးတွဲအသုံးပြုပုံကိုလည်း အဆင့်လိုက်ရှင်းပြထားပါတယ်။",
      ],
    },
    links: [
      {
        label: "Claude Code + OpenCode collaborative workflow",
        url: "https://github.com/saturngod/ai_agent_cli_guide/blob/main/cc_op_work.md",
      },
      {
        label: "Codex CLI guide",
        url: "https://github.com/saturngod/ai_agent_cli_guide/blob/main/codex.md",
      },
      {
        label: "Claude Code guide",
        url: "https://github.com/saturngod/ai_agent_cli_guide/blob/main/claudecode.md",
      },
    ],
  },
  {
    id: "fde-career-webinar",
    title: "Forward Deployed Engineer (FDE) Career Webinar",
    description:
      "Learn how AI moves from research and prototypes into production, with Senior Forward Deployed Engineer Dr. Wai Yan (William) from Bosch USA.",
    category: "Workshops & Webinars",
    type: "Event",
    source: "Dr. Wai Yan (William)",
    meta: "Sunday, October 25, 2026 · 7–8 PM Myanmar Time",
    added: "October 23, 2026",
    image: "/resources/fde-career-webinar-2026.svg",
    imageAlt:
      "Forward Deployed Engineer career webinar with Dr. Wai Yan, October 25, 2026",
    color: "blue",
    tags: ["AI Career", "Forward Deployed Engineer", "Applied AI", "Webinar"],
    featured: true,
    opportunity: true,
    eventStatus: "upcoming",
    format: "Online · 7:00–8:00 PM Myanmar Time",
    location: "Online",
    dateTile: { primary: "OCT", secondary: "25 · 2026" },
    ctaUrl: "https://forms.gle/Kw6bvNiRWurYWy1w9",
    ctaLabel: "Register for webinar",
    speaker: {
      name: "Dr. Wai Yan (William)",
      role: "Senior Forward Deployed Engineer · Bosch USA",
    },
    topics: [
      "Academic research မှ Industry AI သို့ career transition",
      "Forward Deployed Engineering အရေးပါလာရတဲ့ အကြောင်းရင်း",
      "FDE / Applied AI role များအတွက် လိုအပ်တဲ့ skills",
      "AI prototype မှ production အထိ",
      "Industry ထဲက AI demand နဲ့ လက်တွေ့အတွေ့အကြုံများ",
      "Singapore နဲ့ USA မှာ AI လုပ်ငန်းအတွေ့အကြုံများ",
      "အနာဂတ် AI professionals နဲ့ entrepreneurs များအတွက် career advice",
      "Live Q&A",
    ],
    details: {
      heading: "AI research එකကနေ production အသုံးချမှုအထိ",
      paragraphs: [
        "AI Career မှာ Forward Deployed Engineer (FDE) role ဘာကြောင့် ပိုအရေးပါလာသလဲ၊ AI ကို industry ထဲမှာ လက်တွေ့အသုံးချတဲ့အခါ ဘယ်လိုအလုပ်လုပ်ရသလဲဆိုတာကို ဆွေးနွေးမယ့် online webinar ဖြစ်ပါတယ်။",
        "Bosch USA မှာ Senior Forward Deployed Engineer အဖြစ် လုပ်ကိုင်နေတဲ့ Dr. Wai Yan (William) က သူ့ရဲ့ academic research မှ industry AI သို့ career transition နဲ့ လက်တွေ့လုပ်ငန်းအတွေ့အကြုံတွေကို မျှဝေပေးမှာဖြစ်ပါတယ်။ တက်ရောက်သူတွေက Live Q&A မှာလည်း မေးခွန်းတွေ တိုက်ရိုက်မေးနိုင်ပါတယ်။",
        "Webinar ကို ၂၀၂၆ ခုနှစ် အောက်တိုဘာ ၂၅ ရက်၊ တနင်္ဂနွေနေ့ ည ၇ နာရီမှ ၈ နာရီအထိ Myanmar Time ဖြင့် online မှာ ပြုလုပ်မှာဖြစ်ပါတယ်။",
      ],
    },
    links: [
      {
        label: "Event announcement · Facebook",
        url: "https://www.facebook.com/share/p/19igr1X2d6/",
      },
    ],
  },
  {
    id: "app-industry-talk-2026",
    title: "App Industry Talk 2026",
    description:
      "A free, in-person panel for young people exploring app development careers, with speakers from product design, solutions architecture, and full-stack development.",
    category: "Workshops & Webinars",
    type: "Event",
    source: "App Industry Talk 2026",
    meta: "August 30, 2026 · 12–4 PM",
    cost: "Free",
    added: "October 23, 2026",
    image: photos.workshop,
    imageAlt: "App Industry Talk panel discussion",
    color: "blue",
    tags: [
      "App Development",
      "Career",
      "Product Design",
      "UX",
      "Full Stack",
      "Yangon",
    ],
    opportunity: true,
    eventStatus: "past",
    format: "In-person · 12–4 PM",
    location: "Acumen International College Campus, Times City",
    dateTile: { primary: "AUG", secondary: "30 · 2026" },
    ctaUrl: "https://www.facebook.com/share/p/1DWViBpdJA/",
    ctaLabel: "View event announcement",
    speakers: [
      {
        name: "Ma Wai Yi Mon Soe",
        role: "Founder, UXMM & BridgeX · Product Design & UX Consultant",
      },
      {
        name: "Ko Aung Kyaw Min",
        role: "Solutions Architect · AYA Innovation Labs",
      },
      {
        name: "Ko Aung Ko Ko Thet",
        role: "Founder, Magicx Genesis Value Network · Solution Architect",
      },
      {
        name: "Ko Kyaw Ko Ko Tun",
        role: "Founder, Let's Tech Club · Senior Full-Stack Developer",
      },
    ],
    details: {
      heading: "Real-world perspectives on starting an app development career",
      paragraphs: [
        "App Development ကို စိတ်ဝင်စားပေမဲ့ ဘယ်ကစလေ့လာရမလဲ၊ နည်းပညာတွေ မြန်မြန်ပြောင်းလဲနေချိန်မှာ ဘယ်လမ်းကြောင်းရွေးရမလဲဆိုတဲ့ မေးခွန်းတွေကို ဆွေးနွေးဖို့ စီစဉ်ထားတဲ့ အခမဲ့ tech seminar ဖြစ်ပါတယ်။ Product Design & UX, Solutions Architecture နဲ့ Full-Stack Development နယ်ပယ်တွေမှာ လက်တွေ့လုပ်ကိုင်နေတဲ့ founder တွေနဲ့ industry experts တွေဆီက အတွေ့အကြုံတွေကို နားထောင်နိုင်ပါတယ်။",
        "ပွဲကို ၂၀၂၆ ဩဂုတ် ၃၀ ရက်၊ တနင်္ဂနွေနေ့ နေ့လယ် ၁၂ နာရီမှ ညနေ ၄ နာရီအထိ Acumen International College Campus, Times City မှာ လူကိုယ်တိုင် ကျင်းပဖို့ ကြေညာထားပါတယ်။ နေရာကန့်သတ်ထားပြီး ဝင်ကြေးအခမဲ့ဖြစ်တယ်လို့ ဖော်ပြထားပါတယ်။",
        "ဆွေးနွေးမှုကနေ App Development Industry ရဲ့ လက်ရှိအခြေအနေနဲ့ အနာဂတ် trend တွေ၊ senior နဲ့ founder တွေရဲ့ practical guidance၊ tech community ထဲက networking အခွင့်အလမ်းတွေကို ရရှိဖို့ ရည်ရွယ်ထားပါတယ်။",
      ],
    },
  },
  {
    id: "burmax-journey-entrepreneurship",
    title: "The BurmaX Journey · Entrepreneurship or Entrepreneursh*t?",
    description:
      "An honest conversation about building a real business in Myanmar, with Technortal and Empire Digital Solution founder Ko Bo Bo Min.",
    category: "Workshops & Webinars",
    type: "Event",
    source: "The BurmaX Journey",
    meta: "August 23, 2026 · 10:20–11:20 AM",
    added: "October 23, 2026",
    image: photos.workshop,
    imageAlt: "The BurmaX Journey entrepreneurship session",
    color: "orange",
    tags: ["Entrepreneurship", "Business", "Career", "Technortal", "Yangon"],
    opportunity: true,
    eventStatus: "past",
    format: "In-person · 10:20–11:20 AM",
    location: "UAB Tower @ Times City",
    dateTile: { primary: "AUG", secondary: "23 · 2026" },
    ctaUrl: "https://www.facebook.com/share/p/1BrRzrrtBe/",
    ctaLabel: "View event announcement",
    speaker: {
      name: "Ko Bo Bo Min",
      role: "Founder, Technortal and Empire Digital Solution · General Manager",
    },
    details: {
      heading: "A candid look at entrepreneurship in Myanmar",
      paragraphs: [
        "“Entrepreneursh*t or Entrepreneurship?” session မှာ social media ပေါ်က အလွယ်တကူချမ်းသာမယ်ဆိုတဲ့ ဇာတ်လမ်းတွေနဲ့ မြန်မာနိုင်ငံမှာ တကယ်လုပ်ငန်းတည်ဆောက်ရတဲ့ အတွေ့အကြုံတွေ ဘယ်လိုကွာခြားသလဲဆိုတာကို ပွင့်ပွင့်လင်းလင်း ဆွေးနွေးဖို့ စီစဉ်ထားပါတယ်။ Motivation ရှာဖွေတာနဲ့ လုပ်ငန်းစနစ်တည်ဆောက်တာ၊ ကျောင်းသားဘဝကနေ စတင်နိုင်တဲ့ လက်တွေ့ခြေလှမ်းတွေအကြောင်းလည်း ပါဝင်ပါတယ်။",
        "Guest speaker Ko Bo Bo Min ဟာ programming ပညာရေးကို သင်ကြားပေးတဲ့ Technortal နဲ့ software solution လုပ်ငန်း Empire Digital Solution တို့ကို တည်ထောင်သူဖြစ်ပြီး international college တစ်ခုမှာ General Manager အဖြစ်လည်း တာဝန်ယူတယ်လို့ ကြေညာချက်မှာ ဖော်ပြထားပါတယ်။ ကျောင်းသားဘဝက စီးပွားရေးစတင်ခဲ့ပြီး ကျောင်းသား ၄ ယောက်အထိ ကျဆင်းသွားတဲ့ လုပ်ငန်းကို ပြန်လည်တည်ဆောက်ခဲ့တဲ့ ကိုယ်တွေ့အကြောင်းကို မျှဝေဖို့ စီစဉ်ထားပါတယ်။",
        "ပွဲကို ၂၀၂၆ ဩဂုတ် ၂၃ ရက် မနက် ၁၀:၂၀ မှ ၁၁:၂၀ အထိ UAB Tower @ Times City မှာ ကျင်းပဖို့ ကြေညာထားပါတယ်။ မိဘများနဲ့ လုပ်ငန်းစတင်ဖို့ စိတ်ဝင်စားတဲ့ ကျောင်းသားလူငယ်တွေအတွက် ရည်ရွယ်ထားပါတယ်။",
      ],
    },
    links: [
      {
        label: "Registration form · Google Forms",
        url: "https://forms.gle/CC2G75vTDLmAxoe2A",
      },
    ],
  },
  {
    id: "embracing-ai-career-talk",
    title: "Embracing AI: AI ခေတ်ကို ရင်ဆိုင်ခြင်း",
    description:
      "A free Zoom webinar with Fairway Technology co-founder Ei Maung on practical AI workflows, career risks, future-proof skills, and automation.",
    category: "Workshops & Webinars",
    type: "Event",
    source: "MyJobs Myanmar · Fairway Technology",
    meta: "August 17, 2026 · 7–9 PM",
    cost: "Free",
    added: "October 23, 2026",
    image: photos.workshop,
    imageAlt: "Embracing AI webinar by MyJobs Myanmar and Fairway Technology",
    color: "blue",
    tags: ["AI", "Career", "Prompting", "Automation", "Skills", "Myanmar"],
    opportunity: true,
    eventStatus: "past",
    format: "Online · Zoom · 7–9 PM",
    location: "Zoom",
    dateTile: { primary: "AUG", secondary: "17 · 2026" },
    ctaUrl:
      "https://www.findglocal.com/MM/Yangon/369107489814175/MyJobs-Myanmar",
    ctaLabel: "View MyJobs announcement archive",
    speaker: {
      name: "Ei Maung",
      role: "Co-founder, Fairway Technology · Author on AI tools and workflow automation",
    },
    topics: [
      "AI ကို လက်တွေ့အလုပ်တွင် အသုံးချရန် prompting နည်းလမ်းများ",
      "AI ကြောင့် ပြောင်းလဲလာနိုင်သည့် အလုပ်အကိုင်နှင့် career risk များ",
      "AI ကို အစားထိုးမခံရဘဲ အတူအလုပ်လုပ်နိုင်ရန် အရေးကြီးသော skills များ",
      "နေ့စဉ်အလုပ်များကို AI ဖြင့် automate လုပ်ခြင်း",
    ],
    details: {
      heading: "Practical ways to use AI at work and prepare for change",
      paragraphs: [
        "MyJobs Myanmar နဲ့ Fairway Technology တို့ ပူးပေါင်းတင်ဆက်ခဲ့တဲ့ အခမဲ့ webinar ဖြစ်ပါတယ်။ AI ကို မေးခွန်းမေးရုံကနေ အလုပ်လုပ်ငန်းစဉ်တွေမှာ လက်တွေ့အသုံးချခြင်း၊ prompting ကို စနစ်တကျလုပ်ခြင်းနဲ့ နေ့စဉ်လုပ်ငန်းများကို automate လုပ်ခြင်းအထိ ဆွေးနွေးခဲ့ပါတယ်။",
        "Fairway Technology ကို ပူးတွဲတည်ထောင်သူ Ei Maung က ဟောပြောခဲ့ပြီး AI ကြောင့် career တွေမှာ ဖြစ်လာနိုင်တဲ့ စိန်ခေါ်မှုများ၊ အနာဂတ်အလုပ်အကိုင်အတွက် ပြင်ဆင်သင့်တဲ့ အခြေခံကျွမ်းကျင်မှုများနဲ့ လူငယ်များအတွက် အသုံးချနိုင်တဲ့ နည်းလမ်းများကို မျှဝေခဲ့ပါတယ်။",
        "အခမ်းအနားကို ၂၀၂၆ ဩဂုတ် ၁၇ ရက်၊ တနင်္လာနေ့ ည ၇ နာရီမှ ၉ နာရီအထိ Zoom မှတစ်ဆင့် ပြုလုပ်ခဲ့ကြောင်း MyJobs Myanmar ၏ ကြေညာချက်တွင် ဖော်ပြထားပါတယ်။",
      ],
    },
    links: [
      {
        label: "Original MyJobs event page",
        url: "https://myjobs.com.mm/events/01KYVTSKJ1FXERWKNMPQ5QXD00",
      },
    ],
  },
]

export const categories = categoryDefinitions.map((category) => ({
  ...category,
  count: resources.filter((resource) => resource.category === category.name)
    .length,
}))

export type Collection = {
  id: string
  title: string
  description: string
  resourceIds: string[]
  tone: string
}

export const collections: Collection[] = [
  {
    id: "myanmar-tech-events",
    title: "Myanmar Tech Events",
    description:
      "Talks, workshops, and build opportunities shared by local tech communities.",
    resourceIds: [
      "appcube-developers-bootcamp",
      "one-project-one-week-hackathon-2026",
      "smart-event-graphics-ai-workshop",
      "workadventure-tiled-map-workshop",
      "fde-career-webinar",
      "app-industry-talk-2026",
      "burmax-journey-entrepreneurship",
      "embracing-ai-career-talk",
    ],
    tone: "blue",
  },
  {
    id: "developer-books-and-guides",
    title: "Developer Books & Guides",
    description:
      "Burmese language books and guides for APIs, full-stack development, and AI coding tools.",
    resourceIds: [
      "api-book-ei-maung",
      "rockstar-developer-2025",
      "ai-agent-cli-guide",
    ],
    tone: "orange",
  },
  {
    id: "visual-design-inspiration",
    title: "Visual Design Inspiration",
    description:
      "Explore selected graphic design and website references for visual direction.",
    resourceIds: [
      "visuelle-graphic-design",
      "godly-web-design-inspiration",
      "smart-event-graphics-ai-workshop",
    ],
    tone: "purple",
  },
]

export const categoryBySlug = (slug?: string) =>
  categories.find((category) => category.slug === slug)
