const connectBtn = document.getElementById("connectBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const walletStatus = document.getElementById("walletStatus");
const walletAddress = document.getElementById("walletAddress");
const telegramStatus = document.getElementById("telegramStatus");
const telegramUser = document.getElementById("telegramUser");
const identityStatus = document.getElementById("identityStatus");
const identityMessage = document.getElementById("identityMessage");
const linkWalletBtn = document.getElementById("linkWalletBtn");
const copyAddressBtn = document.getElementById("copyAddressBtn");
const explorerBtn = document.getElementById("explorerBtn");
const connectedWalletChip = document.getElementById("connectedWalletChip");
const connectedWalletAddress = document.getElementById("connectedWalletAddress");
const checkinTimer = document.getElementById("checkinTimer");
const checkinCountdown = document.getElementById("checkinCountdown");

const TELEGRAM_VALIDATE_URL = "https://sandy-chain-hub.vercel.app/api/telegram/validate";
const IDENTITY_LINK_URL = "https://sandy-chain-hub.vercel.app/api/identity/link";
const PROFILE_SESSION_URL = "https://sandy-chain-hub.vercel.app/api/profile/session";

const profileStatus = document.getElementById("profileStatus");
const profileIdentity = document.getElementById("profileIdentity");
const goalkeeperUserId = document.getElementById("goalkeeperUserId");
const profileTelegram = document.getElementById("profileTelegram");
const profileWallet = document.getElementById("profileWallet");
const profileLinkStatus = document.getElementById("profileLinkStatus");
const profileActivity = document.getElementById("profileActivity");
const pointsTotal = document.getElementById("pointsTotal");
const rewardPoints = document.getElementById("rewardPoints");
const levelNumber = document.getElementById("levelNumber");
const levelDisplay = document.getElementById("levelDisplay");
const levelProgress = document.getElementById("levelProgress");
const levelBar = document.getElementById("levelBar");
const levelMessage = document.getElementById("levelMessage");
const levelBadge = document.getElementById("levelBadge");
const levelOrb = document.getElementById("levelOrb");
const levelTitle = document.getElementById("levelTitle");
const streakNumber = document.getElementById("streakNumber");
const streakBest = document.getElementById("streakBest");
const streakStatus = document.getElementById("streakStatus");
const streakDetail = document.getElementById("streakDetail");
const streakMessage = document.getElementById("streakMessage");
const pointsMessage = document.getElementById("pointsMessage");
const dailyCheckinBtn = document.getElementById("dailyCheckinBtn");
const missionTelegram = document.getElementById("missionTelegram");
const missionWallet = document.getElementById("missionWallet");
const missionIdentity = document.getElementById("missionIdentity");
const missionCheckin = document.getElementById("missionCheckin");
const missionDaily = missionCheckin;
const missionOpen = document.getElementById("missionOpen");
const missionConnect = document.getElementById("missionConnect");
const missionLink = document.getElementById("missionLink");
const achievementOpen = document.getElementById("achievementOpen");
const achievementWallet = document.getElementById("achievementWallet");
const achievementIdentity = document.getElementById("achievementIdentity");
const achievementCheckin = document.getElementById("achievementCheckin");
const shareGoalkeeperBtn = document.getElementById("shareGoalkeeperBtn");


let tonConnectUI;
let telegramInitData = "";
let telegramVerified = false;
let connectedWalletAddress = "";
function updateAuthButtons() {
  const loggedIn = Boolean(telegramVerified);
  if (loginBtn) loginBtn.hidden = loggedIn;
  if (logoutBtn) logoutBtn.hidden = !loggedIn;
}

async function loginTelegram() {
  const tg = window.Telegram?.WebApp;
  if (!tg) {
    telegramStatus.textContent = "Open Goalkeeper from Telegram";
    telegramUser.textContent = "Login with Telegram तभी उपलब्ध होगा जब Mini-App Telegram के अंदर खुले।";
    return;
  }
  try {
    tg.ready();
    await initTelegram();
  } catch (error) {
    console.error("Telegram login error:", error);
    telegramStatus.textContent = "Telegram login failed";
  }
}

async function logoutSession() {
  try {
    if (tonConnectUI && getWalletAddress()) {
      await tonConnectUI.disconnect();
    }
  } catch (error) {
    console.error("Wallet disconnect during logout:", error);
  }
  telegramInitData = "";
  telegramVerified = false;
  connectedWalletAddress = "";
  localStorage.removeItem("goalkeeperIdentityLink");
  telegramStatus.textContent = "Logged out";
  telegramUser.textContent = "Telegram session cleared. Login again to continue.";
  profileStatus.textContent = "Profile pending";
  profileIdentity.textContent = "Login with Telegram to create a secure session.";
  goalkeeperUserId.textContent = "—";
  profileTelegram.textContent = "—";
  profileWallet.textContent = "Not connected";
  profileLinkStatus.textContent = "—";
  profileActivity.textContent = "Waiting for login";
  identityStatus.textContent = "Login required";
  identityMessage.textContent = "Login with Telegram और फिर TON wallet connect करें।";
  updateAuthButtons();
  updateWalletTools();
  updateIdentityState();
  updateRewards();
}

if (loginBtn) loginBtn.addEventListener("click", loginTelegram);
if (logoutBtn) logoutBtn.addEventListener("click", logoutSession);

const POINTS_KEY = "goalkeeperPoints";
const CHECKIN_KEY = "goalkeeperCheckinDate";
const STREAK_KEY = "goalkeeperStreak";
const BEST_STREAK_KEY = "goalkeeperBestStreak";
const STREAK_DATE_KEY = "goalkeeperStreakDate";
const MISSIONS_KEY = "goalkeeperMissions";
const TON_TESTNET_EXPLORER = "https://testnet.tonscan.org";

function updateWalletTools() {
  const address = getWalletAddress();
  if (connectedWalletChip && connectedWalletAddress && connectBtn) {
    const connected = Boolean(address);
    connectedWalletChip.hidden = !connected;
    connectedWalletAddress.textContent = connected ? shortAddress(address) : "—";
    if (connectBtn) connectBtn.hidden = true;
  }
  const enabled = Boolean(address);
  copyAddressBtn.disabled = !enabled;
  explorerBtn.disabled = !enabled;
}

function openTonExplorer() {
  const address = getWalletAddress();
  if (!address) return;
  const url = TON_TESTNET_EXPLORER + "/address/" + encodeURIComponent(address);
  const tg = window.Telegram?.WebApp;
  if (tg?.openLink) tg.openLink(url);
  else window.open(url, "_blank", "noopener,noreferrer");
}

if (copyAddressBtn) copyAddressBtn.addEventListener("click", async () => {
  const address = getWalletAddress();
  if (!address) return;
  try {
    await navigator.clipboard.writeText(address);
    copyAddressBtn.textContent = "Copied";
    setTimeout(() => { copyAddressBtn.textContent = "Copy Address"; }, 1200);
  } catch {
    copyAddressBtn.textContent = "Copy failed";
    setTimeout(() => { copyAddressBtn.textContent = "Copy Address"; }, 1200);
  }
});

if (explorerBtn) explorerBtn.addEventListener("click", openTonExplorer);

function shortAddress(address) {
  if (!address) return "";
  return address.length > 18 ? address.slice(0, 10) + "..." + address.slice(-8) : address;
}

function getWalletAddress() {
  return connectedWalletAddress || tonConnectUI?.account?.address || "";
}

function updateProfileWallet() {
  const address = getWalletAddress();
  profileWallet.textContent = address ? shortAddress(address) : "Not connected";
  const linked = Boolean(localStorage.getItem("goalkeeperIdentityLink"));
  profileLinkStatus.textContent = linked ? "Identity Linked" : "Not linked";
}

async function loadProfileSession() {
  if (!telegramInitData || !telegramVerified) return;
  try {
    profileStatus.textContent = "Secure profile ready";
    profileIdentity.textContent = "Telegram session verified by Goalkeeper backend.";
    const response = await fetch(PROFILE_SESSION_URL, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({initData: telegramInitData})
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Profile unavailable");
    goalkeeperUserId.textContent = result.goalkeeperUserId;
    const user=result.user;
    profileTelegram.textContent = user?.username ? "@" + user.username : ([user?.first_name,user?.last_name].filter(Boolean).join(" ") || "Telegram user");
    profileActivity.textContent = "Session activity: Telegram verified • Profile loaded.";
    updateProfileWallet();
    updateRewards();
  } catch (error) {
    profileStatus.textContent = "Profile unavailable";
    profileIdentity.textContent = error.message || "Secure profile load failed.";
    profileActivity.textContent = "Session activity: Verification available, profile endpoint unavailable.";
  }
}

function getMissions() {
  try { return JSON.parse(localStorage.getItem(MISSIONS_KEY) || "{}"); }
  catch { return {}; }
}

function saveMissions(missions) {
  localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
}

function awardMission(id, points) {
  const missions = getMissions();
  if (missions[id]) return false;
  const current = Number(localStorage.getItem(POINTS_KEY) || "0");
  localStorage.setItem(POINTS_KEY, String(current + points));
  missions[id] = {completedAt: new Date().toISOString(), points};
  saveMissions(missions);
  return true;
}

function updateLevel(points) {
  const level = Math.floor(points / 50) + 1;
  const progress = points % 50;
  if (levelNumber) levelNumber.textContent = level;
  if (levelDisplay) levelDisplay.textContent = level;
  if (levelProgress) levelProgress.textContent = progress + " / 50";
  if (levelBar) levelBar.style.width = (progress * 2) + "%";
  if (levelMessage) levelMessage.textContent = level > 1
    ? "Level " + level + " unlocked. Keep defending your streak."
    : "Complete missions to unlock your next level.";
  updateRankUI(level);
}

function updateMissionUI() {
  const missions = getMissions();
  missionOpen.textContent = missions.open ? "Completed" : "+5";
  missionConnect.textContent = missions.connect ? "Completed" : "+10";
  missionLink.textContent = missions.link ? "Completed" : "+20";
  missionDaily.textContent = localStorage.getItem(CHECKIN_KEY) === todayKey() ? "Completed" : "+10";
}

function getStreak() { return Number(localStorage.getItem(STREAK_KEY) || "0"); }
function getBestStreak() { return Number(localStorage.getItem(BEST_STREAK_KEY) || "0"); }

function previousDayKey() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.getUTCFullYear() + "-" + String(d.getUTCMonth()+1).padStart(2,"0") + "-" + String(d.getUTCDate()).padStart(2,"0");
}

function updateStreakUI() {
  const streak = getStreak();
  const best = getBestStreak();
  const today = todayKey();
  const last = localStorage.getItem(STREAK_DATE_KEY);
  const checked = localStorage.getItem(CHECKIN_KEY) === today;
  streakNumber.textContent = streak + (streak === 1 ? " Day" : " Days");
  streakBest.textContent = "Best: " + best;
  if (streakDetail) streakDetail.textContent = streak + (streak === 1 ? " day" : " days");
  if (checked) {
    streakStatus.textContent = "Streak protected today";
    if (streakMessage) streakMessage.textContent = "Nice save. Come back tomorrow to keep the streak alive.";
  } else if (last === previousDayKey()) {
    streakStatus.textContent = "Check-in available";
    if (streakMessage) streakMessage.textContent = "Your streak is waiting. Complete today's check-in.";
  } else {
    streakStatus.textContent = streak ? "Check-in available" : "Start your daily check-in";
    if (streakMessage) streakMessage.textContent = streak ? "Check in today to start a new streak cycle." : "Daily check-in starts your keeper streak.";
  }
}

function updateRankUI(level) {
  const titles = {1:"Rookie",2:"Defender",3:"Guardian",4:"Elite"};
  const badges = {1:"ROOKIE",2:"DEFENDER",3:"GUARDIAN",4:"ELITE"};
  const safeLevel = Math.min(level, 4);
  if (levelBadge) levelBadge.textContent = level > 4 ? "ELITE+" : badges[safeLevel];
  if (levelOrb) levelOrb.textContent = level > 4 ? "4+" : String(level);
  if (levelTitle) levelTitle.textContent = level > 4 ? "Elite+" : titles[safeLevel];
  document.querySelectorAll(".level-ladder span").forEach(el => {
    const n = el.dataset.level === "5+" ? 5 : Number(el.dataset.level);
    el.classList.toggle("active", level >= n);
  });
  document.querySelectorAll(".rank-item").forEach(el => {
    const n = Number(el.dataset.rank);
    el.classList.toggle("unlocked", level >= n);
  });
}

function todayKey() {
  const d = new Date();
  return d.getUTCFullYear() + "-" + String(d.getUTCMonth()+1).padStart(2,"0") + "-" + String(d.getUTCDate()).padStart(2,"0");
}

function updateAchievements() {
  const missions = getMissions();
  const checkinDone = localStorage.getItem(CHECKIN_KEY) === todayKey();
  achievementOpen.textContent = missions.open ? "Unlocked" : "Locked";
  achievementWallet.textContent = missions.connect ? "Unlocked" : "Locked";
  achievementIdentity.textContent = missions.link ? "Unlocked" : "Locked";
  achievementCheckin.textContent = checkinDone ? "Unlocked" : "Locked";
}

function nextCheckinTimestamp() {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  return next.getTime();
}

function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return String(hours).padStart(2,"0") + ":" + String(minutes).padStart(2,"0") + ":" + String(seconds).padStart(2,"0");
}

