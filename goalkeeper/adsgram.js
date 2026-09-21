/* Goalkeeper AdsGram — local session bonus only.
   Server-authoritative mission points are kept separate so a rewarded-ad callback
   cannot silently overwrite or corrupt the Telegram/Redis score. */
(function(){
  "use strict";
  const BLOCK_ID = "48894";
  const REWARD_XP = 10;
  const AD_XP_KEY = "goalkeeperAdXp";
  let controller = null;
  let initialized = false;

  const $ = (id) => document.getElementById(id);
  const status = (msg) => {
    const el = $("adsgramStatus");
    if (el) { el.textContent = msg; el.hidden = false; }
  };
  const serverPoints = () => {
    try {
      const raw = localStorage.getItem("goalkeeperServerPoints");
      if (raw !== null) return Number(raw) || 0;
      return Number(localStorage.getItem("goalkeeperPoints") || 0);
    } catch (e) { return 0; }
  };
  const adXp = () => {
    try { return Number(localStorage.getItem(AD_XP_KEY) || 0); } catch (e) { return 0; }
  };
  const totalDisplayPoints = () => serverPoints() + adXp();
  const render = () => {
    const n = totalDisplayPoints();
    ["pointsTotal","rewardPoints","heroPointsTotal"].forEach((id) => {
      const el = $(id);
      if (el) el.textContent = id === "heroPointsTotal" ? String(n) : String(n) + " Points";
    });
  };
  const reward = () => {
    const n = adXp() + REWARD_XP;
    try { localStorage.setItem(AD_XP_KEY, String(n)); } catch (e) {}
    render();
    status("Reward received: +" + REWARD_XP + " session XP");
    window.dispatchEvent(new CustomEvent("goalkeeper:mission", {
      detail: { message: "AdsGram reward received: +" + REWARD_XP + " session XP" }
    }));
  };

  function initController() {
    if (controller || !window.Adsgram) return Boolean(controller);
    try {
      controller = window.Adsgram.init({ blockId: BLOCK_ID, debug: false });
      if (!controller) return false;
      controller.addEventListener("onReward", reward);
      controller.addEventListener("onBannerNotFound", () => status("No ad is available right now."));
      controller.addEventListener("onError", () => status("Ad could not be loaded. Try again later."));
      controller.addEventListener("onNonStopShow", () => status("Please wait before watching another ad."));
      controller.addEventListener("onTooLongSession", () => status("Please reopen Goalkeeper in Telegram and try again."));
      initialized = true;
      return true;
    } catch (e) {
      console.error("AdsGram init failed:", e);
      return false;
    }
  }

  async function waitForSDK(timeoutMs) {
    const started = Date.now();
    while (!window.Adsgram && Date.now() - started < timeoutMs) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return Boolean(window.Adsgram);
  }

  async function show() {
    const b = $("watchRewardAdBtn");
    if (!b) return;
    b.disabled = true;
    status("Loading rewarded ad…");
    try {
      const sdkReady = await waitForSDK(5000);
      if (!sdkReady || !initController()) {
        status("AdsGram is not ready. Please reopen Goalkeeper and try again.");
        return;
      }
      if (!initialized) {
        status("AdsGram could not be initialized.");
        return;
      }
      await controller.show();
    } catch (e) {
      console.error("AdsGram show error:", e);
      status("Ad skipped or unavailable. No XP was added.");
    } finally {
      b.disabled = false;
    }
  }

  function init() {
    const b = $("watchRewardAdBtn");
    if (b && !b.dataset.adsgramBound) {
      b.dataset.adsgramBound = "1";
      b.addEventListener("click", show);
    }
    if (window.Adsgram) initController();
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();