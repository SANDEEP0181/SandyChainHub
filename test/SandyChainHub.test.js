const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SandyChainHub", function () {
  async function deployHub() {
    const Factory = await ethers.getContractFactory("SandyChainHub");
    const hub = await Factory.deploy();
    await hub.waitForDeployment();
    return hub;
  }

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

  it("creates a proposal and records yes/no votes", async function () {
    const hub = await deployHub();
    const [, voter] = await ethers.getSigners();

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

    await hub.createProposal("Test duplicate voting", "This proposal is only for the unit test.");
    await hub.vote(1, true);

    await expect(hub.vote(1, false)).to.be.revertedWith("Already voted");
  });

  it("rejects invalid project and proposal ids", async function () {
    const hub = await deployHub();

    await expect(hub.getProject(1)).to.be.revertedWith("Invalid project");
    await expect(hub.getProposal(1)).to.be.revertedWith("Invalid proposal");
    await expect(hub.vote(1, true)).to.be.revertedWith("Invalid proposal");
  });
});
