import { render } from '@redwoodjs/testing/web'

import Counter from './Counter'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Counter', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Counter />)
    }).not.toThrow()
  })
})