function updateCheckinTimer() {
  if (!dailyCheckinBtn || !checkinTimer || !checkinCountdown) return;
  const checked = localStorage.getItem(CHECKIN_KEY) === todayKey();
  if (!checked) {
    checkinTimer.hidden = true;
    return;
  }
  const remaining = nextCheckinTimestamp() - Date.now();
  if (remaining <= 0) {
    checkinTimer.hidden = true;
    dailyCheckinBtn.disabled = !telegramVerified;
    dailyCheckinBtn.textContent = "Daily Check-in";
    return;
  }
  checkinTimer.hidden = false;
  checkinCountdown.textContent = formatCountdown(remaining);
}

setInterval(() => { try { updateCheckinTimer(); } catch (error) { console.error("Check-in timer error:", error); } }, 1000);

function updateRewards() {
  awardMission("open", 5);
  const points = Number(localStorage.getItem(POINTS_KEY) || "0");
  const checked = localStorage.getItem(CHECKIN_KEY) === todayKey();
  pointsTotal.textContent = points + " Points";
  if (rewardPoints) rewardPoints.textContent = points + " Points";
  updateLevel(points);
  updateStreakUI();
  missionTelegram.textContent = telegramVerified ? "Verified" : "Pending";
  missionWallet.textContent = getWalletAddress() ? "Connected" : "Pending";
  missionIdentity.textContent = localStorage.getItem("goalkeeperIdentityLink") ? "Linked" : "Pending";
  missionCheckin.textContent = checked ? "Completed today" : "Available";
  dailyCheckinBtn.disabled = checked || !telegramVerified;
  dailyCheckinBtn.textContent = checked ? "Check-in Complete" : "Daily Check-in";
  updateCheckinTimer();
  updateMissionUI();
  updateAchievements();
  pointsMessage.textContent = checked
    ? "आज का testnet check-in complete है।"
    : "Testnet-only activity points. No real-money reward is issued.";
}

