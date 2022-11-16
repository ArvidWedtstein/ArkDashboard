import { render } from '@redwoodjs/testing/web'

import GtwPage from './GtwPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('GtwPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<GtwPage />)
    }).not.toThrow()
  })
})
