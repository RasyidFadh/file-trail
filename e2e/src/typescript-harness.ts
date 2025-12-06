import { FileTrail, hydrate } from 'file-trail';

const fileTrail = FileTrail()

fileTrail.visit('/var/home/jdoe/Pictures/2022/11/IMG_6532.PNG')
fileTrail.visit('/var/home/jdoe/Pictures/2022/11/IMG_6533.PNG')

console.log('hasVisited /var/home/jdoe/Pictures/2022/11: ', fileTrail.hasVisited('/var/home/jdoe/Pictures/2022/11'))
console.log('hasVisited /var/home/jdoe/Pictures/2022: ', fileTrail.hasVisited('/var/home/jdoe/Pictures/2022'))
console.log('hasVisited /: ', fileTrail.hasVisited('/'))

console.log('\nBefore visiting /var/home/jdoe/Pictures/2022/12:')
console.log('hasVisited /var/home/jdoe/Pictures/2022/12: ', fileTrail.hasVisited('/var/home/jdoe/Pictures/2022/12'))
console.log('hasCompleted /var/home/jdoe/Pictures/2022/11: ', fileTrail.hasCompleted('/var/home/jdoe/Pictures/2022/11'))
fileTrail.visit('/var/home/jdoe/Pictures/2022/12/IMG_6534.PNG')
console.log('\nAfter visiting /var/home/jdoe/Pictures/2022/12:')
console.log('hasVisited /var/home/jdoe/Pictures/2022/12: ', fileTrail.hasVisited('/var/home/jdoe/Pictures/2022/12'))
console.log('hasCompleted /var/home/jdoe/Pictures/2022/11: ', fileTrail.hasCompleted('/var/home/jdoe/Pictures/2022/11'))

console.log('serialize: ', fileTrail.serialize())

console.log('hydrate: ', hydrate(fileTrail.serialize()))
