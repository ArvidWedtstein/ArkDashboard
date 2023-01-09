import type { TimelineBasespot } from '@prisma/client'

import {
  timelineBasespots,
  timelineBasespot,
  createTimelineBasespot,
  updateTimelineBasespot,
  deleteTimelineBasespot,
} from './timelineBasespots'
import type { StandardScenario } from './timelineBasespots.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('timelineBasespots', () => {
  scenario(
    'returns all timelineBasespots',
    async (scenario: StandardScenario) => {
      const result = await timelineBasespots()

      expect(result.length).toEqual(
        Object.keys(scenario.timelineBasespot).length
      )
    }
  )

  scenario(
    'returns a single timelineBasespot',
    async (scenario: StandardScenario) => {
      const result = await timelineBasespot({
        id: Number(scenario.timelineBasespot.one.id),
      })

      expect(result).toEqual(scenario.timelineBasespot.one)
    }
  )

  scenario('creates a timelineBasespot', async (scenario: StandardScenario) => {
    const result = await createTimelineBasespot({
      input: {
        timeline_id: scenario.timelineBasespot.two.timeline_id,
        tribeName: 'String',
        players: ['String'],
      },
    })

    expect(result.timeline_id).toEqual(
      scenario.timelineBasespot.two.timeline_id
    )
    expect(result.tribeName).toEqual('String')
    expect(result.players).toEqual(['String'])
  })

  scenario('updates a timelineBasespot', async (scenario: StandardScenario) => {
    const original = (await timelineBasespot({
      id: Number(scenario.timelineBasespot.one.id),
    })) as TimelineBasespot
    const result = await updateTimelineBasespot({
      id: Number(original.id),
      input: { tribeName: 'String2', players: [] },
    })

    expect(result.tribeName).toEqual('String2')
    expect(result.players).toEqual([])
  })

  scenario('deletes a timelineBasespot', async (scenario: StandardScenario) => {
    const original = (await deleteTimelineBasespot({
      id: Number(scenario.timelineBasespot.one.id),
    })) as TimelineBasespot
    const result = await timelineBasespot({ id: Number(original.id) })

    expect(result).toEqual(null)
  })
})
