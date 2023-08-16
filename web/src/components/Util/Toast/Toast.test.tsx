import { render } from '@redwoodjs/testing/web'

import Toast from './Toast'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Toast', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Toast />)
    }).not.toThrow()
  })
})
