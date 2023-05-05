import type { MapNote } from '@prisma/client'

import {
  mapNotes,
  mapNote,
  createMapNote,
  updateMapNote,
  deleteMapNote,
} from './mapNotes'
import type { StandardScenario } from './mapNotes.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('mapNotes', () => {
  scenario('returns all mapNotes', async (scenario: StandardScenario) => {
    const result = await mapNotes()

    expect(result.length).toEqual(Object.keys(scenario.mapNote).length)
  })

  scenario('returns a single mapNote', async (scenario: StandardScenario) => {
    const result = await mapNote({ id: scenario.mapNote.one.id })

    expect(result).toEqual(scenario.mapNote.one)
  })

  scenario('creates a mapNote', async (scenario: StandardScenario) => {
    const result = await createMapNote({
      input: { map_id: scenario.mapNote.two.map_id },
    })

    expect(result.map_id).toEqual(scenario.mapNote.two.map_id)
  })

  scenario('updates a mapNote', async (scenario: StandardScenario) => {
    const original = (await mapNote({ id: scenario.mapNote.one.id })) as MapNote
    const result = await updateMapNote({
      id: original.id,
      input: { map_id: scenario.mapNote.two.map_id },
    })

    expect(result.map_id).toEqual(scenario.mapNote.two.map_id)
  })

  scenario('deletes a mapNote', async (scenario: StandardScenario) => {
    const original = (await deleteMapNote({
      id: scenario.mapNote.one.id,
    })) as MapNote
    const result = await mapNote({ id: original.id })

    expect(result).toEqual(null)
  })
})
