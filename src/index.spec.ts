import { describe, it, expect } from 'vitest';
import { Breadcrumbs, hydrate } from './index';

describe(Breadcrumbs.name, () => {
  it('should say that I visited a directory when called with the parent directory of a file', () => {
    // act
    const breadcrumbs = Breadcrumbs()
    breadcrumbs.visit('/var/home/jdoe/Pictures/2022/12/IMG_6532.PNG')

    // assert
    expect(breadcrumbs.hasVisited('/var/home/jdoe/Pictures/2022/12')).toBe(true)
  })

  it('should say that I visited a directory when called with the file that I just visited', () => {
    // act
    const breadcrumbs = Breadcrumbs()
    breadcrumbs.visit('/var/home/jdoe/Pictures/2022/12/IMG_6532.PNG')

    // assert
    expect(breadcrumbs.hasVisited('/var/home/jdoe/Pictures/2022/12/IMG_6532.PNG')).toBe(true)
  })

  it('should say I did NOT visit a directory when called with a different directory than the directory of the file I just visited', () => {
    // act
    const breadcrumbs = Breadcrumbs()
    breadcrumbs.visit('/var/home/jdoe/Pictures/2022/12/IMG_6532.PNG')

    // assert
    expect(breadcrumbs.hasVisited('/var/home/jdoe/Pictures/2022/11')).toBe(false)
  })

  it('should not say that I vitied the root directory when no visits have been made', () => {
    // act
    const breadcrumbs = Breadcrumbs()

    // assert
    expect(breadcrumbs.hasVisited('/')).toBe(false)
  })

  it('should say that I vitied the grandparent directory after visiting a file', () => {
    // act
    const breadcrumbs = Breadcrumbs()
    breadcrumbs.visit('/var/home/jdoe/Pictures/2022/12/IMG_6532.PNG')

    // assert
    expect(breadcrumbs.hasVisited('/var/home/jdoe/Pictures/2022')).toBe(true)
  })

  it('should say that I vitied root directory after visiting a file', () => {
    // act
    const breadcrumbs = Breadcrumbs()
    breadcrumbs.visit('/var/home/jdoe/Pictures/2022/12/IMG_6532.PNG')

    // assert
    expect(breadcrumbs.hasVisited('/')).toBe(true)
  })

  it('should say that I did NOT complete a directory after visiting a file in it once', () => {
    // act
    const breadcrumbs = Breadcrumbs()
    breadcrumbs.visit('/var/home/jdoe/Pictures/2022/12/IMG_6532.PNG')

    // assert
    expect(breadcrumbs.hasCompleted('/var/home/jdoe/Pictures/2022/12')).toBe(false)
  })

  it('should NOT say that I completed a directory after visiting two files in it', () => {
    // act
    const breadcrumbs = Breadcrumbs()
    breadcrumbs.visit('/var/home/jdoe/Pictures/2022/12/IMG_6532.PNG')
    breadcrumbs.visit('/var/home/jdoe/Pictures/2022/12/IMG_6533.PNG')

    // assert
    expect(breadcrumbs.hasCompleted('/var/home/jdoe/Pictures/2022/12')).toBe(false)
  })

  it('should say that I completed a directory after visiting a file in it, and then visiting a file in a different directory', () => {
    // act
    const breadcrumbs = Breadcrumbs()
    breadcrumbs.visit('/var/home/jdoe/Pictures/2022/12/IMG_6532.PNG')
    breadcrumbs.visit('/var/home/jdoe/Pictures/2022/11/IMG_6533.PNG')

    // assert
    expect(breadcrumbs.hasCompleted('/var/home/jdoe/Pictures/2022/12')).toBe(true)
  })

  it('should NOT mark the root directory as completed after visiting two descendants that have different parents', () => {
    // act
    const breadcrumbs = Breadcrumbs()
    breadcrumbs.visit('/var/home/jdoe/Pictures/2022/12/IMG_6532.PNG')
    breadcrumbs.visit('/var/home/jdoe/Pictures/2022/11/IMG_6533.PNG')

    // assert
    expect(breadcrumbs.hasCompleted('/')).toBe(false)
  })
})

