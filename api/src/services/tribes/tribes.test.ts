import type { Tribe } from '@prisma/client'

import { tribes, tribe, createTribe, updateTribe, deleteTribe } from './tribes'
import type { StandardScenario } from './tribes.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('tribes', () => {
  scenario('returns all tribes', async (scenario: StandardScenario) => {
    const result = await tribes()

    expect(result.length).toEqual(Object.keys(scenario.tribe).length)
  })

  scenario('returns a single tribe', async (scenario: StandardScenario) => {
    const result = await tribe({ id: scenario.tribe.one.id })

    expect(result).toEqual(scenario.tribe.one)
  })

  scenario('creates a tribe', async () => {
    const result = await createTribe({
      input: { name: 'String' },
    })

    expect(result.name).toEqual('String')
  })

  scenario('updates a tribe', async (scenario: StandardScenario) => {
    const original = (await tribe({ id: scenario.tribe.one.id })) as Tribe
    const result = await updateTribe({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a tribe', async (scenario: StandardScenario) => {
    const original = (await deleteTribe({ id: scenario.tribe.one.id })) as Tribe
    const result = await tribe({ id: original.id })

    expect(result).toEqual(null)
  })
})
