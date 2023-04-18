import type { Timeline } from '@prisma/client'

import {
  timelines,
  timeline,
  createTimeline,
  updateTimeline,
  deleteTimeline,
} from './timelines'
import type { StandardScenario } from './timelines.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('timelines', () => {
  scenario('returns all timelines', async (scenario: StandardScenario) => {
    const result = await timelines()

    expect(result.length).toEqual(Object.keys(scenario.timeline).length)
  })

  scenario('returns a single timeline', async (scenario: StandardScenario) => {
    const result = await timeline({ id: scenario.timeline.one.id })

    expect(result).toEqual(scenario.timeline.one)
  })

  scenario('creates a timeline', async (scenario: StandardScenario) => {
    const result = await createTimeline({
      input: { created_by: scenario.timeline.two.created_by },
    })

    expect(result.created_by).toEqual(scenario.timeline.two.created_by)
  })

  scenario('updates a timeline', async (scenario: StandardScenario) => {
    const original = (await timeline({
      id: scenario.timeline.one.id,
    })) as Timeline
    const result = await updateTimeline({
      id: original.id,
      input: { created_by: scenario.timeline.two.created_by },
    })

    expect(result.created_by).toEqual(scenario.timeline.two.created_by)
  })

  scenario('deletes a timeline', async (scenario: StandardScenario) => {
    const original = (await deleteTimeline({
      id: scenario.timeline.one.id,
    })) as Timeline
    const result = await timeline({ id: original.id })

    expect(result).toEqual(null)
  })
})
