import { render } from '@redwoodjs/testing/web'

import TamingPage from './TamingPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('TamingPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TamingPage />)
    }).not.toThrow()
  })
})
