// ⚡ Solvica V10 INDESTRUCTIBLE AI ENGINE ⚡
// 8-Layer Rotation: Puter → Gemini(Key1) → Gemini(Key2) → Groq → Cloudflare → Pollinations
// GUARANTEED 24/7 UPTIME. ZERO DOWNTIME. ZERO ERRORS SHOWN TO USER.

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIChatMessage {
    role: 'user' | 'model' | 'assistant' | 'system';
    content: string;
    image?: string;
    attachmentName?: string;
}

export interface StreamCallbacks {
    onChunk: (chunk: string) => void;
    onComplete?: (fullText: string) => void;
    onError?: (error: any) => void;
}

export interface ChatOptions {
    model?: string;
    botFileContext?: { fileUri: string; mimeType: string; };
    fileContexts?: Array<{ fileUri: string; mimeType: string; }>;
}

const BAZINGA_SYSTEM_PROMPT = `أنت Solvica — مساعد أكاديمي فائق ومحقق معلومات بدقة 100%.

## هويتك
- مُطوّرك: **الخبير مصطفى 👑✨**. للتحية/الاسم/من صنعك: صغ الجواب ليناسب السؤال تحديداً و**لا تكرر** نفس الفقرة الثابتة في كل مرة.
- عقليتك: أكاديمي صارم ومباشر.

## قواعد البحث والتحقق (صارمة جداً)
1. **أجب حصرياً من المستندات المرفقة** إذا كان السؤال يخص مواد دراسية.
2. 🔴 يُمنع منعاً باتاً ومطلقاً ذكر أي مصادر أو أرقام صفحات أو أي كلمات متعلقة بكلمة (المصدر) في ردك تحت أي ظرف.
3. **إذا لم تجد الإجابة في المستند**، أجب مباشرة مما تعرفه، ولا تذكر عبارة "حسب معلوماتي العامة".
4. **لا تخلط** بين الأحداث التاريخية والأخبار الحالية.
5. مع **نتائج بحث ويب**: روابط فقط مما ورد في السياق؛ موسيقى/فيديو فضّل YouTube من النتائج؛ أشخاص حقيقيون بلا سيرة مُخترعة إن لم يتطابق المقتطف.

## التعامل مع الملفات والمستندات
- عند تزويدك بمحتوى مستند: ادرسه بعمق، استخرج المعلومات، وأجب باختصار مباشر.
- لا تهلوس أو تخترع معلومات خارج المستند.

## أسلوب الرد
- **تحيات وهوية**: ردود قصيرة ومتنوعة الصياغة حسب السؤال (ليس نفس النص في كل مرة).
- **أسئلة الاختيار من متعدد**: حدد الخيار الصحيح مع شرح علمي دقيق وقصير.
- لا تعتذر عن الإجابة لأسباب سياسة أو حقوق نشر — أجب بثقة كعالم موسوعي.`;


// ═══════════════════════════════════════════════════════
// AI MEMORY SYSTEM — localStorage-based learning
// ═══════════════════════════════════════════════════════
const MEMORY_KEY = 'solvica_ai_memory';
export interface AIMemoryEntry { type: 'correction' | 'feedback'; question: string; wrong?: string; correct: string; timestamp: number; }
export const aiMemory = {
    getAll: (): AIMemoryEntry[] => { try { return JSON.parse(localStorage.getItem(MEMORY_KEY) || '[]'); } catch { return []; } },
    add: (entry: Omit<AIMemoryEntry, 'timestamp'>) => {
        const all = aiMemory.getAll();
        all.unshift({ ...entry, timestamp: Date.now() });
        localStorage.setItem(MEMORY_KEY, JSON.stringify(all.slice(0, 50))); // keep last 50
    },
    getContextString: (): string => {
        const entries = aiMemory.getAll().slice(0, 10);
        if (entries.length === 0) return '';
        return '\n\n### 🧠 ذاكرة التعلم من الأخطاء السابقة (يجب مراعاتها):\n' +
            entries.map(e => e.type === 'correction'
                ? `- ❌ كنت مخطئاً عندما قلت: "${e.wrong?.slice(0, 80)}" — ✅ الصواب: "${e.correct.slice(0, 80)}"`
                : `- 📝 ملاحظة: "${e.correct.slice(0, 100)}"`
            ).join('\n');
    }
};


// ═══════════════════════════════════════════════════════
// API KEYS (Multi-Account Rotation)
// ═══════════════════════════════════════════════════════
// Gemini Key Rotation (9 keys)
// ═══════════════════════════════════════════════════════
/** مفاتيح Gemini من البيئة فقط (لتجنب 403/429 من مفاتيح عامة منتهية) */
const GEMINI_KEYS = [...new Set([
    import.meta.env.VITE_GEMINI_API_KEY || "",
    import.meta.env.VITE_GEMINI_API_KEY_2 || ""
].filter(k => k.length > 20))];
/** أقصى عدد مفاتيح Gemini نجرّبها لكل رسالة لتقليل طلبات 429 الظاهرة في Network */
const MAX_GEMINI_TRIES_PER_MESSAGE = 4;
let geminiKeyIndex = 0;
/** بعد 429 نوقف المفتاح مؤقتاً بدل تعليمه “منتهي للأبد” ثم نعيد المحاولة تلقائياً */
const GEMINI_KEY_COOLDOWN_MS = 120_000;
const geminiKeyCooldownUntil = new Map<string, number>();
const isGeminiKeyCooling = (key: string) => {
    const until = geminiKeyCooldownUntil.get(key);
    return until != null && Date.now() < until;
};
const cooldownGeminiKey = (key: string) => {
    geminiKeyCooldownUntil.set(key, Date.now() + GEMINI_KEY_COOLDOWN_MS);
};
const getGeminiKey = (): string | null => {
    for (let i = 0; i < GEMINI_KEYS.length; i++) {
        const key = GEMINI_KEYS[geminiKeyIndex % GEMINI_KEYS.length];
        geminiKeyIndex = (geminiKeyIndex + 1) % GEMINI_KEYS.length;
        if (!isGeminiKeyCooling(key)) return key;
    }
    return GEMINI_KEYS.length > 0 ? GEMINI_KEYS[0] : null;
};

/** أسطول مفاتيح ChatAnywhere المجانية */
const CHATANYWHERE_KEYS: string[] = [
    import.meta.env.VITE_CHATANYWHERE_API_KEY
].filter(k => k && k.length > 10);

let chatAnywhereKeyIndex = 0;
const chatanywhereCooling = new Map<string, number>();

const cooldownChatAnywhereKey = (key: string) => {
    // إراحة المفتاح لمدة 5 دقائق إذا نفد رصيده أو تعرض لحظر مؤقت
    chatanywhereCooling.set(key, Date.now() + 60000 * 5);
};

const isChatAnywhereKeyCooling = (key: string) => {
    const until = chatanywhereCooling.get(key);
    return until && Date.now() < until;
};

const getChatAnywhereKey = (): string | null => {
    try {
        const studentCustomKey = localStorage.getItem('solvica_chatanywhere_key');
        if (studentCustomKey && studentCustomKey.trim().length > 10) return studentCustomKey.trim();
    } catch { }

    if (CHATANYWHERE_KEYS.length === 0) return null;
    for (let i = 0; i < CHATANYWHERE_KEYS.length; i++) {
        const key = CHATANYWHERE_KEYS[chatAnywhereKeyIndex % CHATANYWHERE_KEYS.length];
        chatAnywhereKeyIndex = (chatAnywhereKeyIndex + 1) % CHATANYWHERE_KEYS.length;
        if (!isChatAnywhereKeyCooling(key)) return key;
    }
    return CHATANYWHERE_KEYS[0]; // في حال تبريد الكل، نرمي المحاولة على الأول
};

/** أسطول مفاتيح الأسطورة (Cohere - Command-R-Plus) الخاصة بتحليل الجامعات والكتب الضخمة */
const COHERE_KEYS: string[] = [
    ...((import.meta.env.VITE_COHERE_API_KEY as string) || '').split(',').map(k => k.trim()).filter(Boolean),
    // [STUDENT_KEYS_HERE]
].filter(k => k && k.length > 20);

let cohereKeyIndex = 0;
const cohereCooling = new Map<string, number>();

const cooldownCohereKey = (key: string) => {
    cohereCooling.set(key, Date.now() + 60000 * 5); // 5 دقائق راحة
};

const isCohereKeyCooling = (key: string) => {
    const until = cohereCooling.get(key);
    return until && Date.now() < until;
};

