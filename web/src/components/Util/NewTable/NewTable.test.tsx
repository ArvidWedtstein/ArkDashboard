import { render } from '@redwoodjs/testing/web'

import NewTable from './NewTable'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('NewTable', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewTable />)
    }).not.toThrow()
  })
})
