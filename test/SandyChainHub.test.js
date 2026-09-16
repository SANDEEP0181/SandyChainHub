const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SandyChainHub", function () {
  async function deployHub() {
    const Factory = await ethers.getContractFactory("SandyChainHub");
    const hub = await Factory.deploy();
    await hub.waitForDeployment();
    return hub;
  }

  async function join(hub, member) {
    const fee = await hub.MEMBERSHIP_FEE();
    await hub.connect(member).joinCommunity({ value: fee });
  }

  it("sets the deployer as founder", async function () {
    const hub = await deployHub();
    const [founder] = await ethers.getSigners();
    expect(await hub.founder()).to.equal(founder.address);
    expect(await hub.SYSFI_TESTNET_CHAIN_ID()).to.equal(76081n);
    expect(await hub.MEMBERSHIP_FEE()).to.equal(ethers.parseEther("0.01"));
  });

  it("joins the community with the exact testnet membership fee", async function () {
    const hub = await deployHub();
    const [, member] = await ethers.getSigners();
    const fee = await hub.MEMBERSHIP_FEE();

    await expect(hub.connect(member).joinCommunity({ value: fee }))
      .to.emit(hub, "CommunityJoined")
      .withArgs(member.address, fee, await latestTimestamp());

    expect(await hub.isMember(member.address)).to.equal(true);
    expect(await hub.memberCount()).to.equal(1n);
  });

  it("registers a project", async function () {
    const hub = await deployHub();
    const [builder] = await ethers.getSigners();

    await expect(
      hub.registerProject(
        "SandyChain Hub",
        "A builder and community registry MVP.",
        "https://github.com/SANDEEP0181/SandyChainHub"
      )
    ).to.emit(hub, "ProjectRegistered");

    expect(await hub.projectCount()).to.equal(1n);
    expect(await hub.projectsByBuilder(builder.address)).to.equal(1n);

    const project = await hub.getProject(1);
    expect(project.builder).to.equal(builder.address);
    expect(project.name).to.equal("SandyChain Hub");
  });

  it("requires membership before creating a proposal", async function () {
    const hub = await deployHub();
    await expect(
      hub.createProposal("Members only", "Membership is required.")
    ).to.be.revertedWith("Join community first");
  });

  it("creates a proposal and records yes/no votes for members", async function () {
    const hub = await deployHub();
    const [creator, voter] = await ethers.getSigners();

    await join(hub, creator);
    await join(hub, voter);

    await hub.createProposal("Add project categories", "Add simple categories to the registry.");

    await hub.vote(1, true);
    await hub.connect(voter).vote(1, false);

    const proposal = await hub.getProposal(1);
    expect(proposal.yesVotes).to.equal(1n);
    expect(proposal.noVotes).to.equal(1n);
    expect(await hub.proposalVoted(1, voter.address)).to.equal(true);
  });

  it("prevents the same wallet from voting twice on one proposal", async function () {
    const hub = await deployHub();
    const [member] = await ethers.getSigners();

    await join(hub, member);
    await hub.createProposal("Test duplicate voting", "This proposal is only for the unit test.");
    await hub.vote(1, true);

    await expect(hub.vote(1, false)).to.be.revertedWith("Already voted");
  });

  it("rejects invalid project and proposal ids", async function () {
    const hub = await deployHub();
    const [member] = await ethers.getSigners();

    await join(hub, member);
    await expect(hub.getProject(1)).to.be.revertedWith("Invalid project");
    await expect(hub.getProposal(1)).to.be.revertedWith("Invalid proposal");
    await expect(hub.vote(1, true)).to.be.revertedWith("Invalid proposal");
  });

  async function latestTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }
});