if (dailyCheckinBtn) dailyCheckinBtn.addEventListener("click", () => {
  if (!telegramVerified || localStorage.getItem(CHECKIN_KEY) === todayKey()) return;
  const current = Number(localStorage.getItem(POINTS_KEY) || "0");
  localStorage.setItem(POINTS_KEY, String(current + 10));
  const today = todayKey();
  const last = localStorage.getItem(STREAK_DATE_KEY);
  let streak = getStreak();
  if (last === previousDayKey()) streak += 1;
  else if (last !== today) streak = 1;
  localStorage.setItem(STREAK_KEY, String(streak));
  localStorage.setItem(BEST_STREAK_KEY, String(Math.max(getBestStreak(), streak)));
  localStorage.setItem(STREAK_DATE_KEY, today);
  localStorage.setItem(CHECKIN_KEY, today);
  profileActivity.textContent = "Session activity: Daily testnet check-in completed (+10 points).";
  updateRewards();
});

if (shareGoalkeeperBtn) shareGoalkeeperBtn.addEventListener("click", () => {
  const url = "https://t.me/GoalkeeperSandyBot";
  const text = "Try Goalkeeper — TON + Telegram Mini-App by SandyChainHub.";
  const shareUrl = "https://t.me/share/url?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(text);
  const tg = window.Telegram?.WebApp;
  if (tg?.openTelegramLink) {
    tg.openTelegramLink(shareUrl);
  } else {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }
});

function updateIdentityState() {
  const connected = Boolean(getWalletAddress());

  if (telegramVerified && connected) {
    const existingLink = localStorage.getItem("goalkeeperIdentityLink");
    linkWalletBtn.disabled = Boolean(existingLink);
    identityStatus.textContent = existingLink ? "Identity Linked" : "Ready to link";
    identityMessage.textContent = existingLink
      ? "Telegram identity और TON wallet इस session के लिए linked हैं।"
      : "Telegram verified और TON wallet connected है। Link TON Wallet दबाएं।";
  } else {
    linkWalletBtn.disabled = true;
    identityStatus.textContent = "Wallet link pending";
    identityMessage.textContent = telegramVerified
      ? "पहले TON wallet connect करें।"
      : "पहले Telegram verification पूरी होने दें।";
  }
}

async function validateTelegramSession(tg) {
  if (!tg.initData) {
    telegramStatus.textContent = "Telegram session not available";
    telegramUser.textContent = "Valid Telegram Mini-App session मिलने पर verification होगी।";
    updateIdentityState();
    return;
  }

  try {
    telegramStatus.textContent = "Verifying Telegram session...";
    const response = await fetch(TELEGRAM_VALIDATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: tg.initData })
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
      telegramStatus.textContent = "Telegram verification failed";
      telegramUser.textContent = result.error || "Server verification failed.";
      telegramVerified = false;
      updateIdentityState();
      return;
    }

    telegramStatus.textContent = "Telegram verified";
    telegramInitData = tg.initData;
    telegramVerified = true;
    updateAuthButtons();

    const user = result.user;
    if (user) {
      const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
      const username = user.username ? "@" + user.username : "";
      telegramUser.textContent =
        [name, username].filter(Boolean).join(" • ") || "Telegram user verified";
    } else {
      telegramUser.textContent = "Telegram session verified.";
    }

    updateIdentityState();
    updateProfileWallet();
  } catch (error) {
    console.error(error);
    telegramStatus.textContent = "Verification server unavailable";
    telegramVerified = false;
    telegramUser.textContent = "Backend से connection नहीं हो पाया।";
    updateAuthButtons();
    updateIdentityState();
    updateRewards();
  }
}

