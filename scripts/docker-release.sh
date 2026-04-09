#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="cmmrox/customer-feedback"
VERSION="${1:-$(node -p "require('./package.json').version")}" 
PLATFORMS="${PLATFORMS:-}"

if [[ -z "$VERSION" ]]; then
  echo "Unable to determine version" >&2
  exit 1
fi

EXACT_TAG="$IMAGE_NAME:$VERSION"
LATEST_TAG="$IMAGE_NAME:latest"

echo "==> Building Docker image"
echo "Image:   $IMAGE_NAME"
echo "Version: $VERSION"

if [[ -n "$PLATFORMS" ]]; then
  docker buildx build \
    --platform "$PLATFORMS" \
    --tag "$EXACT_TAG" \
    --tag "$LATEST_TAG" \
    --push \
    .
else
  docker build -t "$EXACT_TAG" .
  docker tag "$EXACT_TAG" "$LATEST_TAG"

  echo "==> Pushing $EXACT_TAG"
  docker push "$EXACT_TAG"

  echo "==> Pushing $LATEST_TAG"
  docker push "$LATEST_TAG"
fi

echo "==> Done"
echo "Published tags:"
echo " - $EXACT_TAG"
echo " - $LATEST_TAG"
