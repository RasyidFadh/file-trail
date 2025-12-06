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

  const visitInvocations: string[] = []
  
  return {
    visit: (filePath: string) => {
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
      if(visitInvocations.length === 0) {
        return ''
      }
      return JSON.stringify(visitInvocations)
    }
  };
}

export const hydrate = (serialized: string) => {
  const visitInvocations: string[] = JSON.parse(serialized)
  const breadcrumbs = Breadcrumbs()
  visitInvocations.forEach(x => breadcrumbs.visit(x))
  return breadcrumbs
}
