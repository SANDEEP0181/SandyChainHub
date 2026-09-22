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
    if ($("proUpdated")) $("proUpdated").textContent = "LIVE";
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

  const screenMap = {
    home: ["hero", "quick-start", "level-card", "streak-strip", "overview", "pro-grid", "stats"],
    missions: ["missions"],
    events: ["events"],
    team: ["team-screen", "leaderboard", "referral-stats"],
    wallet: ["wallet-screen"],
    profile: ["profile", "settings", "notifications", "support"]
  };

  function tagScreens() {
    const map = {
      hero: document.querySelector(".hero"),
      "quick-start": document.querySelector(".quick-start"),
      "level-card": document.querySelector(".level-card"),
      "streak-strip": document.querySelector(".streak-strip"),
      overview: $("overview"),
      "pro-grid": document.querySelector(".pro-grid"),
      stats: document.querySelector(".stats"),
      missions: $("missions"),
      leaderboard: $("leaderboard"),
      "referral-stats": $("referral-stats"),
      "team-screen": $("team-screen"),
      profile: $("profile"),
      settings: $("settings"),
      notifications: $("notifications"),
      support: $("support")
    };
    Object.entries(map).forEach(([id, el]) => el && el.setAttribute("data-gk-section", id));

    const grid = document.querySelector(".dashboard-grid");
    if (grid) {
      grid.setAttribute("data-gk-section", "wallet-screen");
      grid.querySelector(".wallet-card")?.setAttribute("data-gk-wallet-card", "1");
      grid.querySelector(".telegram-card")?.setAttribute("data-gk-profile-card", "1");
      grid.querySelector(".identity-card")?.setAttribute("data-gk-wallet-card", "1");
      grid.querySelector(".reward-card")?.setAttribute("data-gk-reward-card", "1");
    }
    document.querySelector(".roadmap")?.setAttribute("data-gk-section", "roadmap");
  }

  function showScreen(screen, updateHash = true) {
    tagScreens();
    const allowed = new Set(screenMap[screen] || screenMap.home);

    document.querySelectorAll("[data-gk-section]").forEach(el => {
      el.hidden = !allowed.has(el.getAttribute("data-gk-section"));
    });

    const grid = document.querySelector(".dashboard-grid");
    if (grid) {
      grid.hidden = !["wallet", "profile"].includes(screen);
      grid.querySelectorAll("[data-gk-wallet-card]").forEach(el => el.hidden = screen !== "wallet");
      grid.querySelectorAll("[data-gk-profile-card]").forEach(el => el.hidden = screen !== "profile");
      grid.querySelectorAll("[data-gk-reward-card]").forEach(el => el.hidden = true);
    }

    document.querySelector(".roadmap")?.setAttribute("hidden", "");
    document.querySelector("footer")?.setAttribute("hidden", "");

    document.querySelectorAll("[data-gk-nav]").forEach(btn => btn.classList.toggle("active", btn.dataset.gkNav === screen));
    document.querySelectorAll("[data-gk-bottom]").forEach(btn => btn.classList.toggle("active", btn.dataset.gkBottom === screen));

    if (updateHash) history.replaceState(null, "", "#" + screen);
    syncProStats();
    syncTeam();
  }

  function setupNav() {
    document.querySelectorAll("[data-gk-nav]").forEach(btn => btn.addEventListener("click", () => showScreen(btn.dataset.gkNav)));
    document.querySelectorAll("[data-gk-bottom]").forEach(btn => btn.addEventListener("click", e => { e.preventDefault(); showScreen(btn.dataset.gkBottom); }));
    const initial = location.hash.replace("#", "");
    showScreen(screenMap[initial] ? initial : "home", false);
    window.addEventListener("hashchange", () => {
      const next = location.hash.replace("#", "");
      if (screenMap[next]) showScreen(next, false);
    });
  }


  function syncTeam() {
    const code = safe(() => localStorage.getItem("goalkeeperReferralCode") || "GK-LOCAL", "GK-LOCAL");
    const invites = Number($("referralCount")?.textContent || 0);
    const bonus = Number($("referralBonus")?.textContent || 0);
    const level = Math.floor(invites / 5) + 1, progress = invites % 5, pct = Math.round(progress / 5 * 100);
    if ($("teamReferralCode")) $("teamReferralCode").textContent = code;
    if ($("teamInvites")) $("teamInvites").textContent = invites;
    if ($("teamBonus")) $("teamBonus").textContent = bonus;
    if ($("teamLevel")) $("teamLevel").textContent = level;
    if ($("teamLevelText")) $("teamLevelText").textContent = level === 1 ? "Starter" : level === 2 ? "Builder" : level === 3 ? "Guardian" : "Elite";
    if ($("teamProgressLabel")) $("teamProgressLabel").textContent = progress + " / 5 direct invites";
    if ($("teamProgressPct")) $("teamProgressPct").textContent = pct + "%";
    if ($("teamProgressBar")) $("teamProgressBar").style.width = pct + "%";
    if ($("teamProgressNote")) $("teamProgressNote").textContent = invites >= 5 ? "Next Team Level is unlocked by another 5 direct invites." : "Invite " + (5-progress) + " more people to reach Team Level " + (level+1) + ".";
    if ($("teamInviteLink")) $("teamInviteLink").textContent = location.origin + location.pathname + "?ref=" + encodeURIComponent(code);
    if ($("teamReferralStatus")) $("teamReferralStatus").textContent = $("referralStatus")?.textContent || "Ready to share.";
  }
  function setupTeam() {
    $("teamShareBtn")?.addEventListener("click", () => window.GoalkeeperShareInvite?.());
    $("teamCopyBtn")?.addEventListener("click", () => window.GoalkeeperCopyInvite?.());
    $("teamLinkCopyBtn")?.addEventListener("click", () => window.GoalkeeperCopyInvite?.());
    syncTeam();
  }

  function setupQuickActions() {
    $("proConnectBtn")?.addEventListener("click", () => { window.GoalkeeperConnectWallet?.(); addActivity("Wallet action", "TON wallet selector opened."); });
    $("proMissionBtn")?.addEventListener("click", () => showScreen("missions"));
    $("proShareBtn")?.addEventListener("click", () => showScreen("team"));
    $("proCheckinBtn")?.addEventListener("click", () => window.GoalkeeperDailyCheckin?.());
  }

  window.GoalkeeperShowScreen = showScreen;

  function init() {
    setupNav();
    setupQuickActions();
    setupTeam();
    syncProStats();
    addActivity("Goalkeeper ready", "App-style navigation initialized.");
    setInterval(syncProStats, 3000);
    window.addEventListener("goalkeeper:mission", e => { addActivity("Mission completed", e.detail?.message || "Mission progress updated."); syncProStats(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();