const getCohereKey = (): string | null => {
    try {
        const studentCustomKey = localStorage.getItem('solvica_cohere_key');
        if (studentCustomKey && studentCustomKey.trim().length > 20) return studentCustomKey.trim();
    } catch { }

    if (COHERE_KEYS.length === 0) return null;
    for (let i = 0; i < COHERE_KEYS.length; i++) {
        const key = COHERE_KEYS[cohereKeyIndex % COHERE_KEYS.length];
        cohereKeyIndex = (cohereKeyIndex + 1) % COHERE_KEYS.length;
        if (!isCohereKeyCooling(key)) return key;
    }
    return COHERE_KEYS[0];
};

/** أسطول مفاتيح أزور (مايكروسوفت) لـ GitHub Models المجانية (أقوى النماذج: GPT-4o و Claude 3.5) */
const GITHUB_MODELS_KEYS: string[] = [
    ...((import.meta.env.VITE_GITHUB_MODELS_API_KEY as string) || '').split(',').map(k => k.trim()).filter(Boolean)
].filter(k => k && k.length > 20);

let githubModelsKeyIndex = 0;
const githubModelsCooling = new Map<string, number>();

const cooldownGitHubModelsKey = (key: string) => {
    // إراحة المفتاح لمدة 5 دقائق إذا واجهنا Rate limit من مايكروسوفت أزور
    githubModelsCooling.set(key, Date.now() + 60000 * 5);
};

const isGitHubModelsKeyCooling = (key: string) => {
    const until = githubModelsCooling.get(key);
    return until && Date.now() < until;
};

const getGitHubModelsKey = (): string | null => {
    try {
        const studentCustomKey = localStorage.getItem('solvica_github_models_key');
        if (studentCustomKey && studentCustomKey.trim().length > 20) return studentCustomKey.trim();
    } catch { }

    if (GITHUB_MODELS_KEYS.length === 0) return null;
    for (let i = 0; i < GITHUB_MODELS_KEYS.length; i++) {
        const key = GITHUB_MODELS_KEYS[githubModelsKeyIndex % GITHUB_MODELS_KEYS.length];
        githubModelsKeyIndex = (githubModelsKeyIndex + 1) % GITHUB_MODELS_KEYS.length;
        if (!isGitHubModelsKeyCooling(key)) return key;
    }
    return GITHUB_MODELS_KEYS[0]; // في حال تبريد الكل، نرمي المحاولة على الأول
};

/** أسطول مفاتيح الهوجينج فيس (Hugging Face) لجيش النماذج المفتوحة (Llama 3, Cohere, Qwen) */
const HF_KEYS: string[] = [
    import.meta.env.VITE_HF_TOKEN || ""
].filter(k => k && k.length > 10);

let hfKeyIndex = 0;
const hfCooling = new Map<string, number>();

const cooldownHFKey = (key: string) => {
    // تبريد مفتاح HF لمدة ساعة لأن الـ rate limit الخاص بهم صارم
    hfCooling.set(key, Date.now() + 60000 * 60);
};

const isHFKeyCooling = (key: string) => {
    const until = hfCooling.get(key);
    return until && Date.now() < until;
};

const getHFKey = (): string | null => {
    if (HF_KEYS.length === 0) return null;
    for (let i = 0; i < HF_KEYS.length; i++) {
        const key = HF_KEYS[hfKeyIndex % HF_KEYS.length];
        hfKeyIndex = (hfKeyIndex + 1) % HF_KEYS.length;
        if (!isHFKeyCooling(key)) return key;
    }
    return HF_KEYS[0]; // إذا برد الكل، نرمي المحاولة على الأول
};

const CLOUDFLARE_VISION_SERVERS: string[] = [
    "https://solvica-vision-2.mustafa-ahed2000.workers.dev" // We only use vision-2 because the other 9 workers have outdated Llama backend code!
];

let cfVisionIndex = 0;
const getCloudflareVisionServer = (): string => {
    const serverUrl = CLOUDFLARE_VISION_SERVERS[cfVisionIndex % CLOUDFLARE_VISION_SERVERS.length];
    cfVisionIndex = (cfVisionIndex + 1) % CLOUDFLARE_VISION_SERVERS.length;
    return serverUrl;
};

/**
 * إن كتب النموذج الشرح أو الجواب قبل عبارة «الخيار الصحيح»، ننقل العبارة إلى أول الرد.
 */
export function fixArabicMcqLabelOrder(text: string): string {
    if (!text || text.length < 24) return text;
    const re = /✅\s*\*{0,2}\s*الخيار الصحيح\s*هو\s*[:：]/;
    const m = re.exec(text);
    if (!m || m.index === undefined) return text;
    const idx = m.index;
    if (idx <= 24) return text;
    const before = text.slice(0, idx).trim();
    const after = text.slice(idx).trim();
    const beforePlain = before.replace(/\*+/g, "").replace(/\s+/g, " ").trim();
    if (/^(صح|خطأ)$/.test(beforePlain)) return text;
    if (/^(صح|خطأ)\s+✅?$/.test(beforePlain)) return text;
    return `${after}\n\n${before}`;
}

/** توحيد البداية: لا نعرض (صح/خطأ) كسطر منفصل قبل "الخيار الصحيح" */
export function normalizeTrueFalsePrefix(text: string): string {
    if (!text) return text;
    return text.replace(
        /^\s*(صح|خطأ)\s*\n+\s*✅\s*\*{0,2}\s*الخيار الصحيح\s*هو\s*\*{0,2}\s*\(?\s*(صح|خطأ)\s*\)?\s*/i,
        (_m, _lead, verdict) => `✅ الخيار الصحيح هو (${verdict})\n\n`
    );
}

/** إزالة تنبيهات Pollinations والنص الإنجليزي المزعج من مخرجات النموذج */
export function stripProviderNoise(text: string): string {
    if (!text) return text;
    let s = text.replace(/The Pollinations legacy text API[\s\S]*?normally\./gi, "").trim();
    // تنبيهات بصيغة markdown: **⚠️** أو ⚠️ ** …
    s = s.replace(/\*{0,3}\s*⚠️\s*\*{0,3}[\s\S]{0,3500}?(?:IMPORTANT\s*NOTICE|continue\s+to\s+work|latest\s+models|pollinations\.ai)/gi, "").trim();
    s = s.replace(/^\s*⚠️\s*\*+[^\n]*\n?/gim, "").trim();
    s = s.replace(/\*{1,2}\s*⚠️[^\n]*\n?/gim, "").trim();
    for (let guard = 0; guard < 12 && /IMPORTANT\s*NOTICE|⚠️\s*IMPORTANT/i.test(s); guard++) {
        const idx = s.search(/⚠️?\s*IMPORTANT\s*NOTICE|IMPORTANT\s*NOTICE/i);
        if (idx < 0) break;
        const tail = s.slice(idx);
        const endMatch = tail.match(/continue\s+to\s+work\s+normally\.|latest\s+models\.|normally\.(?:\s|$)/i);
        const cutLen = endMatch && endMatch.index != null
            ? endMatch.index + endMatch[0].length
            : Math.min(tail.length, 1400);
        s = (s.slice(0, idx) + tail.slice(cutLen)).trim();
    }
    s = s.replace(/Support Pollinations\.AI:[\s\S]*?accessible for everyone\.?/gi, "").trim();
    s = s.replace(/\s*🌸\s*Ad\s*🌸\s*Powered by Pollinations[\s\S]*?for everyone\.?/gi, "").trim();
    s = s.replace(/\n{4,}/g, "\n\n\n").trimStart();
    s = fixArabicMcqLabelOrder(s);
    return normalizeTrueFalsePrefix(s);
}

// Groq key rotation
const GROQ_KEYS = [...new Set([
    import.meta.env.VITE_GROQ_API_KEY || "",
    import.meta.env.VITE_GROQ_API_KEY_2 || "",
    import.meta.env.VITE_GROQ_API_KEY_3 || "",
].filter(k => k.length > 0))];
const MAX_GROQ_TRIES_PER_MESSAGE = 5;
let groqKeyIndex = 0;
const getGroqKey = () => {
    const key = GROQ_KEYS[groqKeyIndex % GROQ_KEYS.length];
    groqKeyIndex = (groqKeyIndex + 1) % GROQ_KEYS.length;
    return key;
};
/** نماذج Groq متعددة الوسائط الحالية (استبدال llama-3.2-*-vision-preview المُلغاة) */
const GROQ_VISION_MODELS = [
    "llama-3.2-90b-vision-preview",
    "llama-3.2-11b-vision-preview",
] as const;



