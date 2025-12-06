# 🛤️ file-trail

Keep track of which files and directories you've visited, and detect when you've finished exploring a directory (moved on to a different one). Useful for file system navigation, progress tracking, and resumable operations.

## Installation

```bash
npm install file-trail
```

## Usage

```typescript
import { FileTrail } from 'file-trail';

const trail = FileTrail();

// Visit files
trail.visit('/path/to/file1.txt');
trail.visit('/path/to/file2.txt');

// Check if visited
trail.hasVisited('/path/to'); // true

// Check if directory is completed (visited then left)
trail.hasCompleted('/path/to'); // false (still in this directory)
trail.visit('/other/path/file.txt');
trail.hasCompleted('/path/to'); // true (moved to different directory)
```

## Serialization

```typescript
import { FileTrail, hydrate } from 'file-trail';
import { writeFileSync, readFileSync } from 'fs';

const trail = FileTrail();
trail.visit('/path/to/file.txt');

// Save
const serialized = trail.serialize();
writeFileSync('.file-trail', serialized);

// Restore
const restored = hydrate(readFileSync('.file-trail', 'utf-8'));
```

## API

```typescript
/**
 * Creates a new FileTrail instance for tracking file and directory visits.
 */
function FileTrail(): FileTrail

interface FileTrail {
  /**
   * Records a file visit. Marks the file and all its ancestor directories as visited.
   */
  visit(filePath: string): void

  /**
   * Checks if a file or directory has been visited.
   */
  hasVisited(filePath: string): boolean

  /**
   * Checks if a directory has been completed. A directory is completed when
   * at least one file in it has been visited, and then a file in a different
   * directory has been visited afterward.
   */
  hasCompleted(filePath: string): boolean

  /**
   * Serializes the trail state to a string for persistence.
   */
  serialize(): string
}

/**
 * Restores a FileTrail instance from a serialized string.
 */
function hydrate(serialized: string): FileTrail
```
