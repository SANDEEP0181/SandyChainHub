# Community Hub API

Base path: `/api`

## Public endpoints
- `GET /health` — service status and configuration flags.
- `GET /posts?page=1&limit=10` — published community posts.
- `GET /posts/:postId/comments` — published comments.
- `GET /listings` — published directory listings.
- `GET /courses` — published learning courses.
- `GET /courses/:courseId/lessons` — lesson content.

## Identity-protected endpoints
These return 503 until the InterLink verification configuration is complete. In local development only, `DEV_AUTH_ENABLED=true` permits a test identity via `x-dev-user-id`. This mode is rejected in production.
- `POST /posts`
- `POST /posts/:postId/comments`
- `POST /posts/:postId/likes`
- `POST /reports`
- `POST /inquiries` — disabled with HTTP 403; direct contact is not part of this release.
- `POST /learning/progress`

For production, configure the issuer, audience and JWKS URL confirmed by InterLink for the registered App ID. The API verifies the JWT signature and claims before mapping the external subject to a local profile. Do not trust client-supplied user IDs.

## Admin endpoints
- `GET /admin/reports`
- `PATCH /admin/reports/:reportId`

Send `x-admin-token` with the secret configured as `ADMIN_API_TOKEN`. Keep the secret only in server-side environment variables. Never expose it to browser code.

## Data model
Prisma models cover users, posts, comments, likes, reports, directory listings, enquiries, courses, lessons, learning progress, notifications and moderation audit records.

## Error behavior
- 400: invalid request
- 401: sign-in or admin authorization required
- 404: resource not found
- 409: duplicate action
- 503: identity provider not configured
- 500: generic server error (details are not exposed in production)
