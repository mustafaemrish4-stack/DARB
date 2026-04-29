
import { useEffect, useState } from 'react';
import { AIChat } from './components/AIChat';
import { Instagram, Linkedin, Mail, Github, Globe, Moon, Sun, Smartphone, Terminal, ShieldAlert, Bug, X, Code, Database, Globe as GlobeIcon, Cpu, Lock } from 'lucide-react';
import { translations } from './data/translations';

type Lang = 'ar' | 'en' | 'fr' | 'es' | 'he' | 'pt' | 'zh';
type Theme = 'dark' | 'light';

// Extended Skill Data with Code Snippets & Icons
const skillData: Record<string, { snippet: string; icon: any; desc_ar: string; desc_en: string }> = {
  // Web
  "React.js": {
    snippet: "const [state, setState] = useState(null);\nuseEffect(() => { loadData(); }, []);",
    icon: Code,
    desc_ar: "بناء واجهات مستخدم تفاعلية وحديثة.",
    desc_en: "Building modern, interactive UIs."
  },
  "Vue.js": {
    snippet: "<template>\n  <div>{{ message }}</div>\n</template>",
    icon: Code,
    desc_ar: "إطار عمل مرن للواجهات الأمامية.",
    desc_en: "The Progressive JavaScript Framework."
  },
  "Node.js": {
    snippet: "const http = require('http');\nhttp.createServer((req, res) => ...);",
    icon: GlobeIcon,
    desc_ar: "بيئة تشغيل جافاسكريبت قوية من جانب الخادم.",
    desc_en: "Powerful JavaScript server-side runtime."
  },
  "Django": {
    snippet: "class User(models.Model):\n    name = models.CharField(max_length=100)",
    icon: GlobeIcon,
    desc_ar: "إطار عمل ويب عالي المستوى بلغة بايثون.",
    desc_en: "High-level Python Web framework."
  },
  "Tailwind": {
    snippet: "<div class=\"flex justify-center p-4 bg-gray-900\">\n  <!-- Utility First -->\n</div>",
    icon: Code,
    desc_ar: "تنسيق سريع ومرن يعتمد على الأدوات.",
    desc_en: "Utility-first CSS framework."
  },
  // Programming
  "Python": {
    snippet: "def solve_problem(data):\n    return [x for x in data if x > 0]",
    icon: Terminal,
    desc_ar: "لغة متعددة الاستخدامات للذكاء الاصطناعي والويب.",
    desc_en: "Versatile language for AI, Web, and more."
  },
  "Java": {
    snippet: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World\");\n    }\n}",
    icon: Cpu,
    desc_ar: "قوية، آمنة، وتعمل على أي منصة.",
    desc_en: "Robust, secure, and platform-independent."
  },
  "C++": {
    snippet: "#include <iostream>\nint main() {\n    std::cout << \"System.Memory\";\n    return 0;\n}",
    icon: Cpu,
    desc_ar: "أداء عالي وإدارة دقيقة للذاكرة.",
    desc_en: "High performance and memory control."
  },
  "PHP": {
    snippet: "<?php\n  echo \"Server Side Scripting\";\n?>",
    icon: GlobeIcon,
    desc_ar: "أساس الويب الديناميكي.",
    desc_en: "The backbone of dynamic web."
  },
  "SQL": {
    snippet: "SELECT * FROM Users\nWHERE active = 1\nORDER BY created_at DESC;",
    icon: Database,
    desc_ar: "إدارة واستعلام قواعد البيانات الهيكلية.",
    desc_en: "Managing relational databases."
  },
  // Security
  "Ethical Hacking": {
    snippet: "$ nmap -sS -p- 192.168.1.1\n> Scanning for vulnerabilities...",
    icon: ShieldAlert,
    desc_ar: "اكتشاف الثغرات وتأمين الأنظمة.",
    desc_en: "Identifying vulnerabilities to secure systems."
  },
  "Pen Testing": {
    snippet: "$ metasploit_console\n> use exploit/multi/handler",
    icon: Bug,
    desc_ar: "اختبار اختراق محاكي للهجمات الحقيقية.",
    desc_en: "Simulating cyberattacks to find weaknesses."
  },
  "Encryption": {
    snippet: "AES-256-CBC\nKey: 4f3a...91b\nIV:  8e2...10c",
    icon: Lock,
    desc_ar: "حماية البيانات بتشفير غير قابل للكسر.",
    desc_en: "Securing data with unbreakable cyphers."
  },
  // DB
  "MongoDB": {
    snippet: "db.collection.find({ \n  status: \"active\" \n})",
    icon: Database,
    desc_ar: "قاعدة بيانات مرنة تعتمد على الوثائق.",
    desc_en: "Flexible document-based database."
  },
  "MySQL": {
    snippet: "ALTER TABLE Users ADD COLUMN age INT;",
    icon: Database,
    desc_ar: "قاعدة بيانات علائقية مفتوحة المصدر.",
    desc_en: "Open-source relational database."
  },
  "PostgreSQL": {
    snippet: "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";",
    icon: Database,
    desc_ar: "قاعدة بيانات متقدمة وموثوقة.",
    desc_en: "Advanced, reliable open-source RDBMS."
  },
  "Firebase": {
    snippet: "firebase.firestore().collection('chat').add({...})",
    icon: GlobeIcon,
    desc_ar: "منصة تطوير تطبيقات متكاملة من جوجل.",
    desc_en: "Google's mobile platform for app dev."
  }
};

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [lang, setLang] = useState<Lang>('ar');
  const [theme, setTheme] = useState<Theme>('dark');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isHackerMode, setIsHackerMode] = useState(false);

  const [visitCount, setVisitCount] = useState<number | null>(null);

  const t = translations[lang];
  const isRTL = ['ar', 'he'].includes(lang);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    // Visitor Counter: Hybrid Strategy
    // 1. Try Real Global API
    // 2. If fails (Adblock/Network), use Local Simulator
    const updateCounter = async () => {
      try {
        const response = await fetch('https://api.counterapi.dev/v1/mustafa-portfolio/up');
        const data = await response.json();

        if (data.count) {
          // Success: Real Global Count + Offset
          setVisitCount(data.count + 1240);

          // Sync local storage to keep it close to real
          localStorage.setItem('portfolio_visits', (data.count + 1240).toString());
        } else {
          throw new Error("Invalid API response");
        }
      } catch (error) {
        console.log("Using Local Counter Fallback");
        // Fallback: Local Storage
        const storedCount = localStorage.getItem('portfolio_visits');
        let count = storedCount ? parseInt(storedCount) : 1240;
        count = count + 1;
        localStorage.setItem('portfolio_visits', count.toString());
        setVisitCount(count);
      }
    };
    updateCounter();
  }, []);

  useEffect(() => {
    // Update HTML dir and lang attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('data-theme', theme);

    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      let current = 'home';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) current = section.getAttribute('id') || 'home';
      });
      setActiveSection(current);
    };

    // Security: Block F12, Ctrl+Shift+I, Ctrl+U
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        alert(lang === 'ar' ? 'تم حظر أدوات المطور لأسباب أمنية!' : 'Developer tools are blocked for security!');
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', event => event.preventDefault()); // Block Right Click Globally

    // Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', event => event.preventDefault());
    };
  }, [lang, theme, isRTL]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerHackerMode = () => {
    setIsHackerMode(true);
    setTimeout(() => setIsHackerMode(false), 5000); // Effect lasts 5 seconds
  };

  // Prevent downloading/dragging images
  const protectImage = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  // Determine effect based on skill name (Thematic Mapping)
  const getSkillEffect = (skillName: string) => {
    const effects = [
      { bg: 'effect-matrix-bg', content: 'effect-matrix-content' }, // 0: Green
      { bg: 'effect-cyber-bg', content: 'effect-cyber-content' },   // 1: Cyan/Blue
      { bg: 'effect-fire-bg', content: 'effect-fire-content' },     // 2: Orange/Red
      { bg: 'effect-galaxy-bg', content: 'effect-galaxy-content' }  // 3: Purple
    ];

    // Manual Overrides for better theming
    const map: Record<string, number> = {
      "Tailwind": 1, // Cyber (Blue)
      "React.js": 1, // Cyber (Blue)
      "Vue.js": 0,   // Matrix (Green)
      "Java": 2,     // Fire (Red)
      "Python": 3,   // Galaxy (Purple/Cosmic) - Better contrast
      "PHP": 2,      // Fire (Orange/Red)
      "SQL": 3,      // Galaxy
      "MongoDB": 3,  // Galaxy
      "PostgreSQL": 3, // Galaxy (Purple)
      "MySQL": 3,    // Galaxy
      "Firebase": 2, // Fire (Orange)
      "C++": 1,      // Cyber
      "Node.js": 0,  // Matrix (Green)
      "Django": 0,   // Matrix (Green)
      "Ethical Hacking": 1, // Cyber (Blue) - Feels more "hacker/neon"
      "Pen Testing": 2, // Fire (Red)
      "Encryption": 1  // Cyber (Blue)
    };

    if (skillName in map) {
      return effects[map[skillName]];
    }

    // Fallback: Sum of character codes
    const charCodeSum = skillName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return effects[charCodeSum % effects.length];
  };

  const currentSkillData = selectedSkill ? skillData[selectedSkill] : null;

  return (
    <div className={`app ${theme}`}>
      {/* Navigation */}
      <nav>
        <div className="logo">Port<span>folio</span></div>
        <ul className="nav-links">
          <li><a onClick={() => scrollTo('home')} className={activeSection === 'home' ? 'active' : ''}>{t.nav.home}</a></li>
          <li><a onClick={() => scrollTo('about')} className={activeSection === 'about' ? 'active' : ''}>{t.nav.about}</a></li>
          <li><a onClick={() => scrollTo('skills')} className={activeSection === 'skills' ? 'active' : ''}>{t.nav.skills}</a></li>
          <li><a onClick={() => scrollTo('projects')} className={activeSection === 'projects' ? 'active' : ''}>{t.nav.portfolio}</a></li>
          <li><a onClick={() => scrollTo('contact')} className={activeSection === 'contact' ? 'active' : ''}>{t.nav.contact}</a></li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Theme Toggle */}
          <button onClick={toggleTheme} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Language Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Globe size={20} />
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>{lang}</span>
            </button>

            {isLangMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: isRTL ? 'auto' : 0,
                left: isRTL ? 0 : 'auto',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '5px',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                minWidth: '100px'
              }}>
                {(['ar', 'en', 'fr', 'es', 'pt', 'he', 'zh'] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setIsLangMenuOpen(false); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '8px',
                      textAlign: isRTL ? 'right' : 'left',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      opacity: lang === l ? 1 : 1
                    }}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-text fade-in">
              <h3>{t.hero.greeting}</h3>
              <h1>Mustafa Ahed</h1>
              <div className="role" dangerouslySetInnerHTML={{ __html: t.hero.role }}></div>
              <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)', maxWidth: '500px' }}>
                {t.hero.desc}
              </p>

              <div className="social-icons">
                <a href="https://linkedin.com/in/mustafa-emrish-07a4842a4" target="_blank" className="social-icon"><Linkedin size={20} /></a>
                <a href="mailto:mustafa.ahed2000@gmail.com" className="social-icon"><Mail size={20} /></a>
                <a href="https://github.com/mustafaahed1000-lang" target="_blank" className="social-icon"><Github size={20} /></a>
                <a href="https://www.instagram.com/mustafaemrish3?igsh=MXdkZjZ0amk5dDJwbg==" target="_blank" className="social-icon"><Instagram size={20} /></a>
              </div>

              <a href="/resume.pdf" download className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                {t.hero.download_cv}
              </a>
            </div>

            <div className="hero-image-wrapper fade-in">
              <img
                src="/profile.jpeg"
                alt="Mustafa Ahed"
                className="hero-image"
                onContextMenu={protectImage}
                onDragStart={protectImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="hero-grid">
            <div className="hero-image-wrapper fade-in" style={{ cursor: 'pointer' }} onClick={triggerHackerMode}>
              <img
                src="/certificate.jpeg"
                alt="Certificate"
                style={{ borderRadius: '20px', width: '100%', maxWidth: '400px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                onContextMenu={protectImage}
                onDragStart={protectImage}
              />
            </div>
            <div className="hero-text fade-in">
              <h2 className="section-title" style={{ textAlign: isRTL ? 'right' : 'left', marginBottom: '1rem', color: 'var(--text-primary)' }} dangerouslySetInnerHTML={{ __html: t.about.title }}></h2>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{t.about.subtitle}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {t.about.text1}
              </p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                {t.about.text2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills">
        <div className="container">
          <h2 className="section-title" style={{ color: 'var(--text-primary)' }} dangerouslySetInnerHTML={{ __html: t.skills.title }}></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { title: t.skills.web, skills: ["React.js", "Vue.js", "Node.js", "Django", "Tailwind"] },
              { title: t.skills.prog, skills: ["Python", "Java", "C++", "PHP", "SQL"] },
              { title: t.skills.security, skills: ["Ethical Hacking", "Pen Testing", "Encryption"] },
              { title: t.skills.db, skills: ["MongoDB", "MySQL", "PostgreSQL", "Firebase"] }
            ].map((cat, i) => (
              <div key={i} className="card-dark fade-in">
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{cat.title}</h3>
                <div>
                  {cat.skills.map(s => (
                    <span
                      key={s}
                      onClick={(e) => { e.stopPropagation(); setSelectedSkill(s); }}
                      className="skill-tag"
                      style={{
                        color: 'var(--accent)',
                        background: 'rgba(0, 242, 152, 0.1)',
                        border: '1px solid var(--accent)',
                        padding: '5px 15px',
                        borderRadius: '20px',
                        display: 'inline-block',
                        margin: '5px',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent-text)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0, 242, 152, 0.1)'; e.currentTarget.style.color = 'var(--accent)'; }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience / Journey Section (The Story) */}
      <section id="experience" style={{ background: 'var(--bg-secondary)', position: 'relative' }}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'var(--text-primary)' }}>
            {lang === 'ar' ? 'رحلة الكفاح والنجاح' : 'Journey of Struggle & Success'}
          </h2>

          <div className="monitor-container fade-in">
            <div className="monitor-screen">
              <div className="timeline">
                {[
                  { year: '2019', title: lang === 'ar' ? 'بداية الشغف' : 'The Spark', desc: lang === 'ar' ? 'بدأت رحلتي في عالم البرمجة، كانت البداية صعبة ومليئة بالتحديات، لكن الشغف كان أقوى.' : 'Started my coding journey. It was tough, full of errors, but passion kept me going.' },
                  { year: '2021', title: lang === 'ar' ? 'تحدي الجامعة' : 'University Challenge', desc: lang === 'ar' ? 'واجهت ضغط الدراسة والعمل معاً، سهرت ليالي طويلة لأتعلم أساسيات علوم الحاسوب.' : 'Balancing study and work. Countless sleepless nights mastering CS fundamentals.' },
                  { year: '2023', title: lang === 'ar' ? 'أول مشروع حقيقي' : 'First Real Project', desc: lang === 'ar' ? 'بنيت أول نظام متكامل. الشعور برؤية الكود يعمل بعد مئات المحاولات الفاشلة لا يوصف.' : 'Built my first full system. The feeling of seeing code work after 100 fails is indescribable.' },
                  { year: '2024', title: lang === 'ar' ? 'الاحتراف والابتكار' : 'Innovation Era', desc: lang === 'ar' ? 'الآن أطور أنظمة ذكية مثل SmartCare و Melora. الخبرة أصبحت سلاحي.' : 'Now building AI systems like SmartCare. Experience is my weapon.' }
                ].map((item, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <span className="timeline-year">{item.year}</span>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services">
        <div className="container">
          <h2 className="section-title" style={{ color: 'var(--text-primary)' }}>
            {lang === 'ar' ? 'خدماتي' : 'My Services'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { icon: GlobeIcon, title: lang === 'ar' ? 'تطوير المواقع' : 'Web Development', desc: lang === 'ar' ? 'بناء مواقع عصرية وسريعة.' : 'Modern & fast websites.' },
              { icon: Smartphone, title: lang === 'ar' ? 'تطبيقات الموبايل' : 'Mobile Apps', desc: lang === 'ar' ? 'تطبيقات تعمل على أندرويد و iOS.' : 'Android & iOS apps.' },
              { icon: Database, title: lang === 'ar' ? 'تحليل الأنظمة' : 'System Analysis', desc: lang === 'ar' ? 'هيكلة بيانات وقواعد بيانات قوية.' : 'Robust DB architecture.' },
              { icon: Cpu, title: lang === 'ar' ? 'حلول الذكاء الاصطناعي' : 'AI Solutions', desc: lang === 'ar' ? 'دمج AI في أعمالك.' : 'Integrating AI into business.' }
            ].map((s, i) => (
              <div key={i} className="card-dark fade-in" style={{ textAlign: 'center', borderTop: '3px solid var(--accent)' }}>
                <s.icon size={50} color="var(--accent)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 className="section-title" style={{ color: 'var(--text-primary)' }} dangerouslySetInnerHTML={{ __html: t.projects.title }}></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              {
                title: "Professional CV",
                desc: "Interactive Resume Website",
                link: "https://mustafa-ahed-cv.netlify.app/",
                image: "/project-cv.png"
              },
              {
                title: "SmartCare Medical",
                desc: "Health Management System",
                link: "https://smartcare2.netlify.app/",
                image: "/project-smartcare.png"
              },
              {
                title: "Melora E-commerce",
                desc: "Full Shopping Platform",
                link: "https://melora1.pages.dev/",
                image: "/project-melora.png"
              },
              {
                title: "University System",
                desc: "Student Management",
                link: "https://mylibrary-qou.github.io/University-management-system/",
                image: "/project-university.png"
              },
              {
                title: "SUMS System",
                desc: "Student Info System",
                link: "https://mylibrary-qou.github.io/sums/",
                image: "/project-sums.png"
              },
              {
                title: "MyLibrary Store",
                desc: "Stationery E-commerce",
                link: "https://kfkjf233.github.io/MyLibraryAlQuds/",
                image: "/project-mylibrary.png"
              }
            ].map((p, i) => (
              <div key={i} className="card-dark fade-in" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
                <div style={{ overflow: 'hidden', height: '200px' }}>
                  <img
                    src={p.image}
                    alt={p.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    onClick={() => window.open(p.link, '_blank')}
                  />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{p.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{p.desc}</p>
                  <a href={p.link} target="_blank" style={{
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    {t.projects.view} <Globe size={16} /> ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials">
        <div className="container">
          <h2 className="section-title" style={{ color: 'var(--text-primary)' }}>
            {lang === 'ar' ? 'قالوا عني' : 'Testimonials'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              { name: "Ahmad K.", role: "CEO, TechStart", text: lang === 'ar' ? "مصطفى مبرمج مبدع، حول فكرتنا إلى واقع أفضل مما تخيلنا!" : "Mustafa is a creative developer. He turned our idea into reality better than we imagined!" },
              { name: "Sara M.", role: "Project Manager", text: lang === 'ar' ? "العمل معه كان سلساً جداً، التزام بالمواعيد واحترافية عالية." : "Working with him was very smooth. Punctual and highly professional." },
              { name: "Khaled O.", role: "Founder, EduApp", text: lang === 'ar' ? "أنقذ مشروعنا في الوقت الضائع بحلول ذكية وسريعة. أنصح به بشدة." : "Saved our project in the last minute with smart solutions. Highly recommended." }
            ].map((t, i) => (
              <div key={i} className="card-dark fade-in" style={{ fontStyle: 'italic', position: 'relative' }}>
                <div style={{ marginBottom: '1rem', color: 'var(--accent)', fontSize: '2rem' }}>❝</div>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#333', borderRadius: '50%' }}></div>
                  <div>
                    <h4 style={{ color: 'var(--text-primary)', margin: 0 }}>{t.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'gray' }}>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ color: 'var(--text-primary)' }} dangerouslySetInnerHTML={{ __html: t.contact.title }}></h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>

            {/* Email */}
            <a href="mailto:mustafa.ahed2000@gmail.com" className="card-dark" style={{ minWidth: '250px', textDecoration: 'none', display: 'block' }}>
              <Mail size={30} color="var(--accent)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ color: 'var(--text-primary)' }}>{t.contact.email}</h4>
              <p style={{ color: 'var(--text-secondary)' }}>mustafa.ahed2000@gmail.com</p>
            </a>

            {/* LinkedIn */}
            <a href="https://linkedin.com/in/mustafa-emrish-07a4842a4" target="_blank" className="card-dark" style={{ minWidth: '250px', textDecoration: 'none', display: 'block' }}>
              <Linkedin size={30} color="var(--accent)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ color: 'var(--text-primary)' }}>LinkedIn</h4>
              <p style={{ color: 'var(--text-secondary)' }}>Mustafa Emrish</p>
            </a>

            {/* WhatsApp / Phone */}
            <a href="https://wa.me/970594643895" target="_blank" className="card-dark" style={{ minWidth: '250px', cursor: 'pointer', display: 'block', textDecoration: 'none' }}>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', marginTop: '0.5rem' }}>{t.contact.phone}</h4>
              <div style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>📱</div>
              <p style={{ color: 'var(--text-secondary)', direction: 'ltr', display: 'inline-block' }}>0594643895</p>
            </a>
          </div>
        </div>
      </section>

      {/* Floating Action Button (WhatsApp) */}
      <a
        href="https://wa.me/970594643895"
        target="_blank"
        style={{
          position: 'fixed',
          bottom: '30px',
          left: '30px',
          width: '60px',
          height: '60px',
          background: '#25D366',
          borderRadius: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 5px 20px rgba(0,0,0,0.3)',
          zIndex: 1000,
          cursor: 'pointer',
          transition: 'transform 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Smartphone size={30} color="white" />
        <span style={{
          position: 'absolute',
          top: '-5px',
          right: '-5px',
          width: '15px',
          height: '15px',
          background: 'red',
          borderRadius: '50%',
          border: '2px solid white'
        }}></span>
      </a>

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-secondary)',
        padding: '2rem 0',
        textAlign: 'center',
        borderTop: '1px solid var(--border-color)',
        marginTop: 'auto'
      }}>
        <div className="container">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            &copy; {currentYear} {lang === 'ar' ? 'جميع الحقوق محفوظة مصطفى عاهد عزات امريش' : 'All rights reserved to Mustafa Ahed Azzat Emrish'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
            <a href="mailto:mustafa.ahed2000@gmail.com" style={{ color: 'var(--text-secondary)' }}><Mail size={20} /></a>
            <a href="https://linkedin.com/in/mustafa-emrish-07a4842a4" target="_blank" style={{ color: 'var(--text-secondary)' }}><Linkedin size={20} /></a>
            <a href="https://github.com/mustafaahed1000-lang" target="_blank" style={{ color: 'var(--text-secondary)' }}><Github size={20} /></a>
          </div>

          {/* Visitor Counter */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(0,0,0,0.3)',
            padding: '5px 15px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <span style={{ color: 'var(--accent)' }}>●</span>
            {lang === 'ar' ? 'عدد الزوار: ' : 'Visitors: '}
            <span style={{ fontWeight: 'bold', color: 'white' }}>{visitCount?.toLocaleString() ?? '...'}</span>
          </div>
        </div>
      </footer>

      {/* Skill Modal with Effects & Code Snippets */}
      {selectedSkill && currentSkillData && (
        <div
          className={`modal-overlay ${getSkillEffect(selectedSkill).bg}`}
          style={{ zIndex: 9999, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          {/* No onClick on overlay - clicking background does NOTHING */}
          <div className={`modal-content ${getSkillEffect(selectedSkill).content}`} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedSkill(null)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'transparent',
                border: 'none',
                color: 'currentColor',
                cursor: 'pointer',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.2)';
                e.currentTarget.style.opacity = '0.7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.opacity = '1';
              }}
            >
              <X size={32} />
            </button>

            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <currentSkillData.icon size={60} style={{ color: 'inherit', filter: 'drop-shadow(0 0 10px currentColor)' }} />
            </div>

            <h2 style={{ marginBottom: '1rem', color: 'inherit', fontSize: '2rem' }}>{selectedSkill}</h2>

            <p style={{ marginBottom: '1.5rem', color: 'inherit', opacity: 0.9, fontSize: '1.1rem' }}>
              {lang === 'ar' ? currentSkillData.desc_ar : currentSkillData.desc_en}
            </p>

            <div style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '1.5rem',
              borderRadius: '10px',
              marginBottom: '2rem',
              textAlign: 'left',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              overflowX: 'auto',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', opacity: 0.5 }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'red' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'yellow' }}></div>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'green' }}></div>
              </div>
              <pre style={{ margin: 0, color: 'inherit' }}>{currentSkillData.snippet}</pre>
            </div>

            <button
              onClick={() => setSelectedSkill(null)}
              className="btn-primary"
              style={{ background: 'transparent', border: '1px solid currentColor', color: 'inherit', boxShadow: 'none' }}
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Hacker Mode Overlay */}
      {isHackerMode && (
        <div className="hacker-overlay">
          <div className="matrix-bg"></div>
          <div className="hacker-content">
            <div className="hacker-alert">
              <ShieldAlert size={80} color="red" className="pulse-icon" />
              <h1 className="glitch-text" data-text="SYSTEM BREACH DETECTED">SYSTEM BREACH DETECTED</h1>
              <div className="code-stream">
                {Array.from({ length: 10 }).map((_, i) => (
                  <p key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                    &gt; INJECTING_PAYLOAD... {Math.random().toString(16).substr(2, 8)}
                  </p>
                ))}
              </div>
              <div className="access-granted">
                <Bug size={40} className="shake-icon" />
                <h2>CERTIFICATE ACCESS GRANTED</h2>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Widget */}
      <AIChat />
    </div>
  );
}

export default App;
