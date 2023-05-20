import { render } from '@redwoodjs/testing/web'
import { Profiler } from 'react'
import Map from './Map'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Map', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Map map={"1"} />)
    }).not.toThrow()
  })

  it('performs good (renders below 500 ms)', () => {

    render(
      <Profiler id="Map" onRender={(id, phase, actualDuration) => {
        expect(() => {
          console.log(
            `The ${id} interaction took ` +
            `${actualDuration}ms to render (${phase})`,
          );
          return actualDuration
        }).toBeLessThanOrEqual(500)
      }}>
        <Map map={"1"} />
      </Profiler>
    )
  })
})
