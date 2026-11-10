import { useEffect, useState } from "react";
import AdminPage from "./Admin";

type Language = "en" | "hi";
type PostItem = { id: number | string; author: string; time: string; category: string; en: string; hi: string };
type CourseItem = { id: number | string; level: string; duration: string; en: string; hi: string; descEn: string; descHi: string };
type ListingItem = { id: number | string; type: string; en: string; hi: string; descEn: string; descHi: string };
type Section = "home" | "community" | "learn" | "market" | "profile";

const copy = {
  en: {
    eyebrow: "A community built around real utility",
    title: "Connect. Learn. Discover.",
    intro: "A welcoming space for InterLink Linkers to share knowledge, find useful resources and grow together.",
    preview: "Phase 1 preview · Sample content only",
    previewText: "Accounts, publishing and marketplace enquiries are not connected yet. No wallet, payments or token actions are enabled.",
    home: "Home", community: "Community", learn: "Learn", market: "Market", profile: "Profile",
    welcome: "Welcome to the Hub", welcomeText: "Start with a community conversation, explore a short lesson or discover a useful listing.",
    communityTitle: "Community conversations", communityText: "Ideas, questions and updates from the Linker community.",
    learnTitle: "Learn something useful", learnText: "Simple lessons on Web3 basics, digital safety and building online.",
    marketTitle: "Discover community services", marketText: "Explore sample listings and learn how community discovery will work.",
    explore: "Explore", latest: "Latest conversations", lessons: "Learning paths", listings: "Featured listings",
    like: "Like", liked: "Liked", read: "Open lesson", view: "View details",
    profileTitle: "Your community profile", profileText: "Your profile and InterLink identity connection will appear here after the official sign-in integration is approved.",
    profileStatus: "Sign-in integration pending", noWallet: "No wallet connection required for this preview.",
    communityTag: "Community", learningTag: "Learning", marketplaceTag: "Marketplace",
    footer: "Built for people first · Community features before token features"
  },
  hi: {
    eyebrow: "वास्तविक उपयोगिता पर आधारित कम्युनिटी",
    title: "जुड़ें। सीखें। खोजें।",
    intro: "InterLink Linkers के लिए एक ऐसा मंच जहाँ सभी ज्ञान साझा कर सकें, उपयोगी संसाधन खोज सकें और साथ आगे बढ़ें।",
    preview: "Phase 1 Preview · केवल नमूना सामग्री",
    previewText: "अभी अकाउंट, पोस्ट पब्लिशिंग और Marketplace enquiries backend से जुड़े नहीं हैं। Wallet, payment या token actions चालू नहीं हैं।",
    home: "होम", community: "कम्युनिटी", learn: "सीखें", market: "मार्केट", profile: "प्रोफाइल",
    welcome: "Hub में आपका स्वागत है", welcomeText: "कम्युनिटी चर्चा से शुरुआत करें, छोटा lesson पढ़ें या उपयोगी listing देखें।",
    communityTitle: "कम्युनिटी बातचीत", communityText: "Linker कम्युनिटी के विचार, सवाल और अपडेट।",
    learnTitle: "कुछ उपयोगी सीखें", learnText: "Web3 की बुनियादी बातें, डिजिटल सुरक्षा और ऑनलाइन निर्माण पर सरल lessons।",
    marketTitle: "कम्युनिटी सेवाएँ खोजें", marketText: "नमूना listings देखें और जानें कि community discovery कैसे काम करेगी।",
    explore: "देखें", latest: "नई चर्चाएँ", lessons: "Learning Paths", listings: "चुनी हुई Listings",
    like: "पसंद", liked: "पसंद किया", read: "Lesson खोलें", view: "विवरण देखें",
    profileTitle: "आपकी कम्युनिटी प्रोफाइल", profileText: "Official sign-in integration स्वीकृत होने के बाद आपकी प्रोफाइल और InterLink identity यहाँ दिखाई देगी।",
    profileStatus: "Sign-in integration लंबित", noWallet: "इस preview के लिए wallet connect करना जरूरी नहीं है।",
    communityTag: "कम्युनिटी", learningTag: "लर्निंग", marketplaceTag: "मार्केटप्लेस",
    footer: "पहले लोग और कम्युनिटी · Token features बाद में"
  }
} as const;

