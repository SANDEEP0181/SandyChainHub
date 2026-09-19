const connectBtn = document.getElementById("connectBtn");
const walletStatus = document.getElementById("walletStatus");
const walletAddress = document.getElementById("walletAddress");
const telegramStatus = document.getElementById("telegramStatus");
const telegramUser = document.getElementById("telegramUser");

let tonConnectUI;

function shortAddress(address) {
  if (!address) return "";
  return address.length > 18 ? address.slice(0, 10) + "..." + address.slice(-8) : address;
}

function initTelegram() {
  const tg = window.Telegram?.WebApp;

  if (!tg) {
    telegramStatus.textContent = "Browser mode";
    telegramUser.textContent = "Goalkeeper browser में खुला है। Telegram में खोलने पर Mini-App features activate होंगे।";
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
    telegramUser.textContent = "Telegram session active. Server-side authentication अभी जोड़ी जानी बाकी है।";
  }
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
    } else {
      walletStatus.textContent = "Wallet connected नहीं है";
      walletAddress.textContent = "Testnet wallet connect करने के बाद address यहाँ दिखेगा।";
      connectBtn.textContent = "Connect TON Wallet";
    }
  });

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
