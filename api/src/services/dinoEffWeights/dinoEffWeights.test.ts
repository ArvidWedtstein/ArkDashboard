import type { DinoEffWeight } from '@prisma/client'

import {
  dinoEffWeights,
  dinoEffWeight,
  createDinoEffWeight,
  updateDinoEffWeight,
  deleteDinoEffWeight,
} from './dinoEffWeights'
import type { StandardScenario } from './dinoEffWeights.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('dinoEffWeights', () => {
  scenario('returns all dinoEffWeights', async (scenario: StandardScenario) => {
    const result = await dinoEffWeights()

    expect(result.length).toEqual(Object.keys(scenario.dinoEffWeight).length)
  })

  scenario(
    'returns a single dinoEffWeight',
    async (scenario: StandardScenario) => {
      const result = await dinoEffWeight({ id: scenario.dinoEffWeight.one.id })

      expect(result).toEqual(scenario.dinoEffWeight.one)
    }
  )

  scenario('creates a dinoEffWeight', async (scenario: StandardScenario) => {
    const result = await createDinoEffWeight({
      input: {
        dino_id: scenario.dinoEffWeight.two.dino_id,
        item_id: scenario.dinoEffWeight.two.item_id,
        value: 2402355.9228034765,
      },
    })

    expect(result.dino_id).toEqual(scenario.dinoEffWeight.two.dino_id)
    expect(result.item_id).toEqual(scenario.dinoEffWeight.two.item_id)
    expect(result.value).toEqual(2402355.9228034765)
  })

  scenario('updates a dinoEffWeight', async (scenario: StandardScenario) => {
    const original = (await dinoEffWeight({
      id: scenario.dinoEffWeight.one.id,
    })) as DinoEffWeight
    const result = await updateDinoEffWeight({
      id: original.id,
      input: { value: 4913798.660044946 },
    })

    expect(result.value).toEqual(4913798.660044946)
  })

  scenario('deletes a dinoEffWeight', async (scenario: StandardScenario) => {
    const original = (await deleteDinoEffWeight({
      id: scenario.dinoEffWeight.one.id,
    })) as DinoEffWeight
    const result = await dinoEffWeight({ id: original.id })

    expect(result).toEqual(null)
  })
})
