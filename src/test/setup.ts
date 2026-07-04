import { beforeAll, afterAll } from 'vitest';

// Global test setup
beforeAll(async () => {
  // Setup test database or mocks here
  console.log('Test suite starting');
});

afterAll(async () => {
  // Cleanup after tests
  console.log('Test suite completed');
});
