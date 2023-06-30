import { render, screen } from '@redwoodjs/testing/web'

import Tooltip from './Tooltip'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Tooltip', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Tooltip content='test'>
        <p>test</p>
      </Tooltip>)
    }).not.toThrow()
  })

  it('outputs correct value', () => {
    const children = [
      <p key='1'>test</p>,
      <p key='2'>test2</p>,
    ]
    render(<Tooltip content='test'>
      {children}
    </Tooltip>)

    expect(screen.getByText('test')).toBeInTheDocument()
    expect(screen.getByText('test2')).toBeInTheDocument()
  })
})
