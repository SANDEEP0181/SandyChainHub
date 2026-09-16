
let provider = null;
let signer = null;
let contract = null;
let currentAccount = "";

const ABI = [
  "function projectCount() view returns (uint256)",
  "function proposalCount() view returns (uint256)",
  "function projectsByBuilder(address) view returns (uint256)",
  "function getProject(uint256) view returns (uint256,address,string,string,string,uint256)",
  "function getProposal(uint256) view returns (uint256,address,string,string,uint256,uint256,uint256)",
  "function proposalVoted(uint256,address) view returns (bool)",
  "function registerProject(string,string,string)",
  "function createProposal(string,string)",
  "function vote(uint256,bool)"
];

const $ = (id) => document.getElementById(id);

function shortAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function setStatus(message) {
  const old = $("walletStatus");
  if (old) {
    old.textContent = message;
  }
}

async function connect() {
  try {
    if (!window.ethereum) {
      alert("No Web3 wallet detected. Please install a compatible test wallet.");
      return false;
    }

    if (!window.APP_CONFIG.contractAddress) {
      alert("Testnet contract is not configured yet.");
      return false;
    }

    provider = new ethers.BrowserProvider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    signer = await provider.getSigner();
    currentAccount = await signer.getAddress();

    const network = await provider.getNetwork();

    if (
      window.APP_CONFIG.chainId &&
      Number(network.chainId) !== Number(window.APP_CONFIG.chainId)
    ) {
      alert(
        `Wrong network.\nConnected Chain ID: ${network.chainId}\nRequired