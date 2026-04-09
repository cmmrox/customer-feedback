# Log 11 — Docker Release and Versioning

## What was implemented
- Upgraded the application version from `0.1.0` to `1.0.0`
- Added `impl-plans/plan-11-docker-release-and-versioning.md`
- Reworked the `Dockerfile` into a production-oriented multi-stage build
- Updated `docker-compose-app.yml` to pull from Docker Hub using `APP_IMAGE_TAG` instead of building locally
- Added persistent uploads volume mapping for `/app/uploads`
- Added `scripts/docker-release.sh` to build, tag, and push both the exact semver tag and `latest`
- Updated `README.md` with Docker release, compose deployment, and version-management instructions

## Validation
- `docker build -t cmmrox/customer-feedback:1.0.0 .` ✅
- Container smoke run on port `3001` ✅
- Image tagged as `cmmrox/customer-feedback:latest` locally ✅

## Publish status
- Push attempt was made for:
  - `cmmrox/customer-feedback:1.0.0`
  - `cmmrox/customer-feedback:latest`
- Push is currently blocked by Docker Hub authorization:
  - `insufficient_scope: authorization failed`

## Follow-up needed
- Run `docker login` on the MacBook with the correct Docker Hub account that owns `cmmrox/customer-feedback`
- Re-run:
  - `cd /Users/cmmrox/Personal/Projects/customer-feedback`
  - `./scripts/docker-release.sh 1.0.0`

## Notes
- Current Dockerfile uses `npm install` in the image build instead of `npm ci` because the lockfile state was not compatible with the container npm resolver during release validation
- Existing Next.js warning about `<img>` in the admin staff page remains unrelated to Docker release work
