import { render } from '@redwoodjs/testing/web'

import DinoStatsPage from './DinoStatsPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('DinoStatsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DinoStatsPage />)
    }).not.toThrow()
  })
})
