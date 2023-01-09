import { render } from '@redwoodjs/testing/web'

import Lookup from './Lookup'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Lookup', () => {
  it('renders successfully', () => {
    const items = [
      {
        name: "item1"
      },
      {
        name: "item2"
      },
      {
        name: "item3"
      },
      {
        name: "item4"
      },
    ]
    expect(() => {
      render(<Lookup items={items} />)
    }).not.toThrow()
  })
})