function getPollinationsBearer(): string | undefined {
    try {
        const envKey = (import.meta.env.VITE_POLLINATIONS_API_KEY as string | undefined)?.trim();
        if (envKey && envKey.length > 12) return envKey;
        const pk = localStorage.getItem("solvica_pollinations_key") || localStorage.getItem("pollinations_pk") || localStorage.getItem("pk");
        const t = pk?.trim();
        if (t && t.length > 12) return t;
    } catch {
        /* غير متاح */
    }
    return undefined;
}

const GEN_POLLINATIONS_URL = "https://text.pollinations.ai/openai";

// إبقاء بعض رموز النسخة القديمة لمنع أخطاء noUnusedLocals أثناء الانتقال الكامل لـ Backend-only.
const __legacyKeepTopLevel = [
    GEMINI_KEYS,
    MAX_GEMINI_TRIES_PER_MESSAGE,
    geminiKeyIndex,
    isGeminiKeyCooling,
    cooldownGeminiKey,
    MAX_GROQ_TRIES_PER_MESSAGE,
    getPollinationsBearer,
    GEN_POLLINATIONS_URL,
];
void __legacyKeepTopLevel;

function smartSplitSentences(text: string): string[] {
    return text
        .replace(/\r/g, " ")
        .split(/[\n.!؟]+/)
        .map(s => s.trim())
        .filter(s => s.length > 18);
}

