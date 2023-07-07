import { render } from '@redwoodjs/testing/web'

import Chart from './Chart'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Chart', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Chart />)
    }).not.toThrow()
  })
})
