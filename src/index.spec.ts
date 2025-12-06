import { describe, it, expect } from 'vitest';
import { Breadcrumbs } from './index';

describe(Breadcrumbs.name, () => {
  // arrange
  const directory = '/var/home/jdoe/Pictures/2022/12'
  const photoPath = `${directory}/IMG_6532.PNG`

  it('should say that I visited a directory when called with the parent directory of a file', () => {
    // act
    const breadcrumbs = Breadcrumbs()
    breadcrumbs.visit(photoPath)
    const hasVisited = breadcrumbs.hasVisited(directory)

    // assert
    expect(hasVisited).toBe(true)
  })

  it('should say that I visited a directory when called with the file that I just visited', () => {
    // act
    const breadcrumbs = Breadcrumbs()
    breadcrumbs.visit(photoPath)
    const hasVisited = breadcrumbs.hasVisited(photoPath)

    // assert
    expect(hasVisited).toBe(true)
  })
})
