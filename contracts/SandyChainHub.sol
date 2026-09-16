// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title SandyChainHub
/// @notice Lightweight testnet-only builder registry and community proposal hub.
/// @dev No token, custody, payment, or investment functionality is included.
contract SandyChainHub {
    struct Project {
        uint256 id;
        address builder;
        string name;
        string description;
        string link;
        uint256 createdAt;
    }

    struct Proposal {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 createdAt;
    }

    uint256 public projectCount;
    uint256 public proposalCount;

    mapping(uint256 => Project) public projects;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256) public projectsByBuilder;
    mapping(uint256 => mapping(address => bool)) public proposalVoted;

    event ProjectRegistered(uint256 indexed projectId, address indexed builder, string name);
    event ProposalCreated(uint256 indexed proposalId, address indexed creator, string title);
    event ProposalVoted(uint256 indexed proposalId, address indexed voter, bool support);

    function registerProject(
        string calldata name,
        string calldata description,
        string calldata link
    ) external {
        require(bytes(name).length > 0, "Name required");

        projectCount++;
        projects[projectCount] = Project({
            id: projectCount,
            builder: msg.sender,
            name: name,
            description: description,
            link: link,
            createdAt: block.timestamp
        });

        projectsByBuilder[msg.sender]++;
        emit ProjectRegistered(projectCount, msg.sender, name);
    }

    function createProposal(
        string calldata title,
        string calldata description
    ) external {
        require(bytes(title).length > 0, "Title required");

        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            creator: msg.sender,
            title: title,
            description: description,
            yesVotes: 0,
            noVotes: 0,
            createdAt: block.timestamp
        });

        emit ProposalCreated(proposalCount, msg.sender, title);
    }

    function vote(uint256 proposalId, bool support) external {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal");
        require(!proposalVoted[proposalId][msg.sender], "Already voted");

        proposalVoted[proposalId][msg.sender] = true;

        if (support) {
            proposals[proposalId].yesVotes++;
        } else {
            proposals[proposalId].noVotes++;
        }

        emit ProposalVoted(proposalId, msg.sender, support);
    }

    function getProject(uint256 projectId) external view returns (Project memory) {
        require(projectId > 0 && projectId <= projectCount, "Invalid project");
        return projects[projectId];
    }

    function getProposal(uint256 proposalId) external view returns (Proposal memory) {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal");
        return proposals[proposalId];
    }
}
