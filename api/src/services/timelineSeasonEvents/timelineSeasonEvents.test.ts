import type { TimelineSeasonEvent } from '@prisma/client'

import {
  timelineSeasonEvents,
  timelineSeasonEvent,
  createTimelineSeasonEvent,
  updateTimelineSeasonEvent,
  deleteTimelineSeasonEvent,
} from './timelineSeasonEvents'
import type { StandardScenario } from './timelineSeasonEvents.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('timelineSeasonEvents', () => {
  scenario(
    'returns all timelineSeasonEvents',
    async (scenario: StandardScenario) => {
      const result = await timelineSeasonEvents()

      expect(result.length).toEqual(
        Object.keys(scenario.timelineSeasonEvent).length
      )
    }
  )

  scenario(
    'returns a single timelineSeasonEvent',
    async (scenario: StandardScenario) => {
      const result = await timelineSeasonEvent({
        id: scenario.timelineSeasonEvent.one.id,
      })

      expect(result).toEqual(scenario.timelineSeasonEvent.one)
    }
  )

  scenario(
    'creates a timelineSeasonEvent',
    async (scenario: StandardScenario) => {
      const result = await createTimelineSeasonEvent({
        input: {
          timeline_season_id:
            scenario.timelineSeasonEvent.two.timeline_season_id,
        },
      })

      expect(result.timeline_season_id).toEqual(
        scenario.timelineSeasonEvent.two.timeline_season_id
      )
    }
  )

  scenario(
    'updates a timelineSeasonEvent',
    async (scenario: StandardScenario) => {
      const original = (await timelineSeasonEvent({
        id: scenario.timelineSeasonEvent.one.id,
      })) as TimelineSeasonEvent
      const result = await updateTimelineSeasonEvent({
        id: original.id,
        input: {
          timeline_season_id:
            scenario.timelineSeasonEvent.two.timeline_season_id,
        },
      })

      expect(result.timeline_season_id).toEqual(
        scenario.timelineSeasonEvent.two.timeline_season_id
      )
    }
  )

  scenario(
    'deletes a timelineSeasonEvent',
    async (scenario: StandardScenario) => {
      const original = (await deleteTimelineSeasonEvent({
        id: scenario.timelineSeasonEvent.one.id,
      })) as TimelineSeasonEvent
      const result = await timelineSeasonEvent({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})
