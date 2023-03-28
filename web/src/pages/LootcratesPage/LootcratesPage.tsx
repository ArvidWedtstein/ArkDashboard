import { Link, routes } from "@redwoodjs/router";
import { MetaTags } from "@redwoodjs/web";
import lootcrates from "../../../public/lootcratesItemId.json";
import items from "../../../public/arkitems.json";
import { useState } from "react";
import ArkCard from "src/components/ArkCard/ArkCard";
const LootcratesPage = () => {
  const [search, setSearch] = useState("");
  const lootcratesList = lootcrates.lootCrates;

  const getItem = (id) => {
    return !id || isNaN(id)
      ? null
      : items.items.find((g) => g.id.toString() == id.toString())
        ? items.items.find((g) => g.id.toString() == id.toString())
        : null;
  };
  return (
    <>
      <MetaTags title="Lootcrates" description="Lootcrates page" />
      <div className="camera camera--dark">
        <div className="camera__contents">
          <div className="camera__lens-shadow"></div>
          <div className="camera__lens-ring">
            <div className="camera__lens-ring-glare1"></div>
            <div className="camera__lens-ring-glare2"></div>
            <div className="camera__lens-ring-glare3"></div>
          </div>
          <div className="camera__lens-inner">
            <div className="camera__lens-inner-glare1"></div>
            <div className="camera__lens-inner-glare2"></div>
            <div className="camera__lens-eye-shadow"></div>
            <div className="camera__lens-glare"></div>
            <div className="camera__lens-eye">
              <div className="camera__lens-eye-ring"></div>
              <div className="camera__lens-eye-inner-glare"></div>
              <div className="camera__lens-eye-center">
                <div className="camera__lens-eye-center-glare"></div>
              </div>
              <div className="camera__lens-eye-glass-color"></div>
              <div className="camera__lens-eye-glare"></div>
              <div className="camera__lens-eye-glass"></div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="mx-3 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {lootcratesList.map((lootcrate, i) => (
            <ArkCard
              title={lootcrate.name}
              subtitle={lootcrate.map}
              content={<div className="space-y-2">
                <p className="text-sm">The crate contains exactly {Math.pow(lootcrate.setQty.min, lootcrate.setQty.pow)} of the following tier sets.</p>
                {lootcrate.sets.map((s, l) => (
                  <details key={l} className="text-stone-200 bg-slate-600 rounded p-2">
                    <summary className="appearance-none font-bold">{s.name}</summary>

                    <p className="text-sm">The set "{s.name}" contains exactly {Math.pow(s.qtyScale.min, s.qtyScale.pow)} of the following item entries.</p>
                    <ul key={`crate${i}-set${l}`} className="space-y-2">
                      {s.entries.map((e, ind) => (
                        <li key={`crate${i}-set${l}-entry${ind}`} className="border border-gray-500 p-2">
                          <h3 className="font-semibold">{e.name}</h3>
                          <p className="text-sm">The item entry "{e.name}" contains exactly {Math.pow(e.qty.min, e.qty.pow)} of the following items.</p>
                          {(Math.pow(lootcrate.qualityMult.min * e.quality.min, e.quality.pow) * 100) > 0 && (<p>Quality range: {(Math.pow(lootcrate.qualityMult.min * e.quality.min, e.quality.pow) * 100).toFixed(0)}% - {(Math.pow(lootcrate.qualityMult.max * e.quality.max, e.quality.pow) * 100).toFixed(0)}%</p>)}
                          <ul className="ml-4 flex flex-col">
                            {e.items.map((itm) => (

                              getItem(itm[1])?.name && (<li className="space-x-2">
                                <Link to={routes.item({ id: itm[1].toString() })} className="inline-flex">
                                  <img src={`https://arkcheat.com/images/ark/items/${getItem(itm[1])?.image}`} className="w-6 h-6 inline-block" />
                                  <p className="text-white">{getItem(itm[1])?.name} ({e.qty.min} - {e.qty.max})</p>
                                </Link>
                              </li>)
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}</div>}
              ring={`Lvl ${lootcrate.levelReq.min}`}
            />
          ))}
        </div >
      </div >
    </>
  );
};

export default LootcratesPage;
