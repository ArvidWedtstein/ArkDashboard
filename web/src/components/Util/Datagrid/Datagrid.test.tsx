import { render } from '@redwoodjs/testing/web'

import Datagrid from './DataGrid'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Datagrid', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Datagrid />)
    }).not.toThrow()
  })
})
