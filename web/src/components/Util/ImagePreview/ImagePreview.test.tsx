import { render } from '@redwoodjs/testing/web'

import ImagePreview from './ImagePreview'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ImagePreview', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ImagePreview />)
    }).not.toThrow()
  })
})
