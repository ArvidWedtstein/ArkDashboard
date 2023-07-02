import { render } from '@redwoodjs/testing/web'

import TagInput from './TagInput'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('TagInput', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<TagInput />)
    }).not.toThrow()
  })
})
