import { describe, it, expect } from 'vitest';
import { Breadcrumbs } from './index';

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
})
