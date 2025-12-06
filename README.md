# 🛤️ file-trail

Keep track of which files and directories you've visited, and detect when you've finished exploring a directory (moved on to a different one). Useful for file system navigation, progress tracking, and resumable operations.

## What It Does

As your app explores a file system, `file-trail` maintains a breadcrumb trail that tells your app:

- ✅ **Where it's been** - Every file and folder your app has visited
- 🏁 **What it's finished** - Directories your app has explored and then moved on from

```
📁 Documents/
   📁 Photos/
      📄 vacation.jpg  ← Your app visits this
      📄 family.jpg    ← Your app visits this
   📁 Videos/          ← Your app moves here
      📄 movie.mp4     ← Your app visits this
   
   🛤️ Your App's Trail:
   ✅ Documents/          (visited)
   ✅ Documents/Photos/   (visited)
   ✅ Documents/Photos/vacation.jpg
   ✅ Documents/Photos/family.jpg
   🏁 Documents/Photos/   (COMPLETED - your app moved on!)
   ✅ Documents/Videos/   (visited)
   ✅ Documents/Videos/movie.mp4
```

**Key Insight:** A directory is "completed" when your app has visited files in it AND then moved to a different directory. This tells your app "I'm done with that folder, I've moved on."

**Perfect for:**
- 🔄 Resumable file processing (know where you left off)
- 📊 Progress tracking (show what's done vs. in-progress)
- 🧹 Cleanup tools (identify directories you've finished with)
- 🔍 Search operations (avoid re-scanning completed areas)

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

**Stop and Resume Anywhere** - Save your trail to disk and pick up exactly where you left off, even after crashes or restarts.

```
🔄 Your App's Journey:

┌─────────────────────────────────────────┐
│  Session 1: Processing Files            │
├─────────────────────────────────────────┤
│  ✅ Processed: file1.txt                 │
│  ✅ Processed: file2.txt                 │
│  ✅ Processed: file3.txt                 │
│  ⏸️  Saving state...                     │
│  💾 trail.serialize() → ".file-trail"    │
│  🛑 App stops/crashes/restarts          │
└─────────────────────────────────────────┘
              ⬇️
┌─────────────────────────────────────────┐
│  Session 2: Resume from Saved State     │
├─────────────────────────────────────────┤
│  📂 Load ".file-trail"                   │
│  🔄 hydrate(serialized) → trail          │
│  ✅ Knows: file1, file2, file3 done     │
│  ▶️  Continues with: file4.txt           │
│  ▶️  Continues with: file5.txt           │
└─────────────────────────────────────────┘
```

**Perfect for long-running operations:**
- 🔄 **Resumable file processing** - Process millions of files across multiple sessions
- 💪 **Crash recovery** - Automatically resume after unexpected shutdowns
- ⏸️ **Pause and resume** - Stop processing, restart later, continue seamlessly
- 📊 **Progress persistence** - Never lose track of what's been done

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
