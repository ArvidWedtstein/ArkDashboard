import { render } from '@redwoodjs/testing/web'

import Tabs from './Tabs'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Tabs', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Tabs />)
    }).not.toThrow()
  })
})
