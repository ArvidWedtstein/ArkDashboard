import { render } from '@redwoodjs/testing/web'

import FibonacciSphere from './FibonacciSphere'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('FibonacciSphere', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<FibonacciSphere />)
    }).not.toThrow()
  })
})