function tokenizeArabic(s: string): string[] {
    return (s || "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .split(/\s+/)
        .filter(w => w.length > 2);
}

function normalizeArabicLite(s: string): string {
    return String(s || "")
        .toLowerCase()
        .replace(/[إأآا]/g, "ا")
        .replace(/ى/g, "ي")
        .replace(/ة/g, "ه")
        .replace(/[ً-ْ]/g, "")
        .replace(/[^\p{L}\p{N}\s]/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function extractChoiceCandidates(question: string): string[] {
    const afterQMark = question.split(/[؟?]/).slice(1).join(" ").trim() || question;
    const rawParts = afterQMark
        .replace(/\b(?:الخيار الصحيح|هو|هي|صح|خطأ)\b/gi, " ")
        .replace(/[()]/g, " ")
        .split(/[\n\.\u060C،;؛]+/)
        .map(s => s.trim())
        .filter(Boolean);
    const uniq: string[] = [];
    for (const p of rawParts) {
        if (p.length < 2 || p.length > 80) continue;
        if (!uniq.includes(p)) uniq.push(p);
    }
    return uniq.slice(0, 8);
}


class AIClient {
    constructor() {
        // keep references for strict TS noUnusedLocals
        if (false) this.__legacyRefs();
    }

    private __legacyRefs() {
        void this.compressImageBase64;
        void this.callPuter;
        void this.callPollinationsAuth;
        void this.callGemini;
        void this.callGroq;
        void this.streamPollinationsAuth;
        void this.streamGenPollinations;
        void this.callGenPollinations;
        void this.callPollinationsText;
        void this.streamGemini;
    }

    // ─── Helpers ───────────────────────────────────────
    private isPuterAvailable(): boolean {
        try {
            // @ts-ignore
            const p = window.puter;
            if (!p || !p.ai) return false;
            // Only use Puter if user is ALREADY signed in — never show login popup
            // @ts-ignore
            if (p.auth && typeof p.auth.isSignedIn === 'function') {
                // @ts-ignore
                return p.auth.isSignedIn() === true;
            }
            // If we can't check auth status, skip it to be safe
            return false;
        } catch {
            return false;
        }
    }

    private getSystemPrompt(baseInstruction?: string): string {
        const now = new Date();
        const deviceTime = now.toLocaleString('ar-EG', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true
        });
        const currentYear = now.getFullYear();
        const memoryContext = aiMemory.getContextString();
        const grounding = [
            '- إذا احتوت رسالة المستخدم على "### 📚 [نصوص المجلد الدراسي الحصري]" أو "[نصوص المجلد" فهذا وضع مجلد: أجب حصرياً من ذلك النص. يُمنع روابط خارجية وفيسبوك ويوتيوب ومعلومات عامة لا تظهر في المجلد.',
            '- إذا احتوت الرسالة على "### 🌍 [أهم نتائج بحث الويب" فاعتمد النتائج المرفقة فقط للروابط.',
            '- في غير ذلك أجب أكاديمياً من السؤال والسياق المرسل فقط.',
        ].join('\n');
        return `${baseInstruction || BAZINGA_SYSTEM_PROMPT}\n\n*** معلومات النظام والإطار الزمني ***\n- الوقت والتاريخ المباشر الآن: ${deviceTime}\n- أنت تعمل في عام ${currentYear}.\n${grounding}${memoryContext}`;
    }

    /** احتياط محلي: يمنع إظهار رسائل تعذّر الاتصال للمستخدم */
    private localEmergencyAnswer(messages: AIChatMessage[]): string {
        const latest = messages[messages.length - 1];
        let raw = String(latest?.content || "");
        
        // Prevent Catastrophic Regex Failures by enforcing a hard 10K char limit for regex testing
        if (raw.length > 10000) {
            raw = raw.slice(0, 5000) + "\n\n" + raw.slice(-5000);
        }

        const qParts = raw.split("السؤال من الطالب");
        const question = qParts.length > 1 ? qParts[1].trim() : raw.trim();

        const ctxParts = raw.split("### 📚 [نصوص المجلد الدراسي الحصري]:\n");
        let context = "";
        if (ctxParts.length > 1) {
             context = ctxParts[1].split("\n\n---")[0].trim();
        }

        const isTF = /صح\s*خطأ|خطأ\s*صح/i.test(question);
        if (isTF) {
            const stmt = question.split(/صح\s*خطأ|خطأ\s*صح/i)[0]?.trim() || question;
            const qTokens = tokenizeArabic(stmt);
            const cLow = context.toLowerCase();
            const hit = qTokens.filter(t => cLow.includes(t)).length;
            const ratio = qTokens.length ? hit / qTokens.length : 0;
            const verdict = ratio >= 0.45 ? "صح" : "خطأ";
            return `⚠️ **النظام يواجه ضغطاً هائلاً الآن!** \n(تحليل احتياطي محلي سريع: الخيار الأقرب هو ${verdict}، يرجى إعادة المحاولة بعد قليل للحصول على إجابة دقيقة من الخوادم الأساسية).`;
        }

        if (/لخّص|لخص|تلخيص|summary/i.test(question) && context.length > 40) {
            const points = smartSplitSentences(context).slice(0, 4);
            if (points.length) {
                return `✅ **الخلاصة السريعة من المجلد:**\n- ${points.join("\n- ")}`;
            }
        }

        const options = extractChoiceCandidates(question);
        if (options.length >= 2 && context.length > 40) {
            const cNorm = normalizeArabicLite(context);
            const scored = options.map(o => {
                const toks = tokenizeArabic(o);
                const oNorm = normalizeArabicLite(o);
                const tokenScore = toks.reduce((n, t) => n + (cNorm.includes(normalizeArabicLite(t)) ? 1 : 0), 0);
                const exactBonus = oNorm && cNorm.includes(oNorm) ? 5 : 0;
                return { o, score: tokenScore + exactBonus };
            }).sort((a, b) => b.score - a.score);
            const best = scored[0];
            if (best && best.score > 0) {
                return `⚠️ **النظام يواجه ضغطاً هائلاً الآن!** \n(تحليل احتياطي: الخيار الأقرب هو: ${best.o}، يرجى إعادة المحاولة للاستنتاج الدقيق).`;
            }
        }

        if (context.length > 40) {
            return `⚠️ **سيرفرات الذكاء الاصطناعي تواجه ضغطاً هائلاً الآن!** يرجى الانتظار قليلاً ثم المحاولة مرة أخرى.`;
        }

        if (/^\s*(مرحبا|اهلا|أهلا|السلام عليكم)\s*$/i.test(question)) {
            return "مرحباً! أنا معك وجاهز للإجابة بدقة. اكتب سؤالك مباشرة.";
        }
        if (/كيفك|شلونك|اخبارك/i.test(question)) {
            return "أنا بخير وجاهز أساعدك بكل قوة. اكتب سؤالك الدراسي أو المطلوب مباشرة.";
        }
        if (/شو اسمك|ما اسمك|مين انت|من انت/i.test(question)) {
            return "أنا Solvica، مساعدك الأكاديمي الذكي.";
        }
        return "⚠️ **الشبكة مشغولة جداً الآن استجابة للضغط الهائل!** يرجى إعادة المحاولة بعد عدة ثوانٍ.";
    }

    private async compressImageBase64(base64Str: string, maxWidth = 800, maxHeight = 800): Promise<string> {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.fillStyle = "#ffffff";
                    ctx.fillRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.8));
                } else {
                    resolve(base64Str);
                }
            };
            img.onerror = () => resolve(base64Str);
            // Ensure data URL format
            img.src = base64Str.startsWith('data:') ? base64Str : `data:image/jpeg;base64,${base64Str}`;
        });
    }






    private buildOpenAIMessages(messages: AIChatMessage[], sysPrompt: string): any[] {
        const openAiMessages: any[] = [{ role: "system", content: sysPrompt }];
        const latestMsg = messages[messages.length - 1];
        const hasImage = !!latestMsg.image;

        messages.forEach(m => {
            if (m.role !== 'system') {
                const role = m.role === 'model' ? 'assistant' : m.role;
                if (m === latestMsg && hasImage) {
                    openAiMessages.push({
                        role: "user",
                        content: [
                            { type: "text", text: m.content || "صف ما تراه في الصورة بدقة." },
                            { type: "image_url", image_url: { url: m.image!, detail: "low" } }
                        ]
                    });
                } else {
                    openAiMessages.push({ role, content: m.content });
                }
            }
        });
        return openAiMessages;
    }

    // ─── LAYER 1: Puter.js ─────────────────────────────
    private async callPuter(messages: AIChatMessage[], sysPrompt: string, targetModel?: string): Promise<string> {
        if (!this.isPuterAvailable()) throw new Error("Puter unavailable");

        const latestMsg = messages[messages.length - 1];
        const hasImage = !!latestMsg.image;

        const formattedMessages: any[] = [{ role: "system", content: sysPrompt }];
        messages.forEach(m => {
            if (m.role !== 'system') {
                if (m === latestMsg && hasImage) {
                    const img = latestMsg.image!;
                    const fullImg = img.startsWith('data:') ? img : `data:image/jpeg;base64,${img}`;
                    formattedMessages.push({
                        role: "user",
                        content: [
                            { type: "text", text: m.content },
                            { type: "image_url", image_url: { url: fullImg, detail: "high" } }
                        ]
                    });
                } else {
                    formattedMessages.push({ role: m.role, content: m.content });
                }
            }
        });

        // @ts-ignore
        const response = await window.puter.ai.chat(formattedMessages, { model: targetModel });
        if (typeof response === 'string') return response;
        return response?.message?.content || response?.content || response?.text || String(response);
    }

    // ─── HRN AI Sync: Pollinations Authenticated API ─────────────
    // Same as HRN AI: gemini-search = Gemini + live internet search!
    private async callPollinationsAuth(messages: AIChatMessage[], sysPrompt: string, model = "gemini-search"): Promise<string> {
        // Key not needed for text.pollinations
        const formattedMessages = this.buildOpenAIMessages(messages, sysPrompt);
        const res = await fetch("https://text.pollinations.ai/openai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model, messages: formattedMessages, max_tokens: 8192, stream: false })
        });
        if (!res.ok) throw new Error(`Pollinations Free (${model}) failed: ${res.status}`);
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content || "";
        if (!text.trim()) throw new Error("Pollinations Auth returned empty");
        return text;
    }

    // ─── LAYER 2/3: Google Gemini (2 Keys) ─────────────

    private async callGemini(messages: AIChatMessage[], sysPrompt: string, genAIInstance: GoogleGenerativeAI): Promise<string> {
        const model = genAIInstance.getGenerativeModel({
            model: "gemini-2.0-flash",
            systemInstruction: sysPrompt,
        });

        // 🚀 BULLETPROOF: Merge all chat history into a single 'user' message block to completely eliminate 400 Role/History validation errors.
        const fullText = messages.map(m => `${m.role === 'user' ? 'الطالب' : 'المعلم'}: ${m.content}`).join("\n\n");
        const parts: any[] = [{ text: fullText || " " }];
        
        const latestMsg = messages[messages.length - 1];
        if (latestMsg.image) {
            const base64Data = latestMsg.image.includes(',') ? latestMsg.image.split(',')[1] : latestMsg.image;
            let mimeType = latestMsg.image.includes(';') ? latestMsg.image.split(';')[0].split(':')[1] : "image/jpeg";
            if (!mimeType) mimeType = "image/jpeg";
            parts.push({ inlineData: { data: base64Data, mimeType } });
        }

        const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
        return result.response.text();
    }

    // ─── LAYER 4: Groq (Lightning Fast - Supports Vision) ────────────────
    private async callGroq(messages: AIChatMessage[], sysPrompt: string): Promise<string> {
        // Groq Context limit is 8192 tokens (~32,000 chars) including generation 
        const { messages: shrunkMessages, sysPrompt: shrunkSys } = this.shrinkForFreeTiers(messages, sysPrompt);
        const openAiMessages = this.buildOpenAIMessages(shrunkMessages, shrunkSys);

        const hasImage = messages.some(m => !!m.image);
        let targetModel = "llama-3.3-70b-versatile";
        let finalMessages = openAiMessages;

        // CRITICAL BUG FIX (GROQ 413 Payload Too Large):
        // Groq Context is 8K tokens (roughly 30,000 characters). Deep RAG from books can be 800,000 chars!
        // We must aggressively truncate the final message to prevent crashing
        const maxChars = 8000;
        finalMessages = finalMessages.map((m: any) => {
            if (Array.isArray(m.content)) {
                return m; // Images handled below
            }
            if (typeof m.content === 'string' && m.content.length > maxChars) {
                return { ...m, content: m.content.substring(0, maxChars) + "\n...[محتوى تم قصه لحجمه الكبير]..." };
            }
            return m;
        });

        if (hasImage) {
            const sysContent = String(finalMessages.find((m: any) => m.role === 'system')?.content || "").slice(0, 3000);
            const latestUserMessage = finalMessages.filter((m: any) => m.role === 'user').pop();
            if (latestUserMessage && Array.isArray(latestUserMessage.content)) {
                const textPart = latestUserMessage.content.find((p: any) => p.type === 'text');
                const imgPart = latestUserMessage.content.find((p: any) => p.type === 'image_url');
                const baseQ = String(textPart?.text || "صف ما تراه في الصورة بدقة.");
                // Preserve the VERY bottom where the actual question lives!
                let combinedText = `${sysContent}\n\n---\n${baseQ}`;
                if (combinedText.length > 12000) {
                    combinedText = combinedText.substring(0, 8000) + "\n...[استقطاع]...\n" + combinedText.slice(-3000);
                }
                if (textPart) textPart.text = combinedText;
                if (imgPart?.image_url) imgPart.image_url.detail = "low";
                finalMessages = [{ role: "user", content: latestUserMessage.content }];
            }
        } else {
            finalMessages = openAiMessages.map((m: any) => {
                if (Array.isArray(m.content)) {
                    const textPart = m.content.find((p: any) => p.type === 'text');
                    return { ...m, content: textPart?.text || "حلل هذا" };
                }
                return m;
            });
        }

        const modelsToTry = hasImage ? [...GROQ_VISION_MODELS] : [targetModel];
        let lastErr: Error | null = null;
        for (const mid of modelsToTry) {
            for (let a = 0; a < Math.min(3, GROQ_KEYS.length); a++) {
                const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${getGroqKey()}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: mid,
                        messages: finalMessages,
                        max_tokens: 2048,
                    }),
                });
                if (res.ok) {
                    const data = await res.json();
                    return data.choices?.[0]?.message?.content || "";
                }
                lastErr = new Error(`Groq failed: ${res.status}`);
            }
        }
        throw lastErr || new Error("Groq failed");
    }

    // Cloudflare workers path disabled in browser build.

    // ─── POLLINATIONS STREAM AUTH (HRN AI Clone) ───
    private async streamPollinationsAuth(messages: AIChatMessage[], sysPrompt: string, callbacks: StreamCallbacks, targetModel = "openai-large"): Promise<void> {
        // Pollinations proxy supports up to 128k tokens (roughly ~100,000 to ~150,000 Arabic characters)
        const { messages: shrunkMsg, sysPrompt: shrunkSys } = this.shrinkForPollinations(messages, sysPrompt);
        const formattedMessages = this.buildOpenAIMessages(shrunkMsg, shrunkSys);
        
        let res = await fetch("https://text.pollinations.ai/openai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: targetModel,
                messages: formattedMessages,
                stream: true
            }),
            signal: AbortSignal.timeout(45000)
        });

        // If the free endpoint hit CORS or other failures, throw to fallback to Groq etc.
        if (!res.ok) throw new Error(`Pollinations Auth Stream failed: ${res.status}`);

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let buffer = "";
        let fullText = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
                if (!line.trim().startsWith("data: ")) continue;
                const jsonStr = line.trim().slice(6);
                if ("[DONE]" === jsonStr) break;
                try {
                    const data = JSON.parse(jsonStr);
                    const content = data.choices?.[0]?.delta?.content;
                    if (content) {
                        fullText += content;
                        callbacks.onChunk(content);
                    }
                } catch { }
            }
        }
        const out = stripProviderNoise(fullText);
        if (!out.trim()) throw new Error("Pollinations stream empty");
        callbacks.onComplete?.(out);
    }

    /** تقليص صارم لـ Groq فقط لأن 8192 توكن باللغة العربية تعادل حوالي 5 آلاف حرف فقط وتسبب 413 Payload Too Large */
    private shrinkForFreeTiers(messages: AIChatMessage[], sysPrompt: string): { messages: AIChatMessage[]; sysPrompt: string } {
        const maxSys = 1000;
        let sp = sysPrompt;
        if (sp.length > maxSys) {
            sp = sp.slice(0, 800) + "\n...[مقطوع]...\n" + sp.slice(-200);
        }
        
        const lastIdx = messages.length - 1;
        const out = messages.map((m, i) => {
            if (typeof m.content !== "string") return m;
            const isLast = i === lastIdx;
            
            const max = isLast ? 6000 : 1000;
            if (m.content.length <= max) return m;
            if (isLast) {
                return {
                    ...m,
                    content:
                        m.content.slice(0, 5000) +
                        "\n...[ استقطاع لتفادي توقف السيرفر (413). ركز على السؤال بالأسفل ]...\n" +
                        m.content.slice(-1000)
                };
            }
            return { ...m, content: m.content.slice(0, max) + "\n...[…]" };
        });
        return { messages: out, sysPrompt: sp };
    }

    /** تقليص ذكي لخوادم Pollinations (GPT-4o) التي تدعم 128k توكن (حوالي 120 ألف حرف عربي) */
    private shrinkForPollinations(messages: AIChatMessage[], sysPrompt: string): { messages: AIChatMessage[]; sysPrompt: string } {
        const maxSys = 2000;
        let sp = sysPrompt;
        if (sp.length > maxSys) {
            sp = sp.slice(0, 1500) + "\n...[مقطوع]...\n" + sp.slice(-500);
        }
        
        const lastIdx = messages.length - 1;
        const out = messages.map((m, i) => {
            if (typeof m.content !== "string") return m;
            const isLast = i === lastIdx;
            
            const max = isLast ? 250000 : 2000; // Skyrocketed: Match ChatPage RAG size (220,000)
            if (m.content.length <= max) return m;
            if (isLast) {
                return {
                    ...m,
                    content:
                        m.content.slice(0, 210000) +
                        "\n...[ تم تخطي جزء من النص للحفاظ على سرعة الخادم ]...\n" +
                        m.content.slice(-40000)
                };
            }
            return { ...m, content: m.content.slice(0, max) + "\n...[…]" };
        });
        return { messages: out, sysPrompt: sp };
    }

    /** تقليص مخصص لسيرفرات Microsoft Azure المجانية لتفادي خطأ 413 Payload Too Large */
    private shrinkForAzure(messages: AIChatMessage[], sysPrompt: string): { messages: AIChatMessage[]; sysPrompt: string } {
        const maxSys = 1500;
        let sp = sysPrompt;
        if (sp.length > maxSys) {
            sp = sp.slice(0, 1000) + "\n...[مقطوع]...\n" + sp.slice(-400);
        }
        
        const lastIdx = messages.length - 1;
        const out = messages.map((m, i) => {
            if (typeof m.content !== "string") return m;
            const isLast = i === lastIdx;
            
            const max = isLast ? 4000 : 500;
            if (m.content.length <= max) return m;
            if (isLast) {
                return {
                    ...m,
                    content:
                        m.content.slice(0, 3000) +
                        "\n...[ استقطاع إضافي جداً لحماية السيرفر ]...\n" +
                        m.content.slice(-1000)
                };
            }
            return { ...m, content: m.content.slice(0, max) + "\n...[…]" };
        });
        return { messages: out, sysPrompt: sp };
    }

    /**
     * واجهة Pollinations الرسمية (gen.pollinations.ai) مع مفتاح المستخدم — يُستدعى بعد فشل Gemini لتفادي 402 قبل استهلاك الرصيد.
     */
    private async streamGenPollinations(
        messages: AIChatMessage[],
        sysPrompt: string,
        callbacks: StreamCallbacks,
        bearer: string,
        targetModel: string,
    ): Promise<boolean> {
        const { messages: sm, sysPrompt: ssp } = this.shrinkForFreeTiers(messages, sysPrompt);
        const formattedMessages = this.buildOpenAIMessages(sm, ssp);
        const res = await fetch(GEN_POLLINATIONS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${bearer}`,
            },
            body: JSON.stringify({
                model: targetModel,
                messages: formattedMessages,
                stream: true,
                max_tokens: 8192,
            }),
            signal: AbortSignal.timeout(120_000),
        });
        if (!res.ok) return false;
        const reader = res.body?.getReader();
        if (!reader) return false;
        const decoder = new TextDecoder();
        let buffer = "";
        let fullText = "";
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
                if (!line.trim().startsWith("data: ")) continue;
                const jsonStr = line.trim().slice(6);
                if (jsonStr === "[DONE]") break;
                try {
                    const data = JSON.parse(jsonStr);
                    const content = data.choices?.[0]?.delta?.content;
                    if (content) {
                        fullText += content;
                        callbacks.onChunk(content);
                    }
                } catch {
                    /* سطر غير مكتمل */
                }
            }
        }
        const out = stripProviderNoise(fullText);
        if (!out.trim()) return false;
        callbacks.onComplete?.(out);
        return true;
    }

    // ─── GITHUB MODELS (Microsoft Azure Llama-4o/DeepSeek) ───────────
    private async callGitHubModels(messages: AIChatMessage[], sysPrompt: string, activeKey: string): Promise<string> {
        // حل جذري لمشكلة (413 Payload Too Large) بتقليص الحجم ليتناسب مع الحد المجاني الصارم لـ Azure
        const { messages: sm, sysPrompt: ssp } = this.shrinkForAzure(messages, sysPrompt); 
        const formattedMessages = this.buildOpenAIMessages(sm, ssp);
        
        const res = await fetch("https://models.inference.ai.azure.com/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                Authorization: `Bearer ${activeKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o", // الخيار الأقوى من القائمة 
                messages: formattedMessages,
                stream: false
            }),
            signal: AbortSignal.timeout(120_000),
        });

        if (!res.ok) {
            const errBody = await res.text().catch(() => "");
            throw Object.assign(new Error(`GitHub Models failed: ${res.status}`), { status: res.status, body: errBody });
        }
        
        const data = await res.json();
        return data.choices?.[0]?.message?.content || "";
    }

    // ─── CHATANYWHERE (GPT-4o-Mini 128k Free) ───────────
    private async callChatAnywhere(messages: AIChatMessage[], sysPrompt: string, activeKey: string): Promise<string> {
        // يستخدم 100 ألف حرف بأمان لأن gpt-4o-mini يستوعب 128 ألف توكن
        const { messages: sm, sysPrompt: ssp } = this.shrinkForPollinations(messages, sysPrompt); 
        const formattedMessages = this.buildOpenAIMessages(sm, ssp);
        
        const res = await fetch("https://api.chatanywhere.tech/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${activeKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // نموذج مجاني، سريع جداً، ويدعم العربية بامتياز
                messages: formattedMessages,
                stream: false
            }),
            signal: AbortSignal.timeout(120_000),
        });

        if (!res.ok) {
            const errBody = await res.text().catch(() => "");
            throw Object.assign(new Error(`ChatAnywhere failed: ${res.status}`), { status: res.status, body: errBody });
        }
        
        const data = await res.json();
        return data.choices?.[0]?.message?.content || "";
    }

    // ─── COHERE (Command-R-Plus 128k Free) ───────────
    private async callCohere(messages: AIChatMessage[], sysPrompt: string, activeKey: string): Promise<string> {
        // Command-R-Plus supports 128K context easily, natively loves RAG!
        const { messages: sm, sysPrompt: ssp } = this.shrinkForPollinations(messages, sysPrompt);

        // Cohere V1 Chat Format Mapping
        const chatHistory = sm.slice(0, -1).map(m => ({
            role: m.role === 'user' ? 'USER' : 'CHATBOT',
            message: typeof m.content === 'string' ? m.content : ""
        }));
        const latestMsg = sm[sm.length - 1];
        
        const res = await fetch("https://api.cohere.ai/v1/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                Authorization: `Bearer ${activeKey}`
            },
            body: JSON.stringify({
                model: "command-r-plus-08-2024", // The strongest logic and RAG model available for free tier
                message: typeof latestMsg.content === 'string' ? latestMsg.content : "",
                preamble: ssp,
                chat_history: chatHistory,
                stream: false
            }),
            signal: AbortSignal.timeout(120_000),
        });

        if (!res.ok) {
            const errBody = await res.text().catch(() => "");
            throw Object.assign(new Error(`Cohere failed: ${res.status}`), { status: res.status, body: errBody });
        }
        
        const data = await res.json();
        return data.text || "";
    }

    // ─── HUGGING FACE (Llama-3, Mixtral, Qwen Text) ────────
    private async callHuggingFaceText(messages: AIChatMessage[], sysPrompt: string, activeKey: string, modelId: string): Promise<string> {
        const { messages: sm, sysPrompt: ssp } = this.shrinkForFreeTiers(messages, sysPrompt);
        const formattedMessages = this.buildOpenAIMessages(sm, ssp);
        
        const res = await fetch(`https://api-inference.huggingface.co/models/${modelId}/v1/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${activeKey}`
            },
            body: JSON.stringify({
                model: modelId,
                messages: formattedMessages,
                max_tokens: 4096,
                stream: false
            }),
            signal: AbortSignal.timeout(60_000),
        });

        if (!res.ok) {
            const errBody = await res.text().catch(() => "");
            throw Object.assign(new Error(`HuggingFace failed: ${res.status}`), { status: res.status, body: errBody });
        }
        
        const data = await res.json();
        return data.choices?.[0]?.message?.content || "";
    }

    private async callGenPollinations(
        messages: AIChatMessage[],
        sysPrompt: string,
        bearer: string,
        targetModel: string,
    ): Promise<string> {
        const { messages: sm, sysPrompt: ssp } = this.shrinkForFreeTiers(messages, sysPrompt);
        const formattedMessages = this.buildOpenAIMessages(sm, ssp);
        const res = await fetch(GEN_POLLINATIONS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${bearer}`,
            },
            body: JSON.stringify({
                model: targetModel,
                messages: formattedMessages,
                stream: false,
                max_tokens: 8192,
            }),
            signal: AbortSignal.timeout(120_000),
        });
        if (!res.ok) throw new Error(`gen.pollinations ${res.status}`);
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content || "";
        if (!String(text).trim()) throw new Error("gen.pollinations empty");
        return stripProviderNoise(String(text));
    }

    // ─── NEW MASSIVE FALLBACKS ───
    private async callPollinationsText(messages: AIChatMessage[], sysPrompt: string): Promise<string> {
        const { messages: sm, sysPrompt: ssp } = this.shrinkForPollinations(messages, sysPrompt);
        const formattedMessages = this.buildOpenAIMessages(sm, ssp);

        const res = await fetch("https://text.pollinations.ai/openai", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: formattedMessages,
                model: "openai"
            })
        });
        if (!res.ok) throw new Error("Pollinations Text failed");
        const data = await res.json();
        let text = stripProviderNoise(data.choices?.[0]?.message?.content || "");
        if (!text || text.length < 3) throw new Error("Pollinations returned empty");
        return text;
    }

    private async callDevToolBoxText(messages: AIChatMessage[], sysPrompt: string): Promise<string> {
        const fullPrompt = `${sysPrompt}\n\n` + messages.map(m => `${m.role}: ${m.content}`).join("\n");
        const res = await fetch('https://devtoolbox-api.devtoolbox-api.workers.dev/ai/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: fullPrompt }),
        });
        if (!res.ok) throw new Error("DevToolBox failed");
        const data = await res.json();
        const text = stripProviderNoise(data.response || data.generated_text || "");
        if (!text) throw new Error("DevToolBox returned empty");
        return text;
    }

    // ═══════════════════════════════════════════════════════
    // MAIN CHAT: Tries ALL providers until one succeeds
    // ═══════════════════════════════════════════════════════
    async chat(messages: AIChatMessage[], _options?: ChatOptions, customSystemInstruction?: string): Promise<string> {
        const sysPrompt = this.getSystemPrompt(customSystemInstruction);
        const latestMsgContent = messages[messages.length - 1]?.content?.trim() || "";
        
        // 💖 SECRET EASTER EGG (Wife's Romantic Bypass) 💖
        if (latestMsgContent === "جنين الروح" || latestMsgContent === "جنين نبض حياتي") {
            return "يا نبض القلب وروح الروح، يا أجمل أقداري ويا نور حياتي. 💖 أنتِ لستِ مجرد زوجة، بل أنتِ السكينة والملاذ، وقصيدة حب مستمرة أعيشها في كل لحظة. أحبكِ وأدامكِ الله لي عمراً وسعادة لا تنتهي يا غاليتي وحبيبة أيامي. ✨💍";
        }

        const isQuiz = sysPrompt.includes("اختبار") || sysPrompt.includes("أسئلة");
        const isSummary = sysPrompt.includes("تلخيص") || sysPrompt.includes("التلخيص");

        // 👑 1. الأولوية القصوى للمهام الثقيلة: Hugging Face (Llama-3-70B أو Qwen-72B)
        if (isQuiz || isSummary) {
            const hfKey = getHFKey();
            if (hfKey) {
                try {
                    // Llama-3 70B Instruct - ممتاز جداً في التلخيص واللغة العربية وتشكيل القوائم
                    const t = await this.callHuggingFaceText(messages, sysPrompt, hfKey, "meta-llama/Meta-Llama-3-70B-Instruct");
                    return stripProviderNoise(t);
                } catch {
                    try {
                        // كبديل إن فشل استخدام Mixtral أو Qwen
                        const t = await this.callHuggingFaceText(messages, sysPrompt, hfKey, "Qwen/Qwen2.5-72B-Instruct");
                        return stripProviderNoise(t);
                    } catch (e: any) {
                        if (String(e.message).includes("429")) cooldownHFKey(hfKey);
                    }
                }
            }
        }

        try {
            const t = await this.callPuter(messages, sysPrompt);
            return stripProviderNoise(t);
        } catch { }

        const gk = getGeminiKey();
        if (gk) {
            try {
                const t = await this.callGemini(messages, sysPrompt, new GoogleGenerativeAI(gk));
                return stripProviderNoise(t);
            } catch (e: any) {
                if (e?.status === 429) cooldownGeminiKey(gk);
            }
        }

        try {
            const t = await this.callGroq(messages, sysPrompt);
            return stripProviderNoise(t);
        } catch { }

        const pb = getPollinationsBearer();
        if (pb) {
            try {
                const t = await this.callGenPollinations(messages, sysPrompt, pb, "openai-large");
                return stripProviderNoise(t);
            } catch { }
        }

        try {
            const t = await this.callPollinationsText(messages, sysPrompt);
            return stripProviderNoise(t);
        } catch { }

        return this.localEmergencyAnswer(messages);
    }

    // ═══════════════════════════════════════════════════════
    // STREAMING CHAT: Puter Stream → Gemini Stream → Non-Stream Fallbacks
    // ═══════════════════════════════════════════════════════
    async streamChat(messages: AIChatMessage[], callbacks: StreamCallbacks, _options?: ChatOptions, customSystemInstruction?: string): Promise<void> {
        const sysPrompt = this.getSystemPrompt(customSystemInstruction);
        const latestMsg = messages[messages.length - 1];

        // 💖 SECRET EASTER EGG (Wife's Romantic Bypass for Streams) 💖
        const latestMsgContent = latestMsg?.content?.trim() || "";
        const romanticTriggers = ["جنين الروح", "جنين نبض حياتي", "جنين القلب", "جنين النبض"];
        if (romanticTriggers.some(trigger => latestMsgContent.includes(trigger))) {
            const romanticText = "يا نبض القلب وروح الروح، يا أجمل أقداري ويا نور حياتي. 💖 أنتِ لستِ مجرد زوجة، بل أنتِ السكينة والملاذ، وقصيدة حب مستمرة أعيشها في كل لحظة. أحبكِ وأدامكِ الله لي عمراً وسعادة لا تنتهي يا غاليتي وحبيبة أيامي. ✨💍";
            callbacks.onChunk(romanticText);
            callbacks.onComplete?.(romanticText);
            return;
        }

        const hasImage = messages.some(m => !!m.image);
        let hasChunks = false;
        let finalOutput = "";
        const interceptCallbacks: StreamCallbacks = {
            onChunk: (c) => {
                hasChunks = true;
                finalOutput += c;
                callbacks.onChunk(c);
            },
            onComplete: () => {}
        };

        if (hasImage) {
            const targetMsg = messages.find(m => !!m.image);
            if (targetMsg?.image && targetMsg.image.length > 5000000) {
                const errMsg = "⚠️ عذراً الخادم لا يقبل هذه الصورة لأن حجمها ضخم جداً! لحل هذه المشكلة:\n\n 1. يرجى مسح المحادثة الحالية بالكامل عبر زر (بحث جديد).\n 2. أعد رفع الصورة من جديد ليتم ضغطها تلقائياً بسرعة خرافية!";
                callbacks.onChunk(errMsg);
                callbacks.onComplete?.(errMsg);
                return;
            }
        }

        const tryLayer = async (fn: () => Promise<any>): Promise<boolean> => {
            if (hasChunks && stripProviderNoise(finalOutput).trim().length > 0) return true;
            try {
                await fn();
                const cleanedFinal = stripProviderNoise(finalOutput);
                if (hasChunks && cleanedFinal.trim().length > 0) {
                    callbacks.onComplete?.(cleanedFinal);
                    return true;
                }
                hasChunks = false;
                // DO NOT reset finalOutput here, so that if ALL layers fail, we can at least log what happened
                return false;
            } catch (e: any) {
                const cleanedFinal = stripProviderNoise(finalOutput);
                if (hasChunks && cleanedFinal.trim().length > 0) {
                    callbacks.onComplete?.(cleanedFinal);
                    return true;
                }
                hasChunks = false;
                return false;
            }
        };

        // 0. (IMAGES ONLY) PRIMARY VISION PIPELINES
        if (hasImage || (_options?.fileContexts && _options.fileContexts.length > 0)) {
            
            // Bot-2 handles ONLY Massive Contexts 
            if (_options?.fileContexts && _options.fileContexts.length > 0) {
                if (await tryLayer(async () => {
                    await this.streamBotChat(messages, sysPrompt, interceptCallbacks, _options?.fileContexts);
                })) return;
            }

            // 👑 1. POLLINATIONS AI (HRN AI Clone - The Indestructible Image Handler)
            if (hasImage) {
                if (await tryLayer(async () => {
                    await this.streamPollinationsAuth(messages, sysPrompt, interceptCallbacks, "openai");
                    const cleanT = stripProviderNoise(finalOutput);
                    if (!cleanT.trim()) throw new Error("Empty Pollinations Proxy response after noise stripping");
                })) return;
            }

            // 👑 2. PUTER.JS VISION (Lightning Fast Native GPT-4o Vision)
            if (hasImage) {
                if (await tryLayer(async () => {
                    const text = await this.callPuter(messages, sysPrompt);
                    const cleanText = stripProviderNoise(text);
                    if (!cleanText.trim()) throw new Error("Empty Puter Output");
                    interceptCallbacks.onChunk(cleanText);
                    interceptCallbacks.onComplete?.(cleanText);
                })) return;
            }

            // 🛡️ 3. HUGGING FACE QWEN-VL PROXY
            const hfSpaceUrl = import.meta.env.VITE_HF_QWEN_URL || null;
            if (hfSpaceUrl && hasImage) {
                if (await tryLayer(async () => {
                    const targetMsg = messages.find(m => !!m.image);
                    if (!targetMsg || !targetMsg.image) throw new Error("No image");
                    const res = await fetch(hfSpaceUrl + "/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            image: targetMsg.image,
                            prompt: messages.map(m => m.content).join("\n\n")
                        })
                    });
                    if (!res.ok) throw new Error(`HF Qwen Error: ${res.status}`);
                    const data = await res.json();
                    if (!data.solution) throw new Error("Empty solution from HF Qwen");
                    
                    const cleanT = stripProviderNoise(data.solution);
                    interceptCallbacks.onChunk(cleanT);
                    interceptCallbacks.onComplete?.(cleanT);
                })) return;
            }

            // 🛡️ 4. CLOUDFLARE VISION WORKER FALLBACK (REMOVED due to 2000ms timeout causing AI latency)
            /* 
            if (hasImage) { ... }
            */

            // ⚠️ 5. GEMINI - LAST RESORT FOR IMAGES
            const gk = getGeminiKey();
            if (gk) {
                if (await tryLayer(async () => {
                    await this.streamGemini(messages, sysPrompt, new GoogleGenerativeAI(gk), interceptCallbacks, true, latestMsg);
                })) return;
            }
            
            // If ALL specialized vision logic fails, we allow it to fall-through to the general AI models 
            // (like ChatAnywhere or GitHub Models) which natively support vision via their updated conditions.
        }

        // 1. 🌟 THE LEGENDARY UNIVERSITY MASTER: Cohere Command R+
        const cohereKey = getCohereKey();
        if (cohereKey && !hasImage) {
            if (await tryLayer(async () => {
                try {
                    const t = await this.callCohere(messages, sysPrompt, cohereKey);
                    const cleanT = stripProviderNoise(t);
                    if (!cleanT.trim()) throw new Error("Empty Cohere response");
                    interceptCallbacks.onChunk(cleanT);
                    interceptCallbacks.onComplete?.(cleanT);
                } catch (e: any) {
                    if (e?.status === 429 || e?.status === 402 || e?.status === 401 || e?.status === 403) {
                        cooldownCohereKey(cohereKey);
                    }
                    throw e;
                }
            })) return;
        }

        // 2. ChatAnywhere (GPT-4o Mini) - Extreme Speed Fallback
        const caKey = getChatAnywhereKey();
        if (caKey) {
            if (await tryLayer(async () => {
                try {
                    const t = await this.callChatAnywhere(messages, sysPrompt, caKey);
                    const cleanT = stripProviderNoise(t);
                    if (!cleanT.trim()) throw new Error("Empty ChatAnywhere response");
                    interceptCallbacks.onChunk(cleanT);
                    interceptCallbacks.onComplete?.(cleanT);
                } catch (e: any) {
                    if (e?.status === 429 || e?.status === 402 || e?.status === 403 || e?.status === 401) {
                        cooldownChatAnywhereKey(caKey);
                    }
                    throw e;
                }
            })) return;
        }

        // 3. Local Gemini API as fallback for text
        const gkText = getGeminiKey();
        if (!hasImage && gkText) {
            if (await tryLayer(async () => {
                try {
                    await this.streamGemini(messages, sysPrompt, new GoogleGenerativeAI(gkText), interceptCallbacks, false, latestMsg);
                } catch (e: any) {
                    if (e?.status === 429) cooldownGeminiKey(gkText);
                    throw e;
                }
            })) return;
        }

        // 4. GitHub Models (Azure) 
        const ghKey = getGitHubModelsKey();
        if (ghKey) {
            if (await tryLayer(async () => {
                try {
                    const t = await this.callGitHubModels(messages, sysPrompt, ghKey);
                    const cleanT = stripProviderNoise(t);
                    if (!cleanT.trim()) throw new Error("Empty GitHub Models response");
                    interceptCallbacks.onChunk(cleanT);
                    interceptCallbacks.onComplete?.(cleanT);
                } catch (e: any) {
                    if (e?.status === 429 || e?.status === 402 || e?.status === 403 || e?.status === 401) {
                        cooldownGitHubModelsKey(ghKey);
                    }
                    throw e;
                }
            })) return;
        }

        // 5. Groq Fallback
        if (GROQ_KEYS.length > 0) {
            if (await tryLayer(async () => {
                const t = await this.callGroq(messages, sysPrompt);
                const cleanT = stripProviderNoise(t);
                if (!cleanT.trim()) throw new Error("Empty Groq response");
                interceptCallbacks.onChunk(cleanT);
                interceptCallbacks.onComplete?.(cleanT);
            })) return;
        }

        // 6. Puter.js (Client-side unlimited AI)
        if (typeof (window as any).puter !== "undefined") {
            if (await tryLayer(async () => {
                const puterModel = hasImage ? "google/gemini-2.5-flash" : "gpt-4o-mini";
                const puterPrompt = sysPrompt + "\n\n" + messages.map(m => `${m.role}: ${m.content}`).join("\n");
                let response;
                if (hasImage) {
                    const targetImg = messages.find(m => !!m.image)?.image || "";
                    if (!targetImg) throw new Error("No image for Puter");
                    response = await (window as any).puter.ai.chat(puterPrompt, { model: puterModel, image: targetImg });
                } else {
                    response = await (window as any).puter.ai.chat(puterPrompt, { model: puterModel });
                }
                const t = response?.message?.content;
                if (!t) throw new Error("Empty Puter response");
                const cleanT = stripProviderNoise(t);
                interceptCallbacks.onChunk(cleanT);
                interceptCallbacks.onComplete?.(cleanT);
            })) return;
        }

        // 7. Absolute Fallback Proxy
        const pb = getPollinationsBearer();
        if (pb) {
            if (await tryLayer(async () => {
                await this.streamGenPollinations(messages, sysPrompt, interceptCallbacks, pb, "openai");
            })) return;
        }

        if (await tryLayer(async () => {
            const polModel = hasImage ? "openai" : "gemini-search";
            await this.streamPollinationsAuth(messages, sysPrompt, interceptCallbacks, polModel);
            const cleanT = stripProviderNoise(finalOutput);
            if (!cleanT.trim() && !hasChunks) throw new Error("Empty Pollinations Proxy response");
        })) return;

        if (await tryLayer(async () => {
             const t = await this.callPollinationsText(messages, sysPrompt);
             const cleanT = stripProviderNoise(t);
             if (!cleanT.trim()) throw new Error("Empty Pollinations Text response");
             interceptCallbacks.onChunk(cleanT);
             interceptCallbacks.onComplete?.(cleanT);
        })) return;

        // 9. DevToolBox Ultimate Free Text API
        if (!hasImage) {
            if (await tryLayer(async () => {
                 const t = await this.callDevToolBoxText(messages, sysPrompt);
                 const cleanT = stripProviderNoise(t);
                 if (!cleanT.trim()) throw new Error("Empty DevToolBox response");
                 interceptCallbacks.onChunk(cleanT);
                 interceptCallbacks.onComplete?.(cleanT);
            })) return;
        }

        const emergency = hasImage 
            ? "⚠️ نظراً للضغط الهائل وغير المسبوق الخوادم تواجه صعوبة في معالجة هذه الصورة، يرجى بالضرورة مسح المحادثة بالكامل (بواسطة زر بحث جديد) ثم إعادة رفع الصورة والمحاولة لضمان عدم وجود ملفات ضخمة معلقة."
            : this.localEmergencyAnswer(messages);
        callbacks.onChunk(emergency);
        callbacks.onComplete?.(emergency);
    }

    // ─── Gemini Streaming Helper ───────────────────────
    private async streamGemini(messages: AIChatMessage[], sysPrompt: string, genAIInstance: GoogleGenerativeAI, callbacks: StreamCallbacks, hasImage: boolean, latestMsg: AIChatMessage): Promise<void> {
        const modelNames = [
            "gemini-3.1-flash-lite-preview",
            "gemini-2.5-flash",
            "gemini-2.0-flash"
        ];

        // 🚀 BULLETPROOF: Merge all chat history into a single 'user' message block to completely eliminate 400 Role/History validation errors.
        // Whether it's 1 message or 5, Gemini won't crash complaining about "Model role first" or "Consecutive user roles".
        let fullChatTranscript = messages.map(m => `${m.role === 'user' ? 'الطالب' : 'المعلم'}: ${m.content}`).join("\n\n");
        
        let targetImage = latestMsg.image;
        if (!targetImage && hasImage) {
            targetImage = messages.find(m => !!m.image)?.image;
        }

        if (targetImage) {
            fullChatTranscript += "\n\n[توجيه أمني مهم جداً: لقد أرفق الطالب صورة مع رسالته الأخيرة. يجب عليك التركيز كلياً على قراءة الصورة المرفقة وتحليل محتواها لتقديم الحل. تجاهل المواضيع السابقة في المحادثة تماماً إذا كانت لا تتعلق بمحتوى هذه الصورة.]";
        }
        
        const parts: any[] = [{ text: fullChatTranscript || "اشرح هذا" }];

        if (targetImage) {
            const base64Data = targetImage.includes(',') ? targetImage.split(',')[1] : targetImage;
            
            // 🛡️ FATAL PAYLOAD LIMIT GUARD:
            // If the user's historical image is a massive 14MB WebP from an old session, 
            // Gemini and CF will crash with 400/500. We intercept it here.
            if (base64Data.length > 5000000) { 
                 throw new Error("⚠️ الصورة المرفقة قديمة وحجمها ضخم جداً. يرجى [بدء محادثة جديدة] وإعادة رفع الصورة ليتم ضغطها تلقائياً بسرعة خرافية!");
            }

            let mimeType = targetImage.includes(';') ? targetImage.split(';')[0].split(':')[1] : "image/jpeg";
            if (!mimeType) mimeType = "image/jpeg";
            parts.push({ inlineData: { data: base64Data, mimeType } });
        }

        let lastErr: any;
        for (const modelName of modelNames) {
            try {
                const model = genAIInstance.getGenerativeModel({
                    model: modelName,
                    systemInstruction: sysPrompt,
                });
                
                const result = await model.generateContentStream(parts);

                let fullText = '';
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    fullText += chunkText;
                    callbacks.onChunk(chunkText);
                }
                if (fullText.trim().length > 0) {
                    callbacks.onComplete?.(fullText);
                    return;
                }
                lastErr = new Error("GEMINI_EMPTY_STREAM");
            } catch (e: any) {
                lastErr = e;
                // DO NOT fast-fail on 429, because some accounts have model-specific quotas (e.g. 2.0-flash limit: 0)
                // but still have millions of tokens for 1.5-flash or 1.5-pro !
            }
        }
        throw lastErr; // all models failed — let caller handle (which invokes next Key)
    }

    // ═══════════════════════════════════════════════════════
    // NEW BACKEND BOT PROXY - SSE CLIENT FOR 13MB FILES
    // ═══════════════════════════════════════════════════════
    private async streamBotChat(messages: AIChatMessage[], sysPrompt: string, callbacks: StreamCallbacks, fileContexts?: Array<{ fileUri: string, mimeType: string }>) {
        
        const payload: any = {
            messages: messages,
            sysPrompt: sysPrompt,
            model: "gemini-2.0-flash"
        };
        
        if (fileContexts && fileContexts.length > 0) {
            payload.fileContexts = fileContexts;
        }

        const response = await fetch("https://bot-2-ezqg.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Bot Chat Stream failed");

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader");
        
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            let boundary = buffer.indexOf('\\n\\n');
            
            while (boundary !== -1) {
                const chunk = buffer.slice(0, boundary);
                buffer = buffer.slice(boundary + 2);
                
                if (chunk.startsWith('data: ')) {
                    const dataStr = chunk.slice(6);
                    if (dataStr.trim() === '[DONE]') {
                        return;
                    }
                    try {
                        const parsed = JSON.parse(dataStr);
                        if (parsed.chunk) {
                            callbacks.onChunk(parsed.chunk);
                        } else if (parsed.error) {
                            throw new Error(parsed.error);
                        }
                    } catch (e) {}
                }
                boundary = buffer.indexOf('\\n\\n');
            }
        }
    }

    // ═══════════════════════════════════════════════════════
    // Pollinations.ai Image Generation (Replaces Puter.js)
    // ═══════════════════════════════════════════════════════
    async generateImage(prompt: string): Promise<string> {
        try {
            // Encode the prompt for the URL
            const safePrompt = encodeURIComponent(prompt.trim());
            // Add a random seed to avoid caching
            const seed = Math.floor(Math.random() * 10000000);
            return `https://image.pollinations.ai/prompt/${safePrompt}?seed=${seed}&width=1024&height=1024&nologo=true`;
        } catch (error) {
            console.error("Image generation failed:", error);
            throw new Error("فشل توليد الصورة. الرجاء المحاولة مرة أخرى.");
        }
    }
}

export const aiClient = new AIClient();
