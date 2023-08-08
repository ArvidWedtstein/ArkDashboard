import { render } from '@redwoodjs/testing/web'

import FileUpload from './FileUpload'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('FileUpload', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<FileUpload storagePath='avatars' />)
    }).not.toThrow()
  })


  it('disables upload button when no new files are present', () => {
    const { getByText } = render(<FileUpload storagePath='avatars' />)
    expect(getByText('Upload')).toBeInTheDocument()
    expect(getByText('Upload')).toBeDisabled()
  })

  it('enables upload button when new files are present', () => {
    const { getByText } = render(<FileUpload storagePath='avatars' defaultValue='0.212623052023.jpg' />)
    expect(getByText('Upload')).toBeInTheDocument()
    expect(getByText('Upload')).toBeEnabled()
  })
})
