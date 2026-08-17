// jest-dom adds custom matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
// The /vitest entry point extends Vitest's own `expect`, not Jest's.
import '@testing-library/jest-dom/vitest';

// jest-environment-jsdom doesn't expose these globals, but react-router
// depends on them being present.
import {TextEncoder, TextDecoder} from 'util';
global.TextEncoder = global.TextEncoder || TextEncoder;
global.TextDecoder = global.TextDecoder || TextDecoder;
