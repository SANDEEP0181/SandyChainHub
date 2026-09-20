
const LANGUAGE_KEY = "goalkeeperLanguage";
const LANGUAGE_NAMES = {en:"EN",hi:"HI",es:"ES",fr:"FR",zh:"中文",ja:"日本語",de:"DE",pt:"PT",ko:"한국어",ar:"العربية",ru:"RU",bn:"বাংলা"};

const I18N = {
  hi: {
    "Language":"भाषा","Login with Telegram":"Telegram से लॉगिन","Logout":"लॉगआउट","Connect TON Wallet":"TON Wallet कनेक्ट करें","Disconnect Wallet":"Wallet डिस्कनेक्ट करें",
    "Goalkeeper":"Goalkeeper","TON • TELEGRAM":"TON • TELEGRAM","LIVE TESTNET EXPERIENCE":"LIVE TESTNET EXPERIENCE","Defend your":"अपनी","Web3 journey.":"Web3 यात्रा की रक्षा करें।",
    "Connect. Complete missions. Build your Goalkeeper profile.":"कनेक्ट करें। मिशन पूरे करें। अपना Goalkeeper प्रोफाइल बनाएं।","Explore Missions":"मिशन देखें","TON TESTNET":"TON TESTNET",
    "KEEPER LEVEL":"KEEPER LEVEL","Level":"लेवल","XP TO NEXT":"अगले लेवल का XP","ROOKIE":"शुरुआती","Complete missions to unlock your next level.":"अगला लेवल अनलॉक करने के लिए मिशन पूरे करें।",
    "KEEPER STREAK":"KEEPER STREAK","Start your daily check-in":"अपना दैनिक चेक-इन शुरू करें","Best: 0":"सर्वश्रेष्ठ: 0","POINTS":"पॉइंट्स","NETWORK":"नेटवर्क","STATUS":"स्थिति","Active":"सक्रिय",
    "YOUR HUB":"आपका हब","Profile":"प्रोफाइल","SECURE SESSION":"सुरक्षित सेशन","GOALKEEPER ID":"GOALKEEPER ID","Profile pending":"प्रोफाइल लंबित",
    "Complete Telegram verification to create your secure profile.":"सुरक्षित प्रोफाइल बनाने के लिए Telegram सत्यापन पूरा करें।","TELEGRAM":"TELEGRAM","TON WALLET":"TON WALLET","Not connected":"कनेक्ट नहीं है","IDENTITY":"पहचान","SESSION":"सेशन","Waiting":"प्रतीक्षा",
    "PLAY & EARN TESTNET POINTS":"टेस्टनेट पॉइंट्स के लिए मिशन","Missions":"मिशन","START":"शुरू","Open Goalkeeper":"Goalkeeper खोलें","Begin your keeper journey.":"अपनी keeper यात्रा शुरू करें।",
    "WALLET":"WALLET","Connect TON Wallet":"TON Wallet कनेक्ट करें","Connect a TON testnet wallet.":"TON testnet wallet कनेक्ट करें।","IDENTITY":"पहचान","Link Identity":"पहचान लिंक करें","Link Telegram and TON.":"Telegram और TON लिंक करें।","DAILY":"दैनिक","Daily Check-in":"दैनिक चेक-इन","Return each UTC day.":"हर UTC दिन वापस आएं।",
    "Wallet not connected":"Wallet कनेक्ट नहीं है","Connect your TON wallet to continue.":"जारी रखने के लिए अपना testnet wallet कनेक्ट करें।","Copy Address":"Address कॉपी करें","Open Explorer":"Explorer खोलें",
    "Browser mode":"ब्राउज़र मोड","Open Goalkeeper inside Telegram to view user and session information.":"User और session जानकारी देखने के लिए Goalkeeper को Telegram के अंदर खोलें।",
    "Wallet link pending":"Wallet लिंक लंबित","Link your Telegram identity after connecting a TON wallet.":"TON wallet कनेक्ट करने के बाद Telegram identity लिंक करें।","Link TON Wallet":"TON Wallet लिंक करें",
    "REWARDS":"REWARDS","Testnet-only activity points. No real-money reward is issued.":"केवल testnet activity points। कोई real-money reward नहीं दिया जाता।",
    "Share Goalkeeper":"Goalkeeper शेयर करें","COLLECTION":"कलेक्शन","Achievements":"उपलब्धियां","Locked":"लॉक","Unlocked":"अनलॉक",
    "ROADMAP":"रोडमैप","What's next":"आगे क्या है","Home":"होम","Rewards":"रिवॉर्ड्स"
  },
  es: {
    "Language":"Idioma","Login with Telegram":"Iniciar sesión con Telegram","Logout":"Cerrar sesión","Connect TON Wallet":"Conectar TON Wallet","Disconnect Wallet":"Desconectar Wallet",
    "Explore Missions":"Explorar misiones","Defend your":"Protege tu","Web3 journey.":"viaje Web3.","Connect. Complete missions. Build your Goalkeeper profile.":"Conecta. Completa misiones. Crea tu perfil de Goalkeeper.",
    "KEEPER LEVEL":"NIVEL DEL KEEPER","Level":"Nivel","XP TO NEXT":"XP PARA EL SIGUIENTE","ROOKIE":"NOVATO","Complete missions to unlock your next level.":"Completa misiones para desbloquear el siguiente nivel.",
    "KEEPER STREAK":"RACHA DEL KEEPER","Start your daily check-in":"Inicia tu check-in diario","POINTS":"PUNTOS","NETWORK":"RED","STATUS":"ESTADO","Active":"Activo",
    "YOUR HUB":"TU HUB","Profile":"Perfil","SECURE SESSION":"SESIÓN SEGURA","Profile pending":"Perfil pendiente","Not connected":"No conectado","Waiting":"Esperando",
    "PLAY & EARN TESTNET POINTS":"JUEGA Y GANA PUNTOS DE TESTNET","Missions":"Misiones","START":"INICIO","Open Goalkeeper":"Abrir Goalkeeper","Begin your keeper journey.":"Comienza tu camino como keeper.",
    "WALLET":"WALLET","Connect a TON testnet wallet.":"Conecta una wallet TON de testnet.","Link Identity":"Vincular identidad","Link Telegram and TON.":"Vincula Telegram y TON.","DAILY":"DIARIO","Daily Check-in":"Check-in diario","Return each UTC day.":"Vuelve cada día UTC.",
    "Wallet not connected":"Wallet no conectada","Connect your testnet wallet to continue.":"Conecta tu wallet de testnet para continuar.","Copy Address":"Copiar dirección","Open Explorer":"Abrir Explorer",
    "Browser mode":"Modo navegador","Wallet link pending":"Vinculación pendiente","Link TON Wallet":"Vincular TON Wallet","REWARDS":"RECOMPENSAS",
    "Testnet-only activity points. No real-money reward is issued.":"Puntos solo de actividad en testnet. No se emiten recompensas de dinero real.","Share Goalkeeper":"Compartir Goalkeeper","COLLECTION":"COLECCIÓN","Achievements":"Logros","Locked":"Bloqueado","Unlocked":"Desbloqueado","ROADMAP":"HOJA DE RUTA","What's next":"Qué sigue","Home":"Inicio","Rewards":"Recompensas"
  },
  fr: {
    "Language":"Langue","Login with Telegram":"Se connecter avec Telegram","Logout":"Se déconnecter","Connect TON Wallet":"Connecter TON Wallet","Disconnect Wallet":"Déconnecter Wallet",
    "Explore Missions":"Explorer les missions","Defend your":"Protège ton","Web3 journey.":"parcours Web3.","Connect. Complete missions. Build your Goalkeeper profile.":"Connecte-toi. Termine les missions. Crée ton profil Goalkeeper.",
    "KEEPER LEVEL":"NIVEAU DU KEEPER","Level":"Niveau","XP TO NEXT":"XP SUIVANTE","ROOKIE":"DÉBUTANT","Complete missions to unlock your next level.":"Termine des missions pour débloquer le niveau suivant.",
    "KEEPER STREAK":"SÉRIE DU KEEPER","Start your daily check-in":"Commence ton check-in quotidien","POINTS":"POINTS","NETWORK":"RÉSEAU","STATUS":"STATUT","Active":"Actif",
    "YOUR HUB":"TON HUB","Profile":"Profil","SECURE SESSION":"SESSION SÉCURISÉE","Profile pending":"Profil en attente","Not connected":"Non connecté","Waiting":"En attente",
    "PLAY & EARN TESTNET POINTS":"JOUE ET GAGNE DES POINTS TESTNET","Missions":"Missions","START":"DÉBUT","Open Goalkeeper":"Ouvrir Goalkeeper","Begin your keeper journey.":"Commence ton parcours de keeper.",
    "WALLET":"WALLET","Connect a TON testnet wallet.":"Connecte un wallet TON testnet.","Link Identity":"Lier l'identité","Link Telegram and TON.":"Lier Telegram et TON.","DAILY":"QUOTIDIEN","Daily Check-in":"Check-in quotidien","Return each UTC day.":"Reviens chaque jour UTC.",
    "Wallet not connected":"Wallet non connecté","Connect your testnet wallet to continue.":"Connecte ton wallet testnet pour continuer.","Copy Address":"Copier l'adresse","Open Explorer":"Ouvrir Explorer",
    "Browser mode":"Mode navigateur","Wallet link pending":"Lien wallet en attente","Link TON Wallet":"Lier TON Wallet","REWARDS":"RÉCOMPENSES",
    "Testnet-only activity points. No real-money reward is issued.":"Points d'activité uniquement sur testnet. Aucune récompense en argent réel n'est émise.","Share Goalkeeper":"Partager Goalkeeper","COLLECTION":"COLLECTION","Achievements":"Succès","Locked":"Verrouillé","Unlocked":"Déverrouillé","ROADMAP":"FEUILLE DE ROUTE","What's next":"Et ensuite","Home":"Accueil","Rewards":"Récompenses"
  },
  zh: {
    "Language":"语言","Login with Telegram":"使用 Telegram 登录","Logout":"退出登录","Connect TON Wallet":"连接 TON 钱包","Disconnect Wallet":"断开钱包",
    "Explore Missions":"探索任务","Defend your":"守护你的","Web3 journey.":"Web3 之旅。","Connect. Complete missions. Build your Goalkeeper profile.":"连接钱包，完成任务，建立 Goalkeeper 资料。",
    "KEEPER LEVEL":"KEEPER 等级","Level":"等级","XP TO NEXT":"升级所需 XP","ROOKIE":"新手","Complete missions to unlock your next level.":"完成任务以解锁下一等级。",
    "KEEPER STREAK":"KEEPER 连续记录","Start your daily check-in":"开始每日签到","POINTS":"积分","NETWORK":"网络","STATUS":"状态","Active":"活跃",
    "YOUR HUB":"你的中心","Profile":"资料","SECURE SESSION":"安全会话","Profile pending":"资料待定","Not connected":"未连接","Waiting":"等待中",
    "PLAY & EARN TESTNET POINTS":"完成任务获得测试网积分","Missions":"任务","START":"开始","Open Goalkeeper":"打开 Goalkeeper","Begin your keeper journey.":"开始你的 keeper 之旅。",
    "WALLET":"钱包","Connect a TON testnet wallet.":"连接 TON 测试网钱包。","Link Identity":"关联身份","Link Telegram and TON.":"关联 Telegram 和 TON。","DAILY":"每日","Daily Check-in":"每日签到","Return each UTC day.":"每个 UTC 日返回。",
    "Wallet not connected":"钱包未连接","Connect your testnet wallet to continue.":"连接测试网钱包以继续。","Copy Address":"复制地址","Open Explorer":"打开浏览器",
    "Browser mode":"浏览器模式","Wallet link pending":"钱包关联待定","Link TON Wallet":"关联 TON 钱包","REWARDS":"奖励",
    "Testnet-only activity points. No real-money reward is issued.":"仅限测试网活动积分，不发放真实货币奖励。","Share Goalkeeper":"分享 Goalkeeper","COLLECTION":"收藏","Achievements":"成就","Locked":"已锁定","Unlocked":"已解锁","ROADMAP":"路线图","What's next":"下一步","Home":"主页","Rewards":"奖励"
  },
  ja: {
    "Language":"言語","Login with Telegram":"Telegramでログイン","Logout":"ログアウト","Connect TON Wallet":"TON Walletを接続","Disconnect Wallet":"Walletを切断",
    "Explore Missions":"ミッションを見る","Defend your":"あなたの","Web3 journey.":"Web3の旅を守ろう。","Connect. Complete missions. Build your Goalkeeper profile.":"接続、ミッション達成、Goalkeeperプロフィールを作成。",
    "KEEPER LEVEL":"KEEPERレベル","Level":"レベル","XP TO NEXT":"次のレベルまでのXP","ROOKIE":"ルーキー","Complete missions to unlock your next level.":"ミッションを完了して次のレベルを解放。",
    "KEEPER STREAK":"KEEPER連続記録","Start your daily check-in":"毎日のチェックインを開始","POINTS":"ポイント","NETWORK":"ネットワーク","STATUS":"ステータス","Active":"アクティブ",
    "YOUR HUB":"あなたのハブ","Profile":"プロフィール","SECURE SESSION":"安全なセッション","Profile pending":"プロフィール保留中","Not connected":"未接続","Waiting":"待機中",
    "PLAY & EARN TESTNET POINTS":"テストネットポイントのミッション","Missions":"ミッション","START":"開始","Open Goalkeeper":"Goalkeeperを開く","Begin your keeper journey.":"keeperの旅を始めよう。",
    "WALLET":"ウォレット","Connect a TON testnet wallet.":"TONテストネットWalletを接続。","Link Identity":"IDをリンク","Link Telegram and TON.":"TelegramとTONをリンク。","DAILY":"毎日","Daily Check-in":"毎日のチェックイン","Return each UTC day.":"UTCの毎日に戻ってきてください。",
    "Wallet not connected":"Wallet未接続","Connect your testnet wallet to continue.":"続行するにはテストネットWalletを接続。","Copy Address":"アドレスをコピー","Open Explorer":"Explorerを開く",
    "Browser mode":"ブラウザモード","Wallet link pending":"Walletリンク待ち","Link TON Wallet":"TON Walletをリンク","REWARDS":"報酬",
    "Testnet-only activity points. No real-money reward is issued.":"テストネット活動ポイントのみ。現金報酬は発行されません。","Share Goalkeeper":"Goalkeeperを共有","COLLECTION":"コレクション","Achievements":"実績","Locked":"ロック中","Unlocked":"解除済み","ROADMAP":"ロードマップ","What's next":"次のステップ","Home":"ホーム","Rewards":"報酬"
  }
};


