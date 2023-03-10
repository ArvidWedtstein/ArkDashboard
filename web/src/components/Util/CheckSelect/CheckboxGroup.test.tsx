import { render } from '@redwoodjs/testing/web'

import CheckboxGroup from './CheckboxGroup'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CheckSelect', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<CheckboxGroup />)
    }).not.toThrow()
  })
})
