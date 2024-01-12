import { render } from '@redwoodjs/testing/web'

import ColorInput from './ColorInput'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ColorInput', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ColorInput />)
    }).not.toThrow()
  })
})
