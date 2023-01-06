import { render } from '@redwoodjs/testing/web'

import Timeline from '../../Timeline/Timeline'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Timeline', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Timeline timeline={{id: "test"}} />)
    }).not.toThrow()
  })
})