describe(hydrate.name, () => {
  it('should return the same hasVisited results for both the original and hydrated breadcrumbs', () => {
    // act
    const original = Breadcrumbs()
    original.visit('/var/home/jdoe/Pictures/2022/12/IMG_6532.PNG')
    const serialized = original.serialize()
    const hydrated = hydrate(serialized)

    // assert - visited
    const visited = [
      '/var/home/jdoe/Pictures/2022/12',
      '/var/home/jdoe/Pictures/2022',
      '/'
    ]
    visited.forEach(x => {
      expect(original.hasVisited(x)).toBe(true)
      expect(hydrated.hasVisited(x)).toBe(true)
    })

    // assert - NOT visited
    const notVisited = [
      '/var/home/jdoe/Pictures/2022/11',
      '/var/home/jdoe/Pictures/2022/12/13',
    ]
    notVisited.forEach(x => {
      expect(original.hasVisited(x)).toBe(false)
      expect(hydrated.hasVisited(x)).toBe(false)
    })
  })

  it('should return the same hasCompleted results for both the original and hydrated breadcrumbs', () => {
    // act
    const original = Breadcrumbs()
    original.visit('/var/home/jdoe/Pictures/2022/12/IMG_6532.PNG')
    original.visit('/var/home/jdoe/Pictures/2022/11/IMG_6533.PNG')
    const serialized = original.serialize()
    const hydrated = hydrate(serialized)

    // assert - completed
    const completed = '/var/home/jdoe/Pictures/2022/12'
    expect(original.hasCompleted(completed)).toBe(true)
    expect(hydrated.hasCompleted(completed)).toBe(true)

    // assert - NOT completed
    const notCompleted = '/var/home/jdoe/Pictures/2022/11'
    expect(original.hasCompleted(notCompleted)).toBe(false)
    expect(hydrated.hasCompleted(notCompleted)).toBe(false)
  })

  it('should hydrate without errors from an original that had no visits', () => {
    // act
    const act = () => {
      const original = Breadcrumbs()
      const serialized = original.serialize()
      hydrate(serialized)
    }

    // assert
    expect(act).not.toThrow()
  })

  it('should fail to hydrate when there is no prefix in the serialized output', () => {
    // act
    const act = () => {
      hydrate('[]')
    }

    // assert
    expect(act).toThrow('Invalid serialized output')
  })

  it('should hydrate without error when there is a prefix but an empty suffix', () => {
    // act
    const act = () => {
      hydrate('bc@1.0.0:')
    }

    // assert
    expect(act).not.toThrow()
  })

  it('should fail to hydrate when the prefix is incompleted', () => {
    // act
    const act = () => {
      hydrate('bc@1.0.0')
    }

    // assert
    expect(act).toThrow('Invalid serialized output')
  })

  it('should fail to hydrate when the prefix is completed but the suffix is a JSON object instead of an array', () => {
    // act
    const act = () => {
      hydrate('bc@1.0.0:{}')
    }

    // assert
    expect(act).toThrow('Invalid serialized output')
  })
})

describe('serialize', () => {
  it('should serialize when there are no visits', () => {
    // act
    const breadcrumbs = Breadcrumbs()
    const serialized = breadcrumbs.serialize()

    // assert
    expect(serialized).toBe('bc@1.0.0:[]')
  })

  it('should include the version in the serialized output', () => {
    // act
    const breadcrumbs = Breadcrumbs()
    breadcrumbs.visit('/var/home/jdoe/Pictures/2022/12/IMG_6532.PNG')
    const serialized = breadcrumbs.serialize()

    // assert
    expect(serialized.startsWith('bc@1.0.0:')).toBe(true)
  })
})
