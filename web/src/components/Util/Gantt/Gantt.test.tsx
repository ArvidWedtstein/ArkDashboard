import { render } from '@redwoodjs/testing/web'

import Gantt from './Gantt'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Gantt', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Gantt />)
    }).not.toThrow()
  })
})
