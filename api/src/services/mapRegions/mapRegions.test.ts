import type { MapRegion } from '@prisma/client'

import {
  mapRegions,
  mapRegion,
  createMapRegion,
  updateMapRegion,
  deleteMapRegion,
} from './mapRegions'
import type { StandardScenario } from './mapRegions.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('mapRegions', () => {
  scenario('returns all mapRegions', async (scenario: StandardScenario) => {
    const result = await mapRegions()

    expect(result.length).toEqual(Object.keys(scenario.mapRegion).length)
  })

  scenario('returns a single mapRegion', async (scenario: StandardScenario) => {
    const result = await mapRegion({ id: scenario.mapRegion.one.id })

    expect(result).toEqual(scenario.mapRegion.one)
  })

  scenario('creates a mapRegion', async (scenario: StandardScenario) => {
    const result = await createMapRegion({
      input: { map_id: scenario.mapRegion.two.map_id },
    })

    expect(result.map_id).toEqual(scenario.mapRegion.two.map_id)
  })

  scenario('updates a mapRegion', async (scenario: StandardScenario) => {
    const original = (await mapRegion({
      id: scenario.mapRegion.one.id,
    })) as MapRegion
    const result = await updateMapRegion({
      id: original.id,
      input: { map_id: scenario.mapRegion.two.map_id },
    })

    expect(result.map_id).toEqual(scenario.mapRegion.two.map_id)
  })

  scenario('deletes a mapRegion', async (scenario: StandardScenario) => {
    const original = (await deleteMapRegion({
      id: scenario.mapRegion.one.id,
    })) as MapRegion
    const result = await mapRegion({ id: original.id })

    expect(result).toEqual(null)
  })
})
