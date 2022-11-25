import { render } from '@redwoodjs/testing/web'

import ArkCard from './ArkCard'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ArkCard', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ArkCard />)
    }).not.toThrow()
  })
})
