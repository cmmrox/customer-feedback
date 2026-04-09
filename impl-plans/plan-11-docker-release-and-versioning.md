# Plan 11 — Docker Release and Versioning

## Goal
Prepare the customer-feedback application for production image publishing to Docker Hub and compose-based deployment using pulled images instead of local builds.

## Release targets
- cmmrox/customer-feedback:latest
- cmmrox/customer-feedback:1.0.0

## Strategy
- Use package.json as the canonical application version source
- Upgrade the project version to 1.0.0
- Harden the Dockerfile for production runtime
- Convert docker-compose-app.yml into a pull-based deployment manifest
- Add a small repeatable release script for future version management
- Document build, tag, push, and deploy workflow in README

## Stages

### Stage 01 — Inspect current container setup
- review Dockerfile, compose, env usage, and current version
- identify runtime gaps for Next.js + Prisma in Docker

### Stage 02 — Define versioning approach
- set package.json version to 1.0.0
- use semantic versioning as the future release policy
- document exact tag and latest tag expectations

### Stage 03 — Harden Dockerfile
- install dependencies with deterministic build behavior
- generate Prisma client during image build
- build Next.js app in a dedicated builder stage
- create a smaller production runtime image
- ensure uploaded file path works with mounted storage

### Stage 04 — Convert compose to image-pull deployment
- change compose app service from local build to Docker Hub image reference
- preserve environment variables and persistent upload volume
- make version tag configurable via compose env substitution

### Stage 05 — Add release automation
- add a release script that reads version from package.json
- build one image and tag both exact version and latest
- optionally support dry future releases without rewriting commands manually

### Stage 06 — Documentation and operational notes
- update README with Docker build/push/pull/deploy flow
- explain future version bump process
- document production compose usage

### Stage 07 — Validation and publish
- run type/build validation if needed
- build Docker image locally on the MacBook
- tag and push latest and 1.0.0 to Docker Hub
- verify pushed tags are available locally/remotely where possible
