import type { TimelineSeasonPerson } from '@prisma/client'

import {
  timelineSeasonPeople,
  timelineSeasonPerson,
  createTimelineSeasonPerson,
  updateTimelineSeasonPerson,
  deleteTimelineSeasonPerson,
} from './timelineSeasonPeople'
import type { StandardScenario } from './timelineSeasonPeople.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('timelineSeasonPeople', () => {
  scenario(
    'returns all timelineSeasonPeople',
    async (scenario: StandardScenario) => {
      const result = await timelineSeasonPeople()

      expect(result.length).toEqual(
        Object.keys(scenario.timelineSeasonPerson).length
      )
    }
  )

  scenario(
    'returns a single timelineSeasonPerson',
    async (scenario: StandardScenario) => {
      const result = await timelineSeasonPerson({
        id: scenario.timelineSeasonPerson.one.id,
      })

      expect(result).toEqual(scenario.timelineSeasonPerson.one)
    }
  )

  scenario(
    'creates a timelineSeasonPerson',
    async (scenario: StandardScenario) => {
      const result = await createTimelineSeasonPerson({
        input: {
          timeline_season_id:
            scenario.timelineSeasonPerson.two.timeline_season_id,
        },
      })

      expect(result.timeline_season_id).toEqual(
        scenario.timelineSeasonPerson.two.timeline_season_id
      )
    }
  )

  scenario(
    'updates a timelineSeasonPerson',
    async (scenario: StandardScenario) => {
      const original = (await timelineSeasonPerson({
        id: scenario.timelineSeasonPerson.one.id,
      })) as TimelineSeasonPerson
      const result = await updateTimelineSeasonPerson({
        id: original.id,
        input: {
          timeline_season_id:
            scenario.timelineSeasonPerson.two.timeline_season_id,
        },
      })

      expect(result.timeline_season_id).toEqual(
        scenario.timelineSeasonPerson.two.timeline_season_id
      )
    }
  )

  scenario(
    'deletes a timelineSeasonPerson',
    async (scenario: StandardScenario) => {
      const original = (await deleteTimelineSeasonPerson({
        id: scenario.timelineSeasonPerson.one.id,
      })) as TimelineSeasonPerson
      const result = await timelineSeasonPerson({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})
