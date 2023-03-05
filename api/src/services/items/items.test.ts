import type { Item } from '@prisma/client'

import { items, item, createItem, updateItem, deleteItem } from './items'
import type { StandardScenario } from './items.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('items', () => {
  scenario('returns all items', async (scenario: StandardScenario) => {
    const result = await items()

    expect(result.length).toEqual(Object.keys(scenario.item).length)
  })

  scenario('returns a single item', async (scenario: StandardScenario) => {
    const result = await item({ id: scenario.item.one.id })

    expect(result).toEqual(scenario.item.one)
  })

  scenario('creates a item', async () => {
    const result = await createItem({
      input: { name: 'String', crafted_in: 'String', effects: 'String' },
    })

    expect(result.name).toEqual('String')
    expect(result.crafted_in).toEqual('String')
    expect(result.effects).toEqual('String')
  })

  scenario('updates a item', async (scenario: StandardScenario) => {
    const original = (await item({ id: scenario.item.one.id })) as Item
    const result = await updateItem({
      id: original.id,
      input: { name: 'String2' },
    })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a item', async (scenario: StandardScenario) => {
    const original = (await deleteItem({ id: scenario.item.one.id })) as Item
    const result = await item({ id: original.id })

    expect(result).toEqual(null)
  })
})
