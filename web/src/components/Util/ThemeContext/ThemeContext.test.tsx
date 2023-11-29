import { render } from '@redwoodjs/testing/web'

import ThemeContext from './ThemeContext'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ThemeContext', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ThemeContext />)
    }).not.toThrow()
  })
})
