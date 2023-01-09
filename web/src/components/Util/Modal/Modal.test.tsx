import { render } from '@redwoodjs/testing/web'

import { Modal } from './Modal'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Modal', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Modal isOpen={false} />)
    }).not.toThrow()
  })

  it('renders title', () => {
    const { getByText } = render(
      <Modal isOpen={true} title={"test123"}  />
    )
    expect(getByText('test123')).toBeInTheDocument()
  })

  it('renders content', () => {
    const { getByText } = render(
      <Modal isOpen={true} content={"test123"} />
    )
    expect(getByText('test123')).toBeInTheDocument()
  })
})
