# API Gateway Reference

![CI](https://img.shields.io/github/actions/workflow/status/WisemanTsusi/api-gateway-reference/ci.yml?branch=main&label=CI&logo=githubactions&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)

A generic **Node.js + TypeScript API Gateway reference implementation** demonstrating the edge layer between clients and backend services.

This is portfolio/reference code. It contains no proprietary Ceribro™, Genius Geeks, employer, or client source code.

## Demonstrates

- API gateway routing and service registry
- API versioning
- JWT verification at the edge
- Request-ID propagation
- Rate limiting
- CORS and security headers
- Proxy forwarding
- Upstream timeout/error handling
- Health/readiness endpoints
- Structured logging
- OpenTelemetry-ready observability
- Tests, Docker and GitHub Actions CI

## Architecture

```text
Clients
   |
   v
+---------------------------+
|       API Gateway         |
|---------------------------|
| TLS / CORS / Helmet       |
| Request ID                |
| Rate limiting             |
| JWT verification          |
| Routing / versioning      |
| Timeout / error mapping   |
+------------+--------------+
             |
      +------+------+------+
      v             v      v
 Task Service   User Service AI Service
```

## Routes

| Gateway route | Upstream |
|---|---|
| `/api/v1/tasks/*` | Task service |
| `/api/v1/users/*` | User service |
| `/api/v1/ai/*` | AI service |
| `/health` | Gateway |
| `/ready` | Gateway |

## Start

```bash
npm install
cp .env.example .env
npm run dev
```

Gateway: `http://localhost:4000`

```bash
npm test
npm run build
```

Protected routes require a bearer token signed with the configured `JWT_SECRET`.

## Design principle

The gateway handles **edge concerns**, not business-domain logic.

Good gateway responsibilities include authentication, routing, throttling, request correlation, coarse policy enforcement, timeout handling and observability. Domain authorization and business rules remain inside the owning services.

## Rate limiting

The example uses an in-process token-bucket limiter. A horizontally scaled production deployment should use a distributed limiter or managed gateway policy.

## Observability

The project emits structured logs and propagates request IDs. OpenTelemetry is a natural production extension for distributed traces and metrics. Current OpenTelemetry JavaScript documentation supports Node.js and Express instrumentation.

## Production security

Add OIDC/JWKS validation, asymmetric key rotation, distributed rate limiting, WAF policy, strict CORS, request limits, secret management, SSRF protections, service identity/mTLS where appropriate, audit logging and dependency/container scanning.

## Cloud mapping

```text
AWS:   CloudFront/WAF -> API Gateway/ALB -> ECS/EKS -> services
Azure: Front Door/WAF -> API Management -> AKS/Container Apps
GCP:   Cloud Armor -> API Gateway/Load Balancer -> GKE/Cloud Run
```

The code remains provider-neutral while the deployment edge can use native cloud services.

## Portfolio relevance

API architecture • enterprise integration • SaaS platforms • microservices • AI infrastructure • security boundaries • cloud-native systems.

## License

MIT.
