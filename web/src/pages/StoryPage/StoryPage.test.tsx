import { render } from '@redwoodjs/testing/web'

import StoryPage from './StoryPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('StoryPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<StoryPage />)
    }).not.toThrow()
  })
})