const posts: PostItem[] = [
  { id: 1, author: "Linker Learning", time: "2h", category: "Learning", en: "What helped you understand blockchain for the first time? Share one beginner-friendly resource.", hi: "आपको पहली बार Blockchain समझने में किस चीज़ ने मदद की? शुरुआती लोगों के लिए एक उपयोगी resource साझा करें।" },
  { id: 2, author: "Community Desk", time: "5h", category: "Community", en: "This week’s discussion: how can we make useful digital tools easier for local communities to access?", hi: "इस सप्ताह की चर्चा: स्थानीय कम्युनिटी के लिए उपयोगी digital tools को और आसान कैसे बनाया जा सकता है?" },
  { id: 3, author: "Builder Notes", time: "1d", category: "Builders", en: "A good project starts with a real problem. What community problem would you like builders to solve?", hi: "एक अच्छा project वास्तविक समस्या से शुरू होता है। आप चाहते हैं कि builders कम्युनिटी की कौन-सी समस्या हल करें?" }
];

const courses = [
  { id: 1, level: "Beginner", duration: "8 min", en: "Web3 fundamentals", hi: "Web3 की बुनियादी जानकारी", descEn: "Understand wallets, blockchains and decentralised apps at a high level.", descHi: "Wallet, blockchain और decentralised apps को आसान भाषा में समझें।" },
  { id: 2, level: "Safety", duration: "6 min", en: "Stay safe online", hi: "ऑनलाइन सुरक्षित रहें", descEn: "Learn to recognise suspicious links, impersonation and unsafe requests.", descHi: "संदिग्ध links, नकली पहचान और असुरक्षित requests को पहचानना सीखें।" },
  { id: 3, level: "Creator", duration: "10 min", en: "Build your first digital project", hi: "अपना पहला digital project बनाएँ", descEn: "Turn a small idea into a clear project brief and learning plan.", descHi: "एक छोटे विचार को project brief और learning plan में बदलें।" }
];

const listings = [
  { id: 1, type: "Creator service", en: "Hindi video editing", hi: "Hindi वीडियो एडिटिंग", descEn: "Sample listing for short-form creator content.", descHi: "Short-form creator content के लिए नमूना listing।" },
  { id: 2, type: "Learning", en: "Beginner tech sessions", hi: "शुरुआती Tech Sessions", descEn: "Sample listing for basic digital-skills learning sessions.", descHi: "बुनियादी digital skills सीखने के लिए नमूना listing।" },
  { id: 3, type: "Community", en: "Local creator network", hi: "Local Creator Network", descEn: "A sample community directory entry for creators.", descHi: "Creators के लिए नमूना community directory entry।" }
];

