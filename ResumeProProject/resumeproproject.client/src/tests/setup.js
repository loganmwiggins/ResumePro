import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Add jest-dom matcher methods
expect.extend(matchers);

// Perform clean up after each test
afterEach(() => cleanup());