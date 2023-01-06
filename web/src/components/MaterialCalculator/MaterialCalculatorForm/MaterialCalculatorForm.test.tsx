import { render } from '@redwoodjs/testing/web'

import MaterialCalculatorForm from './MaterialCalculatorForm'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('MaterialCalculatorForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MaterialCalculatorForm />)
    }).not.toThrow()
  })
})
