/* Goalkeeper Genesis Keeper NFT claim preview — testnet only */
(function(){
  const ENDPOINT="https://sandy-chain-hub.vercel.app/api/goalkeeper/event";
  const STATUS_ID="genesisNftStatus", BTN_ID="genesisNftClaimBtn";
  const ELIGIBLE_KEY="goalkeeperGenesisNftEligible";
  const VERIFY_KEY="goalkeeperGenesisNftVerifiedAt";
  const MINTED_KEY="goalkeeperGenesisNftMinted";
  const BADGE_KEY="goalkeeperGenesisBadge";
  const eligible=()=>Math.max(Number(localStorage.getItem("goalkeeperStreak")||"0"),Number(localStorage.getItem("goalkeeperBestStreak")||"0"))>=30;
  const initData=()=>window.Telegram&&window.Telegram.WebApp?window.Telegram.WebApp.initData:"";
  const set=(s,b,disabled)=>{const x=document.getElementById(STATUS_ID),y=document.getElementById(BTN_ID);if(x)x.textContent=s;if(y){y.disabled=disabled;y.textContent=b}};
  function refresh(){
    const minted=localStorage.getItem(MINTED_KEY)==="1";
    const verified=localStorage.getItem(ELIGIBLE_KEY)==="1";
    if(localStorage.getItem(BADGE_KEY)==="1"&&!verified)localStorage.setItem(ELIGIBLE_KEY,"1");
    if(minted)return set("Genesis Keeper testnet NFT is marked minted for this profile.","MINTED ✓",true);
    if(verified)return set("Eligibility is server-verified, but the Goalkeeper Genesis collection is not deployed yet. No NFT mint transaction is available.","DEPLOYMENT PENDING",true);
    if(eligible())return set("30-day Keeper Streak appears complete locally. Verify eligibility with the Goalkeeper server.","VERIFY ELIGIBILITY",false);
    set("Reach a 30-day Keeper Streak to unlock Genesis Keeper NFT eligibility verification.","VERIFY ELIGIBILITY",true);
  }
  async function verify(){
    const i=initData();
    if(!i)return set("Open Goalkeeper inside Telegram to verify your Genesis profile.","OPEN IN TELEGRAM",true);
    set("Checking your 30-day Keeper Streak…","VERIFYING…",true);
    try{
      const r=await fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({initData:i,action:"badge"})});
      const j=await r.json();
      if(!j.ok||!j.eligible)return set("Server verification did not confirm eligibility yet.","TRY AGAIN",false);
      localStorage.setItem(ELIGIBLE_KEY,"1");
      if(j.claimed)localStorage.setItem(BADGE_KEY,"1");
      localStorage.setItem(VERIFY_KEY,new Date().toISOString());
      set("30-day Keeper Streak verified. NFT minting is disabled until the Goalkeeper Genesis collection is deployed on TON Testnet.","DEPLOYMENT PENDING",true);
      window.dispatchEvent(new CustomEvent("goalkeeper:mission",{detail:{message:"Genesis Keeper eligibility server-verified for testnet NFT claim."}}));
    }catch(e){console.warn("Genesis NFT verification:",e);set("Verification service is unavailable. Try again later.","TRY AGAIN",false)}
  }
  function init(){refresh();document.getElementById(BTN_ID)?.addEventListener("click",verify);window.addEventListener("goalkeeper:mission",refresh);setInterval(refresh,5000)}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();