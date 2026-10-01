# Security

Included: security headers, CORS configuration, request limits, bearer-token verification, rate limiting, request IDs and upstream timeout/error handling.

Production hardening: OIDC/JWKS, asymmetric key rotation, distributed rate limiting, WAF, strict CORS, SSRF controls, service identity/mTLS where appropriate, secret management, audit logging and dependency/container scanning.

A gateway should not be the only authorization boundary; downstream services should independently protect their resources.
