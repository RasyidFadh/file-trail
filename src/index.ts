import path from 'path';

export const Breadcrumbs = () => {
  const visited: Record<string, boolean> = {}
  const completed: Record<string, boolean> = {}
  let lastDirectory: string | null = null

  const markCompleted = (filePath: string) => {
    const dir = path.dirname(filePath)
    if (dir !== lastDirectory) {
      completed[lastDirectory!] = true
    }
    lastDirectory = dir
  }

  const markVisited = (filePath: string) => {
    let current = filePath
    do {
      visited[current] = true
      current = path.dirname(current)
    } while (current !== '/')
    visited['/'] = true
  }
  
  return {
    visit: (filePath: string) => {
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
      return ''
    }
  };
}

export const hydrate = (serialized: string) => {
  return Breadcrumbs()
}
