# Architecture

```text
Client
  |
  v
Gateway
  |-- security headers
  |-- CORS
  |-- request ID
  |-- rate limiting
  |-- JWT verification
  |-- routing
  |-- timeout/error translation
  |
  +--> Task Service
  +--> User Service
  +--> AI Service
```

The gateway is an edge service, not a business-domain service. Downstream services remain responsible for resource-level authorization and domain rules.
