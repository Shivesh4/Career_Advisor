// tests/setupTests.js
import { jest } from "@jest/globals";

// Stable env for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.PORT = process.env.PORT || "0";
process.env.MAX_UPLOAD_BYTES = process.env.MAX_UPLOAD_BYTES || String(2 * 1024 * 1024);

// Quiet noisy error logs from intentional error-path tests
const _origError = console.error;
beforeAll(() => { console.error = jest.fn(); });
afterAll(() => { console.error = _origError; });

// Reset mocks between tests
afterEach(() => {
  jest.clearAllMocks();
  // Some libs set timeouts/intervals; this helps avoid lingering handles
  jest.useRealTimers();
});

// Provide a handy req/res/next triple for controller tests
export function mockReqRes({ body = {}, params = {}, query = {}, headers = {}, user = {} } = {}) {
  const req = { body, params, query, headers, user };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
    set: jest.fn().mockReturnThis(),
    end: jest.fn(),
    type: jest.fn().mockReturnThis(),
    sendStatus: jest.fn(),
    jsonp: jest.fn(),
  };
  const next = jest.fn();
  return { req, res, next };
}
