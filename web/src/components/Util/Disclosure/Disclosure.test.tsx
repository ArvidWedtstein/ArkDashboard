import { render } from '@redwoodjs/testing/web'

import Disclosure from './Disclosure'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Disclosure', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Disclosure />)
    }).not.toThrow()
  })
})
