# Observability

The gateway emits structured request logs and propagates request IDs.

OpenTelemetry is a strong production extension for distributed traces and metrics. The current OpenTelemetry JavaScript documentation supports Node.js instrumentation and Express instrumentation.

Recommended signals:
- request rate
- latency percentiles
- gateway/upstream error rate
- rate-limit rejections
- authentication failures
- saturation
- distributed traces
