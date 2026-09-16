const ABI = [
  "function projectCount() view returns (uint256)",
  "function proposalCount() view returns (uint256)",
  "function projectsByBuilder(address) view returns (uint256)",
  "function getProject(uint256) view returns (uint256 id,address builder,string name,string description,string link,uint256 createdAt)",
  "function getProposal(uint256) view returns (uint256 id,address creator,string title,string description,uint256 yesVotes,uint256 noVotes,uint256 createdAt)",
  "function registerProject(string name,string description,string link)",
  "function createProposal(string title,string description)",
  "function vote(uint256 proposalId,bool support)",
  "function proposalVoted(uint256,address) view returns (bool)"
];

let provider;
let signer;
let contract;
let account;

const $ = (id) => document.getElementById(id);

function setStatus(message, good = false) {
  $("status").textContent = message;
  $("status").className = good ? "status good" : "status";
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
  }[c]));
}

function safeLink(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function requireConfigured() {
  if (!window.APP_CONFIG?.contractAddress) {
    throw new Error("Configure contractAddress in frontend/config.js first.");
  }
}

async function connect() {
  try {
    requireConfigured();
    if (!window.ethereum) throw new Error("No browser wallet detected.");

    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    account = await signer.getAddress();
    contract = new ethers.Contract(window.APP_CONFIG.contractAddress, ABI, signer);

    const network = await provider.getNetwork();
    const configured = window.APP_CONFIG.chainId;
    if (configured && network.chainId.toString() !== String(configured)) {
      setStatus(`Wrong network. Connected chain ID: ${network.chainId}`);
      return;
    }

    $("connectBtn").textContent = `${account.slice(0, 6)}...${account.slice(-4)}`;
    setStatus(`Connected • Chain ${network.chainId}`, true);
    await refresh();
  } catch (error) {
    setStatus(error.shortMessage || error.message || "Connection failed.");
  }
}

async function refresh() {
  if (!contract) return;

  const [projects, proposals, mine] = await Promise.all([
    contract.projectCount(),
    contract.proposalCount(),
    contract.projectsByBuilder(account)
  ]);

  $("projectCount").textContent = projects.toString();
  $("proposalCount").textContent = proposals.toString();
  $("yourProjects").textContent = mine.toString();

  await Promise.all([renderProjects(Number(projects)), renderProposals(Number(proposals))]);
}

async function renderProjects(count) {
  const root = $("projects");
  if (!count) {
    root.innerHTML = '<div class="empty">No projects registered yet.</div>';
    return;
  }

  const rows = [];
  for (let id = count; id >= 1; id--) {
    const p = await contract.getProject(id);
    const link = safeLink(p.link);
    rows.push(`<article class="item">
      <div><span class="badge">#${p.id}</span><h3>${escapeHtml(p.name)}</h3></div>
      <p>${escapeHtml(p.description)}</p>
      <small>Builder: ${escapeHtml(p.builder)}</small>
      ${link ? `<a href="${escapeHtml(link)}" target="_blank" rel="noopener">Open project</a>` : ""}
    </article>`);
  }
  root.innerHTML = rows.join("");
}

async function renderProposals(count) {
  const root = $("proposals");
  if (!count) {
    root.innerHTML = '<div class="empty">No proposals yet.</div>';
    return;
  }

  const rows = [];
  for (let id = count; id >= 1; id--) {
    const p = await contract.getProposal(id);
    const alreadyVoted = await contract.proposalVoted(id, account);
    rows.push(`<article class="item">
      <div><span class="badge">#${p.id}</span><h3>${escapeHtml(p.title)}</h3></div>
      <p>${escapeHtml(p.description)}</p>
      <div class="votes">YES ${p.yesVotes} · NO ${p.noVotes}</div>
      <div class="actions">
        <button ${alreadyVoted ? "disabled" : ""} onclick="voteProposal(${id}, true)">Vote Yes</button>
        <button class="secondary" ${alreadyVoted ? "disabled" : ""} onclick="voteProposal(${id}, false)">Vote No</button>
      </div>
      ${alreadyVoted ? '<small>You already voted on this proposal.</small>' : ''}
    </article>`);
  }
  root.innerHTML = rows.join("");
}

async function voteProposal(id, support) {
  try {
    const tx = await contract.vote(id, support);
    setStatus(`Voting transaction submitted: ${tx.hash.slice(0, 12)}...`);
    await tx.wait();
    setStatus("Vote confirmed.", true);
    await refresh();
  } catch (error) {
    setStatus(error.shortMessage || error.message || "Vote failed.");
  }
}

$("connectBtn").addEventListener("click", connect);
$("refreshBtn").addEventListener("click", () => refresh().catch((e) => setStatus(e.message)));

$("projectForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    requireConfigured();
    if (!contract) await connect();
    const name = $("projectName").value.trim();
    const description = $("projectDescription").value.trim();
    const link = $("projectLink").value.trim();
    if (link && !safeLink(link)) throw new Error("Use a valid http/https URL.");

    const tx = await contract.registerProject(name, description, link);
    setStatus("Project transaction submitted...");
    await tx.wait();
    event.target.reset();
    setStatus("Project registered.", true);
    await refresh();
  } catch (error) {
    setStatus(error.shortMessage || error.message || "Project registration failed.");
  }
});

$("proposalForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    requireConfigured();
    if (!contract) await connect();
    const title = $("proposalTitle").value.trim();
    const description = $("proposalDescription").value.trim();
    const tx = await contract.createProposal(title, description);
    setStatus("Proposal transaction submitted...");
    await tx.wait();
    event.target.reset();
    setStatus("Proposal created.", true);
    await refresh();
  } catch (error) {
    setStatus(error.shortMessage || error.message || "Proposal creation failed.");
  }
});

window.voteProposal = voteProposal;
