import path from 'path';

export const Breadcrumbs = () => {
  const visited: Record<string, boolean> = {}
  return {
    visit: (filePath: string) => {
      visited[filePath] = true
      visited[path.dirname(filePath)] = true
    },
    hasVisited: (filePath: string) => {
      return visited[filePath] || false
    },
  };
}
