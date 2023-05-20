import { render } from '@redwoodjs/testing/web'

import Table from './Table'
import { Profiler } from 'react'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('Table', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<Table columns={[{
        field: 'test',
        label: 'test',
      }]} rows={[{ test: 'tewstg' }]} />)
    }).not.toThrow()
  })

  it('has good performance', () => {

    render(
      <Profiler id="Table" onRender={(id, phase, actualDuration) => {
        expect(() => {
          console.log(
            `The ${id} interaction took ` +
            `${actualDuration}ms to render (${phase})`,
          );
          return actualDuration
        }).toBeLessThanOrEqual(500)
      }}>
        <Table
          columns={[{
            field: 'test',
            label: 'test',
          }]}
          rows={[{ test: 'tewstg' }, { test: '12321' }, { test: 'row3' }, { test: 'rosdg' }, { test: 'tewstg' }, { test: '12321' }, { test: 'row3' }, { test: 'rosdg' }, { test: 'tewstg' }, { test: '12321' }, { test: 'row3' }, { test: 'rosdg' }, { test: 'tewstg' }, { test: '12321' }, { test: 'row3' }, { test: 'rosdg' }]}
        />
      </Profiler>
    )
  })
})
