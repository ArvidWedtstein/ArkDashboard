import type { MapResource } from '@prisma/client'

import {
  mapResources,
  mapResource,
  createMapResource,
  updateMapResource,
  deleteMapResource,
} from './mapResources'
import type { StandardScenario } from './mapResources.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('mapResources', () => {
  scenario('returns all mapResources', async (scenario: StandardScenario) => {
    const result = await mapResources()

    expect(result.length).toEqual(Object.keys(scenario.mapResource).length)
  })

  scenario(
    'returns a single mapResource',
    async (scenario: StandardScenario) => {
      const result = await mapResource({ id: scenario.mapResource.one.id })

      expect(result).toEqual(scenario.mapResource.one)
    }
  )

  scenario('creates a mapResource', async (scenario: StandardScenario) => {
    const result = await createMapResource({
      input: { map_id: scenario.mapResource.two.map_id },
    })

    expect(result.map_id).toEqual(scenario.mapResource.two.map_id)
  })

  scenario('updates a mapResource', async (scenario: StandardScenario) => {
    const original = (await mapResource({
      id: scenario.mapResource.one.id,
    })) as MapResource
    const result = await updateMapResource({
      id: original.id,
      input: { map_id: scenario.mapResource.two.map_id },
    })

    expect(result.map_id).toEqual(scenario.mapResource.two.map_id)
  })

  scenario('deletes a mapResource', async (scenario: StandardScenario) => {
    const original = (await deleteMapResource({
      id: scenario.mapResource.one.id,
    })) as MapResource
    const result = await mapResource({ id: original.id })

    expect(result).toEqual(null)
  })
})