async function linkWalletIdentity() {
  const walletAddress = getWalletAddress();

  if (!telegramInitData || !telegramVerified || !walletAddress) {
    identityStatus.textContent = "Not ready";
    identityMessage.textContent = !telegramVerified
      ? "Telegram verification अभी पूरी नहीं हुई।"
      : "TON wallet address अभी उपलब्ध नहीं है।";
    updateIdentityState();
    return;
  }

  try {
    linkWalletBtn.disabled = true;
    identityStatus.textContent = "Linking...";
    identityMessage.textContent = "Secure identity link तैयार हो रहा है...";

    const response = await fetch(IDENTITY_LINK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: telegramInitData, walletAddress })
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
      identityStatus.textContent = "Link failed";
      identityMessage.textContent = result.error || "Identity link नहीं बन पाया।";
      linkWalletBtn.disabled = false;
      return;
    }

    localStorage.setItem("goalkeeperIdentityLink", result.linkToken);
    identityStatus.textContent = "Identity Linked";
    profileLinkStatus.textContent = "Identity Linked";
    profileActivity.textContent = "Session activity: Telegram + TON wallet linked.";
    awardMission("link", 20);
    updateRewards();
    identityMessage.textContent = "Telegram identity और TON wallet इस session के लिए linked हैं।";
    linkWalletBtn.disabled = true;
  } catch (error) {
    console.error(error);
    identityStatus.textContent = "Link server unavailable";
    identityMessage.textContent = "Backend से connection नहीं हो पाया।";
    linkWalletBtn.disabled = false;
  }
}

// Bind immediately, with safe guards for Telegram WebView startup.
if (linkWalletBtn) linkWalletBtn.addEventListener("click", linkWalletIdentity);

