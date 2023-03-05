import type { Map } from '@prisma/client'

import { maps, map, createMap, updateMap, deleteMap } from './maps'
import type { StandardScenario } from './maps.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('maps', () => {
  scenario('returns all maps', async (scenario: StandardScenario) => {
    const result = await maps()

    expect(result.length).toEqual(Object.keys(scenario.map).length)
  })

  scenario('returns a single map', async (scenario: StandardScenario) => {
    const result = await map({ id: scenario.map.one.id })

    expect(result).toEqual(scenario.map.one)
  })

  scenario('deletes a map', async (scenario: StandardScenario) => {
    const original = (await deleteMap({ id: scenario.map.one.id })) as Map
    const result = await map({ id: original.id })

    expect(result).toEqual(null)
  })
})