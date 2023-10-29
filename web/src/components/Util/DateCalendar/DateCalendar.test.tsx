import { render } from '@redwoodjs/testing/web'

import DateCalendar from './DateCalendar'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('DateCalendar', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DateCalendar />)
    }).not.toThrow()
  })
})
