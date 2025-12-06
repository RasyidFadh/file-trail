import { describe, it, expect } from 'vitest';
import { Breadcrumbs } from './index';

describe(Breadcrumbs.name, () => {
  it('should say that I visited a directory when called with the parent directory of a file', () => {
    // arrange
    const directory = '/var/home/jdoe/Pictures/2022/12'
    const photoPath = `${directory}/IMG_6532.PNG`

    // act
    const breadcrumbs = Breadcrumbs()
    breadcrumbs.visit(photoPath)
    const hasVisited = breadcrumbs.hasVisited(directory)

    // assert
    expect(hasVisited).toBe(true)
  })
})