I18N.de = {
  "Language":"Sprache","Login with Telegram":"Mit Telegram anmelden","Logout":"Abmelden","Connect TON Wallet":"TON Wallet verbinden","Disconnect Wallet":"Wallet trennen",
  "Explore Missions":"Missionen erkunden","Defend your":"Schütze deine","Web3 journey.":"Web3-Reise.","Profile":"Profil","Missions":"Missionen","Rewards":"Belohnungen","Achievements":"Erfolge","Home":"Startseite",
  "Wallet not connected":"Wallet nicht verbunden","Connect your testnet wallet to continue.":"Verbinde deine Testnet-Wallet, um fortzufahren.","Copy Address":"Adresse kopieren","Open Explorer":"Explorer öffnen",
  "Daily Check-in":"Täglicher Check-in","Share Goalkeeper":"Goalkeeper teilen","Locked":"Gesperrt","Unlocked":"Freigeschaltet","ROADMAP":"ROADMAP","What's next":"Was kommt als Nächstes?"
};
I18N.pt = {
  "Language":"Idioma","Login with Telegram":"Entrar com Telegram","Logout":"Sair","Connect TON Wallet":"Conectar TON Wallet","Disconnect Wallet":"Desconectar Wallet",
  "Explore Missions":"Explorar missões","Defend your":"Proteja sua","Web3 journey.":"jornada Web3.","Profile":"Perfil","Missions":"Missões","Rewards":"Recompensas","Achievements":"Conquistas","Home":"Início",
  "Wallet not connected":"Wallet não conectada","Connect your testnet wallet to continue.":"Conecte sua wallet de testnet para continuar.","Copy Address":"Copiar endereço","Open Explorer":"Abrir Explorer",
  "Daily Check-in":"Check-in diário","Share Goalkeeper":"Compartilhar Goalkeeper","Locked":"Bloqueado","Unlocked":"Desbloqueado","ROADMAP":"ROTEIRO","What's next":"Próximos passos"
};
I18N.ko = {
  "Language":"언어","Login with Telegram":"Telegram으로 로그인","Logout":"로그아웃","Connect TON Wallet":"TON Wallet 연결","Disconnect Wallet":"Wallet 연결 해제",
  "Explore Missions":"미션 보기","Defend your":"당신의","Web3 journey.":"Web3 여정을 지켜보세요.","Profile":"프로필","Missions":"미션","Rewards":"보상","Achievements":"업적","Home":"홈",
  "Wallet not connected":"Wallet 연결 안 됨","Connect your testnet wallet to continue.":"계속하려면 테스트넷 Wallet을 연결하세요.","Copy Address":"주소 복사","Open Explorer":"Explorer 열기",
  "Daily Check-in":"일일 체크인","Share Goalkeeper":"Goalkeeper 공유","Locked":"잠김","Unlocked":"잠금 해제","ROADMAP":"로드맵","What's next":"다음 단계"
};
I18N.ar = {
  "Language":"اللغة","Login with Telegram":"تسجيل الدخول عبر Telegram","Logout":"تسجيل الخروج","Connect TON Wallet":"ربط TON Wallet","Disconnect Wallet":"فصل Wallet",
  "Explore Missions":"استكشاف المهام","Defend your":"احمِ","Web3 journey.":"رحلة Web3 الخاصة بك.","Profile":"الملف الشخصي","Missions":"المهام","Rewards":"المكافآت","Achievements":"الإنجازات","Home":"الرئيسية",
  "Wallet not connected":"المحفظة غير متصلة","Connect your testnet wallet to continue.":"اربط محفظة الاختبار للمتابعة.","Copy Address":"نسخ العنوان","Open Explorer":"فتح Explorer",
  "Daily Check-in":"تسجيل يومي","Share Goalkeeper":"مشاركة Goalkeeper","Locked":"مقفل","Unlocked":"مفتوح","ROADMAP":"خارطة الطريق","What's next":"ما التالي؟"
};
I18N.ru = {
  "Language":"Язык","Login with Telegram":"Войти через Telegram","Logout":"Выйти","Connect TON Wallet":"Подключить TON Wallet","Disconnect Wallet":"Отключить Wallet",
  "Explore Missions":"Открыть миссии","Defend your":"Защити свою","Web3 journey.":"Web3-путешествие.","Profile":"Профиль","Missions":"Миссии","Rewards":"Награды","Achievements":"Достижения","Home":"Главная",
  "Wallet not connected":"Wallet не подключён","Connect your testnet wallet to continue.":"Подключите тестовую Wallet, чтобы продолжить.","Copy Address":"Копировать адрес","Open Explorer":"Открыть Explorer",
  "Daily Check-in":"Ежедневная отметка","Share Goalkeeper":"Поделиться Goalkeeper","Locked":"Заблокировано","Unlocked":"Разблокировано","ROADMAP":"ДОРОЖНАЯ КАРТА","What's next":"Что дальше?"
};
I18N.bn = {
  "Language":"ভাষা","Login with Telegram":"Telegram দিয়ে লগইন","Logout":"লগআউট","Connect TON Wallet":"TON Wallet সংযুক্ত করুন","Disconnect Wallet":"Wallet বিচ্ছিন্ন করুন",
  "Explore Missions":"মিশন দেখুন","Defend your":"আপনার","Web3 journey.":"Web3 যাত্রা রক্ষা করুন।","Profile":"প্রোফাইল","Missions":"মিশন","Rewards":"পুরস্কার","Achievements":"অর্জন","Home":"হোম",
  "Wallet not connected":"Wallet সংযুক্ত নয়","Connect your testnet wallet to continue.":"চালিয়ে যেতে testnet Wallet সংযুক্ত করুন।","Copy Address":"ঠিকানা কপি করুন","Open Explorer":"Explorer খুলুন",
  "Daily Check-in":"দৈনিক চেক-ইন","Share Goalkeeper":"Goalkeeper শেয়ার করুন","Locked":"লকড","Unlocked":"আনলকড","ROADMAP":"রোডম্যাপ","What's next":"পরবর্তী কী?"
};

