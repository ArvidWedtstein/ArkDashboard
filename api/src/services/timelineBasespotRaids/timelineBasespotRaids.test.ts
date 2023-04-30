import type { TimelineBasespotRaid } from '@prisma/client'

import {
  timelineBasespotRaids,
  timelineBasespotRaid,
  createTimelineBasespotRaid,
  updateTimelineBasespotRaid,
  deleteTimelineBasespotRaid,
} from './timelineBasespotRaids'
import type { StandardScenario } from './timelineBasespotRaids.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('timelineBasespotRaids', () => {
  scenario(
    'returns all timelineBasespotRaids',
    async (scenario: StandardScenario) => {
      const result = await timelineBasespotRaids()

      expect(result.length).toEqual(
        Object.keys(scenario.timelineBasespotRaid).length
      )
    }
  )

  scenario(
    'returns a single timelineBasespotRaid',
    async (scenario: StandardScenario) => {
      const result = await timelineBasespotRaid({
        id: scenario.timelineBasespotRaid.one.id,
      })

      expect(result).toEqual(scenario.timelineBasespotRaid.one)
    }
  )

  scenario(
    'creates a timelineBasespotRaid',
    async (scenario: StandardScenario) => {
      const result = await createTimelineBasespotRaid({
        input: {
          timelinebasespot_id:
            scenario.timelineBasespotRaid.two.timelinebasespot_id,
        },
      })

      expect(result.timelinebasespot_id).toEqual(
        scenario.timelineBasespotRaid.two.timelinebasespot_id
      )
    }
  )

  scenario(
    'updates a timelineBasespotRaid',
    async (scenario: StandardScenario) => {
      const original = (await timelineBasespotRaid({
        id: scenario.timelineBasespotRaid.one.id,
      })) as TimelineBasespotRaid
      const result = await updateTimelineBasespotRaid({
        id: original.id,
        input: {
          timelinebasespot_id:
            scenario.timelineBasespotRaid.two.timelinebasespot_id,
        },
      })

      expect(result.timelinebasespot_id).toEqual(
        scenario.timelineBasespotRaid.two.timelinebasespot_id
      )
    }
  )

  scenario(
    'deletes a timelineBasespotRaid',
    async (scenario: StandardScenario) => {
      const original = (await deleteTimelineBasespotRaid({
        id: scenario.timelineBasespotRaid.one.id,
      })) as TimelineBasespotRaid
      const result = await timelineBasespotRaid({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})
