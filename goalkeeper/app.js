const connectBtn = document.getElementById("connectBtn");
const walletStatus = document.getElementById("walletStatus");
const walletAddress = document.getElementById("walletAddress");
const telegramStatus = document.getElementById("telegramStatus");
const telegramUser = document.getElementById("telegramUser");
const identityStatus = document.getElementById("identityStatus");
const identityMessage = document.getElementById("identityMessage");
const linkWalletBtn = document.getElementById("linkWalletBtn");

const TELEGRAM_VALIDATE_URL = "https://sandy-chain-hub.vercel.app/api/telegram/validate";
const IDENTITY_LINK_URL = "https://sandy-chain-hub.vercel.app/api/identity/link";

let tonConnectUI;
let telegramInitData = "";
let telegramVerified = false;
let connectedWalletAddress = "";

function shortAddress(address) {
  if (!address) return "";
  return address.length > 18 ? address.slice(0, 10) + "..." + address.slice(-8) : address;
}

function getWalletAddress() {
  return connectedWalletAddress || tonConnectUI?.account?.address || "";
}

function updateIdentityState() {
  const connected = Boolean(getWalletAddress());
  const existingLink = localStorage.getItem("goalkeeperIdentityLink");

  if (telegramVerified && connected) {
    if (existingLink) {
      linkWalletBtn.disabled = false;
      identityStatus.textContent = "Identity Linked";
      identityMessage.textContent = "Telegram identity और TON wallet इस session के लिए linked हैं।";
    } else {
      linkWalletBtn.disabled = false;
      identityStatus.textContent = "Ready to link";
      identityMessage.textContent = "Telegram verified और TON wallet connected है। Link TON Wallet दबाएं।";
    }
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
  } catch (error) {
    console.error(error);
    telegramStatus.textContent = "Verification server unavailable";
    telegramVerified = false;
    telegramUser.textContent = "Backend से connection नहीं हो पाया।";
    updateIdentityState();
  }
}

async function linkWalletIdentity() {
  const walletAddress = getWalletAddress();

  if (!telegramInitData || !telegramVerified || !walletAddress) {
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
      body: JSON.stringify({
        initData: telegramInitData,
        walletAddress
      })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      identityStatus.textContent = "Link failed";
      identityMessage.textContent = result.error || "Identity link नहीं बन पाया।";
      updateIdentityState();
      return;
    }

    localStorage.setItem("goalkeeperIdentityLink", result.linkToken);
    identityStatus.textContent = "Identity Linked";
    identityMessage.textContent = "Telegram identity और TON wallet इस session के लिए linked हैं।";
    linkWalletBtn.disabled = false;
  } catch (error) {
    console.error(error);
    identityStatus.textContent = "Link server unavailable";
    identityMessage.textContent = "Backend से connection नहीं हो पाया।";
    linkWalletBtn.disabled = false;
  }
}

function initTelegram() {
  const tg = window.Telegram?.WebApp;

  if (!tg) {
    telegramStatus.textContent = "Browser mode";
    telegramUser.textContent =
      "Goalkeeper browser में खुला है। Telegram में खोलने पर secure verification activate होगी।";
    updateIdentityState();
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

  validateTelegramSession(tg);
}

async function initTonConnect() {
  if (!window.TON_CONNECT_UI) {
    walletStatus.textContent = "TON Connect library load नहीं हुई";
    updateIdentityState();
    return;
  }

  tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: new URL("tonconnect-manifest.json", window.location.href).toString()
  });

  tonConnectUI.onStatusChange(wallet => {
    if (wallet && wallet.account) {
      connectedWalletAddress = wallet.account.address || "";
      walletStatus.textContent = "TON Wallet Connected";
      walletAddress.textContent = shortAddress(connectedWalletAddress);
      connectBtn.textContent = "Wallet Connected";
    } else {
      connectedWalletAddress = "";
      walletStatus.textContent = "Wallet connected नहीं है";
      walletAddress.textContent =
        "Testnet wallet connect करने के बाद address यहाँ दिखेगा।";
      connectBtn.textContent = "Connect TON Wallet";
    }

    updateIdentityState();
  });

  // TON Connect may restore an existing wallet asynchronously.
  setTimeout(() => updateIdentityState(), 500);
  setTimeout(() => updateIdentityState(), 1500);

  linkWalletBtn.addEventListener("click", linkWalletIdentity);

  connectBtn.addEventListener("click", async () => {
    if (!getWalletAddress()) {
      await tonConnectUI.openModal();
    } else {
      await tonConnectUI.disconnect();
    }
  });
}

initTonConnect();
initTelegram();