function translate(value) {
  const lang = localStorage.getItem(LANGUAGE_KEY) || "en";
  return I18N[lang]?.[value] || value;
}

function applyLanguage(lang) {
  lang = LANGUAGE_NAMES[lang] ? lang : "en";
  localStorage.setItem(LANGUAGE_KEY, lang);
  if (languageSelect) languageSelect.value = lang;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const raw = node.__gkI18nKey || node.nodeValue.trim();
    if (!raw) continue;
    node.__gkI18nKey = raw;
    const translated = I18N[lang]?.[raw] || raw;
    if (node.nodeValue.trim() !== translated) {
      const leading = node.nodeValue.match(/^\s*/)?.[0] || "";
      const trailing = node.nodeValue.match(/\s*$/)?.[0] || "";
      node.nodeValue = leading + translated + trailing;
    }
  }
}

const $ = (id) => document.getElementById(id);
const languageSelect = $("languageSelect");

const connectBtn = $("connectBtn");
const tonConnectFallback = $("tonConnectFallback");
const disconnectBtn = $("disconnectBtn");
const disconnectWalletBtn = $("disconnectWalletBtn");
const loginBtn = $("loginBtn");
const logoutBtn = $("logoutBtn");
const walletStatus = $("walletStatus");
const walletAddress = $("walletAddress");
const telegramStatus = $("telegramStatus");
const telegramUser = $("telegramUser");
const identityStatus = $("identityStatus");
const identityMessage = $("identityMessage");
const linkWalletBtn = $("linkWalletBtn");
const copyAddressBtn = $("copyAddressBtn");
const explorerBtn = $("explorerBtn");
const connectedWalletChip = $("connectedWalletChip");
const connectedWalletAddressEl = $("connectedWalletAddress");

