import path from 'path';

export const Breadcrumbs = () => {
  const visited: Record<string, boolean> = {}
  return {
    visit: (filePath: string) => {
      let current = filePath
      do {
        visited[current] = true
        current = path.dirname(current)
      } while (current !== '/')
      visited['/'] = true
    },
    hasVisited: (filePath: string) => {
      return visited[filePath] || false
    },
    hasCompleted: (filePath: string) => {
      return false
    },
  };
}
