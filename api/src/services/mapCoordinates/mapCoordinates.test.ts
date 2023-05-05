import type { MapCoordinate } from '@prisma/client'

import {
  mapCoordinates,
  mapCoordinate,
  createMapCoordinate,
  updateMapCoordinate,
  deleteMapCoordinate,
} from './mapCoordinates'
import type { StandardScenario } from './mapCoordinates.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('mapCoordinates', () => {
  scenario('returns all mapCoordinates', async (scenario: StandardScenario) => {
    const result = await mapCoordinates()

    expect(result.length).toEqual(Object.keys(scenario.mapCoordinate).length)
  })

  scenario(
    'returns a single mapCoordinate',
    async (scenario: StandardScenario) => {
      const result = await mapCoordinate({ id: scenario.mapCoordinate.one.id })

      expect(result).toEqual(scenario.mapCoordinate.one)
    }
  )

  scenario('creates a mapCoordinate', async (scenario: StandardScenario) => {
    const result = await createMapCoordinate({
      input: { map_id: scenario.mapCoordinate.two.map_id },
    })

    expect(result.map_id).toEqual(scenario.mapCoordinate.two.map_id)
  })

  scenario('updates a mapCoordinate', async (scenario: StandardScenario) => {
    const original = (await mapCoordinate({
      id: scenario.mapCoordinate.one.id,
    })) as MapCoordinate
    const result = await updateMapCoordinate({
      id: original.id,
      input: { map_id: scenario.mapCoordinate.two.map_id },
    })

    expect(result.map_id).toEqual(scenario.mapCoordinate.two.map_id)
  })

  scenario('deletes a mapCoordinate', async (scenario: StandardScenario) => {
    const original = (await deleteMapCoordinate({
      id: scenario.mapCoordinate.one.id,
    })) as MapCoordinate
    const result = await mapCoordinate({ id: original.id })

    expect(result).toEqual(null)
  })
})