const profileStatus = $("profileStatus");
const profileIdentity = $("profileIdentity");
const goalkeeperUserId = $("goalkeeperUserId");
const profileTelegram = $("profileTelegram");
const profileWallet = $("profileWallet");
const profileLinkStatus = $("profileLinkStatus");
const profileActivity = $("profileActivity");

const pointsTotal = $("pointsTotal");
const rewardPoints = $("rewardPoints");
const levelNumber = $("levelNumber");
const levelDisplay = $("levelDisplay");
const levelProgress = $("levelProgress");
const levelBar = $("levelBar");
const levelMessage = $("levelMessage");
const levelBadge = $("levelBadge");
const levelOrb = $("levelOrb");
const levelTitle = $("levelTitle");
const streakNumber = $("streakNumber");
const streakBest = $("streakBest");
const streakStatus = $("streakStatus");
const streakDetail = $("streakDetail");
const streakMessage = $("streakMessage");
const pointsMessage = $("pointsMessage");
const dailyCheckinBtn = $("dailyCheckinBtn");
const checkinTimer = $("checkinTimer");
const checkinCountdown = $("checkinCountdown");

const missionTelegram = $("missionTelegram");
const missionWallet = $("missionWallet");
const missionIdentity = $("missionIdentity");
const missionCheckin = $("missionCheckin");
const missionOpen = $("missionOpen");
const missionConnect = $("missionConnect");
const missionLink = $("missionLink");
const achievementOpen = $("achievementOpen");
const achievementWallet = $("achievementWallet");
const achievementIdentity = $("achievementIdentity");
const achievementCheckin = $("achievementCheckin");
const shareGoalkeeperBtn = $("shareGoalkeeperBtn");

const TELEGRAM_VALIDATE_URL = "https://sandy-chain-hub.vercel.app/api/telegram/validate";
const IDENTITY_LINK_URL = "https://sandy-chain-hub.vercel.app/api/identity/link";
const PROFILE_SESSION_URL = "https://sandy-chain-hub.vercel.app/api/profile/session";
const TON_MANIFEST_URL = "https://sandeep0181.github.io/SandyChainHub/goalkeeper/tonconnect-manifest.json";
const TON_TESTNET_EXPLORER = "https://testnet.tonscan.org";

const POINTS_KEY = "goalkeeperPoints";
const CHECKIN_KEY = "goalkeeperCheckinDate";
const STREAK_KEY = "goalkeeperStreak";
const BEST_STREAK_KEY = "goalkeeperBestStreak";
const STREAK_DATE_KEY = "goalkeeperStreakDate";
const MISSIONS_KEY = "goalkeeperMissions";

let tonConnectUI = null;
let tonConnectLoading = null;
let telegramInitData = "";
let telegramVerified = false;
let connectedWalletAddress = "";

function setText(el, value) { if (el) el.textContent = translate(value); }

