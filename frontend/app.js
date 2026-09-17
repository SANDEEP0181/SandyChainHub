let provider = null;
let signer = null;
let contract = null;
let currentAccount = "";
let isCurrentMember = false;

const ABI = [
  "function founder() view returns (address)",
  "function MEMBERSHIP_FEE() view returns (uint256)",
  "function projectCount() view returns (uint256)",
  "function memberCount() view returns (uint256)",
  "function proposalCount() view returns (uint256)",
  "function projectsByBuilder(address) view returns (uint256)",
  "function isMember(address) view returns (bool)",
  "function getProject(uint256) view returns (uint256,address,string,string,string,uint256)",
  "function getProposal(uint256) view returns (uint256,address,string,string,uint256,uint256,uint256)",
  "function proposalVoted(uint256,address) view returns (bool)",
  "function registerProject(string,string,string)",
  "function joinCommunity() payable",
  "function createProposal(string,string)",
  "function vote(uint256,bool)"
];

const $ = (id) => document.getElementById(id);

function shortAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function setStatus(message) {
  const el = $("walletStatus");
  if (el) el.textContent = message;
}

function setMembershipStatus(message) {
  const el = $("membershipStatus");
  if (el) el.textContent = message;
}

function getInjectedProvider() {
  if (window.ethereum) return window.ethereum;
  if (window.parent && window.parent.ethereum) return window.parent.ethereum;
  if (window.top && window.top.ethereum) return window.top.ethereum;
  return null;
}

function requireWallet() {
  if (!signer || !contract || !currentAccount) {
    alert("पहले Test Wallet connect करें और SYSFI Testnet पर जाएँ।");
    return false;
  }
  return true;
}