function loadTelegramLibrary() {
  if (window.Telegram?.WebApp) return Promise.resolve(true);
  if (document.querySelector("script[data-telegram-sdk]")) {
    return new Promise(resolve => {
      const started = Date.now();
      const timer = setInterval(() => {
        if (window.Telegram?.WebApp || Date.now() - started > 5000) {
          clearInterval(timer);
          resolve(Boolean(window.Telegram?.WebApp));
        }
      }, 100);
    });
  }
  return new Promise(resolve => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js?63";
    script.async = true;
    script.dataset.telegramSdk = "1";
    script.onload = () => resolve(Boolean(window.Telegram?.WebApp));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

async function initTelegram() {
  if (!window.Telegram?.WebApp) {
    await loadTelegramLibrary();
  }
  const tg = window.Telegram?.WebApp;
  if (!tg) {
    telegramStatus.textContent = "Browser mode";
    telegramUser.textContent =
      "Goalkeeper browser में खुला है। Telegram में खोलने पर secure verification activate होगी।";
    updateIdentityState();
    updateWalletTools();
    updateAuthButtons();
    return;
  }

  tg.ready();
  tg.expand();
  telegramStatus.textContent = "Telegram Mini-App ready";

  const user = tg.initDataUnsafe?.user;
  if (user) {
    const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
    const username = user.username ? "@" + user.username : "";
    telegramUser.textContent =
      [name, username].filter(Boolean).join(" • ") || "Telegram user connected";
  } else {
    telegramUser.textContent =
      "Telegram session active. Server verification शुरू हो रही है...";
  }

  validateTelegramSession(tg).then(() => loadProfileSession());
}

let tonConnectInitializing = false;

function bindTonConnectButton() {
  if (connectBtn) {
    connectBtn.hidden = true;
    connectBtn.disabled = true;
  }
  const fallback = document.getElementById("tonConnectFallback");
  if (fallback && fallback.dataset.bound !== "1") {
    fallback.dataset.bound = "1";
    fallback.addEventListener("click", async () => {
      fallback.disabled = true;
      walletStatus.textContent = "Opening TON wallet selector...";
      try {
        const ui = await ensureTonConnect();
        if (!ui) throw new Error("TON Connect SDK did not load.");
        await ui.openModal();
      } catch (error) {
        console.error("TON fallback connect error:", error);
        walletStatus.textContent = "TON wallet selector could not open. Tap again.";
        fallback.disabled = false;
      }
    });
  }
}
nst connectBtn = document.getElementById("connectBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const walletStatus = document.getElementById("walletStatus");
const walletAddress = document.getElementById("walletAddress");
const telegramStatus = document.getElementById("telegramStatus");
const telegramUser = document.getElementById("telegramUser");
const identityStatus = document.getElementById("identityStatus");
const identityMessage = document.getElementById("identityMessage");
const linkWalletBtn = document.getElementById("linkWalletBtn");
const copyAddressBtn = document.getElementById("copyAddressBtn");
const explorerBtn = document.getElementById("explorerBtn");
const connectedWalletChip = document.getElementById("connectedWalletChip");
const connectedWalletAddress = document.getElementById("connectedWalletAddress");
const checkinTimer = document.getElementById("checkinTimer");
const checkinCountdown = document.getElementById("checkinCountdown");

const TELEGRAM_VALIDATE_URL = "https://sandy-chain-hub.vercel.app/api/telegram/validate";
const IDENTITY_LINK_URL = "https://sandy-chain-hub.vercel.app/api/identity/link";
const PROFILE_SESSION_URL = "https://sandy-chain-hub.vercel.app/api/profile/session";

const profileStatus = document.getElementById("profileStatus");
const profileIdentity = document.getElementById("profileIdentity");
const goalkeeperUserId = document.getElementById("goalkeeperUserId");
const profileTelegram = document.getElementById("profileTelegram");
const profileWallet = document.getElementById("profileWallet");
const profileLinkStatus = document.getElementById("profileLinkStatus");
const profileActivity = document.getElementById("profileActivity");
const pointsTotal = document.getElementById("pointsTotal");
const rewardPoints = document.getElementById("rewardPoints");
const levelNumber = document.getElementById("levelNumber");
const levelDisplay = document.getElementById("levelDisplay");
const levelProgress = document.getElementById("levelProgress");
const levelBar = document.getElementById("levelBar");
const levelMessage = document.getElementById("levelMessage");
const levelBadge = document.getElementById("levelBadge");
const levelOrb = document.getElementById("levelOrb");
const levelTitle = document.getElementById("levelTitle");
const streakNumber = document.getElementById("streakNumber");
const streakBest = document.getElementById("streakBest");
const streakStatus = document.getElementById("streakStatus");
const streakDetail = document.getElementById("streakDetail");
const streakMessage = document.getElementById("streakMessage");
const pointsMessage = document.getElementById("pointsMessage");
const dailyCheckinBtn = document.getElementById("dailyCheckinBtn");
const missionTelegram = document.getElementById("missionTelegram");
const missionWallet = document.getElementById("missionWallet");
const missionIdentity = document.getElementById("missionIdentity");
const missionCheckin = document.getElementById("missionCheckin");
const missionDaily = missionCheckin;
const missionOpen = document.getElementById("missionOpen");
const missionConnect = document.getElementById("missionConnect");
const missionLink = document.getElementById("missionLink");
const achievementOpen = document.getElementById("achievementOpen");
const achievementWallet = document.getElementById("achievementWallet");
const achievementIdentity = document.getElementById("achievementIdentity");
const achievementCheckin = document.getElementById("achievementCheckin");
const shareGoalkeeperBtn = document.getElementById("shareGoalkeeperBtn");


let tonConnectUI;
let telegramInitData = "";
let telegramVerified = false;
let connectedWalletAddress = "";
function updateAuthButtons() {
  const loggedIn = Boolean(telegramVerified);
  if (loginBtn) loginBtn.hidden = loggedIn;
  if (logoutBtn) logoutBtn.hidden = !loggedIn;
}

async function loginTelegram() {
  const tg = window.Telegram?.WebApp;
  if (!tg) {
    telegramStatus.textContent = "Open Goalkeeper from Telegram";
    telegramUser.textContent = "Login with Telegram तभी उपलब्ध होगा जब Mini-App Telegram के अंदर खुले।";
    return;
  }
  try {
    tg.ready();
    await initTelegram();
  } catch (error) {
    console.error("Telegram login error:", error);
    telegramStatus.textContent = "Telegram login failed";
  }
}

async function logoutSession() {
  try {
    if (tonConnectUI && getWalletAddress()) {
      await tonConnectUI.disconnect();
    }
  } catch (error) {
    console.error("Wallet disconnect during logout:", error);
  }
  telegramInitData = "";
  telegramVerified = false;
  connectedWalletAddress = "";
  localStorage.removeItem("goalkeeperIdentityLink");
  telegramStatus.textContent = "Logged out";
  telegramUser.textContent = "Telegram session cleared. Login again to continue.";
  profileStatus.textContent = "Profile pending";
  profileIdentity.textContent = "Login with Telegram to create a secure session.";
  goalkeeperUserId.textContent = "—";
  profileTelegram.textContent = "—";
  profileWallet.textContent = "Not connected";
  profileLinkStatus.textContent = "—";
  profileActivity.textContent = "Waiting for login";
  identityStatus.textContent = "Login required";
  identityMessage.textContent = "Login with Telegram और फिर TON wallet connect करें।";
  updateAuthButtons();
  updateWalletTools();
  updateIdentityState();
  updateRewards();
}

if (loginBtn) loginBtn.addEventListener("click", loginTelegram);
if (logoutBtn) logoutBtn.addEventListener("click", logoutSession);

const POINTS_KEY = "goalkeeperPoints";
const CHECKIN_KEY = "goalkeeperCheckinDate";
const STREAK_KEY = "goalkeeperStreak";
const BEST_STREAK_KEY = "goalkeeperBestStreak";
const STREAK_DATE_KEY = "goalkeeperStreakDate";
const MISSIONS_KEY = "goalkeeperMissions";
const TON_TESTNET_EXPLORER = "https://testnet.tonscan.org";

function updateWalletTools() {
  const address = getWalletAddress();
  if (connectedWalletChip && connectedWalletAddress && connectBtn) {
    const connected = Boolean(address);
    connectedWalletChip.hidden = !connected;
    connectedWalletAddress.textContent = connected ? shortAddress(address) : "—";
    if (connectBtn) connectBtn.hidden = true;
  }
  const enabled = Boolean(address);
  copyAddressBtn.disabled = !enabled;
  explorerBtn.disabled = !enabled;
}

function openTonExplorer() {
  const address = getWalletAddress();
  if (!address) return;
  const url = TON_TESTNET_EXPLORER + "/address/" + encodeURIComponent(address);
  const tg = window.Telegram?.WebApp;
  if (tg?.openLink) tg.openLink(url);
  else window.open(url, "_blank", "noopener,noreferrer");
}

if (copyAddressBtn) copyAddressBtn.addEventListener("click", async () => {
  const address = getWalletAddress();
  if (!address) return;
  try {
    await navigator.clipboard.writeText(address);
    copyAddressBtn.textContent = "Copied";
    setTimeout(() => { copyAddressBtn.textContent = "Copy Address"; }, 1200);
  } catch {
    copyAddressBtn.textContent = "Copy failed";
    setTimeout(() => { copyAddressBtn.textContent = "Copy Address"; }, 1200);
  }
});

if (explorerBtn) explorerBtn.addEventListener("click", openTonExplorer);

function shortAddress(address) {
  if (!address) return "";
  return address.length > 18 ? address.slice(0, 10) + "..." + address.slice(-8) : address;
}

function getWalletAddress() {
  return connectedWalletAddress || tonConnectUI?.account?.address || "";
}

function updateProfileWallet() {
  const address = getWalletAddress();
  profileWallet.textContent = address ? shortAddress(address) : "Not connected";
  const linked = Boolean(localStorage.getItem("goalkeeperIdentityLink"));
  profileLinkStatus.textContent = linked ? "Identity Linked" : "Not linked";
}

async function loadProfileSession() {
  if (!telegramInitData || !telegramVerified) return;
  try {
    profileStatus.textContent = "Secure profile ready";
    profileIdentity.textContent = "Telegram session verified by Goalkeeper backend.";
    const response = await fetch(PROFILE_SESSION_URL, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({initData: telegramInitData})
    });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Profile unavailable");
    goalkeeperUserId.textContent = result.goalkeeperUserId;
    const user=result.user;
    profileTelegram.textContent = user?.username ? "@" + user.username : ([user?.first_name,user?.last_name].filter(Boolean).join(" ") || "Telegram user");
    profileActivity.textContent = "Session activity: Telegram verified • Profile loaded.";
    updateProfileWallet();
    updateRewards();
  } catch (error) {
    profileStatus.textContent = "Profile unavailable";
    profileIdentity.textContent = error.message || "Secure profile load failed.";
    profileActivity.textContent = "Session activity: Verification available, profile endpoint unavailable.";
  }
}

function getMissions() {
  try { return JSON.parse(localStorage.getItem(MISSIONS_KEY) || "{}"); }
  catch { return {}; }
}

function saveMissions(missions) {
  localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
}

function awardMission(id, points) {
  const missions = getMissions();
  if (missions[id]) return false;
  const current = Number(localStorage.getItem(POINTS_KEY) || "0");
  localStorage.setItem(POINTS_KEY, String(current + points));
  missions[id] = {completedAt: new Date().toISOString(), points};
  saveMissions(missions);
  return true;
}

function updateLevel(points) {
  const level = Math.floor(points / 50) + 1;
  const progress = points % 50;
  if (levelNumber) levelNumber.textContent = level;
  if (levelDisplay) levelDisplay.textContent = level;
  if (levelProgress) levelProgress.textContent = progress + " / 50";
  if (levelBar) levelBar.style.width = (progress * 2) + "%";
  if (levelMessage) levelMessage.textContent = level > 1
    ? "Level " + level + " unlocked. Keep defending your streak."
    : "Complete missions to unlock your next level.";
  updateRankUI(level);
}

function updateMissionUI() {
  const missions = getMissions();
  missionOpen.textContent = missions.open ? "Completed" : "+5";
  missionConnect.textContent = missions.connect ? "Completed" : "+10";
  missionLink.textContent = missions.link ? "Completed" : "+20";
  missionDaily.textContent = localStorage.getItem(CHECKIN_KEY) === todayKey() ? "Completed" : "+10";
}

function getStreak() { return Number(localStorage.getItem(STREAK_KEY) || "0"); }
function getBestStreak() { return Number(localStorage.getItem(BEST_STREAK_KEY) || "0"); }

function previousDayKey() {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.getUTCFullYear() + "-" + String(d.getUTCMonth()+1).padStart(2,"0") + "-" + String(d.getUTCDate()).padStart(2,"0");
}

function updateStreakUI() {
  const streak = getStreak();
  const best = getBestStreak();
  const today = todayKey();
  const last = localStorage.getItem(STREAK_DATE_KEY);
  const checked = localStorage.getItem(CHECKIN_KEY) === today;
  streakNumber.textContent = streak + (streak === 1 ? " Day" : " Days");
  streakBest.textContent = "Best: " + best;
  if (streakDetail) streakDetail.textContent = streak + (streak === 1 ? " day" : " days");
  if (checked) {
    streakStatus.textContent = "Streak protected today";
    if (streakMessage) streakMessage.textContent = "Nice save. Come back tomorrow to keep the streak alive.";
  } else if (last === previousDayKey()) {
    streakStatus.textContent = "Check-in available";
    if (streakMessage) streakMessage.textContent = "Your streak is waiting. Complete today's check-in.";
  } else {
    streakStatus.textContent = streak ? "Check-in available" : "Start your daily check-in";
    if (streakMessage) streakMessage.textContent = streak ? "Check in today to start a new streak cycle." : "Daily check-in starts your keeper streak.";
  }
}

function updateRankUI(level) {
  const titles = {1:"Rookie",2:"Defender",3:"Guardian",4:"Elite"};
  const badges = {1:"ROOKIE",2:"DEFENDER",3:"GUARDIAN",4:"ELITE"};
  const safeLevel = Math.min(level, 4);
  if (levelBadge) levelBadge.textContent = level > 4 ? "ELITE+" : badges[safeLevel];
  if (levelOrb) levelOrb.textContent = level > 4 ? "4+" : String(level);
  if (levelTitle) levelTitle.textContent = level > 4 ? "Elite+" : titles[safeLevel];
  document.querySelectorAll(".level-ladder span").forEach(el => {
    const n = el.dataset.level === "5+" ? 5 : Number(el.dataset.level);
    el.classList.toggle("active", level >= n);
  });
  document.querySelectorAll(".rank-item").forEach(el => {
    const n = Number(el.dataset.rank);
    el.classList.toggle("unlocked", level >= n);
  });
}

function todayKey() {
  const d = new Date();
  return d.getUTCFullYear() + "-" + String(d.getUTCMonth()+1).padStart(2,"0") + "-" + String(d.getUTCDate()).padStart(2,"0");
}

function updateAchievements() {
  const missions = getMissions();
  const checkinDone = localStorage.getItem(CHECKIN_KEY) === todayKey();
  achievementOpen.textContent = missions.open ? "Unlocked" : "Locked";
  achievementWallet.textContent = missions.connect ? "Unlocked" : "Locked";
  achievementIdentity.textContent = missions.link ? "Unlocked" : "Locked";
  achievementCheckin.textContent = checkinDone ? "Unlocked" : "Locked";
}

function nextCheckinTimestamp() {
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  return next.getTime();
}

function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return String(hours).padStart(2,"0") + ":" + String(minutes).padStart(2,"0") + ":" + String(seconds).padStart(2,"0");
}

function updateCheckinTimer() {
  if (!dailyCheckinBtn || !checkinTimer || !checkinCountdown) return;
  const checked = localStorage.getItem(CHECKIN_KEY) === todayKey();
  if (!checked) {
    checkinTimer.hidden = true;
    return;
  }
  const remaining = nextCheckinTimestamp() - Date.now();
  if (remaining <= 0) {
    checkinTimer.hidden = true;
    dailyCheckinBtn.disabled = !telegramVerified;
    dailyCheckinBtn.textContent = "Daily Check-in";
    return;
  }
  checkinTimer.hidden = false;
  checkinCountdown.textContent = formatCountdown(remaining);
}

setInterval(() => { try { updateCheckinTimer(); } catch (error) { console.error("Check-in timer error:", error); } }, 1000);

function updateRewards() {
  awardMission("open", 5);
  const points = Number(localStorage.getItem(POINTS_KEY) || "0");
  const checked = localStorage.getItem(CHECKIN_KEY) === todayKey();
  pointsTotal.textContent = points + " Points";
  if (rewardPoints) rewardPoints.textContent = points + " Points";
  updateLevel(points);
  updateStreakUI();
  missionTelegram.textContent = telegramVerified ? "Verified" : "Pending";
  missionWallet.textContent = getWalletAddress() ? "Connected" : "Pending";
  missionIdentity.textContent = localStorage.getItem("goalkeeperIdentityLink") ? "Linked" : "Pending";
  missionCheckin.textContent = checked ? "Completed today" : "Available";
  dailyCheckinBtn.disabled = checked || !telegramVerified;
  dailyCheckinBtn.textContent = checked ? "Check-in Complete" : "Daily Check-in";
  updateCheckinTimer();
  updateMissionUI();
  updateAchievements();
  pointsMessage.textContent = checked
    ? "आज का testnet check-in complete है।"
    : "Testnet-only activity points. No real-money reward is issued.";
}

if (dailyCheckinBtn) dailyCheckinBtn.addEventListener("click", () => {
  if (!telegramVerified || localStorage.getItem(CHECKIN_KEY) === todayKey()) return;
  const current = Number(localStorage.getItem(POINTS_KEY) || "0");
  localStorage.setItem(POINTS_KEY, String(current + 10));
  const today = todayKey();
  const last = localStorage.getItem(STREAK_DATE_KEY);
  let streak = getStreak();
  if (last === previousDayKey()) streak += 1;
  else if (last !== today) streak = 1;
  localStorage.setItem(STREAK_KEY, String(streak));
  localStorage.setItem(BEST_STREAK_KEY, String(Math.max(getBestStreak(), streak)));
  localStorage.setItem(STREAK_DATE_KEY, today);
  localStorage.setItem(CHECKIN_KEY, today);
  profileActivity.textContent = "Session activity: Daily testnet check-in completed (+10 points).";
  updateRewards();
});

if (shareGoalkeeperBtn) shareGoalkeeperBtn.addEventListener("click", () => {
  const url = "https://t.me/GoalkeeperSandyBot";
  const text = "Try Goalkeeper — TON + Telegram Mini-App by SandyChainHub.";
  const shareUrl = "https://t.me/share/url?url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(text);
  const tg = window.Telegram?.WebApp;
  if (tg?.openTelegramLink) {
    tg.openTelegramLink(shareUrl);
  } else {
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }
});

function updateIdentityState() {
  const connected = Boolean(getWalletAddress());

  if (telegramVerified && connected) {
    const existingLink = localStorage.getItem("goalkeeperIdentityLink");
    linkWalletBtn.disabled = Boolean(existingLink);
    identityStatus.textContent = existingLink ? "Identity Linked" : "Ready to link";
    identityMessage.textContent = existingLink
      ? "Telegram identity और TON wallet इस session के लिए linked हैं।"
      : "Telegram verified और TON wallet connected है। Link TON Wallet दबाएं।";
  } else {
    linkWalletBtn.disabled = true;
    identityStatus.textContent = "Wallet link pending";
    identityMessage.textContent = telegramVerified
      ? "पहले TON wallet connect करें।"
      : "पहले Telegram verification पूरी होने दें।";
  }
}

async function validateTelegramSession(tg) {
  if (!tg.initData) {
    telegramStatus.textContent = "Telegram session not available";
    telegramUser.textContent = "Valid Telegram Mini-App session मिलने पर verification होगी।";
    updateIdentityState();
    return;
  }

  try {
    telegramStatus.textContent = "Verifying Telegram session...";
    const response = await fetch(TELEGRAM_VALIDATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: tg.initData })
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
      telegramStatus.textContent = "Telegram verification failed";
      telegramUser.textContent = result.error || "Server verification failed.";
      telegramVerified = false;
      updateIdentityState();
      return;
    }

    telegramStatus.textContent = "Telegram verified";
    telegramInitData = tg.initData;
    telegramVerified = true;
    updateAuthButtons();

    const user = result.user;
    if (user) {
      const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
      const username = user.username ? "@" + user.username : "";
      telegramUser.textContent =
        [name, username].filter(Boolean).join(" • ") || "Telegram user verified";
    } else {
      telegramUser.textContent = "Telegram session verified.";
    }

    updateIdentityState();
    updateProfileWallet();
  } catch (error) {
    console.error(error);
    telegramStatus.textContent = "Verification server unavailable";
    telegramVerified = false;
    telegramUser.textContent = "Backend से connection नहीं हो पाया।";
    updateAuthButtons();
    updateIdentityState();
    updateRewards();
  }
}

