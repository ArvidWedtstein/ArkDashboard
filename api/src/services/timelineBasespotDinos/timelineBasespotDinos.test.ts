import type { TimelineBasespotDino } from '@prisma/client'

import {
  timelineBasespotDinos,
  timelineBasespotDino,
  createTimelineBasespotDino,
  updateTimelineBasespotDino,
  deleteTimelineBasespotDino,
} from './timelineBasespotDinos'
import type { StandardScenario } from './timelineBasespotDinos.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('timelineBasespotDinos', () => {
  scenario(
    'returns all timelineBasespotDinos',
    async (scenario: StandardScenario) => {
      const result = await timelineBasespotDinos()

      expect(result.length).toEqual(
        Object.keys(scenario.timelineBasespotDino).length
      )
    }
  )

  scenario(
    'returns a single timelineBasespotDino',
    async (scenario: StandardScenario) => {
      const result = await timelineBasespotDino({
        id: scenario.timelineBasespotDino.one.id,
      })

      expect(result).toEqual(scenario.timelineBasespotDino.one)
    }
  )

  scenario(
    'creates a timelineBasespotDino',
    async (scenario: StandardScenario) => {
      const result = await createTimelineBasespotDino({
        input: {
          timelinebasespot_id:
            scenario.timelineBasespotDino.two.timelinebasespot_id,
          dino_id: scenario.timelineBasespotDino.two.dino_id,
        },
      })

      expect(result.timelinebasespot_id).toEqual(
        scenario.timelineBasespotDino.two.timelinebasespot_id
      )
      expect(result.dino_id).toEqual(scenario.timelineBasespotDino.two.dino_id)
    }
  )

  scenario(
    'updates a timelineBasespotDino',
    async (scenario: StandardScenario) => {
      const original = (await timelineBasespotDino({
        id: scenario.timelineBasespotDino.one.id,
      })) as TimelineBasespotDino
      const result = await updateTimelineBasespotDino({
        id: original.id,
        input: {
          dino_id: scenario.timelineBasespotDino.two.timelinebasespot_id,
        },
      })

      expect(result.dino_id).toEqual(
        scenario.timelineBasespotDino.two.timelinebasespot_id
      )
    }
  )

  scenario(
    'deletes a timelineBasespotDino',
    async (scenario: StandardScenario) => {
      const original = (await deleteTimelineBasespotDino({
        id: scenario.timelineBasespotDino.one.id,
      })) as TimelineBasespotDino
      const result = await timelineBasespotDino({ id: original.id })

      expect(result).toEqual(null)
    }
  )
})
