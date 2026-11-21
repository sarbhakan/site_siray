/** Crop settings shared by all public photo slots. Zoom is optional for old content. */
export function validatePhotoZoom(value: unknown): number {
  if (value === undefined) return 1;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 1 || value > 2) {
    throw new Error('Le rapprochement d’une photographie doit être un nombre entre 1 et 2.');
  }
  return value;
}

/** Only allow percentage positions in generated style attributes. */
export function photoPosition(value: unknown): string {
  const match = typeof value === 'string' && value.trim().match(/^(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);
  if (!match) return '50% 50%';
  return `${Math.min(100, Number(match[1]))}% ${Math.min(100, Number(match[2]))}%`;
}

export function photoCropStyle(position: unknown, zoom?: unknown): string {
  const point = photoPosition(position);
  const magnification = validatePhotoZoom(zoom);
  // Individual scale composes with the existing hover transform rather than replacing it.
  return `object-position:${point};transform-origin:${point};scale:${magnification}`;
}
