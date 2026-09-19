const connectBtn = document.getElementById("connectBtn");
const walletStatus = document.getElementById("walletStatus");
const walletAddress = document.getElementById("walletAddress");
const telegramStatus = document.getElementById("telegramStatus");
const telegramUser = document.getElementById("telegramUser");
const identityStatus = document.getElementById("identityStatus");
const identityMessage = document.getElementById("identityMessage");
const linkWalletBtn = document.getElementById("linkWalletBtn");

const TELEGRAM_VALIDATE_URL = "https://sandy-chain-hub.vercel.app/api/telegram/validate";

let tonConnectUI;
let telegramInitData = "";
let telegramVerified = false;

function shortAddress(address) {
  if (!address) return "";
  return address.length > 18 ? address.slice(0, 10) + "..." + address.slice(-8) : address;
}

async function validateTelegramSession(tg) {
  if (!tg.initData) {
    telegramStatus.textContent = "Telegram session not available";
    telegramUser.textContent = "Valid Telegram Mini-App session मिलने पर verification होगी।";
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
      return;
    }

    telegramStatus.textContent = "Telegram verified";
    telegramInitData = tg.initData;
    telegramVerified = true;
    updateIdentityState();
    const user = result.user;
    if (user) {
      const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
      const username = user.username ? "@" + user.username : "";
      telegramUser.textContent = [name, username].filter(Boolean).join(" • ") || "Telegram user verified";
    } else {
      telegramUser.textContent = "Telegram session verified.";
    }
  } catch (error) {
    console.error(error);
    telegramStatus.textContent = "Verification server unavailable";
    telegramUser.textContent = "Backend से connection नहीं हो पाया।";
  }
}

function updateIdentityState() {
  const connected = Boolean(tonConnectUI?.account?.address);
  if (telegramVerified && connected) {
    linkWalletBtn.disabled = false;
    identityStatus.textContent = "Ready to link";
    identityMessage.textContent = "Telegram verified और TON wallet connected है। Link TON Wallet दबाएं।";
  } else {
    linkWalletBtn.disabled = true;
    identityStatus.textContent = "Wallet link pending";
    identityMessage.textContent = telegramVerified ? "पहले TON wallet connect करें।" : "पहले Telegram verification पूरी होने दें।";
  }
}

async function linkWalletIdentity() {
  if (!telegramInitData || !telegramVerified || !tonConnectUI?.account?.address) return;
  try {
    linkWalletBtn.disabled = true;
    identityStatus.textContent = "Linking...";
    identityMessage.textContent = "Secure identity link तैयार हो रहा है...";
    const response = await fetch("https://sandy-chain-hub.vercel.app/api/identity/link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData: telegramInitData, walletAddress: tonConnectUI.account.address })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
      identityStatus.textContent = "Link failed";
      identityMessage.textContent = result.error || "Identity link नहीं बन पाया।";
      return;
    }
    localStorage.setItem("goalkeeperIdentityLink", result.linkToken);
    identityStatus.textContent = "Identity Linked";
    identityMessage.textContent = "Telegram identity और TON wallet इस session के लिए linked हैं।";
  } catch (error) {
    console.error(error);
    identityStatus.textContent = "Link server unavailable";
    identityMessage.textContent = "Backend से connection नहीं हो पाया।";
  } finally {
    updateIdentityState();
  }
}

function initTelegram() {
  const tg = window.Telegram?.WebApp;

  if (!tg) {
    telegramStatus.textContent = "Browser mode";
    telegramUser.textContent = "Goalkeeper browser में खुला है। Telegram में खोलने पर secure verification activate होगी।";
    return;
  }

  tg.ready();
  tg.expand();

  telegramStatus.textContent = "Telegram Mini-App ready";

  const user = tg.initDataUnsafe?.user;
  if (user) {
    const name = [user.first_name, user.last_name].filter(Boolean).join(" ");
    const username = user.username ? "@" + user.username : "";
    telegramUser.textContent = [name, username].filter(Boolean).join(" • ") || "Telegram user connected";
  } else {
    telegramUser.textContent = "Telegram session active. Server verification शुरू हो रही है...";
  }

  validateTelegramSession(tg);
}

async function initTonConnect() {
  if (!window.TON_CONNECT_UI) {
    walletStatus.textContent = "TON Connect library load नहीं हुई";
    return;
  }

  tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: new URL("tonconnect-manifest.json", window.location.href).toString()
  });

  tonConnectUI.onStatusChange(wallet => {
    if (wallet && wallet.account) {
      walletStatus.textContent = "TON Wallet Connected";
      walletAddress.textContent = shortAddress(wallet.account.address);
      connectBtn.textContent = "Wallet Connected";
      updateIdentityState();
    } else {
      walletStatus.textContent = "Wallet connected नहीं है";
      walletAddress.textContent = "Testnet wallet connect करने के बाद address यहाँ दिखेगा।";
      connectBtn.textContent = "Connect TON Wallet";
      updateIdentityState();
    }
  });

  linkWalletBtn.addEventListener("click", linkWalletIdentity);

  connectBtn.addEventListener("click", async () => {
    if (!tonConnectUI.account) {
      await tonConnectUI.openModal();
    } else {
      await tonConnectUI.disconnect();
    }
  });
}

initTelegram();
initTonConnect();
