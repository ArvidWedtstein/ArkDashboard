import type { Dino } from '@prisma/client'

import { dinos, dino, createDino, updateDino, deleteDino } from './dinos'
import type { StandardScenario } from './dinos.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('dinos', () => {
  scenario('returns all dinos', async (scenario: StandardScenario) => {
    const result = await dinos()

    expect(result.length).toEqual(Object.keys(scenario.dino).length)
  })

  scenario('returns a single dino', async (scenario: StandardScenario) => {
    const result = await dino({ id: scenario.dino.one.id })

    expect(result).toEqual(scenario.dino.one)
  })

  scenario('creates a dino', async () => {
    const result = await createDino({
      input: {
        name: 'String',
        can_destroy: 'String',
        fits_through: 'String',
        eats: 'String',
        drops: 'String',
        type: 'String',
        carryable_by: 'String',
      },
    })

    expect(result.name).toEqual('String')
    expect(result.can_destroy).toEqual('String')
    expect(result.fits_through).toEqual('String')
    expect(result.eats).toEqual('String')
    expect(result.drops).toEqual('String')
    expect(result.type).toEqual('String')
    expect(result.carryable_by).toEqual('String')
  })

  scenario('updates a dino', async (scenario: StandardScenario) => {
    const original = (await dino({ id: scenario.dino.one.id })) as Dino
    const result = await updateDino({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a dino', async (scenario: StandardScenario) => {
    const original = (await deleteDino({ id: scenario.dino.one.id })) as Dino
    const result = await dino({ id: original.id })

    expect(result).toEqual(null)
  })
})