async function connect() {
  try {
    const ethereum = getInjectedProvider();

    if (!ethereum) {
      alert("Compatible Web3 test wallet नहीं मिला। MetaMask के Explore browser में page खोलें।");
      return false;
    }

    if (!window.APP_CONFIG || !window.APP_CONFIG.contractAddress) {
      setStatus("Contract deployment pending — wallet actions अभी बंद हैं।");
      alert("SYSFI testnet contract अभी configure नहीं हुआ है।");
      return false;
    }

    provider = new ethers.BrowserProvider(ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    currentAccount = await signer.getAddress();

    const network = await provider.getNetwork();
    const requiredChainId = Number(window.APP_CONFIG.chainId || 76081);

    if (Number(network.chainId) !== requiredChainId) {
      setStatus(`Wrong network — Required Chain ID: ${requiredChainId}`);
      alert(`Wrong network.\nConnected: ${network.chainId}\nRequired: ${requiredChainId}`);
      return false;
    }

    contract = new ethers.Contract(window.APP_CONFIG.contractAddress, ABI, signer);

    $("connectBtn").textContent = `Connected ${shortAddress(currentAccount)}`;
    setStatus(`Wallet connected: ${shortAddress(currentAccount)} · SYSFI Testnet`);

    await refresh();
    return true;
  } catch (error) {
    console.error(error);
    setStatus("Wallet connection failed");
    alert(error?.shortMessage || error?.message || "Wallet connection failed.");
    return false;
  }
}

async function refresh() {
  if (!contract || !currentAccount) return;

  try {
    const [projects, members, proposals, mine, member, founder, fee] = await Promise.all([
      contract.projectCount(),
      contract.memberCount(),
      contract.proposalCount(),
      contract.projectsByBuilder(currentAccount),
      contract.isMember(currentAccount),
      contract.founder(),
      contract.MEMBERSHIP_FEE()
    ]);

    isCurrentMember = member;
    $("projectCount").textContent = projects.toString();
    $("memberCount").textContent = members.toString();
    $("proposalCount").textContent = proposals.toString();
    $("yourProjectCount").textContent = mine.toString();
    $("membershipFee").textContent = `${ethers.formatEther(fee)} SYSFI Testnet`;
    $("founderAddress").textContent = shortAddress(founder);
    const contractAddressEl = $("contractAddress");
    if (contractAddressEl) {
      contractAddressEl.textContent = shortAddress(window.APP_CONFIG.contractAddress);
      contractAddressEl.href = `${window.APP_CONFIG.explorerBaseUrl}/address/${window.APP_CONFIG.contractAddress}`;
    }

    const joinBtn = $("joinBtn");
    if (member) {
      setMembershipStatus("✓ आप Community Member हैं। Proposal create और vote access enabled है।");
      joinBtn.textContent = "Community Member ✓";
      joinBtn.disabled = true;
    } else {
      setMembershipStatus("आप अभी member नहीं हैं। Join Community से testnet membership लें।");
      joinBtn.textContent = `Join Community — ${ethers.formatEther(fee)} SYSFI`;
      joinBtn.disabled = false;
    }

    await Promise.all([loadProjects(), loadProposals()]);
  } catch (error) {
    console.error(error);
    setStatus("Dashboard data load नहीं हो पाया");
  }
}

async function joinCommunity() {
  if (!requireWallet()) return;
  if (isCurrentMember) return;

  const button = $("joinBtn");
  try {
    button.disabled = true;
    button.textContent = "Confirming testnet transaction...";
    const fee = await contract.MEMBERSHIP_FEE();
    const tx = await contract.joinCommunity({ value: fee });
    setMembershipStatus("Transaction submitted. Confirmation का इंतजार है...");
    await tx.wait();
    setMembershipStatus("✓ Membership सफलतापूर्वक activate हो गई।");
    await refresh();
  } catch (error) {
    console.error(error);
    button.disabled = false;
    button.textContent = "Join Community — Testnet";
    setMembershipStatus(error?.shortMessage || error?.reason || "Membership transaction failed.");
  }
}

async function registerProject(name, description, link) {
  if (!requireWallet()) return;
  const tx = await contract.registerProject(name.trim(), description.trim(), link.trim());
  await tx.wait();
}

async function createProposal(title, description) {
  if (!requireWallet()) return;
  if (!isCurrentMember) {
    alert("Proposal create करने के लिए पहले Community Member बनें।");
    return;
  }
  const tx = await contract.createProposal(title.trim(), description.trim());
  await tx.wait();
}

async function loadProjects() {
  const list = $("projectsList");
  if (!contract) return;

  try {
    const count = Number(await contract.projectCount());
    if (count === 0) {
      list.innerHTML = '<div class="empty">No projects registered yet.</div>';
      return;
    }

    const items = [];
    for (let i = count; i >= 1; i--) {
      const p = await contract.getProject(i);
      items.push(`
        <div class="item">
          <strong>${escapeHtml(p[2])}</strong>
          <p>${escapeHtml(p[3])}</p>
          <small>Builder: ${shortAddress(p[1])}</small>
          <br><a href="${safeUrl(p[4])}" target="_blank" rel="noopener noreferrer">Open project</a>
        </div>
      `);
    }
    list.innerHTML = items.join("");
  } catch (error) {
    console.error(error);
    list.innerHTML = '<div class="empty">Projects load नहीं हो पाए।</div>';
  }
}

async function loadProposals() {
  const list = $("proposalsList");
  if (!contract) return;

  try {
    const count = Number(await contract.proposalCount());
    if (count === 0) {
      list.innerHTML = '<div class="empty">No proposals created yet.</div>';
      return;
    }

    const items = [];
    for (let i = count; i >= 1; i--) {
      const p = await contract.getProposal(i);
      const voted = currentAccount ? await contract.proposalVoted(i, currentAccount) : false;
      const disabled = !isCurrentMember || voted ? "disabled" : "";
      const note = voted ? "आप vote कर चुके हैं।" : (!isCurrentMember ? "Member access required." : "");

      items.push(`
        <div class="item">
          <strong>${escapeHtml(p[2])}</strong>
          <p>${escapeHtml(p[3])}</p>
          <small>Yes: ${p[4].toString()} · No: ${p[5].toString()} · Creator: ${shortAddress(p[1])}</small>
          <div class="vote-row">
            <button type="button" ${disabled} onclick="voteProposal(${i}, true)">Vote Yes</button>
            <button type="button" ${disabled} onclick="voteProposal(${i}, false)">Vote No</button>
          </div>
          <small>${note}</small>
        </div>
      `);
    }
    list.innerHTML = items.join("");
  } catch (error) {
    console.error(error);
    list.innerHTML = '<div class="empty">Proposals load नहीं हो पाए।</div>';
  }
}

async function voteProposal(id, support) {
  if (!requireWallet()) return;
  if (!isCurrentMember) {
    alert("Vote करने के लिए पहले Community Member बनें।");
    return;
  }

  try {
    const tx = await contract.vote(id, support);
    await tx.wait();
    await refresh();
  } catch (error) {
    console.error(error);
    alert(error?.shortMessage || error?.reason || "Vote transaction failed.");
  }
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") return escapeHtml(url.href);
  } catch (_) {}
  return "#";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.connect = connect;
window.joinCommunity = joinCommunity;
window.voteProposal = voteProposal;

window.addEventListener("DOMContentLoaded", () => {
  if (window.APP_CONFIG?.contractAddress) {
    const contractAddressEl = $("contractAddress");
    if (contractAddressEl) {
      contractAddressEl.textContent = shortAddress(window.APP_CONFIG.contractAddress);
      contractAddressEl.href = `${window.APP_CONFIG.explorerBaseUrl}/address/${window.APP_CONFIG.contractAddress}`;
    }
  }

  $("projectForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = event.target.querySelector("button[type='submit']");
    try {
      button.disabled = true;
      button.textContent = "Submitting...";
      await registerProject($("projectName").value, $("projectDescription").value, $("projectLink").value);
      event.target.reset();
      await refresh();
      alert("Project successfully registered on SYSFI Testnet.");
    } catch (error) {
      console.error(error);
      alert(error?.shortMessage || error?.reason || "Project registration failed.");
    } finally {
      button.disabled = false;
      button.textContent = "Register Project";
    }
  });

  $("proposalForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = event.target.querySelector("button[type='submit']");
    try {
      button.disabled = true;
      button.textContent = "Submitting...";
      await createProposal($("proposalTitle").value, $("proposalDescription").value);
      event.target.reset();
      await refresh();
      alert("Proposal successfully created on SYSFI Testnet.");
    } catch (error) {
      console.error(error);
      alert(error?.shortMessage || error?.reason || "Proposal creation failed.");
    } finally {
      button.disabled = false;
      button.textContent = "Create Proposal";
    }
  });
});