function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [section, setSection] = useState<Section>("home");
  const [liked, setLiked] = useState<Array<number | string>>([]);
  const [feedPosts, setFeedPosts] = useState<PostItem[]>(posts);
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");
  const [courseItems, setCourseItems] = useState<CourseItem[]>(courses);
  const [listingItems, setListingItems] = useState<ListingItem[]>(listings);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [lessonItems, setLessonItems] = useState<Array<{ id: string; titleEn: string; titleHi: string; bodyEn: string; bodyHi: string; durationMin: number }>>([]);
  const [lessonLoading, setLessonLoading] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/health").then((response) => {
      if (!response.ok) throw new Error("API unavailable");
      return response.json();
    }).then(() => { if (active) setApiStatus("online"); }).catch(() => { if (active) setApiStatus("offline"); });
    fetch("/api/courses").then((response) => response.ok ? response.json() : null).then((data) => {
      if (!active || !Array.isArray(data?.items) || data.items.length === 0) return;
      setCourseItems(data.items.map((item: { id: string; level: string; durationMin: number; titleEn: string; titleHi: string; descriptionEn: string; descriptionHi: string }) => ({ id: item.id, level: item.level, duration: `${item.durationMin} min`, en: item.titleEn, hi: item.titleHi, descEn: item.descriptionEn, descHi: item.descriptionHi })));
    }).catch(() => undefined);
    fetch("/api/listings").then((response) => response.ok ? response.json() : null).then((data) => {
      if (!active || !Array.isArray(data?.items) || data.items.length === 0) return;
      setListingItems(data.items.map((item: { id: string; category: string; title: string; description: string }) => ({ id: item.id, type: item.category, en: item.title, hi: item.title, descEn: item.description, descHi: item.description })));
    }).catch(() => undefined);
    fetch("/api/posts?limit=10").then((response) => response.ok ? response.json() : null).then((data) => {
      if (!active || !Array.isArray(data?.items) || data.items.length === 0) return;
      const mapped: PostItem[] = data.items.map((post: { id: string; body: string; category: string; createdAt: string; author?: { displayName?: string } }) => ({
        id: post.id,
        author: post.author?.displayName || "Community Member",
        time: new Date(post.createdAt).toLocaleDateString(),
        category: post.category,
        en: post.body,
        hi: post.body
      }));
      setFeedPosts(mapped);
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);
  const t = copy[language];

  const nav: { id: Section; label: string }[] = [
    { id: "home", label: t.home },
    { id: "community", label: t.community },
    { id: "learn", label: t.learn },
    { id: "market", label: t.market },
    { id: "profile", label: t.profile }
  ];

  const openCourse = async (course: CourseItem) => {
    setSelectedCourse(course);
    setLessonItems([]);
    setLessonLoading(true);
    try {
      const response = await fetch(`/api/courses/${encodeURIComponent(String(course.id))}/lessons`);
      if (!response.ok) throw new Error("Lesson content is not connected yet.");
      const data = await response.json();
      setLessonItems(Array.isArray(data.items) ? data.items : []);
    } catch {
      setLessonItems([]);
    } finally { setLessonLoading(false); }
  };

  const toggleLike = (id: number | string) => {
    setLiked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  if (window.location.pathname === "/admin") return <AdminPage />;

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" onClick={() => setSection("home")} aria-label="InterLink Community Hub home">
          <span className="brand-mark">IL</span>
          <span><strong>InterLink</strong><small>COMMUNITY HUB</small></span>
        </a>
        <div className="top-actions">
          <span className="status-pill"><i /> Phase 1</span>
          <button className="language-button" onClick={() => setLanguage(language === "en" ? "hi" : "en")} aria-label="Switch language">
            {language === "en" ? "हिन्दी" : "English"}
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <span className="eyebrow">{t.eyebrow}</span>
            <h1>{t.title}</h1>
            <p>{t.intro}</p>
            <div className="hero-actions">
              <button className="button-primary" onClick={() => setSection("community")}>{t.community}</button>
              <button className="button-secondary" onClick={() => setSection("learn")}>{t.learn}</button>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="hero-symbol">IL<span>+</span></div>
            <div className="floating-card card-top">CONNECT</div>
            <div className="floating-card card-bottom">GROW TOGETHER</div>
          </div>
        </section>

        <section className="preview-notice" role="note">
          <strong>{t.preview}</strong>
          <p>{t.previewText}</p>
          <small className="api-state">{apiStatus === "online" ? "API connected" : apiStatus === "offline" ? "API unavailable · showing sample content" : "Checking API…"}</small>
        </section>

        {section === "home" && <section className="content-section">
          <div className="section-heading"><div><span className="section-kicker">YOUR STARTING POINT</span><h2>{t.welcome}</h2><p>{t.welcomeText}</p></div></div>
          <div className="feature-grid">
            <FeatureCard icon="◎" title={t.communityTitle} text={t.communityText} action={t.explore} onClick={() => setSection("community")} />
            <FeatureCard icon="▤" title={t.learnTitle} text={t.learnText} action={t.explore} onClick={() => setSection("learn")} />
            <FeatureCard icon="◇" title={t.marketTitle} text={t.marketText} action={t.explore} onClick={() => setSection("market")} />
          </div>
          <div className="section-heading compact-heading"><div><span className="section-kicker">{t.communityTag}</span><h2>{t.latest}</h2></div><button className="text-button" onClick={() => setSection("community")}>{t.explore} →</button></div>
          <PostGrid language={language} liked={liked} onLike={toggleLike} items={feedPosts} limit={2} />
        </section>}

        {section === "community" && <section className="content-section">
          <div className="section-heading"><div><span className="section-kicker">{t.communityTag}</span><h2>{t.communityTitle}</h2><p>{t.communityText}</p></div></div>
          <PostGrid language={language} liked={liked} onLike={toggleLike} items={feedPosts} />
        </section>}

        {section === "learn" && <section className="content-section">
          <div className="section-heading"><div><span className="section-kicker">{t.learningTag}</span><h2>{t.learnTitle}</h2><p>{t.learnText}</p></div></div>
          <div className="course-grid">{courseItems.map((course) => <article className="content-card course-card" key={course.id}><div className="card-meta"><span className="tag">{course.level}</span><span>{course.duration}</span></div><h3>{language === "en" ? course.en : course.hi}</h3><p>{language === "en" ? course.descEn : course.descHi}</p><button className="text-button" onClick={() => void openCourse(course)}>{t.read} →</button></article>)}</div>
        </section>}

        {section === "market" && <section className="content-section">
          <div className="section-heading"><div><span className="section-kicker">{t.marketplaceTag}</span><h2>{t.marketTitle}</h2><p>{t.marketText}</p></div></div>
          <div className="listing-grid">{listingItems.map((listing) => <article className="content-card listing-card" key={listing.id}><span className="tag">{listing.type}</span><h3>{language === "en" ? listing.en : listing.hi}</h3><p>{language === "en" ? listing.descEn : listing.descHi}</p><span className="coming-label">{t.preview}</span></article>)}</div>
        </section>}

        {section === "profile" && <section className="content-section">
          <div className="profile-panel"><div className="profile-avatar">IL</div><span className="section-kicker">{t.profileStatus}</span><h2>{t.profileTitle}</h2><p>{t.profileText}</p><div className="profile-note">{t.noWallet}</div></div>
        </section>}
      </main>

      {selectedCourse && <div className="modal-backdrop" role="presentation" onClick={() => setSelectedCourse(null)}><section className="lesson-modal" role="dialog" aria-modal="true" aria-label={language === "en" ? selectedCourse.en : selectedCourse.hi} onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelectedCourse(null)} aria-label="Close">×</button><span className="section-kicker">{t.learningTag}</span><h2>{language === "en" ? selectedCourse.en : selectedCourse.hi}</h2>{lessonLoading && <p>Loading lessons…</p>}{!lessonLoading && lessonItems.length === 0 && <p>{language === "en" ? "Lesson content will appear after the database is configured and seeded." : "Database configure और seed होने के बाद lesson content यहाँ दिखेगा।"}</p>}{lessonItems.map((lesson) => <article className="lesson-item" key={lesson.id}><div className="card-meta"><strong>{language === "en" ? lesson.titleEn : lesson.titleHi}</strong><span>{lesson.durationMin} min</span></div><p>{language === "en" ? lesson.bodyEn : lesson.bodyHi}</p></article>)}</section></div>}

      <nav className="bottom-nav" aria-label="Main navigation">
        {nav.map((item) => <button key={item.id} className={section === item.id ? "nav-item active" : "nav-item"} onClick={() => setSection(item.id)}><span>{item.id === "home" ? "⌂" : item.id === "community" ? "◎" : item.id === "learn" ? "▤" : item.id === "market" ? "◇" : "◉"}</span>{item.label}</button>)}
      </nav>
      <footer className="footer">{t.footer}<span>INTERLINK COMMUNITY HUB · PHASE 1</span></footer>
    </div>
  );
}

function FeatureCard({ icon, title, text, action, onClick }: { icon: string; title: string; text: string; action: string; onClick: () => void }) {
  return <article className="feature-card"><span className="feature-icon">{icon}</span><h3>{title}</h3><p>{text}</p><button className="text-button" onClick={onClick}>{action} →</button></article>;
}

function PostGrid({ language, liked, onLike, items, limit }: { language: Language; liked: Array<number | string>; onLike: (id: number | string) => void; items: PostItem[]; limit?: number }) {
  const t = copy[language];
  return <div className="post-grid">{items.slice(0, limit ?? items.length).map((post) => {
    const isLiked = liked.includes(post.id);
    return <article className="content-card post-card" key={post.id}><div className="post-author"><span className="author-avatar">{post.author.slice(0, 1)}</span><div><strong>{post.author}</strong><small>{post.time} · {post.category}</small></div></div><p>{language === "en" ? post.en : post.hi}</p><div className="post-actions"><button className={isLiked ? "like-button liked" : "like-button"} onClick={() => onLike(post.id)}>{isLiked ? "♥" : "♡"} {isLiked ? t.liked : t.like}</button><span className="sample-label">{t.preview}</span></div></article>;
  })}</div>;
}

export default App;
