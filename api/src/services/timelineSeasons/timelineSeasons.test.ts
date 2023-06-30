import type { TimelineSeason } from '@prisma/client'

import {
  timelineSeasons,
  timelineSeason,
  createTimelineSeason,
  updateTimelineSeason,
  deleteTimelineSeason,
} from './timelineSeasons'
import type { StandardScenario } from './timelineSeasons.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('timelineSeasons', () => {
  scenario(
    'returns all timelineSeasons',
    async (scenario: StandardScenario) => {
      const result = await timelineSeasons()

      expect(result.length).toEqual(Object.keys(scenario.timelineSeason).length)
    }
  )

  scenario(
    'returns a single timelineSeason',
    async (scenario: StandardScenario) => {
      const result = await timelineSeason({
        id: scenario.timelineSeason.one.id,
      })

      expect(result).toEqual(scenario.timelineSeason.one)
    }
  )

  scenario('deletes a timelineSeason', async (scenario: StandardScenario) => {
    const original = (await deleteTimelineSeason({
      id: scenario.timelineSeason.one.id,
    })) as TimelineSeason
    const result = await timelineSeason({ id: original.id })

    expect(result).toEqual(null)
  })
})
