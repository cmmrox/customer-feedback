require('ts-node/register/transpile-only');
const assert = require('node:assert/strict');
const { adminStaffListQuerySchema, staffMutationSchema } = require('./src/lib/staff-validation');

const parsedList = adminStaffListQuerySchema.parse({ search: '  Cashier  ', status: 'active' });
assert.equal(parsedList.search, 'Cashier');
assert.equal(parsedList.status, 'active');

const emptyQuery = adminStaffListQuerySchema.parse({ search: '', status: '' });
assert.equal(emptyQuery.search, undefined);
assert.equal(emptyQuery.status, undefined);

const validStaff = staffMutationSchema.parse({
  name: 'Prasanna Walukumara',
  position: 'Sales Assistant',
  contactInfo: 'prasanna@example.com',
  status: true,
  imageUrl: '/uploads/staff/abc.jpg',
  cropLabel: 'Centered face crop',
});
assert.equal(validStaff.name, 'Prasanna Walukumara');
assert.equal(validStaff.position, 'Sales Assistant');

assert.throws(() => staffMutationSchema.parse({ name: '', status: true }), /Name is required/);

console.log('staff-validation tests passed');
