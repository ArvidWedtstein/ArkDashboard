import type { DinoStat } from '@prisma/client'

import {
  dinoStats,
  dinoStat,
  createDinoStat,
  updateDinoStat,
  deleteDinoStat,
} from './dinoStats'
import type { StandardScenario } from './dinoStats.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('dinoStats', () => {
  scenario('returns all dinoStats', async (scenario: StandardScenario) => {
    const result = await dinoStats()

    expect(result.length).toEqual(Object.keys(scenario.dinoStat).length)
  })

  scenario('returns a single dinoStat', async (scenario: StandardScenario) => {
    const result = await dinoStat({ id: scenario.dinoStat.one.id })

    expect(result).toEqual(scenario.dinoStat.one)
  })

  scenario('creates a dinoStat', async (scenario: StandardScenario) => {
    const result = await createDinoStat({
      input: {
        dino_id: scenario.dinoStat.two.dino_id,
        item_id: scenario.dinoStat.two.item_id,
        type: 'food',
      },
    })

    expect(result.dino_id).toEqual(scenario.dinoStat.two.dino_id)
    expect(result.item_id).toEqual(scenario.dinoStat.two.item_id)
    expect(result.type).toEqual('food')
  })

  scenario('updates a dinoStat', async (scenario: StandardScenario) => {
    const original = (await dinoStat({
      id: scenario.dinoStat.one.id,
    })) as DinoStat
    const result = await updateDinoStat({
      id: original.id,
      input: { type: 'saddle' },
    })

    expect(result.type).toEqual('saddle')
  })

  scenario('deletes a dinoStat', async (scenario: StandardScenario) => {
    const original = (await deleteDinoStat({
      id: scenario.dinoStat.one.id,
    })) as DinoStat
    const result = await dinoStat({ id: original.id })

    expect(result).toEqual(null)
  })
})