function rawTonAddressToFriendly(address) {
  if (!address || !/^-?\\d+:[0-9a-fA-F]{64}$/.test(address)) return address || "";
  try {
    const parts = address.split(":");
    const workchain = Number(parts[0]);
    const hashHex = parts[1];
    if (workchain < -128 || workchain > 127) return address;
    const bytes = new Uint8Array(34);
    // Non-bounceable, user-friendly TON address (UQ...).
    bytes[0] = 0x51;
    bytes[1] = workchain < 0 ? workchain + 256 : workchain;
    for (let i = 0; i < 32; i++) bytes[i + 2] = parseInt(hashHex.slice(i * 2, i * 2 + 2), 16);
    let crc = 0;
    for (let i = 0; i < 34; i++) {
      crc ^= bytes[i] << 8;
      for (let j = 0; j < 8; j++) crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
    const out = new Uint8Array(36);
    out.set(bytes);
    out[34] = (crc >> 8) & 0xff;
    out[35] = crc & 0xff;
    let binary = "";
    for (let i = 0; i < out.length; i++) binary += String.fromCharCode(out[i]);
    return btoa(binary).replace(/\\+/g, "-").replace(/\\//g, "_").replace(/=+$/, "");
  } catch {
    return address;
  }
}

function shortAddress(address) {
  if (!address) return "";
  const friendly = rawTonAddressToFriendly(address);
  return friendly.length > 18 ? friendly.slice(0, 10) + "..." + friendly.slice(-8) : friendly;
}

function getWalletAddress() {
  // TON Connect UI is the source of truth. Never prefer a stale cached value.
  const live = tonConnectUI?.account?.address || tonConnectUI?.wallet?.account?.address || "";
  if (live) connectedWalletAddress = live;
  return rawTonAddressToFriendly(live || connectedWalletAddress || "");
}

function todayKey() {
  const d = new Date();
  return d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0") + "-" + String(d.getUTCDate()).padStart(2, "0");
}

function previousDayKey() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0") + "-" + String(d.getUTCDate()).padStart(2, "0");
}

function getMissions() {
  try { return JSON.parse(localStorage.getItem(MISSIONS_KEY) || "{}"); } catch { return {}; }
}

function saveMissions(value) { localStorage.setItem(MISSIONS_KEY, JSON.stringify(value)); }

function awardMission(id, points) {
  const missions = getMissions();
  if (missions[id]) return false;
  const current = Number(localStorage.getItem(POINTS_KEY) || "0");
  localStorage.setItem(POINTS_KEY, String(current + points));
  missions[id] = { completedAt: new Date().toISOString(), points };
  saveMissions(missions);
  return true;
}

function updateAuthButtons() {
  const loggedIn = Boolean(telegramVerified);
  if (loginBtn) loginBtn.hidden = loggedIn;
  if (logoutBtn) logoutBtn.hidden = !loggedIn;
}

function returnToDashboard() {
  const dashboard = document.querySelector("#home");
  if (!dashboard) return;
  setTimeout(() => {
    try { window.location.hash = "home"; } catch {}
    dashboard.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 350);
}

async function handleWalletReturn() {
  try {
    const ui = tonConnectUI || await ensureTonConnect();
    if (ui) {
      try { await ui.connectionRestored; } catch {}
      // Always replace the cached address with TON Connect's current account.
      connectedWalletAddress = ui.account?.address || ui.wallet?.account?.address || "";
      updateWalletUI();
    }
  } catch (error) {
    console.warn("TON wallet return restore:", error);
  }
  if (getWalletAddress()) {
    try { sessionStorage.removeItem("goalkeeperWalletConnected"); } catch {}
    returnToDashboard();
  }
}

window.addEventListener("pageshow", () => { void handleWalletReturn(); });
window.addEventListener("focus", () => { void handleWalletReturn(); });
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") void handleWalletReturn();
});

function updateWalletUI() {
  const address = getWalletAddress();
  const connected = Boolean(address);

  if (connectedWalletChip) connectedWalletChip.hidden = !connected;
  setText(connectedWalletAddressEl, connected ? shortAddress(address) : "—");

  if (connectBtn) connectBtn.hidden = connected;
  if (disconnectBtn) disconnectBtn.hidden = !connected;
  if (disconnectWalletBtn) disconnectWalletBtn.hidden = !connected;

  if (tonConnectFallback) {
    tonConnectFallback.hidden = true;
    tonConnectFallback.disabled = false;
  }

  setText(walletStatus, connected ? "Wallet connected" : "Wallet not connected");
  setText(walletAddress, connected ? shortAddress(address) : "Connect your testnet wallet to continue.");
  if (copyAddressBtn) copyAddressBtn.disabled = !connected;
  if (explorerBtn) explorerBtn.disabled = !connected;
  setText(profileWallet, connected ? shortAddress(address) : "Not connected");
  updateIdentityState();
  updateRewards();
}

async function loadTonConnectLibrary() {
  if (window.TON_CONNECT_UI?.TonConnectUI) return true;
  if (tonConnectLoading) return tonConnectLoading;

  tonConnectLoading = (async () => {
    const sources = [
      "https://unpkg.com/@tonconnect/ui@3.0.2/dist/tonconnect-ui.min.js",
      "https://cdn.jsdelivr.net/npm/@tonconnect/ui@3.0.2/dist/tonconnect-ui.min.js"
    ];

    for (const src of sources) {
      try {
        await new Promise((resolve, reject) => {
          const existing = document.querySelector('script[data-tonconnect-sdk="1"]');
          if (existing) {
            if (window.TON_CONNECT_UI?.TonConnectUI) return resolve();
            existing.addEventListener("load", resolve, { once: true });
            existing.addEventListener("error", reject, { once: true });
            setTimeout(() => reject(new Error("TON Connect SDK timeout")), 10000);
            return;
          }

          const script = document.createElement("script");
          script.src = src;
          script.async = true;
          script.dataset.tonconnectSdk = "1";
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load " + src));
          document.head.appendChild(script);
        });

        if (window.TON_CONNECT_UI?.TonConnectUI) return true;
      } catch (error) {
        console.warn("TON Connect SDK source failed:", src, error);
        const failed = document.querySelector('script[data-tonconnect-sdk="1"]');
        if (failed && !window.TON_CONNECT_UI?.TonConnectUI) failed.remove();
      }
    }

    return false;
  })();

  const ok = await tonConnectLoading;
  if (!ok) tonConnectLoading = null;
  return ok;
}

