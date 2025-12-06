# E2E Tests

This directory contains end-to-end tests for `file-trail`.

## Setup

Dependencies are installed in this directory's own `node_modules`. Run:

```bash
npm install
```

## Running Tests

```bash
npm test
```

Or with watch mode:

```bash
npm run test:watch
```

## Using zx

You can use `zx` to write shell scripts with JavaScript/TypeScript. Example:

```javascript
#!/usr/bin/env zx

import 'zx/globals';

await $`echo "Hello from zx"`;
```
