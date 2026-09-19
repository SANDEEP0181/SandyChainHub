const $ = (id) => document.getElementById(id);

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

function setText(el, value) { if (el) el.textContent = value; }

function shortAddress(address) {
  if (!address) return "";
  return address.length > 18 ? address.slice(0, 10) + "..." + address.slice(-8) : address;
}

function getWalletAddress() {
  return connectedWalletAddress || tonConnectUI?.account?.address || tonConnectUI?.wallet?.account?.address || "";
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

  tonConnectLoading = new Promise((resolve) => {
    const existing = document.querySelector("script[data-tonconnect-sdk]");
    if (existing) {
      const started = Date.now();
      const timer = setInterval(() => {
        if (window.TON_CONNECT_UI?.TonConnectUI || Date.now() - started > 8000) {
          clearInterval(timer);
          resolve(Boolean(window.TON_CONNECT_UI?.TonConnectUI));
        }
      }, 100);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js";
    script.async = true;
    script.dataset.tonconnectSdk = "1";
    script.onload = () => resolve(Boolean(window.TON_CONNECT_UI?.TonConnectUI));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

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
      uiPreferences: { theme: "DARK" },
      analytics: { mode: "off" }
    });

    tonConnectUI.onStatusChange((wallet) => {
      connectedWalletAddress = wallet?.account?.address || "";
      updateWalletUI();
      if (connectedWalletAddress) {
        awardMission("connect", 10);
        setText(walletStatus, "Wallet connected");
        setText(profileActivity, "Session activity: TON wallet connected.");
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
    await ui.openModal();
  } catch (error) {
    console.error("TON wallet selector error:", error);
    setText(walletStatus, "Wallet selector could not open. Tap again.");
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
  setText(profileWallet, address ? shortAddress(address) : "Not connected");
  setText(profileLinkStatus, localStorage.getItem("goalkeeperIdentityLink") ? "Identity Linked" : "Not linked");
}

function updateIdentityState() {
  const connected = Boolean(getWalletAddress());
  const linked = Boolean(localStorage.getItem("goalkeeperIdentityLink"));

  if (telegramVerified && connected) {
    if (linkWalletBtn) linkWalletBtn.disabled = linked;
    setText(identityStatus, linked ? "Identity Linked" : "Ready to link");
    setText(identityMessage, linked ? "Telegram identity और TON wallet इस session के लिए linked हैं।" : "Telegram verified और TON wallet connected है। Link TON Wallet दबाएं।");
  } else {
    if (linkWalletBtn) linkWalletBtn.disabled = true;
    setText(identityStatus, "Wallet link pending");
    setText(identityMessage, telegramVerified ? "पहले TON wallet connect करें।" : "पहले Telegram verification पूरी होने दें।");
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
    setText(telegramUser, "Telegram में खोलने पर user/session information यहाँ दिखाई देगी।");
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
    setText(telegramUser, "Goalkeeper browser में खुला है। Telegram में खोलने पर secure verification activate होगी.");
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
  setText(telegramUser, "Login with Telegram तभी उपलब्ध होगा जब Mini-App Telegram के अंदर खुले।");
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
  setText(identityMessage, "Secure identity link तैयार हो रहा है...");
  try {
    const response = await fetch(IDENTITY_LINK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ initData: telegramInitData, walletAddress: wallet }) });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || "Identity link failed");
    localStorage.setItem("goalkeeperIdentityLink", result.linkToken);
    awardMission("link", 20);
    setText(identityStatus, "Identity Linked");
    setText(identityMessage, "Telegram identity और TON wallet इस session के लिए linked हैं।");
    setText(profileLinkStatus, "Identity Linked");
    setText(profileActivity, "Session activity: Telegram + TON wallet linked.");
    updateRewards();
    if (linkWalletBtn) linkWalletBtn.disabled = true;
  } catch (error) {
    console.error("Identity link:", error);
    setText(identityStatus, "Link failed");
    setText(identityMessage, error.message || "Identity link नहीं बन पाया।");
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
  setText(pointsMessage,checked?"आज का testnet check-in complete है।":"Browser mode: daily testnet check-in is available. Telegram verification is optional.");
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
  setText(telegramStatus,"Logged out"); setText(telegramUser,"Telegram session cleared. Open Goalkeeper from Telegram to login again."); setText(profileStatus,"Profile pending"); setText(profileIdentity,"Telegram verification के बाद secure profile तैयार होगा।"); setText(goalkeeperUserId,"—"); setText(profileTelegram,"—"); setText(profileWallet,"Not connected"); setText(profileLinkStatus,"—"); setText(profileActivity,"Waiting");
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
    setText(telegramUser,"Telegram session cleared. Open Goalkeeper from Telegram to login again.");
    setText(profileStatus,"Profile pending");
    setText(profileIdentity,"Telegram verification के बाद secure profile तैयार होगा।");
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

window.addEventListener("load",()=>{
  ensureTonConnect().catch((error)=>console.error("TON startup:",error));
  initTelegram().catch((error)=>console.error("Telegram startup:",error));
});

setInterval(()=>{try{updateCheckinTimer();}catch(error){console.error("Check-in timer:",error);}},1000);
