import type { Basespot } from '@prisma/client'

import {
  basespots,
  basespot,
  createBasespot,
  updateBasespot,
  deleteBasespot,
} from './basespots'
import type { StandardScenario } from './basespots.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('basespots', () => {
  scenario('returns all basespots', async (scenario: StandardScenario) => {
    const result = await basespots()

    expect(result.length).toEqual(Object.keys(scenario.basespot).length)
  })

  scenario('returns a single basespot', async (scenario: StandardScenario) => {
    const result = await basespot({ id: scenario.basespot.one.id })

    expect(result).toEqual(scenario.basespot.one)
  })

  scenario('creates a basespot', async (scenario: StandardScenario) => {
    const result = await createBasespot({
      input: {
        latitude: 9211981.209636737,
        longitude: 3619539.0308738286,
        map_id: scenario.basespot.two.map_id,
      },
    })

    expect(result.latitude).toEqual(9211981.209636737)
    expect(result.longitude).toEqual(3619539.0308738286)
    expect(result.map_id).toEqual(scenario.basespot.two.map_id)
  })

  scenario('updates a basespot', async (scenario: StandardScenario) => {
    const original = (await basespot({
      id: scenario.basespot.one.id,
    })) as Basespot
    const result = await updateBasespot({
      id: original.id,
      input: { latitude: 8017896.478442905 },
    })

    expect(result.latitude).toEqual(8017896.478442905)
  })

  scenario('deletes a basespot', async (scenario: StandardScenario) => {
    const original = (await deleteBasespot({
      id: scenario.basespot.one.id,
    })) as Basespot
    const result = await basespot({ id: original.id })

    expect(result).toEqual(null)
  })
})
