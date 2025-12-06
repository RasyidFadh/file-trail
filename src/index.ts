import path from 'path';

const serilizationPrefix = 'bc@1.0.0:'

export interface Breadcrumbs {
  visit: (filePath: string) => void
  hasVisited: (filePath: string) => boolean
  hasCompleted: (filePath: string) => boolean
  serialize: () => string
}

export const Breadcrumbs = (): Breadcrumbs => {
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
      return `${serilizationPrefix}${JSON.stringify(visitInvocations)}`
    }
  };
}

export const hydrate = (serialized: string) => {
  const raw = serialized.slice(serilizationPrefix.length)
  const visitInvocations: string[] = JSON.parse(raw)
  const breadcrumbs = Breadcrumbs()
  visitInvocations.forEach(x => breadcrumbs.visit(x))
  return breadcrumbs
}
