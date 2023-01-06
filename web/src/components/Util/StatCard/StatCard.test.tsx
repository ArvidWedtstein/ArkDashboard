import { render } from '@redwoodjs/testing/web'

import StatCard from './StatCard'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

// TODO: Add tests for dark mode and light mode classes
describe('StatCard', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<StatCard stat="test" value={10}/>)
    }).not.toThrow()
  })

  it('renders the stat', () => {
    const { getByText } = render(<StatCard stat="test" value={10}/>)
    expect(getByText('test')).toBeInTheDocument()
  })

  it('renders the value', () => {
    const { getByText } = render(<StatCard stat="test" value={10}/>)
    expect(getByText('10')).toBeInTheDocument()
  })

  it('should have bg-stone-200 class', () => {
    const { getByText } = render(<StatCard stat="test" value={10}/>)
    expect(getByText('test')).toHaveClass('bg-stone-200')
  })
})
