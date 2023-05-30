import type { TimelineBasespotPerson } from '@prisma/client'

import {
  timelineBasespotPeople,
  timelineBasespotPerson,
  createTimelineBasespotPerson,
  updateTimelineBasespotPerson,
  deleteTimelineBasespotPerson,
} from './timelineBasespotPeople'
import type { StandardScenario } from './timelineBasespotPeople.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('timelineBasespotPeople', () => {
  scenario(
    'returns all timelineBasespotPeople',
    async (scenario: StandardScenario) => {
      const result = await timelineBasespotPeople()

      expect(result.length).toEqual(
        Object.keys(scenario.timelineBasespotPerson).length
      )
    }
  )

  scenario(
    'returns a single timelineBasespotPerson',
    async (scenario: StandardScenario) => {
      const result = await timelineBasespotPerson({
        id: scenario.timelineBasespotPerson.one.id,
      })

      expect(result).toEqual(scenario.timelineBasespotPerson.one)
    }
  )

  scenario(
    'creates a timelineBasespotPerson',
    async (scenario: StandardScenario) => {
      const result = await createTimelineBasespotPerson({
        input: {
          timelinebasespot_id:
            scenario.timelineBasespotPerson.two.timelinebasespot_id,
        },
      })

      expect(result.timelinebasespot_id).toEqual(
        scenario.timelineBasespotPerson.two.timelinebasespot_id
      )
    }
  )

  scenario(
    'updates a timelineBasespotPerson',
    async (scenario: StandardScenario) => {
      const original = (await timelineBasespotPerson({
        id: scenario.timelineBasespotPerson.one.id,
      })) as TimelineBasespotPerson
      const result = await updateTimelineBasespotPerson({
        id: original.id,
        input: {
          timelinebasespot_id:
            scenario.timelineBasespotPerson.two.timelinebasespot_id,
        },
      })

      expect(result.timelinebasespot_id).toEqual(
        scenario.timelineBasespotPerson.two.timelinebasespot_id
      )
    }
  )

  scenario(
    'deletes a timelineBasespotPerson',
    async (scenario: StandardScenario) => {
      const original = (await deleteTimelineBasespotPerson({
        id: scenario.timelineBasespotPerson.one.id,
      })) as TimelineBasespotPerson
      const result = await timelineBasespotPerson({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})
