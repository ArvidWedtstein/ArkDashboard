import { render } from '@redwoodjs/testing/web'

import Paginate from './Paginate'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Paginate', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Paginate />)
    }).not.toThrow()
  })
})
