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

  scenario('creates a basespot', async () => {
    const result = await createBasespot({
      input: {
        name: 'String',
        description: 'String',
        latitude: 4305440.691423464,
        longitude: 6893699.730383891,
      },
    })

    expect(result.name).toEqual('String')
    expect(result.description).toEqual('String')
    expect(result.latitude).toEqual(4305440.691423464)
    expect(result.longitude).toEqual(6893699.730383891)
  })

  scenario('updates a basespot', async (scenario: StandardScenario) => {
    const original = (await basespot({
      id: scenario.basespot.one.id,
    })) as Basespot
    const result = await updateBasespot({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a basespot', async (scenario: StandardScenario) => {
    const original = (await deleteBasespot({
      id: scenario.basespot.one.id,
    })) as Basespot
    const result = await basespot({ id: original.id })

    expect(result).toEqual(null)
  })
})