async function linkWalletIdentity() {
  const walletAddress = getWalletAddress();

  if (!telegramInitData || !telegramVerified || !walletAddress) {
    identityStatus.textContent = "Not ready";
    identityMessage.textContent = !telegramVerified
      ? "Telegram verification अभी पूरी नहीं हुई।"
      : "TON wallet address अभी उपलब्ध नहीं है।";
    updateIdentityState();
    return;
  }

  try {
    linkWalletBtn.disabled = true;
    identityStatus.textContent = "Linking...";
    identityMessage.textContent = "Secure identity link तैयार हो रहा है...";

    const response = await fetch(IDENTITY_LINK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: telegramInitData, walletAddress })
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
      identityStatus.textContent = "Link failed";
      identityMessage.textContent = result.error || "Identity link नहीं बन पाया।";
      linkWalletBtn.disabled = false;
      return;
    }

    localStorage.setItem("goalkeeperIdentityLink", result.linkToken);
    identityStatus.textContent = "Identity Linked";
    profileLinkStatus.textContent = "Identity Linked";
    profileActivity.textContent = "Session activity: Telegram + TON wallet linked.";
    awardMission("link", 20);
    updateRewards();
    identityMessage.textContent = "Telegram identity और TON wallet इस session के लिए linked हैं।";
    linkWalletBtn.disabled = true;
  } catch (error) {
    console.error(error);
    identityStatus.textContent = "Link server unavailable";
    identityMessage.textContent = "Backend से connection नहीं हो पाया।";
    linkWalletBtn.disabled = false;
  }
}

