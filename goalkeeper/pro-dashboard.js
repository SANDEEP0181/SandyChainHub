(() => {
  const $ = (id) => document.getElementById(id);
  const safe = (fn, fallback = null) => { try { return fn(); } catch { return fallback; } };

  function shortWallet() {
    const value = safe(() => localStorage.getItem("goalkeeperWalletAddress") || "", "");
    return value ? value.slice(0, 6) + "..." + value.slice(-6) : "Not connected";
  }

  function syncProStats() {
    const points = Number(safe(() => localStorage.getItem("goalkeeperServerPoints") || localStorage.getItem("goalkeeperPoints") || "0", 0));
    const streak = Number(safe(() => localStorage.getItem("goalkeeperStreak") || "0", 0));
    const missions = safe(() => JSON.parse(localStorage.getItem("goalkeeperMissions") || "{}"), {}) || {};
    const completed = ["open", "connect", "link", "checkin"].filter(k => missions[k]).length;
    if ($("proTotalPoints")) $("proTotalPoints").textContent = points;
    if ($("proStreak")) $("proStreak").textContent = streak + "d";
    if ($("proMissions")) $("proMissions").textContent = completed + "/4";
    if ($("proWallet")) $("proWallet").textContent = shortWallet();
    if ($("proUpdated")) $("proUpdated").textContent = "Updated " + new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
  }

  function addActivity(title, text) {
    const box = $("proActivityList");
    if (!box) return;
    const item = document.createElement("div");
    item.className = "pro-activity-item";
    item.innerHTML = '<span class="pro-activity-dot"></span><div><strong></strong><small></small></div><time></time>';
    item.querySelector("strong").textContent = title;
    item.querySelector("small").textContent = text;
    item.querySelector("time").textContent = new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});
    box.prepend(item);
    while (box.children.length > 6) box.lastElementChild.remove();
  }

  function setupNav() {
    document.querySelectorAll("[data-gk-nav]").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = $(btn.dataset.gkNav);
        if (target) target.scrollIntoView({behavior:"smooth", block:"start"});
        document.querySelectorAll("[data-gk-nav]").forEach(x => x.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }

  function setupQuickActions() {
    $("proConnectBtn")?.addEventListener("click", () => {
      window.GoalkeeperConnectWallet?.();
      addActivity("Wallet action", "TON wallet selector opened.");
    });
    $("proMissionBtn")?.addEventListener("click", () => $("missions")?.scrollIntoView({behavior:"smooth"}));
    $("proShareBtn")?.addEventListener("click", () => $("shareGoalkeeperBtn")?.click());
    $("proCheckinBtn")?.addEventListener("click", () => window.GoalkeeperDailyCheckin?.());
  }

  function init() {
    setupNav();
    setupQuickActions();
    syncProStats();
    addActivity("Goalkeeper ready", "Secure testnet dashboard initialized.");
    setInterval(syncProStats, 3000);
    window.addEventListener("goalkeeper:mission", e => {
      addActivity("Mission completed", e.detail?.message || "Mission progress updated.");
      syncProStats();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();