async function ensureTonConnect() {
  if (tonConnectUI) return tonConnectUI;
  const loaded = await loadTonConnectLibrary();
  if (!loaded) {
    setText(walletStatus, "TON Connect SDK failed to load");
    return null;
  }
  try {
    tonConnectUI = new window.TON_CONNECT_UI.TonConnectUI({
      manifestUrl: TON_MANIFEST_URL,
      uiPreferences: { theme: "DARK" }
    });
    // Telegram Mini App return URL uses the TON Connect TMA return strategy.
    try {
      tonConnectUI.uiOptions = {
        twaReturnUrl: "https://t.me/GoalkeeperSandyBot"
      };
    } catch (error) {
      console.warn("TON Connect TMA return strategy:", error);
    }
    // Do not force a network during connection. Keeper does not offer a user-facing network switch,
    // and TON Connect requires the wallet and dApp network to match when a network is requested.
    // Goalkeeper currently uses the wallet only for connection/identity; no transaction is requested.
    tonConnectUI.onStatusChange((wallet) => {
      // Wallet switch/connect/disconnect events are authoritative.
      connectedWalletAddress = wallet?.account?.address || "";
      updateWalletUI();
      if (connectedWalletAddress) {
        awardMission("connect", 10);
        setText(walletStatus, "Wallet connected");
        setText(profileActivity, "Session activity: TON wallet connected.");
        try { sessionStorage.setItem("goalkeeperWalletConnected", "1"); } catch {}
        handleWalletReturn();
      } else {
        setText(walletStatus, "Wallet not connected");
      }
    });

    try { await tonConnectUI.connectionRestored; } catch (error) { console.warn("TON connection restore:", error); }
    connectedWalletAddress = tonConnectUI.account?.address || tonConnectUI.wallet?.account?.address || "";
    updateWalletUI();
    return tonConnectUI;
  } catch (error) {
    console.error("TON Connect initialization failed:", error);
    tonConnectUI = null;
    setText(walletStatus, "TON Connect initialization failed");
    return null;
  }
}

async function openWalletSelector() {
  const button = connectBtn;
  if (button) button.disabled = true;
  setText(walletStatus, "Opening TON wallet selector...");
  try {
    const ui = await ensureTonConnect();
    if (!ui) throw new Error("TON Connect SDK unavailable.");
    // Use the standard TON Connect modal so the SDK can choose the
    // correct Tonkeeper deep-link/return target for this device.
    await ui.openModal();
    void handleWalletReturn();
  } catch (error) {
    console.error("TON wallet selector error:", error);
    const message = error?.message || error?.name || "Unknown TON Connect error";
    setText(walletStatus, "TON Connect error: " + message);
  } finally {
    if (button && !getWalletAddress()) button.disabled = false;
  }
}

function bindWalletButtons() {
  if (tonConnectFallback && tonConnectFallback.dataset.bound !== "1") {
    tonConnectFallback.dataset.bound = "1";
    tonConnectFallback.addEventListener("click", openWalletSelector);
  }
  if (connectBtn && connectBtn.dataset.bound !== "1") {
    connectBtn.dataset.bound = "1";
    connectBtn.addEventListener("click", openWalletSelector);
  }
}

function updateProfileWallet() {
  const address = getWalletAddress();
  setText(profileWallet, address ? rawTonAddressToFriendly(address) : "Not connected");
  setText(profileLinkStatus, localStorage.getItem("goalkeeperIdentityLink") ? "Identity Linked" : "Not linked");
}

function updateIdentityState() {
  const connected = Boolean(getWalletAddress());
  const linked = Boolean(localStorage.getItem("goalkeeperIdentityLink"));

  if (telegramVerified && connected) {
    if (linkWalletBtn) linkWalletBtn.disabled = linked;
    setText(identityStatus, linked ? "Identity Linked" : "Ready to link");
    setText(identityMessage, linked ? "Telegram identity and TON wallet are linked for this session." : "Telegram is verified and the TON wallet is connected. Select Link TON Wallet.");
  } else {
    if (linkWalletBtn) linkWalletBtn.disabled = true;
    setText(identityStatus, "Wallet link pending");
    setText(identityMessage, telegramVerified ? "Connect a TON wallet first." : "Complete Telegram verification first.");
  }
}

async function loadTelegramLibrary() {
  if (window.Telegram?.WebApp) return true;
  const existing = document.querySelector("script[data-telegram-sdk]");
  if (existing) return false;
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js?63";
    script.async = true;
    script.dataset.telegramSdk = "1";
    script.onload = () => resolve(Boolean(window.Telegram?.WebApp));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

async function validateTelegramSession(tg) {
  if (!tg?.initData) {
    telegramVerified = false;
    setText(telegramStatus, "Browser mode");
    setText(telegramUser, "Open Goalkeeper inside Telegram to view user and session information.");
    updateAuthButtons(); updateIdentityState(); updateRewards(); return;
  }
  try {
    setText(telegramStatus, "Verifying Telegram session...");
    const response = await fetch(TELEGRAM_VALIDATE_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initData: tg.initData }) });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Telegram verification failed");
    telegramInitData = tg.initData;
    telegramVerified = true;
    setText(telegramStatus, "Telegram verified");
    const user = result.user || tg.initDataUnsafe?.user;
    const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
    const username = user?.username ? "@" + user.username : "";
    setText(telegramUser, [name, username].filter(Boolean).join(" • ") || "Telegram user verified");
    awardMission("telegram", 0);
    updateAuthButtons(); updateIdentityState(); updateRewards();
    await loadProfileSession();
  } catch (error) {
    console.error("Telegram verification:", error);
    telegramVerified = false;
    setText(telegramStatus, "Telegram verification failed");
    setText(telegramUser, error.message || "Backend verification failed.");
    updateAuthButtons(); updateIdentityState(); updateRewards();
  }
}

async function initTelegram() {
  const loaded = await loadTelegramLibrary();
  const tg = window.Telegram?.WebApp;
  if (!loaded && !tg) {
    setText(telegramStatus, "Browser mode");
    setText(telegramUser, "Goalkeeper is open in browser. Open it inside Telegram to activate secure verification.");
    updateAuthButtons(); return;
  }
  if (!tg) return;
  try { tg.ready(); tg.expand(); } catch (error) { console.warn("Telegram ready:", error); }
  await validateTelegramSession(tg);
}

