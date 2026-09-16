# Security notes

This repository is an MVP intended for testnet experimentation and code review.

## Current protections

- No private keys or wallet secrets are handled by the frontend.
- No token issuance or fund custody exists in the contract.
- Project and proposal identifiers are checked before reads/votes.
- A wallet can vote only once on each proposal.
- Basic empty-name/title validation is included.
- Frontend project links are limited to HTTP/HTTPS URLs.

## Before production use

- Perform a professional smart-contract security review/audit.
- Add explicit proposal lifecycle rules if required.
- Consider access-control and moderation requirements.
- Consider pagination/indexing for large project/proposal counts.
- Verify the target network and deployment configuration from current official documentation.
- Do not use this MVP as a financial product or promise of returns.
