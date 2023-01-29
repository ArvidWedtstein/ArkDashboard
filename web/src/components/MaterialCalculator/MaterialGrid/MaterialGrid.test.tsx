import { render } from '@redwoodjs/testing/web'

import { MaterialGrid } from './MaterialGrid'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('MaterialGrid', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MaterialGrid />)
    }).not.toThrow()
  })
  it('renders the MaterialGrid component', () => {
    const { getByText } = render(<MaterialGrid />)
    expect(getByText('MaterialGrid')).toBeInTheDocument()
  })
  it('Adds turret tower items when button is clicked', () => {
    const wrapper = render(<MaterialGrid />)
    let btn = wrapper.findByTestId('turrettowerbtn');

    expect(btn).toBeInTheDocument();

    // btn.then((btn) => {
    //   btn.click();

    // })
  })
  // TODO: Write test to check for all add and remove buttons, if the correct items are added and removed and if the correct amount of items are correct.
})
