require('ts-node/register/transpile-only');
const assert = require('node:assert/strict');
const { access } = require('node:fs/promises');
const { saveStaffImageFromDataUrl, removeStaffImageByUrl } = require('./src/lib/file-storage');

const tinyPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wn8n6sAAAAASUVORK5CYII=';

(async () => {
  const result = await saveStaffImageFromDataUrl(tinyPng, 'test-staff');
  assert.ok(result.imageUrl.startsWith('/uploads/staff/test-staff-'));
  assert.ok(result.absolutePath.includes('public/uploads/staff/'));
  await access(result.absolutePath);
  await removeStaffImageByUrl(result.imageUrl);
  console.log('file-storage tests passed');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
