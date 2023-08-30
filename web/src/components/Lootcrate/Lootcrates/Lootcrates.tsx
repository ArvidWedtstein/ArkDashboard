import { Form, Label, SearchField, Submit } from '@redwoodjs/forms'
import { navigate, useParams } from '@redwoodjs/router'
import { Link, routes, parseSearch } from '@redwoodjs/router'
import { useCallback, useEffect, useState } from 'react'
import Lookup from 'src/components/Util/Lookup/Lookup'
import { removeDuplicates } from 'src/lib/formatters'

import type {
  FindLootcrates,
} from 'types/graphql'


const LootcratesList = ({ lootcratesByMap, maps }: FindLootcrates) => {
  let { map, search } = useParams();
  console.log(lootcratesByMap.length)
  const onSubmit = useCallback((data) => {
    navigate(
      routes.lootcrates({
        ...parseSearch(
          Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v != "" && v != undefined)
          ) as any
        ),
      })
    );
  }, []);
  return (
    <div className="rw-segment">
      <Form className="flex w-auto" onSubmit={onSubmit}>
        <nav className="flex w-full flex-row justify-center space-x-2">
          <div className="rw-button-group !w-full !space-x-0">
            <Label name="map" className="sr-only">
              Choose a Map
            </Label>
            <Lookup
              name="map"
              className="rw-input mt-0 !rounded-none !rounded-l-lg min-w-[10rem]"
              options={
                maps?.map((map) => ({
                  label: map.name,
                  value: Number(map.id),
                  image: `https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Map/${map.icon}`,
                })) || []
              }
              placeholder="Map"
              defaultValue={map}
            />
            <Lookup
              name="category"
              className="rw-input !rounded-none mt-0"
              options={removeDuplicates(
                lootcratesByMap.filter((k) => k != undefined && k?.name != "").map((crate) => ({
                  label: crate?.name.split(' ')[0],
                  value: crate?.name.split(' ')[0],
                }))
              )}
            />

            <Label name="search" className="sr-only">
              Search for item
            </Label>
            <SearchField
              name="search"
              className="rw-input mt-0 !w-full"
              placeholder="Search..."
              defaultValue={search}
              validation={{
                shouldUnregister: true,
              }}
            />
            <Submit className="rw-button rw-button-gray rounded-l-none">
              Search
            </Submit>
          </div>
        </nav>
      </Form>
      <ul
        className={`grid grid-cols-9 w-full bg-[#171717] bg-[length:calc(200%_/_9)]`}
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 600 1040' xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' clip-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2'%3E%3Cpath d='M0 0l300 173.205v346.41L0 346.41V0z' fill='url(%23_Linear1)'/%3E%3Cpath d='M300 519.615L600 692.82v346.411L300 866.025v-346.41z' fill='url(%23_Linear2)'/%3E%3Cpath d='M600 0L300 173.205v346.41L600 346.41V0z' fill='url(%23_Linear3)'/%3E%3Cpath d='M300 519.615L0 692.82v346.411l300-173.206v-346.41z' fill='url(%23_Linear4)'/%3E%3Cdefs%3E%3ClinearGradient id='_Linear1' x1='0' y1='0' x2='1' y2='0' gradientUnits='userSpaceOnUse' gradientTransform='rotate(-30 646.41 173.205) scale(346.41)'%3E%3Cstop offset='0' stop-color='%23171717'/%3E%3Cstop offset='1' stop-color='%23cde2d9'/%3E%3C/linearGradient%3E%3ClinearGradient id='_Linear2' x1='0' y1='0' x2='1' y2='0' gradientUnits='userSpaceOnUse' gradientTransform='rotate(-30 1766.025 -126.796) scale(346.41)'%3E%3Cstop offset='0' stop-color='%23171717'/%3E%3Cstop offset='1' stop-color='%23cde2d9'/%3E%3C/linearGradient%3E%3ClinearGradient id='_Linear3' x1='0' y1='0' x2='1' y2='0' gradientUnits='userSpaceOnUse' gradientTransform='rotate(-150 346.41 92.82) scale(346.41)'%3E%3Cstop offset='0' stop-color='%23e8dad1'/%3E%3Cstop offset='1' stop-color='%23fff0e7'/%3E%3C/linearGradient%3E%3ClinearGradient id='_Linear4' x1='0' y1='0' x2='1' y2='0' gradientUnits='userSpaceOnUse' gradientTransform='rotate(-150 266.025 392.82) scale(346.41)'%3E%3Cstop offset='0' stop-color='%23e8dad1'/%3E%3Cstop offset='1' stop-color='%23fff0e7'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E")`,
        }}
      >
        {lootcratesByMap.map(({ id, name, required_level, image, color }) => (
          <li
            className={"relative col-end-[span_2] [&:nth-child(8n-7)]:col-start-2 pb-[86.6%]"}
            key={id}
          >
            <Link to={routes.lootcrate({ id })} className='absolute w-1/2 mt-[14%] transform-gpu -skew-y-[30deg] p-3 font-montserrat text-md md:text-xl'>
              <h2 className=''>{name}</h2>
              <p className=''>LVL {required_level}</p>
            </Link>
            <Link to={routes.lootcrate({ id })}>
              <img
                className={`hover:cursor-pointer duration-300 hover:bottom-0 absolute left-1/2 w-1/3 -bottom-3.5 -translate-x-1/2 transition-all will-change-transform hover:!drop-shadow-none`}
                src={`https://xyhqysuxlcxuodtuwrlf.supabase.co/storage/v1/object/public/arkimages/Lootcrate/${image || "White_Beacon.webp"}`}
                alt=''
                style={{
                  filter: `drop-shadow(0 80px 20px ${color || '#000000'}33)`
                }}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default LootcratesList