async function loginTelegram() {
  const tg = window.Telegram?.WebApp;
  if (tg) { await validateTelegramSession(tg); return; }
  setText(telegramStatus, "Open Goalkeeper from Telegram");
  setText(telegramUser, "Login with Telegram is available when the Mini-App is opened inside Telegram.");
}

async function loadProfileSession() {
  if (!telegramVerified || !telegramInitData) return;
  try {
    const response = await fetch(PROFILE_SESSION_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initData: telegramInitData }) });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Profile unavailable");
    setText(goalkeeperUserId, result.goalkeeperUserId || "—");
    const user = result.user || {};
    setText(profileTelegram, user.username ? "@" + user.username : ([user.first_name, user.last_name].filter(Boolean).join(" ") || "Telegram user"));
    setText(profileIdentity, "Telegram session verified by Goalkeeper backend.");
    setText(profileStatus, "Secure profile ready");
    setText(profileActivity, "Session activity: Profile loaded.");
    updateProfileWallet();
  } catch (error) {
    console.error("Profile session:", error);
    setText(profileStatus, "Profile unavailable");
    setText(profileIdentity, error.message || "Secure profile load failed.");
  }
}

async function linkWalletIdentity() {
  const wallet = getWalletAddress();
  if (!telegramVerified || !telegramInitData || !wallet) { updateIdentityState(); return; }
  if (linkWalletBtn) linkWalletBtn.disabled = true;
  setText(identityStatus, "Linking...");
  setText(identityMessage, "Preparing secure identity link...");
  try {
    const response = await fetch(IDENTITY_LINK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initData: telegramInitData, walletAddress: wallet }) });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Identity link failed");
    localStorage.setItem("goalkeeperIdentityLink", result.linkToken);
    awardMission("link", 20);
    setText(identityStatus, "Identity Linked");
    setText(identityMessage, "Telegram identity and TON wallet are linked for this session.");
    setText(profileLinkStatus, "Identity Linked");
    setText(profileActivity, "Session activity: Telegram + TON wallet linked.");
    updateRewards();
    if (linkWalletBtn) linkWalletBtn.disabled = true;
  } catch (error) {
    console.error("Identity link:", error);
    setText(identityStatus, "Link failed");
    setText(identityMessage, error.message || "Identity link could not be created.");
    updateIdentityState();
  }
}

function updateLevel(points) {
  const level = Math.floor(points / 50) + 1;
  const progress = points % 50;
  setText(levelNumber, String(level)); setText(levelDisplay, String(level)); setText(levelProgress, progress + " / 50");
  if (levelBar) levelBar.style.width = (progress * 2) + "%";
  setText(levelMessage, level > 1 ? "Level " + level + " unlocked. Keep defending your streak." : "Complete missions to unlock your next level.");
  const titles = {1:"Rookie",2:"Defender",3:"Guardian",4:"Elite"}; const badges = {1:"ROOKIE",2:"DEFENDER",3:"GUARDIAN",4:"ELITE"}; const safe = Math.min(level,4);
  setText(levelBadge, level > 4 ? "ELITE+" : badges[safe]);
  setText(levelOrb, level > 4 ? "4+" : String(level)); setText(levelTitle, level > 4 ? "Elite+" : titles[safe]);
  document.querySelectorAll(".level-ladder span").forEach((el)=>{const n=el.dataset.level==="5+"?5:Number(el.dataset.level);el.classList.toggle("active",level>=n);});
  document.querySelectorAll(".rank-item").forEach((el)=>el.classList.toggle("unlocked",level>=Number(el.dataset.rank)));
}

function getStreak(){return Number(localStorage.getItem(STREAK_KEY)||"0");}
function getBestStreak(){return Number(localStorage.getItem(BEST_STREAK_KEY)||"0");}

function updateStreakUI(){
  const streak=getStreak(); const best=getBestStreak(); const checked=localStorage.getItem(CHECKIN_KEY)===todayKey();
  setText(streakNumber,streak+(streak===1?" Day":" Days")); setText(streakBest,"Best: "+best); setText(streakDetail,streak+(streak===1?" day":" days"));
  if(checked){setText(streakStatus,"Streak protected today");setText(streakMessage,"Nice save. Come back tomorrow to keep the streak alive.");}
  else{setText(streakStatus,streak?"Check-in available":"Start your daily check-in");setText(streakMessage,streak?"Check in today to keep the streak alive.":"Daily check-in starts your keeper streak.");}
}

function updateMissionUI(){
  const missions=getMissions(); const checked=localStorage.getItem(CHECKIN_KEY)===todayKey();
  setText(missionOpen,missions.open?"Completed":"+5"); setText(missionConnect,missions.connect?"Completed":"+10"); setText(missionLink,missions.link?"Completed":"+20"); setText(missionCheckin,checked?"Completed":"+10");
}

function updateAchievements(){
  const missions=getMissions(); const checked=localStorage.getItem(CHECKIN_KEY)===todayKey();
  setText(achievementOpen,missions.open?"Unlocked":"Locked"); setText(achievementWallet,missions.connect?"Unlocked":"Locked"); setText(achievementIdentity,missions.link?"Unlocked":"Locked"); setText(achievementCheckin,checked?"Unlocked":"Locked");
}

function nextCheckinTimestamp(){const now=new Date();return Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()+1);}
function formatCountdown(ms){const total=Math.max(0,Math.floor(ms/1000));return String(Math.floor(total/3600)).padStart(2,"0")+":"+String(Math.floor((total%3600)/60)).padStart(2,"0")+":"+String(total%60).padStart(2,"0");}

function updateCheckinTimer(){
  if(!dailyCheckinBtn)return;
  const checked=localStorage.getItem(CHECKIN_KEY)===todayKey(); dailyCheckinBtn.disabled=checked; dailyCheckinBtn.textContent=checked?"Check-in Complete":"Daily Check-in";
  if(!checkinTimer||!checkinCountdown)return;
  if(!checked){checkinTimer.hidden=true;return;}
  checkinTimer.hidden=false; setText(checkinCountdown,formatCountdown(nextCheckinTimestamp()-Date.now()));
}

