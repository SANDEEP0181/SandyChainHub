(function(){
  "use strict";
  const BLOCK_ID = "48887";
  const REWARD_XP = 10;
  let controller = null;
  let initialized = false;

  const $ = (id) => document.getElementById(id);
  const status = (msg) => {
    const el = $("adsgramStatus");
    if (el) { el.textContent = msg; el.hidden = false; }
  };
  const points = () => {
    try { return Number(localStorage.getItem("goalkeeperPoints") || 0); } catch (e) { return 0; }
  };
  const setPoints = (n) => {
    try { localStorage.setItem("goalkeeperPoints", String(n)); } catch (e) {}
    ["pointsTotal","rewardPoints","heroPointsTotal"].forEach((id) => {
      const el = $(id);
      if (el) el.textContent = id === "heroPointsTotal" ? String(n) : String(n) + " Points";
    });
  };
  const reward = () => {
    const n = points() + REWARD_XP;
    setPoints(n);
    status("Reward received: +" + REWARD_XP + " XP");
    window.dispatchEvent(new CustomEvent("goalkeeper:mission", { detail: { message: "AdsGram reward received: +" + REWARD_XP + " XP" } }));
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
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
