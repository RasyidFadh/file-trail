import path from 'path';

const serilizationPrefix = 'ft@1.0.0:'

/**
 * Interface for tracking file and directory visits with completion detection.
 * 
 * @example
 * ```typescript
 * const trail = FileTrail();
 * trail.visit('/path/to/file.txt');
 * trail.hasVisited('/path/to'); // true
 * trail.hasCompleted('/path/to'); // false (still in this directory)
 * trail.visit('/other/path/file.txt');
 * trail.hasCompleted('/path/to'); // true (moved to different directory)
 * ```
 */
export interface FileTrail {
  /**
   * Records a file visit. Marks the file and all its ancestor directories as visited.
   * 
   * **Note:** Relative paths are not currently supported. Only absolute paths are accepted.
   * If you would find value in relative path support, please let me know:
   * https://github.com/bkotos/file-trail/issues/new
   * 
   * @param filePath - The absolute path to the file being visited
   * @throws {Error} If a relative path is provided
   * 
   * @example
   * ```typescript
   * trail.visit('/var/home/user/Pictures/photo.jpg');
   * // Now /var/home/user/Pictures/photo.jpg, /var/home/user/Pictures, 
   * // /var/home/user, /var/home, /var, and / are all marked as visited
   * ```
   */
  visit: (filePath: string) => void

  /**
   * Checks if a file or directory has been visited.
   * 
   * @param filePath - The path to check (file or directory)
   * @returns `true` if the path has been visited, `false` otherwise
   * 
   * @example
   * ```typescript
   * trail.visit('/path/to/file.txt');
   * trail.hasVisited('/path/to/file.txt'); // true
   * trail.hasVisited('/path/to'); // true (parent directory)
   * trail.hasVisited('/other/path'); // false
   * ```
   */
  hasVisited: (filePath: string) => boolean

  /**
   * Checks if a directory has been completed. A directory is completed when
   * at least one file in it has been visited, and then a file in a different
   * directory has been visited afterward.
   * 
   * @param filePath - The directory path to check
   * @returns `true` if the directory has been completed (visited and then left), `false` otherwise
   * 
   * @example
   * ```typescript
   * trail.visit('/path/to/file1.txt');
   * trail.hasCompleted('/path/to'); // false (still in this directory)
   * trail.visit('/path/to/file2.txt');
   * trail.hasCompleted('/path/to'); // false (still in this directory)
   * trail.visit('/other/path/file.txt');
   * trail.hasCompleted('/path/to'); // true (moved to different directory)
   * ```
   */
  hasCompleted: (filePath: string) => boolean

  /**
   * Serializes the trail state to a string for persistence.
   * The serialized string can be saved to disk and later restored using `hydrate()`.
   * 
   * @returns A serialized string representation of the trail state
   * 
   * @example
   * ```typescript
   * trail.visit('/path/to/file.txt');
   * const serialized = trail.serialize();
   * writeFileSync('.file-trail', serialized);
   * // Later...
   * const restored = hydrate(readFileSync('.file-trail', 'utf-8'));
   * ```
   */
  serialize: () => string
}

/**
 * Creates a new FileTrail instance for tracking file and directory visits.
 * 
 * The trail maintains two states:
 * - **Visited**: Files and directories that have been encountered
 * - **Completed**: Directories that have been visited and then left (moved on from)
 * 
 * @returns A new FileTrail instance
 * 
 * @example
 * ```typescript
 * const trail = FileTrail();
 * trail.visit('/path/to/file1.txt');
 * trail.visit('/path/to/file2.txt');
 * trail.visit('/other/path/file.txt');
 * 
 * console.log(trail.hasVisited('/path/to')); // true
 * console.log(trail.hasCompleted('/path/to')); // true (moved to /other/path)
 * ```
 */
export const FileTrail = (): FileTrail => {
  const visited: Record<string, boolean> = {}
  const completed: Record<string, boolean> = {}
  let lastDirectory: string | null = null

  /**
   * Marks the previous directory as completed when moving to a new directory.
   * A directory is considered completed when we visit a file in a different directory.
   * 
   * @param filePath - The file path being visited
   * @internal
   */
  const markCompleted = (filePath: string) => {
    const dir = path.dirname(filePath)
    if (dir !== lastDirectory) {
      completed[lastDirectory!] = true
    }
    lastDirectory = dir
  }

  /**
   * Marks a file and all its ancestor directories as visited.
   * Traverses up the directory tree from the file to the root.
   * 
   * @param filePath - The file path to mark as visited
   * @internal
   */
  const markVisited = (filePath: string) => {
    let current = filePath
    let previous = ''
    while (current !== previous) {
      visited[current] = true
      previous = current
      current = path.dirname(current)
    }
  }

  const visitInvocations: string[] = []
  
  return {
    visit: (filePath: string) => {
      const isWindowsPath = /^[A-Za-z]:\\/.test(filePath)
      if (!path.isAbsolute(filePath) && !isWindowsPath) {
        throw new Error('Relative paths are not currently supported. Is this something you would find value in? I would love to hear from you: https://github.com/bkotos/file-trail/issues/new')
      }
      visitInvocations.push(filePath)
      markCompleted(filePath)
      markVisited(filePath)
    },
    hasVisited: (filePath: string) => {
      return visited[filePath] || false
    },
    hasCompleted: (filePath: string) => {
      return completed[filePath] || false
    },
    serialize: () => {
      return `${serilizationPrefix}${JSON.stringify(visitInvocations)}`
    }
  };
}

/**
 * Parses a JSON string and throws a descriptive error if parsing fails.
 * 
 * @param raw - The JSON string to parse
 * @returns The parsed JSON value
 * @throws {Error} If the JSON string is invalid
 * @internal
 */
const jsonParse = (raw: string) => {
  try {
    return JSON.parse(raw)
  } catch (error) {
    throw new Error('Invalid serialized output')
  }
}

/**
 * Restores a FileTrail instance from a serialized string.
 * 
 * This function recreates the trail state by replaying all the visit operations
 * that were recorded when the trail was serialized. The restored trail will have
 * the same visited and completed states as the original.
 * 
 * @param serialized - The serialized string from a previous `serialize()` call
 * @returns A new FileTrail instance with the restored state
 * @throws {Error} If the serialized string is invalid or malformed
 * 
 * @example
 * ```typescript
 * // Save state
 * const trail = FileTrail();
 * trail.visit('/path/to/file1.txt');
 * trail.visit('/path/to/file2.txt');
 * const serialized = trail.serialize();
 * writeFileSync('.file-trail', serialized);
 * 
 * // Restore state later
 * const restored = hydrate(readFileSync('.file-trail', 'utf-8'));
 * console.log(restored.hasVisited('/path/to/file1.txt')); // true
 * console.log(restored.hasVisited('/path/to/file2.txt')); // true
 * ```
 */
export const hydrate = (serialized: string): FileTrail => {
  if (!serialized.startsWith(serilizationPrefix)) {
    throw new Error('Invalid serialized output')
  }

  const raw = serialized.slice(serilizationPrefix.length) || '[]'
  const visitInvocations = jsonParse(raw)
  
  if (!Array.isArray(visitInvocations)) {
    throw new Error('Invalid serialized output')
  }

  const instance = FileTrail()
  visitInvocations.forEach(instance.visit)
  return instance
}
