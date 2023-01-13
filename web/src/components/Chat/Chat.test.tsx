import { render } from '@redwoodjs/testing/web'

import Chat from './Chat'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Chat', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Chat />)
    }).not.toThrow()
  })
})
