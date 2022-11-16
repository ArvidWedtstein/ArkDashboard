import { render } from '@redwoodjs/testing/web'

import MaterialCalculatorPage from './MaterialCalculatorPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('MaterialCalculatorPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MaterialCalculatorPage />)
    }).not.toThrow()
  })
})
