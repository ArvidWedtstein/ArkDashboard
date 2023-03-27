import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import lootcrates from "../../../public/lootcratesItemId.json";
import items from "../../../public/arkitems.json";
import { useState } from 'react';
const LootcratesPage = () => {
  const [search, setSearch] = useState('')
  const lootcratesList = lootcrates.lootCrates;

  const getItem = (id) => {
    return !id || isNaN(id) ? null : items.items.find((g) => g.id.toString() == id.toString()) ? items.items.find((g) => g.id.toString() == id.toString()).name : null
  }
  return (
    <>
      <MetaTags title="Lootcrates" description="Lootcrates page" />

      <div>
        <h1>LootcratesPage</h1>

        <div className="mx-3 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {lootcratesList.map((lootcrate, i) => (
            <div key={`crate${i}`} className="bg-zinc-600 rounded-lg">
              {lootcrate.sets.map((s, l) => (
                <details className="text-stone-200">
                  <summary>{s.name}</summary>
                  <ul key={`crate${i}-set${l}`}>
                    {s.entries.map((e, ind) => (
                      <li key={`crate${i}-set${l}-entry${ind}`}>
                        <details className="ml-5">
                          <summary>{e.name}</summary>
                          <ul className="ml-4">{e.items.map((itm) => <li><p className="text-white">{getItem(itm[1])}</p></li>)}</ul>
                        </details>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default LootcratesPage