// Bind immediately, with safe guards for Telegram WebView startup.
if (linkWalletBtn) linkWalletBtn.addEventListener("click", linkWalletIdentity);

function loadTelegramLibrary() {
  if (window.Telegram?.WebApp) return Promise.resolve(true);
  if (document.querySelector("script[data-telegram-sdk]")) {
    return new Promise(resolve => {
      const started = Date.now();
      const timer = setInterval(() => {
        if (window.Telegram?.WebApp || Date.now() - started > 5000) {
          clearInterval(timer);
          resolve(Boolean(window.Telegram?.WebApp));
        }
      }, 100);
    });
  }
  return new Promise(resolve => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js?63";
    script.async = true;
    script.dataset.telegramSdk = "1";
    script.onload = () => resolve(Boolean(window.Telegram?.WebApp));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

async function initTelegram() {
  if (!window.Telegram?.WebApp) {
    await loadTelegramLibrary();
  }
  const tg = window.Telegram?.WebApp;
  if (!tg) {
    telegramStatus.textContent = "Browser mode";
    telegramUser.textContent =
      "Goalkeeper browser में खुला है। Telegram में खोलने पर secure verification activate होगी।";
    updateIdentityState();
    updateWalletTools();
    updateAuthButtons();
    return;
  }

  tg.ready();
  tg.expand();
  telegramStatus.textContent = "Telegram Mini-App ready";

  const user = tg.initDataUnsafe?.user;
  if (user) {
    const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
    const username = user.username ? "@" + user.username : "";
    telegramUser.textContent =
      [name, username].filter(Boolean).join(" • ") || "Telegram user connected";
  } else {
    telegramUser.textContent =
      "Telegram session active. Server verification शुरू हो रही है...";
  }

  validateTelegramSession(tg).then(() => loadProfileSession());
}

let tonConnectInitializing = false;

function bindTonConnectButton() {
  if (!connectBtn || connectBtn.dataset.tonBound === "1") return;
  connectBtn.dataset.tonBound = "1";
  connectBtn.disabled = false;
  connectBtn.addEventListener("click", () => {
    try {
      if (getWalletAddress()) {
        const ui = tonConnectUI;
        if (!ui) throw new Error("TON Connect UI is not ready.");
        ui.disconnect().catch(error => {
          console.error("TON disconnect error:", error);
          walletStatus.textContent = "Wallet disconnect failed. Tap again.";
        });
        return;
      }

      // Keep openModal() directly inside the user click handler.
      // Waiting on an async loader first can cause Telegram WebView/browser
      // popup protection to block the wallet selector.
      const ui = tonConnectUI;
      if (ui) {
        connectBtn.disabled = true;
        walletStatus.textContent = "Opening TON wallet selector...";
        Promise.resolve(ui.openModal()).catch(error => {
          console.error("TON wallet modal error:", error);
          walletStatus.textContent = "TON wallet selector could not open. Tap Connect again.";
          connectBtn.disabled = false;
        });
        return;
      }

      connectBtn.disabled = true;
      walletStatus.textContent = "TON Connect loading... tap again in a moment.";
      ensureTonConnect().then(ready => {
        if (ready) {
          connectBtn.disabled = false;
          walletStatus.textContent = "TON Connect ready. Tap Connect TON Wallet again.";
        } else {
          throw new Error("TON Connect UI is still loading.");
        }
      }).catch(error => {
        console.error("TON Connect load error:", error);
        walletStatus.textContent = "TON Connect could not load. Tap Connect again.";
        connectBtn.disabled = false;
      });
    } catch (error) {
      console.error("TON Connect button error:", error);
      walletStatus.textContent = "TON Connect could not open. Tap Connect again.";
      connectBtn.disabled = false;
    }
  });
}

async function loadTonConnectLibrary() {
  if (window.TON_CONNECT_UI?.TonConnectUI) return true;
  if (document.querySelector("script[data-tonconnect-fallback]")) {
    for (let i = 0; i < 15; i += 1) {
      if (window.TON_CONNECT_UI?.TonConnectUI) return true;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    return Boolean(window.TON_CONNECT_UI?.TonConnectUI);
  }
  return new Promise(resolve => {
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@tonconnect/ui@4.0.2/dist/tonconnect-ui.min.js";
    script.async = true;
    script.dataset.tonconnectFallback = "1";
    script.onload = () => resolve(Boolean(window.TON_CONNECT_UI?.TonConnectUI));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

async function ensureTonConnect() {
  if (tonConnectUI) return tonConnectUI;
  await loadTonConnectLibrary();
  for (let i = 0; i < 10; i += 1) {
    if (window.TON_CONNECT_UI?.TonConnectUI) {
      await initTonConnect();
      if (tonConnectUI) return tonConnectUI;
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  return tonConnectUI || null;
}

async function initTonConnect() {
  if (tonConnectUI) return tonConnectUI;
  if (tonConnectInitializing) {
    return new Promise(resolve => {
      const started = Date.now();
      const timer = setInterval(() => {
        if (tonConnectUI || Date.now() - started > 5000) {
          clearInterval(timer);
          resolve(tonConnectUI || null);
        }
      }, 100);
    });
  }

  tonConnectInitializing = true;

  try {
    if (!window.TON_CONNECT_UI?.TonConnectUI) {
      if (walletStatus) walletStatus.textContent = "TON Connect loading...";
      return null;
    }

    tonConnectUI = new window.TON_CONNECT_UI.TonConnectUI({
      manifestUrl: "https://sandeep0181.github.io/SandyChainHub/goalkeeper/tonconnect-manifest.json",
      
      uiPreferences: { theme: "DARK" },
      actionsConfiguration: { twaReturnUrl: "https://t.me/GoalkeeperSandyBot" }
    });

    if (connectBtn) connectBtn.disabled = false;

    tonConnectUI.onStatusChange(wallet => {
      if (wallet?.account?.address) {
        connectedWalletAddress = wallet.account.address;
        walletStatus.textContent = "TON Wallet Connected";
        walletAddress.textContent = shortAddress(connectedWalletAddress);
        if (connectBtn) connectBtn.textContent = "Wallet Connected";
        awardMission("connect", 10);
      } else {
        connectedWalletAddress = "";
        walletStatus.textContent = "Wallet connected नहीं है";
        walletAddress.textContent = "Testnet wallet connect करने के बाद address यहाँ दिखेगा।";
        if (connectBtn) connectBtn.textContent = "Connect TON Wallet";
      }
      updateWalletTools();
      updateIdentityState();
      updateProfileWallet();
      updateRewards();
    });

    [300, 800, 1500, 2500].forEach(delay => {
      setTimeout(() => {
        const address = tonConnectUI?.account?.address || "";
        if (address) {
          connectedWalletAddress = address;
          walletStatus.textContent = "TON Wallet Connected";
          walletAddress.textContent = shortAddress(address);
          connectBtn.textContent = "Wallet Connected";
        }
        updateWalletTools();
        updateIdentityState();
        updateProfileWallet();
        updateRewards();
      }, delay);
    });

    return tonConnectUI;
  } catch (error) {
    console.error("TON Connect init error:", error);
    tonConnectUI = null;
    walletStatus.textContent = "TON Connect failed — tap Connect again.";
    return null;
  } finally {
    tonConnectInitializing = false;
  }
}

bindTonConnectButton();

function safeStartup(name, fn) {
  try {
    const result = fn();
    if (result?.catch) result.catch(error => console.error(name + " startup error:", error));
    return result;
  } catch (error) {
    console.error(name + " startup error:", error);
  }
}

safeStartup("TON Connect", () => ensureTonConnect());
safeStartup("Telegram", initTelegram);
safeStartup("Rewards", updateRewards);
safeStartup("Auth buttons", updateAuthButtons);

// Global safety net: keep the Mini-App interactive even if one optional UI update fails.
window.addEventListener("error", event => {
  console.error("Goalkeeper UI error:", event.error || event.message);
});
window.addEventListener("unhandledrejection", event => {
  console.error("Goalkeeper async error:", event.reason);
});

// If TON Connect loads late, keep retrying without locking the button.
window.addEventListener("load", () => {
  if (!tonConnectUI) initTonConnect();
  updateWalletTools();
  updateIdentityState();
  updateAuthButtons();
  updateRewards();
});

