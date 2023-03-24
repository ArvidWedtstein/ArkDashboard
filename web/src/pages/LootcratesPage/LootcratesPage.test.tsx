import { render } from '@redwoodjs/testing/web'

import LootcratesPage from './LootcratesPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('LootcratesPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<LootcratesPage />)
    }).not.toThrow()
  })
})
