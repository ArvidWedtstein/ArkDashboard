import { render } from '@redwoodjs/testing/web'

import Admin from './Admin'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Admin', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Admin />)
    }).not.toThrow()
  })
})
