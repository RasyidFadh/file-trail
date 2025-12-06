import { describe, it, expect } from 'vitest';
import { Breadcrumbs } from './index';

describe(Breadcrumbs.name, () => {
  // arrange
  const directory1 = '/var/home/jdoe/Pictures/2022/12'
  const directory2 = '/var/home/jdoe/Pictures/2022/11'

  it('should say that I visited a directory when called with the parent directory of a file', () => {
    // act
    const breadcrumbs = Breadcrumbs()
    breadcrumbs.visit('/var/home/jdoe/Pictures/2022/12/IMG_6532.PNG')
    const hasVisited = breadcrumbs.hasVisited('/var/home/jdoe/Pictures/2022/12')

    // assert
    expect(hasVisited).toBe(true)
  })

  it('should say that I visited a directory when called with the file that I just visited', () => {
    // act
    const breadcrumbs = Breadcrumbs()
    breadcrumbs.visit('/var/home/jdoe/Pictures/2022/12/IMG_6532.PNG')
    const hasVisited = breadcrumbs.hasVisited('/var/home/jdoe/Pictures/2022/12/IMG_6532.PNG')

    // assert
    expect(hasVisited).toBe(true)
  })

  it('should say I did NOT visit a directory when called with a different directory than the directory of the file I just visited', () => {
    // act
    const breadcrumbs = Breadcrumbs()
    breadcrumbs.visit('/var/home/jdoe/Pictures/2022/12/IMG_6532.PNG')
    const hasVisited = breadcrumbs.hasVisited('/var/home/jdoe/Pictures/2022/11')

    // assert
    expect(hasVisited).toBe(false)
  })
})
