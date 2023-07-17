import type { TimelineSeasonBasespot } from '@prisma/client'

import {
  timelineSeasonBasespots,
  timelineSeasonBasespot,
  createTimelineSeasonBasespot,
  updateTimelineSeasonBasespot,
  deleteTimelineSeasonBasespot,
} from './timelineSeasonBasespots'
import type { StandardScenario } from './timelineSeasonBasespots.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('timelineSeasonBasespots', () => {
  scenario(
    'returns all timelineSeasonBasespots',
    async (scenario: StandardScenario) => {
      const result = await timelineSeasonBasespots()

      expect(result.length).toEqual(
        Object.keys(scenario.timelineSeasonBasespot).length
      )
    }
  )

  scenario(
    'returns a single timelineSeasonBasespot',
    async (scenario: StandardScenario) => {
      const result = await timelineSeasonBasespot({
        id: scenario.timelineSeasonBasespot.one.id,
      })

      expect(result).toEqual(scenario.timelineSeasonBasespot.one)
    }
  )

  scenario(
    'creates a timelineSeasonBasespot',
    async (scenario: StandardScenario) => {
      const result = await createTimelineSeasonBasespot({
        input: {
          timeline_season_id:
            scenario.timelineSeasonBasespot.two.timeline_season_id,
        },
      })

      expect(result.timeline_season_id).toEqual(
        scenario.timelineSeasonBasespot.two.timeline_season_id
      )
    }
  )

  scenario(
    'updates a timelineSeasonBasespot',
    async (scenario: StandardScenario) => {
      const original = (await timelineSeasonBasespot({
        id: scenario.timelineSeasonBasespot.one.id,
      })) as TimelineSeasonBasespot
      const result = await updateTimelineSeasonBasespot({
        id: original.id,
        input: {
          timeline_season_id:
            scenario.timelineSeasonBasespot.two.timeline_season_id,
        },
      })

      expect(result.timeline_season_id).toEqual(
        scenario.timelineSeasonBasespot.two.timeline_season_id
      )
    }
  )

  scenario(
    'deletes a timelineSeasonBasespot',
    async (scenario: StandardScenario) => {
      const original = (await deleteTimelineSeasonBasespot({
        id: scenario.timelineSeasonBasespot.one.id,
      })) as TimelineSeasonBasespot
      const result = await timelineSeasonBasespot({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})
