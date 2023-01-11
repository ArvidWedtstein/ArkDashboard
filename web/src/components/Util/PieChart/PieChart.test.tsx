import { render } from '@redwoodjs/testing/web'

import PieChart from './PieChart'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PieChart', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PieChart />)
    }).not.toThrow()
  })
})