function updateRewards(){
  const opened=getMissions(); if(!opened.open)awardMission("open",5);
  const points=Number(localStorage.getItem(POINTS_KEY)||"0"); const checked=localStorage.getItem(CHECKIN_KEY)===todayKey();
  setText(pointsTotal,points+" Points"); setText(rewardPoints,points+" Points"); updateLevel(points); updateStreakUI();
  setText(missionTelegram,telegramVerified?"Verified":"Pending"); setText(missionWallet,getWalletAddress()?"Connected":"Pending"); setText(missionIdentity,localStorage.getItem("goalkeeperIdentityLink")?"Linked":"Pending"); setText(missionCheckin,checked?"Completed today":"Available");
  updateCheckinTimer(); updateMissionUI(); updateAchievements();
  setText(pointsMessage,checked?"Today's testnet check-in is complete.":"Browser mode: daily testnet check-in is available. Telegram verification is optional.");
}

function handleDailyCheckin(){
  if(localStorage.getItem(CHECKIN_KEY)===todayKey())return;
  const current=Number(localStorage.getItem(POINTS_KEY)||"0"); localStorage.setItem(POINTS_KEY,String(current+10));
  const today=todayKey(); const last=localStorage.getItem(STREAK_DATE_KEY); let streak=getStreak();
  if(last===previousDayKey())streak+=1; else if(last!==today)streak=1;
  localStorage.setItem(STREAK_KEY,String(streak)); localStorage.setItem(BEST_STREAK_KEY,String(Math.max(getBestStreak(),streak))); localStorage.setItem(STREAK_DATE_KEY,today); localStorage.setItem(CHECKIN_KEY,today);
  setText(profileActivity,"Session activity: Daily testnet check-in completed (+10 points)."); updateRewards();
}

async function logoutSession(){
  try{if(tonConnectUI)await tonConnectUI.disconnect();}catch(error){console.warn("Wallet disconnect:",error);}
  telegramInitData=""; telegramVerified=false; connectedWalletAddress=""; localStorage.removeItem("goalkeeperIdentityLink");
  setText(telegramStatus,"Logged out"); setText(telegramUser,"Telegram session cleared. Open Goalkeeper from Telegram to log in again."); setText(profileStatus,"Profile pending"); setText(profileIdentity,"Complete Telegram verification to create your secure profile."); setText(goalkeeperUserId,"—"); setText(profileTelegram,"—"); setText(profileWallet,"Not connected"); setText(profileLinkStatus,"—"); setText(profileActivity,"Waiting");
  updateAuthButtons(); updateWalletUI(); updateRewards();
}

async function disconnectWallet(){
  try{
    const ui=await ensureTonConnect();
    if(ui)await ui.disconnect();

    connectedWalletAddress="";
    telegramInitData="";
    telegramVerified=false;

    localStorage.removeItem("goalkeeperIdentityLink");
    localStorage.removeItem(POINTS_KEY);
    localStorage.removeItem(CHECKIN_KEY);
    localStorage.removeItem(STREAK_KEY);
    localStorage.removeItem(BEST_STREAK_KEY);
    localStorage.removeItem(STREAK_DATE_KEY);

    const missions=getMissions();
    delete missions.telegram;
    delete missions.connect;
    delete missions.link;
    saveMissions(missions);

    setText(telegramStatus,"Logged out");
    setText(telegramUser,"Telegram session cleared. Open Goalkeeper from Telegram to log in again.");
    setText(profileStatus,"Profile pending");
    setText(profileIdentity,"Complete Telegram verification to create your secure profile.");
    setText(goalkeeperUserId,"—");
    setText(profileTelegram,"—");
    setText(profileWallet,"Not connected");
    setText(profileLinkStatus,"—");
    setText(profileActivity,"Session activity: Wallet disconnected.");
    updateAuthButtons();
    updateWalletUI();
    updateRewards();
  }catch(error){
    console.error("Wallet disconnect:",error);
    setText(walletStatus,"Wallet disconnect failed. Try again.");
  }
}

if(languageSelect)languageSelect.addEventListener("change",()=>applyLanguage(languageSelect.value));
if(loginBtn)loginBtn.addEventListener("click",loginTelegram);
if(logoutBtn)logoutBtn.addEventListener("click",logoutSession);
if(disconnectBtn)disconnectBtn.addEventListener("click",disconnectWallet);
if(disconnectWalletBtn)disconnectWalletBtn.addEventListener("click",disconnectWallet);
if(linkWalletBtn)linkWalletBtn.addEventListener("click",linkWalletIdentity);
if(dailyCheckinBtn)dailyCheckinBtn.addEventListener("click",handleDailyCheckin);

if(copyAddressBtn)copyAddressBtn.addEventListener("click",async()=>{
  const address=getWalletAddress(); if(!address)return;
  try{await navigator.clipboard.writeText(address);copyAddressBtn.textContent="Copied";setTimeout(()=>{copyAddressBtn.textContent="Copy Address";},1200);}
  catch{copyAddressBtn.textContent="Copy failed";setTimeout(()=>{copyAddressBtn.textContent="Copy Address";},1200);}
});

if(explorerBtn)explorerBtn.addEventListener("click",()=>{
  const address=getWalletAddress(); if(!address)return;
  const url=TON_TESTNET_EXPLORER+"/address/"+encodeURIComponent(address); const tg=window.Telegram?.WebApp;
  if(tg?.openLink)tg.openLink(url);else window.open(url,"_blank","noopener,noreferrer");
});

if(shareGoalkeeperBtn)shareGoalkeeperBtn.addEventListener("click",()=>{
  const url="https://t.me/GoalkeeperSandyBot"; const text="Try Goalkeeper — TON + Telegram Mini-App by SandyChainHub.";
  const shareUrl="https://t.me/share/url?url="+encodeURIComponent(url)+"&text="+encodeURIComponent(text); const tg=window.Telegram?.WebApp;
  if(tg?.openTelegramLink)tg.openTelegramLink(shareUrl);else window.open(shareUrl,"_blank","noopener,noreferrer");
});

bindWalletButtons();
if(connectBtn)connectBtn.hidden=false;
updateAuthButtons();
updateWalletUI();
updateRewards();
applyLanguage(localStorage.getItem(LANGUAGE_KEY) || "en");

window.addEventListener("load",()=>{
  ensureTonConnect().catch((error)=>console.error("TON startup:",error));
  initTelegram().catch((error)=>console.error("Telegram startup:",error));
});

setInterval(()=>{try{updateCheckinTimer();}catch(error){console.error("Check-in timer:",error);}},1000);
