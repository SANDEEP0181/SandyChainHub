/* Goalkeeper Genesis Keeper NFT claim preview — testnet only */
(function(){
  const ENDPOINT="https://sandy-chain-hub.vercel.app/api/goalkeeper/event";
  const STATUS_ID="genesisNftStatus", BTN_ID="genesisNftClaimBtn";
  const ELIGIBLE_KEY="goalkeeperGenesisNftEligible";
  const VERIFY_KEY="goalkeeperGenesisNftVerifiedAt";
  const MINTED_KEY="goalkeeperGenesisNftMinted";
  const BADGE_KEY="goalkeeperGenesisBadge";
  const DAYS=["2026-09-23","2026-09-24","2026-09-25","2026-09-26","2026-09-27","2026-09-28","2026-09-29"];
  const dayList=()=>{try{return JSON.parse(localStorage.getItem("goalkeeperGenesisDaily")||"[]")||[]}catch{return[]}};
  const eligible=()=>DAYS.every(d=>dayList().includes(d));
  const initData=()=>window.Telegram&&window.Telegram.WebApp?window.Telegram.WebApp.initData:"";
  const set=(s,b,disabled)=>{const x=document.getElementById(STATUS_ID),y=document.getElementById(BTN_ID);if(x)x.textContent=s;if(y){y.disabled=disabled;y.textContent=b}};
  function refresh(){
    const minted=localStorage.getItem(MINTED_KEY)==="1";
    const verified=localStorage.getItem(ELIGIBLE_KEY)==="1";
    if(localStorage.getItem(BADGE_KEY)==="1"&&!verified)localStorage.setItem(ELIGIBLE_KEY,"1");
    if(minted)return set("Genesis Keeper testnet NFT is marked minted for this profile.","MINTED ✓",true);
    if(verified)return set("Eligibility is server-verified, but the Goalkeeper Genesis collection is not deployed yet. No NFT mint transaction is available.","DEPLOYMENT PENDING",true);
    if(eligible())return set("Eligibility appears complete locally. Verify the 7-day achievement first.","VERIFY ELIGIBILITY",false);
    set("Complete all 7 Genesis Event days to unlock eligibility verification.","VERIFY ELIGIBILITY",true);
  }
  async function verify(){
    const i=initData();
    if(!i)return set("Open Goalkeeper inside Telegram to verify your Genesis profile.","OPEN IN TELEGRAM",true);
    set("Checking your 7-day Genesis achievement…","VERIFYING…",true);
    try{
      const r=await fetch(ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({initData:i,action:"badge"})});
      const j=await r.json();
      if(!j.ok||!j.eligible)return set("Server verification did not confirm eligibility yet.","TRY AGAIN",false);
      localStorage.setItem(ELIGIBLE_KEY,"1");
      if(j.claimed)localStorage.setItem(BADGE_KEY,"1");
      localStorage.setItem(VERIFY_KEY,new Date().toISOString());
      set("Eligibility verified. NFT minting is disabled until the Goalkeeper Genesis collection is deployed on TON Testnet.","DEPLOYMENT PENDING",true);
      window.dispatchEvent(new CustomEvent("goalkeeper:mission",{detail:{message:"Genesis Keeper eligibility server-verified for testnet NFT claim."}}));
    }catch(e){console.warn("Genesis NFT verification:",e);set("Verification service is unavailable. Try again later.","TRY AGAIN",false)}
  }
  function init(){refresh();document.getElementById(BTN_ID)?.addEventListener("click",verify);window.addEventListener("goalkeeper:mission",refresh);setInterval(refresh,5000)}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();