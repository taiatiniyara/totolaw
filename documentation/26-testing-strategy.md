# Testing Strategy

## Overview

This document outlines the recommended testing strategy for Totolaw, covering unit tests, integration tests, and end-to-end tests. While the current codebase does not include automated tests, this guide provides a framework for implementing comprehensive test coverage.

---

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Test Types](#test-types)
- [Recommended Testing Stack](#recommended-testing-stack)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Test Organization](#test-organization)
- [Writing Tests](#writing-tests)
- [Running Tests](#running-tests)
- [Continuous Integration](#continuous-integration)
- [Test Coverage Goals](#test-coverage-goals)

---

## Testing Philosophy

### Core Principles

1. **Test Behavior, Not Implementation** - Focus on what the code does, not how it does it
2. **Maintainable Tests** - Tests should be easy to read and maintain
3. **Fast Feedback** - Tests should run quickly to encourage frequent execution
4. **Realistic Tests** - Tests should simulate real-world usage patterns
5. **Isolated Tests** - Each test should be independent and not rely on others

### Testing Pyramid

```
         /\
        /  \    E2E Tests (10%)
       /    \   - Critical user flows
      /------\  - Authentication
     /        \ - Case creation workflow
    /   INTE  \
   /   GRATION\ Integration Tests (30%)
  /    TESTS   \- API endpoints
 /              \- Database operations
/----------------\
|  UNIT TESTS    | Unit Tests (60%)
|  (Functions,   | - Pure functions
|   Components)  | - Utility functions
|                | - Business logic
------------------
```

---

## Test Types

### 1. Unit Tests

**Purpose:** Test individual functions, components, or modules in isolation

**What to Test:**
- Utility functions
- React components
- Business logic functions
- Data transformations
- Validation functions

**Example:**
```typescript
// lib/utils/case-number-generator.test.ts
describe('generateCaseNumber', () => {
  it('generates HAC case number for High Court Criminal', () => {
    const result = generateCaseNumber('HIGH_COURT', 'CRIMINAL', 2024);
    expect(result).toMatch(/^HAC\s\d{1,3}\/2024$/);
  });
});
```

### 2. Integration Tests

**Purpose:** Test how different modules work together

**What to Test:**
- API endpoints
- Database operations
- Authentication flows
- Server actions
- Data fetching

**Example:**
```typescript
// app/api/cases/__tests__/route.test.ts
describe('POST /api/cases', () => {
  it('creates a new case and returns case ID', async () => {
    const response = await POST({
      title: 'State v. Test',
      courtLevel: 'HIGH_COURT',
      caseType: 'CRIMINAL'
    });
    expect(response.status).toBe(201);
    expect(response.caseId).toBeDefined();
  });
});
```

### 3. End-to-End Tests

**Purpose:** Test complete user workflows from start to finish

**What to Test:**
- Critical user journeys
- Authentication flow
- Case creation workflow
- Hearing scheduling
- Evidence upload

**Example:**
```typescript
// e2e/create-case.spec.ts
test('user can create a new criminal case', async ({ page }) => {
  await page.goto('/dashboard/cases');
  await page.click('text=Create Case');
  await page.fill('[name="title"]', 'State v. John Doe');
  await page.selectOption('[name="courtLevel"]', 'HIGH_COURT');
  await page.selectOption('[name="caseType"]', 'CRIMINAL');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/dashboard\/cases\/\d+/);
  await expect(page.locator('h1')).toContainText('State v. John Doe');
});
```

---

## Recommended Testing Stack

### For Unit & Integration Tests: Vitest

**Why Vitest:**
- ⚡ Fast execution (Vite-powered)
- 🔄 Compatible with Jest APIs
- ✅ Native TypeScript support
- 📦 Zero config for Next.js
- 🎯 Built-in code coverage

**Installation:**
```bash
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom
```

**Configuration (vitest.config.ts):**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

**Setup file (test/setup.ts):**
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

### For E2E Tests: Playwright

**Why Playwright:**
- 🌐 Cross-browser testing (Chromium, Firefox, WebKit)
- 📸 Screenshot and video recording
- 🔄 Auto-waiting for elements
- 🎭 Parallel execution
- 🔍 Powerful selectors

**Installation:**
```bash
npm install --save-dev @playwright/test
npx playwright install
```

**Configuration (playwright.config.ts):**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3441',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3441',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Unit Testing

### Component Testing

**Example: Testing Logo Component**

```typescript
// components/__tests__/logo.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Logo from '../logo';

describe('Logo', () => {
  it('renders with default size', () => {
    render(<Logo />);
    const logo = screen.getByTestId('logo');
    expect(logo).toBeInTheDocument();
  });

  it('applies custom size', () => {
    render(<Logo size="large" />);
    const logo = screen.getByTestId('logo');
    expect(logo).toHaveClass('h-12 w-12');
  });
});
```

### Utility Function Testing

**Example: Testing Case Number Generator**

```typescript
// lib/utils/__tests__/case-number-generator.test.ts
import { describe, it, expect } from 'vitest';
import { generateCaseNumber, validateCaseNumber } from '../case-number-generator';

describe('generateCaseNumber', () => {
  it('generates HAC format for High Court Criminal', () => {
    const caseNumber = generateCaseNumber({
      courtLevel: 'HIGH_COURT',
      caseType: 'CRIMINAL',
      year: 2024,
    });
    expect(caseNumber).toMatch(/^HAC\s\d{1,3}\/2024$/);
  });

  it('generates HBC format for High Court Civil', () => {
    const caseNumber = generateCaseNumber({
      courtLevel: 'HIGH_COURT',
      caseType: 'CIVIL',
      year: 2024,
    });
    expect(caseNumber).toMatch(/^HBC\s\d{1,3}\/2024$/);
  });

  it('increments case number correctly', () => {
    const first = generateCaseNumber({
      courtLevel: 'HIGH_COURT',
      caseType: 'CRIMINAL',
      year: 2024,
      lastNumber: 100,
    });
    expect(first).toBe('HAC 101/2024');
  });
});

describe('validateCaseNumber', () => {
  it('validates correct HAC format', () => {
    expect(validateCaseNumber('HAC 123/2024')).toBe(true);
  });

  it('rejects invalid format', () => {
    expect(validateCaseNumber('INVALID123')).toBe(false);
  });
});
```

### Server Action Testing

**Example: Testing Case Actions**

```typescript
// app/dashboard/cases/__tests__/actions.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCase, updateCase, deleteCase } from '../actions';
import * as db from '@/lib/drizzle/db';

vi.mock('@/lib/drizzle/db');

describe('Case Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createCase', () => {
    it('creates a case with valid data', async () => {
      const mockCase = {
        id: 1,
        title: 'State v. John Doe',
        caseNumber: 'HAC 123/2024',
        courtLevel: 'HIGH_COURT',
        caseType: 'CRIMINAL',
      };

      vi.spyOn(db, 'insert').mockResolvedValue(mockCase);

      const result = await createCase({
        title: 'State v. John Doe',
        courtLevel: 'HIGH_COURT',
        caseType: 'CRIMINAL',
      });

      expect(result.success).toBe(true);
      expect(result.data.caseNumber).toBe('HAC 123/2024');
    });

    it('returns error for missing required fields', async () => {
      const result = await createCase({
        title: '',
        courtLevel: 'HIGH_COURT',
        caseType: 'CRIMINAL',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Title is required');
    });
  });
});
```

---

## Integration Testing

### API Route Testing

**Example: Testing Case API Endpoint**

```typescript
// app/api/cases/__tests__/route.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { GET, POST } from '../route';
import { setupTestDatabase, cleanupTestDatabase } from '@/test/helpers/db';

describe('/api/cases', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe('POST', () => {
    it('creates a new case', async () => {
      const request = new Request('http://localhost:3441/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'State v. Test',
          courtLevel: 'HIGH_COURT',
          caseType: 'CRIMINAL',
          filedDate: '2024-11-15',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.caseNumber).toMatch(/^HAC\s\d+\/2024$/);
      expect(data.id).toBeDefined();
    });

    it('returns 400 for invalid data', async () => {
      const request = new Request('http://localhost:3441/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '', // Invalid: empty title
          courtLevel: 'HIGH_COURT',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
    });
  });

  describe('GET', () => {
    it('retrieves cases for organisation', async () => {
      const request = new Request('http://localhost:3441/api/cases');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
    });
  });
});
```

### Database Integration Testing

**Example: Testing Evidence Storage**

```typescript
// lib/services/__tests__/evidence-service.test.ts
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { uploadEvidence, deleteEvidence } from '@/lib/services/evidence-service';
import { db } from '@/lib/drizzle/db';
import { evidence } from '@/lib/drizzle/schema/db-schema';
import fs from 'fs/promises';

describe('Evidence Service', () => {
  const testFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

  afterEach(async () => {
    // Clean up test files and database
    await db.delete(evidence);
  });

  describe('uploadEvidence', () => {
    it('uploads file and creates database record', async () => {
      const result = await uploadEvidence({
        file: testFile,
        caseId: 1,
        description: 'Test evidence',
      });

      expect(result.success).toBe(true);
      expect(result.fileName).toBe('test.pdf');
      expect(result.filePath).toContain('/uploads/evidence/');

      // Verify file exists
      const fileExists = await fs.access(result.filePath).then(() => true).catch(() => false);
      expect(fileExists).toBe(true);
    });

    it('rejects files over 50MB', async () => {
      const largeFile = new File(
        [new ArrayBuffer(51 * 1024 * 1024)],
        'large.pdf',
        { type: 'application/pdf' }
      );

      const result = await uploadEvidence({
        file: largeFile,
        caseId: 1,
        description: 'Large file',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('exceeds maximum size');
    });
  });

  describe('deleteEvidence', () => {
    it('deletes file and database record', async () => {
      // First upload
      const uploaded = await uploadEvidence({
        file: testFile,
        caseId: 1,
        description: 'Test',
      });

      // Then delete
      const result = await deleteEvidence(uploaded.id);

      expect(result.success).toBe(true);

      // Verify file deleted
      const fileExists = await fs.access(uploaded.filePath).then(() => true).catch(() => false);
      expect(fileExists).toBe(false);
    });
  });
});
```

---

## End-to-End Testing

### Authentication Flow

**Example: Login and Session**

```typescript
// e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can login with magic link', async ({ page }) => {
    // Go to login page
    await page.goto('/auth/login');

    // Fill email
    await page.fill('input[type="email"]', 'testuser@example.com');
    await page.click('button:has-text("Send Magic Link")');

    // Check for success message
    await expect(page.locator('text=Check your email')).toBeVisible();

    // In real test, would need to intercept email or use test email provider
  });

  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
```

### Case Creation Workflow

**Example: Complete Case Creation**

```typescript
// e2e/cases/create-case.spec.ts
import { test, expect } from '@playwright/test';
import { loginAsUser } from '../helpers/auth';

test.describe('Case Creation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page, 'clerk@court.gov.fj');
  });

  test('creates criminal case with all details', async ({ page }) => {
    // Navigate to cases
    await page.goto('/dashboard/cases');
    
    // Click create case
    await page.click('text=Create Case');
    await expect(page).toHaveURL('/dashboard/cases/new');

    // Fill case details
    await page.selectOption('[name="courtLevel"]', 'HIGH_COURT');
    await page.selectOption('[name="caseType"]', 'CRIMINAL');
    await page.fill('[name="title"]', 'State v. John Doe - Armed Robbery');
    await page.fill('[name="filedDate"]', '2024-11-15');

    // Add parties
    await page.click('text=Add Party');
    await page.fill('[name="parties.0.name"]', 'Director of Public Prosecutions');
    await page.selectOption('[name="parties.0.type"]', 'PROSECUTION');

    await page.click('text=Add Party');
    await page.fill('[name="parties.1.name"]', 'John Doe');
    await page.selectOption('[name="parties.1.type"]', 'DEFENCE');

    // Add offences
    await page.click('text=Add Offence');
    await page.fill('[name="offences.0.description"]', 'Armed Robbery');
    await page.fill('[name="offences.0.section"]', 'Section 293(1)(a)');

    // Submit
    await page.click('button[type="submit"]');

    // Verify redirect and case created
    await expect(page).toHaveURL(/\/dashboard\/cases\/\d+/);
    await expect(page.locator('h1')).toContainText('State v. John Doe');
    
    // Verify case number generated
    const caseNumber = await page.locator('[data-testid="case-number"]').textContent();
    expect(caseNumber).toMatch(/^HAC\s\d+\/2024$/);

    // Verify parties displayed
    await expect(page.locator('text=Director of Public Prosecutions')).toBeVisible();
    await expect(page.locator('text=John Doe')).toBeVisible();

    // Verify offences displayed
    await expect(page.locator('text=Armed Robbery')).toBeVisible();
  });

  test('shows validation errors for missing fields', async ({ page }) => {
    await page.goto('/dashboard/cases/new');

    // Try to submit without filling required fields
    await page.click('button[type="submit"]');

    // Check for validation errors
    await expect(page.locator('text=Title is required')).toBeVisible();
    await expect(page.locator('text=Court level is required')).toBeVisible();
  });
});
```

### Hearing Scheduling

**Example: Schedule and Manage Hearing**

```typescript
// e2e/hearings/schedule-hearing.spec.ts
import { test, expect } from '@playwright/test';
import { loginAsUser, createTestCase } from '../helpers';

test.describe('Hearing Scheduling', () => {
  let caseId: number;

  test.beforeEach(async ({ page }) => {
    await loginAsUser(page, 'clerk@court.gov.fj');
    caseId = await createTestCase(page);
  });

  test('schedules a new hearing', async ({ page }) => {
    // Go to case details
    await page.goto(`/dashboard/cases/${caseId}`);

    // Click schedule hearing
    await page.click('text=Schedule Hearing');

    // Fill hearing details
    await page.fill('[name="date"]', '2024-12-01');
    await page.fill('[name="time"]', '09:00');
    await page.selectOption('[name="actionType"]', 'MENTION');
    await page.selectOption('[name="courtroom"]', '1'); // Courtroom 1
    
    // Submit
    await page.click('button[type="submit"]');

    // Verify hearing appears in case details
    await expect(page.locator('text=Mention - 01 Dec 2024')).toBeVisible();
    await expect(page.locator('text=Court Room 1')).toBeVisible();
  });

  test('checks courtroom availability', async ({ page }) => {
    await page.goto(`/dashboard/cases/${caseId}`);
    await page.click('text=Schedule Hearing');

    // Select date and courtroom
    await page.fill('[name="date"]', '2024-12-01');
    await page.fill('[name="time"]', '09:00');
    await page.selectOption('[name="courtroom"]', '1');

    // Check if availability indicator appears
    // (assumes UI shows availability status)
    await expect(page.locator('[data-testid="availability-status"]')).toContainText('Available');
  });
});
```

### Evidence Upload

**Example: Upload and View Evidence**

```typescript
// e2e/evidence/upload.spec.ts
import { test, expect } from '@playwright/test';
import { loginAsUser, createTestCase } from '../helpers';
import path from 'path';

test.describe('Evidence Upload', () => {
  test('uploads PDF evidence to case', async ({ page }) => {
    await loginAsUser(page, 'clerk@court.gov.fj');
    const caseId = await createTestCase(page);

    // Navigate to case
    await page.goto(`/dashboard/cases/${caseId}`);

    // Go to evidence tab
    await page.click('text=Evidence');

    // Click upload
    await page.click('text=Upload Evidence');

    // Upload file
    const filePath = path.join(__dirname, '../fixtures/test-document.pdf');
    await page.setInputFiles('input[type="file"]', filePath);

    // Add description
    await page.fill('[name="description"]', 'Police Report');

    // Submit
    await page.click('button:has-text("Upload")');

    // Verify upload success
    await expect(page.locator('text=Police Report')).toBeVisible();
    await expect(page.locator('text=test-document.pdf')).toBeVisible();
  });

  test('rejects files over 50MB', async ({ page }) => {
    await loginAsUser(page, 'clerk@court.gov.fj');
    const caseId = await createTestCase(page);

    await page.goto(`/dashboard/cases/${caseId}`);
    await page.click('text=Evidence');
    await page.click('text=Upload Evidence');

    // Try to upload large file (would need to generate in test setup)
    // For this example, we check the frontend validation

    await expect(page.locator('text=Maximum file size is 50MB')).toBeVisible();
  });
});
```

---

## Test Organization

### Directory Structure

```
/root/totolaw/
├── test/
│   ├── setup.ts                    # Test setup and global mocks
│   ├── helpers/
│   │   ├── auth.ts                 # Auth helpers for tests
│   │   ├── db.ts                   # Database test helpers
│   │   └── fixtures.ts             # Test data fixtures
│   └── mocks/
│       ├── handlers.ts             # MSW request handlers
│       └── server.ts               # MSW server setup
├── e2e/
│   ├── auth/
│   │   └── login.spec.ts
│   ├── cases/
│   │   ├── create-case.spec.ts
│   │   └── update-case.spec.ts
│   ├── hearings/
│   │   └── schedule-hearing.spec.ts
│   ├── evidence/
│   │   └── upload.spec.ts
│   ├── helpers/
│   │   ├── auth.ts
│   │   └── data.ts
│   └── fixtures/
│       └── test-document.pdf
├── app/
│   └── dashboard/
│       └── cases/
│           ├── actions.ts
│           └── __tests__/
│               └── actions.test.ts
├── components/
│   ├── logo.tsx
│   └── __tests__/
│       └── logo.test.tsx
├── lib/
│   └── utils/
│       ├── case-number-generator.ts
│       └── __tests__/
│           └── case-number-generator.test.ts
└── vitest.config.ts
```

### Naming Conventions

- **Unit/Integration Tests**: `*.test.ts` or `*.test.tsx`
- **E2E Tests**: `*.spec.ts`
- **Test Directories**: `__tests__/` for unit tests, `e2e/` for E2E tests
- **Test Files**: Match source file name with `.test` or `.spec` suffix

---

## Writing Tests

### Test Structure (AAA Pattern)

```typescript
describe('Feature', () => {
  it('should do something', () => {
    // Arrange - Set up test data and conditions
    const input = { value: 42 };
    
    // Act - Execute the code being tested
    const result = functionUnderTest(input);
    
    // Assert - Verify the result
    expect(result).toBe(84);
  });
});
```

### Best Practices

1. **Descriptive Test Names**
   ```typescript
   ✅ it('generates HAC case number for High Court Criminal cases')
   ❌ it('works correctly')
   ```

2. **One Assertion Per Test** (when possible)
   ```typescript
   ✅ it('returns 201 status code')
   ✅ it('returns created case with ID')
   ❌ it('creates case') { expect(status).toBe(201); expect(id).toBeDefined(); }
   ```

3. **Use Test Fixtures**
   ```typescript
   // test/fixtures/cases.ts
   export const mockCase = {
     id: 1,
     title: 'State v. Test',
     caseNumber: 'HAC 123/2024',
     courtLevel: 'HIGH_COURT',
   };
   ```

4. **Mock External Dependencies**
   ```typescript
   vi.mock('@/lib/drizzle/db', () => ({
     db: {
       insert: vi.fn(),
       select: vi.fn(),
     },
   }));
   ```

5. **Clean Up After Tests**
   ```typescript
   afterEach(() => {
     vi.clearAllMocks();
     cleanup(); // React Testing Library
   });
   ```

---

## Running Tests

### Package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

### Running Unit/Integration Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- case-number-generator.test.ts

# Run with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run in UI mode
npm run test:e2e:ui

# Run specific test
npm run test:e2e -- e2e/cases/create-case.spec.ts

# Debug mode
npm run test:e2e:debug

# Run in specific browser
npm run test:e2e -- --project=firefox
```

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Setup test database
        run: |
          docker-compose up -d postgres
          npm run db-push
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Test Coverage Goals

### Target Coverage

| Category | Target | Priority |
|----------|--------|----------|
| **Unit Tests** | 80%+ | High |
| **Integration Tests** | 70%+ | High |
| **E2E Tests** | Critical paths | Medium |

### Critical Areas to Test

1. **Authentication** ⭐⭐⭐
   - Magic link generation
   - Session management
   - Permission checks

2. **Case Management** ⭐⭐⭐
   - Case creation
   - Case number generation
   - Status updates

3. **Hearing Scheduling** ⭐⭐
   - Date/time validation
   - Courtroom conflicts
   - Judge assignments

4. **Evidence Upload** ⭐⭐
   - File validation
   - Storage
   - Permission checks

5. **Search** ⭐
   - Query parsing
   - Result filtering
   - Performance

### Coverage Reports

View coverage reports:

```bash
# Generate and view coverage
npm run test:coverage
open coverage/index.html
```

---

## Test Data Management

### Test Database Setup

```typescript
// test/helpers/db.ts
import { db } from '@/lib/drizzle/db';
import { sql } from 'drizzle-orm';

export async function setupTestDatabase() {
  // Create test schema
  await db.execute(sql`CREATE SCHEMA IF NOT EXISTS test`);
  
  // Run migrations
  await db.execute(sql`SET search_path TO test`);
  // ... run migrations
}

export async function cleanupTestDatabase() {
  await db.execute(sql`DROP SCHEMA test CASCADE`);
}

export async function seedTestData() {
  // Insert test organisations, users, cases, etc.
}
```

### Test Fixtures

```typescript
// test/helpers/fixtures.ts
export const testUser = {
  id: 1,
  email: 'test@court.gov.fj',
  name: 'Test User',
  role: 'CLERK',
};

export const testCase = {
  id: 1,
  title: 'State v. Test Defendant',
  caseNumber: 'HAC 1/2024',
  courtLevel: 'HIGH_COURT',
  caseType: 'CRIMINAL',
};

export const testHearing = {
  id: 1,
  caseId: 1,
  date: '2024-12-01',
  time: '09:00',
  actionType: 'MENTION',
};
```

---

## Debugging Tests

### Debugging Vitest Tests

```typescript
// Add debugger statement
it('should do something', () => {
  debugger; // Execution will pause here
  const result = functionUnderTest();
  expect(result).toBe(expected);
});
```

Run with Node inspector:
```bash
node --inspect-brk ./node_modules/.bin/vitest
```

### Debugging Playwright Tests

```bash
# Run in debug mode
npm run test:e2e:debug

# Or use headed mode
npm run test:e2e -- --headed

# Or use UI mode for interactive debugging
npm run test:e2e:ui
```

In test code:
```typescript
test('debug test', async ({ page }) => {
  await page.pause(); // Opens Playwright Inspector
  // ... rest of test
});
```

---

## Next Steps

### Implementation Plan

1. **Phase 1: Setup** (Week 1)
   - Install Vitest and Playwright
   - Configure test environments
   - Set up CI/CD pipeline

2. **Phase 2: Core Tests** (Weeks 2-3)
   - Write unit tests for utilities
   - Test authentication flow
   - Test case creation

3. **Phase 3: Integration** (Weeks 4-5)
   - API endpoint tests
   - Database integration tests
   - Service layer tests

4. **Phase 4: E2E** (Weeks 6-7)
   - Critical user journeys
   - Cross-browser testing
   - Performance testing

5. **Phase 5: Coverage** (Week 8)
   - Achieve 80% unit test coverage
   - Document uncovered areas
   - Set up coverage tracking

---

## Related Documentation

- [Development Guide](09-development-guide.md)
- [API Documentation](05-api-documentation.md)
- [Deployment Guide](08-deployment.md)
- [Troubleshooting Guide](27-troubleshooting.md) (coming soon)
