import { Form, NumberField } from "@redwoodjs/forms";
import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import {
  timeFormatL,
  combineBySummingKeys,
  truncate,
} from "src/lib/formatters";
import { useCallback, useState } from "react";

import type { DeleteDinoMutationVariables, FindDinoById } from "types/graphql";
import clsx from "clsx";
import Table from "src/components/Util/Table/Table";

const DELETE_DINO_MUTATION = gql`
  mutation DeleteDinoMutation($id: String!) {
    deleteDino(id: $id) {
      id
    }
  }
`;
interface stats {
  h: number;
  s: number;
  o: number;
  f: number;
  w: number;
  d: number;
  m: number;
  t: number;
}
interface Props {
  dino: NonNullable<FindDinoById["dino"]>;
}

const Dino = ({ dino }: Props) => {
  const [deleteDino] = useMutation(DELETE_DINO_MUTATION, {
    onCompleted: () => {
      toast.success("Dino deleted");
      navigate(routes.dinos());
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onDeleteClick = (id: DeleteDinoMutationVariables["id"]) => {
    if (confirm("Are you sure you want to delete dino " + id + "?")) {
      deleteDino({ variables: { id } });
    }
  };

  let walls = {
    t: "thatch",
    w: "wooden",
    a: "adobe",
    s: "stone",
    m: "metal",
    tk: "tek",
  };

  const canDestroy = ({ value }) => {
    return value > 0 ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        className="fill-pea-500 h-8 w-8"
      >
        <path d="M475.3 123.3l-272 272C200.2 398.4 196.1 400 192 400s-8.188-1.562-11.31-4.688l-144-144c-6.25-6.25-6.25-16.38 0-22.62s16.38-6.25 22.62 0L192 361.4l260.7-260.7c6.25-6.25 16.38-6.25 22.62 0S481.6 117.1 475.3 123.3z" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
        className="h-8 w-8 fill-red-500"
      >
        <path d="M315.3 411.3c-6.253 6.253-16.37 6.253-22.63 0L160 278.6l-132.7 132.7c-6.253 6.253-16.37 6.253-22.63 0c-6.253-6.253-6.253-16.37 0-22.63L137.4 256L4.69 123.3c-6.253-6.253-6.253-16.37 0-22.63c6.253-6.253 16.37-6.253 22.63 0L160 233.4l132.7-132.7c6.253-6.253 16.37-6.253 22.63 0c6.253 6.253 6.253 16.37 0 22.63L182.6 256l132.7 132.7C321.6 394.9 321.6 405.1 315.3 411.3z" />
      </svg>
    );
  };
  const [useFoundationUnit, setUseFoundationUnit] = useState(false);
  const [maturation, setMaturation] = useState(0);
  const calcMaturationPercent = useCallback(() => {
    let timeElapsed = maturation * parseInt(dino.maturation_time) * 1;
    return timeElapsed / 100;
  }, [maturation, setMaturation]);
  const multipliers = {
    hatch: 1,
    baby: 1,
    consumption: 1,
    taming: 1,
    mature: 1,
    harvest: 1,
    xp: 1,
    matingInterval: 1,
    eggHatchSpeed: 1,
    babyCuddleInterval: 1,
    babyImprintAmount: 1,
    hexagonReward: 1,
  };
  return (
    <div className="container mx-auto">
      <section className="grid grid-cols-1 md:grid-cols-2">
        <img
          src={`https://www.dododex.com/media/creature/${dino.name
            .toLowerCase()
            .replaceAll(" ", "")
            .replace("spinosaurus", "spinosaur")
            .replaceAll("ö", "o")
            .replaceAll("tek", "")
            .replaceAll("paraceratherium", "paracer")
            .replace("&", "")
            .replace("prime", "")
            .replace(",masteroftheocean", "")
            .replace("insectswarm", "bladewasp")}.png`}
          alt={dino.name}
          className="m-4 w-full p-4"
        />
        <div className="py-4 px-8 text-sm font-light text-white">
          <div className="m-0 mb-4 text-sm">
            <strong className="text-3xl font-light uppercase tracking-widest">
              {dino.name}
            </strong>
            <div className="flex flex-row space-x-2 italic">
              <span>{dino.synonyms && dino.synonyms.join(", ")}</span>
            </div>
          </div>

          <div className="mr-4 mb-4 italic">
            <p>{dino.description}</p>
          </div>
          <div className="mr-4 mb-4 inline-block">
            <strong>Ridable:</strong> {dino.ridable ? "Yes" : "No"}
          </div>
          {dino.immobilized_by && dino.immobilized_by.length > 0 && (
            <div className="mr-4 mb-4 flex flex-row space-x-1">
              <strong>Immobilized By:</strong>

              {/* {dino.immobilized_by.map((item: any) => (

                  <Link to={item.id ? routes.item({ id: item.id }) : routes.items()}>
                  <img
                    className="w-8"
                    title={item.name}
                    alt={item.name}
                    src={`https://arkids.net/image/item/120/${item.name
                      .replaceAll(" ", "-")
                      .replace("plant-species-y", "plant-species-y-trap")}.png`}
                  />
                </Link>
              ))} */}
            </div>
          )}
          {/* {dino.can_destroy && dino.can_destroy.length > 0 && (
            <div className="mr-4 mb-4 flex flex-row space-x-1">
              <strong>Can Destroy:</strong>

              {dino.can_destroy.map((w) => (
                <Link to={routes.item({ id: "1" })}>
                  <img
                    className="w-8"
                    title={walls[w]}
                    alt={walls[w]}
                    src={`https://arkids.net/image/item/120/${walls[w]}-wall.png`}
                  />
                </Link>
              ))}
            </div>
          )} */}
          <br />
          <div className="mr-4 mb-4 inline-block">
            <strong>X-Variant:</strong> {dino.x_variant ? "Yes" : "No"}
          </div>
          <div className="mr-4 mb-4 inline-block">
            <strong>Weapon:</strong> {dino.mounted_weaponry ? "Yes" : "No"}
          </div>
          <br />
          <div className="mr-4 mb-4 inline-block">
            <strong>Type:</strong>{" "}
            {dino.violent_tame ? "Aggressive" : "Passive"}
          </div>

          {!dino.disable_food && dino.eats && dino.eats.length > 0 && (
            <>
              <div className="text-lg">Food</div>
              <div className="mb-4">
                {/* {dino.eats.map((f: any) => (
                  <p className="leading-5 flex">
                    {f.name}
                    <img
                      className="w-5"
                      title={f.name}
                      alt={f.name}
                      src={`https://arkids.net/image/item/120/${f.name
                        .replaceAll(" ", "-")
                        .replace("plant-species-y", "plant-species-y-trap")}.png`}
                    />
                  </p>
                ))} */}
              </div>
            </>
          )}
          <div className="text-lg">Some tegst</div>
          <div className="mr-4 mb-4 inline-block">
            <strong>Taming:</strong> yes
          </div>
        </div>
      </section>
      {dino.maturation_time && dino.incubation_time && (
        <section className="my-3 rounded-md p-4 text-stone-600 dark:text-white">
          <Form className="my-3 mx-auto flex justify-center">
            <NumberField
              name="matPerc"
              id="matPerc"
              className="rw-input w-20 rounded-none rounded-l-lg"
              placeholder="Maturation Percent"
              min={0}
              max={100}
              onInput={(event) => {
                setMaturation(
                  parseInt(event.target ? event.target["value"] : 0)
                );
              }}
            />
            <label
              htmlFor="matPerc"
              className="rw-input rounded-none rounded-r-lg"
            >
              %
            </label>
          </Form>
          <ol className="w-full items-center justify-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
            <li
              className={clsx("flex items-center space-x-2.5", {
                "dark:text-pea-500 text-pea-600 [&>*]:border-pea-600 [&>*]:dark:border-pea-500":
                  calcMaturationPercent() >=
                  dino.incubation_time / multipliers.hatch,
                "text-gray-500 dark:text-gray-400 [&>*]:border-gray-500 [&>*]:dark:border-gray-400":
                  calcMaturationPercent() <
                  dino.incubation_time / multipliers.hatch,
              })}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                1
              </span>
              <span>
                <h3 className="font-medium leading-tight">Incubation</h3>
                <p className="text-sm">
                  {timeFormatL(dino.incubation_time / multipliers.hatch)}
                </p>
              </span>
            </li>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 fill-gray-500 dark:fill-gray-400"
                viewBox="0 0 256 512"
              >
                <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
              </svg>
            </li>
            <li
              className={clsx("flex items-center space-x-2.5", {
                "dark:text-pea-500 text-pea-600 [&>*]:border-pea-600 [&>*]:dark:border-pea-500":
                  calcMaturationPercent() >=
                  (parseInt(dino.maturation_time) * multipliers.mature) / 10,
                "text-gray-500 dark:text-gray-400 [&>*]:border-gray-500 [&>*]:dark:border-gray-400":
                  calcMaturationPercent() <
                  (parseInt(dino.maturation_time) * multipliers.mature) / 10,
              })}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                2
              </span>
              <span>
                <h3 className="font-medium leading-tight">Baby</h3>
                <p className="text-sm">
                  {timeFormatL(
                    (parseInt(dino.maturation_time) * multipliers.mature) / 10
                  )}
                </p>
              </span>
            </li>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 fill-gray-500 dark:fill-gray-400"
                viewBox="0 0 256 512"
              >
                <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
              </svg>
            </li>
            <li
              className={clsx("flex items-center space-x-2.5", {
                "dark:text-pea-500 text-pea-600 [&>*]:border-pea-600 [&>*]:dark:border-pea-500":
                  calcMaturationPercent() >=
                  (parseInt(dino.maturation_time) * multipliers.mature) / 2 -
                  (parseInt(dino.maturation_time) * multipliers.mature) / 10,
                "text-gray-500 dark:text-gray-400 [&>*]:border-gray-500 [&>*]:dark:border-gray-400":
                  calcMaturationPercent() <
                  (parseInt(dino.maturation_time) * multipliers.mature) / 2 -
                  (parseInt(dino.maturation_time) * multipliers.mature) / 10,
              })}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                3
              </span>
              <span>
                <h3 className="font-medium leading-tight">Juvenile</h3>
                <p className="text-sm">
                  {timeFormatL(
                    (parseInt(dino.maturation_time) * multipliers.mature) / 2 -
                    (parseInt(dino.maturation_time) * multipliers.mature) / 10
                  )}
                </p>
              </span>
            </li>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 fill-gray-500 dark:fill-gray-400"
                viewBox="0 0 256 512"
              >
                <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
              </svg>
            </li>
            <li
              className={clsx("flex items-center space-x-2.5", {
                "dark:text-pea-500 text-pea-600 [&>*]:border-pea-600 [&>*]:dark:border-pea-500":
                  calcMaturationPercent() >=
                  (parseInt(dino.maturation_time) * 1) / 2,
                "text-gray-500 dark:text-gray-400 [&>*]:border-gray-500 [&>*]:dark:border-gray-400":
                  calcMaturationPercent() <
                  (parseInt(dino.maturation_time) * 1) / 2,
              })}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                4
              </span>
              <span>
                <h3 className="font-medium leading-tight">Adolescent</h3>
                <p className="text-sm">
                  {timeFormatL(
                    (parseInt(dino.maturation_time) * multipliers.mature) / 2
                  )}
                </p>
              </span>
            </li>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 fill-gray-500 dark:fill-gray-400"
                viewBox="0 0 256 512"
              >
                <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
              </svg>
            </li>
            <li
              className={clsx("flex items-center space-x-2.5", {
                "dark:text-pea-500 text-pea-600 [&>*]:border-pea-600 [&>*]:dark:border-pea-500":
                  calcMaturationPercent() >= parseInt(dino.maturation_time) * 1,
                "text-gray-500 dark:text-gray-400 [&>*]:border-gray-500 [&>*]:dark:border-gray-400":
                  calcMaturationPercent() < parseInt(dino.maturation_time) * 1,
              })}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                5
              </span>
              <span>
                <h3 className="font-medium leading-tight">Total</h3>
                <p className="text-sm">
                  {timeFormatL(
                    parseInt(dino.maturation_time) * multipliers.mature
                  )}
                </p>
              </span>
            </li>
          </ol>
        </section>
      )}
      {dino.egg_min &&
        dino.egg_max &&
        dino.egg_max !== 0 &&
        dino.egg_min !== 0 && (
          <section className="mt-4 text-white">
            <img
              src={`https://www.dododex.com/media/item/Dodo_Egg.png`}
              alt={dino.name}
            />
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium leading-tight">Egg</h3>
              <p className="text-sm">
                {dino.egg_min} - {dino.egg_max} °C
              </p>
            </div>
          </section>
        )}

      {dino.movement && (
        <section className="my-3 rounded-md p-4 text-stone-600 dark:text-white">
          <div className="flex flex-col text-white">
            <div className="flex flex-row items-center space-x-1">
              <p className="w-14"></p>
              <p className="w-20">Base</p>
              <p className="w-20">Sprint</p>
            </div>
            {Object.entries(dino.movement["w"]).map(([stat, value], index) => (
              <div
                className="flex flex-row items-center space-x-1"
                key={`${stat}-${index}`}
              >
                <p className="w-14">{stat}</p>
                {["base", "sprint"].map((label, d) => (
                  <p className="rw-input w-20" key={`${label}${d}${index}`}>
                    {!value[label]
                      ? "-"
                      : truncate(
                        (useFoundationUnit
                          ? Number(value[label] / 300)
                          : Number(value[label])
                        ).toFixed(2),
                        6
                      )}
                  </p>
                ))}
                <p className="w-20">
                  {useFoundationUnit ? "Foundations" : `Units`} per sec
                </p>
              </div>
            ))}
          </div>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={useFoundationUnit}
              className="peer sr-only"
              onChange={(e) => setUseFoundationUnit(!useFoundationUnit)}
            />
            <div className="rw-toggle peer-focus:ring-pea-300 dark:peer-focus:ring-pea-800 peer-checked:bg-pea-600 peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Game Units / Foundation
            </span>
          </label>
        </section>
      )}

      {dino.can_destroy && (
        <section className="mt-4 text-gray-400 dark:text-white">
          <h3 className="font-medium leading-tight">Can Destroy</h3>
          <Table
            rows={[
              combineBySummingKeys(
                {
                  t: false,
                  w: false,
                  a: false,
                  s: false,
                  m: false,
                  tk: false,
                },
                dino.can_destroy.reduce((a, v) => ({ ...a, [v]: true }), {})
              ),
            ]}
            columns={[
              {
                field: "t",
                label: "Thatch",
                renderCell: canDestroy,
              },
              {
                field: "w",
                label: "Wood",
                renderCell: canDestroy,
              },
              {
                field: "a",
                label: "Adobe",
                renderCell: canDestroy,
              },
              {
                field: "s",
                label: "Stone",
                renderCell: canDestroy,
              },
              {
                field: "m",
                label: "Metal",
                renderCell: canDestroy,
              },
              {
                field: "tk",
                label: "Tek",
                renderCell: canDestroy,
              },
            ]}
          />
        </section>
      )}
      <section className="mt-4 text-gray-400 dark:text-white">
        <Table
          rows={[dino.base_stats]}
          columns={[
            {
              field: "h",
              label: "Health",
              valueFormatter: (value) => value.value.b,
            },
            {
              field: "s",
              label: "Stamina",
              valueFormatter: (value) => value.value.b,
            },
            {
              field: "w",
              label: "Weight",
              valueFormatter: (value) => value.value.b,
            },
            {
              field: "f",
              label: "Food",
              valueFormatter: (value) => value.value.b,
            },
            {
              field: "t",
              label: "Torpor",
              valueFormatter: (value) => value.value.b,
            },
            !dino.water_movement && {
              field: "o",
              label: "Oxygen",
              valueFormatter: (value) => value.value.b,
            },
            {
              field: "m",
              label: "Melee",
              valueFormatter: (value) => value.value.b,
            },
            {
              field: "d",
              label: "Damage",
              valueFormatter: (value) => value.value.b,
            },
          ]}
        />
      </section>
      <section className="mt-4 grid grid-cols-1 text-gray-400 dark:text-white md:grid-cols-2">
        {(dino.DinoEffWeight && dino.DinoEffWeight.filter((d) => d.is_gather_eff).length > 0) && (
          <div className="space-y-2">
            <h4>Gather Efficiency</h4>
            <Table
              className="w-fit"
              header={false}
              rows={(dino.DinoEffWeight as any[]).filter((d) => d.is_gather_eff).sort(
                (a, b) => b.value - a.value
              )}
              columns={[
                {
                  field: "image",
                  label: "",
                  valueFormatter: (value) => {
                    return (
                      <img
                        src={`https://arkcheat.com/images/ark/items/${value.value}`}
                        className="h-8 w-8 self-end"
                      />
                    );
                  },
                },
                {
                  field: "name",
                  label: "",
                  valueFormatter: (value) => {
                    return (
                      <p>{value.value}</p>
                    );
                  },
                },
                {
                  field: "value",
                  label: "",
                  valueFormatter: (value) => (
                    <div className="flex h-2 w-32 flex-row divide-x divide-black rounded-full bg-gray-300">
                      {Array.from(Array(5)).map((_, i) => (
                        <div
                          key={`${i},${value.value}`}
                          className={clsx(
                            `h-full w-1/5 first:rounded-l-full last:rounded-r-full`,
                            {
                              "bg-transparent": Math.round(value.value) < i + 1,
                              "[&:nth-child(1)]:bg-red-500 [&:nth-child(2)]:bg-orange-500 [&:nth-child(3)]:bg-yellow-500 [&:nth-child(4)]:bg-lime-500 [&:nth-child(5)]:bg-green-500":
                                Math.round(value.value) >= i + 1,
                            }
                          )}
                        ></div>
                      ))}
                    </div>
                  ),
                },
                {
                  field: "rank",
                  label: "",
                  valueFormatter: ({ value }) => {
                    return (
                      value <= 10 && <p>#{value}</p>
                    );
                  }
                }
              ]}
            />
          </div>
        )}
        {/* {!dino.gather_eff && Object.values(dino.gather_eff) !== null && (
          <div className="space-y-2">
            <h4>Gather Efficiency</h4>
            <Table
              className="w-fit"
              header={false}
              rows={(dino.gather_eff as any[]).sort(
                (a, b) => b.value - a.value
              )}
              columns={[
                {
                  field: "itemId",
                  label: "",
                  valueFormatter: (value) => {
                    return (
                      value.row && (
                        <div className="mr-3 flex flex-row space-x-2">
                          <img
                            src={`https://www.arkresourcecalculator.com/assets/images/80px-${value.row.image}`}
                            className="h-8 w-8 self-end"
                          />
                          <p>{value.row.name}</p>
                        </div>
                      )
                    );
                  },
                },
                {
                  field: "value",
                  label: "",
                  valueFormatter: (value) => (
                    <div className="flex h-2 w-32 flex-row divide-x divide-black rounded-full bg-gray-300">
                      {Array.from(Array(5)).map((_, i) => (
                        <div
                          key={`${i},${value.value}`}
                          className={clsx(
                            `h-full w-1/5 first:rounded-l-full last:rounded-r-full`,
                            {
                              "bg-transparent": Math.round(value.value) < i + 1,
                              "[&:nth-child(1)]:bg-red-500 [&:nth-child(2)]:bg-orange-500 [&:nth-child(3)]:bg-yellow-500 [&:nth-child(4)]:bg-lime-500 [&:nth-child(5)]:bg-green-500":
                                Math.round(value.value) >= i + 1,
                            }
                          )}
                        ></div>
                      ))}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )} */}
        {(dino.DinoEffWeight && dino.DinoEffWeight.filter((d) => !d.is_gather_eff).length > 0) && (
          <div className="space-y-2">
            <h4>Weight Reduction</h4>
            <Table
              className="w-fit"
              header={false}
              rows={(dino.DinoEffWeight as any[]).filter((d) => !d.is_gather_eff).sort(
                (a, b) => b.value - a.value
              )}
              columns={[
                {
                  field: "image",
                  label: "",
                  valueFormatter: (value) => {
                    return (
                      <img
                        src={`https://arkcheat.com/images/ark/items/${value.value}`}
                        className="h-8 w-8 self-end"
                      />
                    );
                  },
                },
                {
                  field: "name",
                  label: "",
                  valueFormatter: (value) => {
                    return (
                      <p>{value.value}</p>
                    );
                  },
                },
                {
                  field: "value",
                  label: "",
                  valueFormatter: (value) => (
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="inline-block w-4 fill-current"
                      >
                        <path d="M510.3 445.9L437.3 153.8C433.5 138.5 420.8 128 406.4 128H346.1c3.625-9.1 5.875-20.75 5.875-32c0-53-42.1-96-96-96S159.1 43 159.1 96c0 11.25 2.25 22 5.875 32H105.6c-14.38 0-27.13 10.5-30.88 25.75l-73.01 292.1C-6.641 479.1 16.36 512 47.99 512h416C495.6 512 518.6 479.1 510.3 445.9zM256 128C238.4 128 223.1 113.6 223.1 96S238.4 64 256 64c17.63 0 32 14.38 32 32S273.6 128 256 128z" />
                      </svg>
                      <p className="mx-1 text-lime-300">{value.value}%</p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                        className="inline-block w-4 fill-current text-lime-300"
                      >
                        <path d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z" />
                      </svg>
                    </div>
                  ),
                },
                {
                  field: "rank",
                  label: "",
                  valueFormatter: ({ value }) => {
                    return (
                      value <= 10 && <p>#{value}</p>
                    );
                  }
                }
              ]}
            />
          </div>
        )}
        {/* {dino.weight_reduction && (
          <div className="space-y-2">
            <h4>Weight Reduction</h4>
            <Table
              className="w-fit"
              header={false}
              rows={(dino.weight_reduction as any).sort(
                (a, b) => b.value - a.value
              )}
              columns={[
                {
                  field: "itemId",
                  label: "",
                  valueFormatter: (value) => {
                    return (
                      value.row && (
                        <div className="mr-3 flex flex-row space-x-2">
                          <img
                            src={`https://www.arkresourcecalculator.com/assets/images/80px-${value.row.image}`}
                            className="h-8 w-8 self-end"
                          />
                          <p>{value.row.name}</p>
                        </div>
                      )
                    );
                  },
                },
                {
                  field: "value",
                  label: "",
                  valueFormatter: (value) => (
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        className="inline-block w-4 fill-current"
                      >
                        <path d="M510.3 445.9L437.3 153.8C433.5 138.5 420.8 128 406.4 128H346.1c3.625-9.1 5.875-20.75 5.875-32c0-53-42.1-96-96-96S159.1 43 159.1 96c0 11.25 2.25 22 5.875 32H105.6c-14.38 0-27.13 10.5-30.88 25.75l-73.01 292.1C-6.641 479.1 16.36 512 47.99 512h416C495.6 512 518.6 479.1 510.3 445.9zM256 128C238.4 128 223.1 113.6 223.1 96S238.4 64 256 64c17.63 0 32 14.38 32 32S273.6 128 256 128z" />
                      </svg>
                      <p className="mx-1 text-lime-300">50%</p>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                        className="inline-block w-4 fill-current text-lime-300"
                      >
                        <path d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z" />
                      </svg>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )} */}
      </section>

      <section className="mt-4 text-gray-400 dark:text-white">
        <div className="space-y-2">
          <h4>Drops</h4>
        </div>
        <Table
          className="w-fit"
          header={false}
          rows={dino.drops as any}
          columns={[
            {
              field: "itemId",
              label: "",
              valueFormatter: (value) => {
                return (
                  value.row && (
                    <div className="mr-3 flex flex-row space-x-2">
                      <img
                        src={`https://www.arkresourcecalculator.com/assets/images/80px-${value.row.image}`}
                        className="h-8 w-8 self-end"
                      />
                      <p>{value.row.name}</p>
                    </div>
                  )
                );
              },
            },
          ]}
        />
      </section>
      {/*
      <nav className="rw-button-group">
        <Link
          to={routes.editDino({ id: dino.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(dino.id)}
        >
          Delete
        </button>
      </nav> */}
      {/* <div className="p-4">
          <Form onSubmit={onSubmit}>
            <Label
              name="name"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Name
            </Label>

            <TextField
              name="name"
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ required: true }}
              defaultValue={"Dodo"}
            />

            <FieldError name="name" className="rw-field-error" />
            <Label
              name="level"
              className="rw-label"
              errorClassName="rw-label rw-label-error"
            >
              Level
            </Label>

            <TextField
              name="level"
              className="rw-input"
              errorClassName="rw-input rw-input-error"
              validation={{ required: true }}
              defaultValue={1}
            />

            <FieldError name="level" className="rw-field-error" />

            <div className="rw-button-group">
              <Submit className="rw-button rw-button-green">Calc</Submit>
              <button
                type="button"
                className="rw-button rw-button-red"
                onClick={genRandomStats}
              >
                Random
              </button>
            </div>
          </Form>
          <Table
            rows={dino}
            columns={[
              {
                field: "stat",
                label: "Stat",
                bold: true,
                sortable: true,
              },
              {
                field: "base",
                label: "Base",
                numeric: true,
                sortable: true,
              },
              {
                field: "increasePerLevelWild",
                label: "Increase per level",
                numeric: true,
              },
              {
                field: "dino",
                label: "Total",
              },
            ]}
            renderActions={(row) => {
              return (
                <nav className="flex flex-row content-center items-center align-middle">
                  <button
                    id={`rem${row.stat}`}
                    disabled={level[row.stat] <= 0}
                    className="rw-button rw-button-small rw-button-red rounded-full disabled:bg-slate-500 disabled:text-white"
                    onClick={onRemove}
                  >
                    -
                  </button>
                  <input
                    disabled={true}
                    className="rw-input max-w-[50px]"
                    value={level[row.stat]}
                  />
                  <button
                    id={`add${row.stat}`}
                    disabled={points <= 0}
                    className="rw-button rw-button-small rw-button-green disabled:bg-slate-500 disabled:text-white"
                    onClick={onAdd}
                  >
                    +
                  </button>
                </nav>
              );
            }}
          />

          {select && (
            <>
              <Table
                rows={select.food}
                columns={[
                  {
                    field: "name",
                    label: "Food",
                    bold: true,
                    sortable: true,
                    renderCell: ({ row, rowIndex }) => {
                      return (
                        <button
                          className="relative flex items-center justify-start"
                          onClick={() => useExclusive(rowIndex)}
                        >
                          <img
                            className="mr-3 h-8 w-8"
                            src={
                              "https://www.arkresourcecalculator.com/assets/images/80px-" +
                              row.icon
                            }
                          />
                          <p>{row.name}</p>
                        </button>
                      );
                    },
                  },
                  {
                    field: "use",
                    label: "Use",
                    bold: true,
                    renderCell: ({ row }) => {
                      return (
                        <div
                          className="flex flex-row items-center"
                          key={`${row.use}+${Math.random()}`}
                        >
                          <button
                            type="button"
                            disabled={row.use <= 0}
                            className="relative mx-2 h-8 w-8 rounded-full border border-black text-lg font-semibold text-black hover:bg-white hover:text-black disabled:bg-slate-500 disabled:text-white dark:border-white dark:text-white"
                          >
                            -
                          </button>
                          <p
                            defaultValue={row.use}
                            className="rw-input w-16 p-3 text-center"
                          >
                            {row.use}/{row.max}
                          </p>
                          <button
                            type="button"
                            disabled={row.use >= row.max}
                            className="relative mx-2 h-8 w-8 rounded-full border border-black text-lg font-semibold text-black hover:bg-white hover:text-black disabled:bg-slate-500 disabled:text-white dark:border-white dark:text-white"
                          >
                            +
                          </button>
                        </div>
                      );
                    },
                  },
                  {
                    field: "seconds",
                    label: "Time",
                    numeric: true,
                    className: "text-center",
                    valueFormatter: ({ value }) => {
                      let minutes = Math.floor(value / 60);
                      let remainingSeconds =
                        value % 60 < 10 ? `0${value % 60}` : value % 60;
                      return `${minutes}:${remainingSeconds}`;
                    },
                  },
                  {
                    field: "results",
                    label: "Effectiveness",
                    renderCell: ({ value }) => {
                      return (
                        <div className="block">
                          <div className="my-2 h-1 overflow-hidden rounded-md bg-white">
                            <span
                              className="bg-pea-500 block h-1 w-full rounded-md"
                              style={{
                                width: `${value ? value.effectiveness : 0}%`,
                              }}
                            ></span>
                          </div>
                          <p className="text-xs">
                            {(value ? value.effectiveness : 0).toFixed(2)}%
                          </p>
                        </div>
                      );
                    },
                  },
                ]}
              />
              <p className="my-3 text-center text-sm dark:text-gray-200">
                With selected food:
              </p>
              <section className="my-3 rounded-md p-4 dark:bg-zinc-600 bg-stone-200 dark:text-white">
                <div className="relative my-3 grid grid-cols-4 gap-4 text-center">
                  <div className="not-last:before:content-['>'] relative block before:absolute before:ml-auto before:w-full">
                    <p className="text-thin text-sm">
                      Lvl<span className="ml-1 text-lg font-semibold">100</span>
                    </p>
                  </div>
                  <div className="not-last:before:content-['>'] relative block before:absolute before:ml-auto before:w-full">
                    <p className="text-thin text-sm">
                      {(tame.effectiveness ? tame.effectiveness : 0).toFixed(2)}
                      %
                    </p>
                  </div>
                  <div className="not-last:before:content-['>'] relative block before:absolute before:ml-auto before:w-full">
                    <p className="text-thin text-sm">
                      Lvl
                      <span className="ml-1 text-lg font-semibold">
                        {parseInt(tame.dino.level) + tame.levelsGained}
                      </span>
                    </p>
                  </div>
                  <div className="relative block before:absolute before:ml-auto before:w-full last:before:content-['']">
                    <p className="text-thin text-sm">
                      Lvl
                      <span className="ml-1 text-lg font-semibold">
                        {parseInt(tame.dino.level) +
                          tame.levelsGained +
                          (xVariant ? 88 : 77)}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="my-3 grid grid-cols-4 gap-4 text-center">
                  <p className="text-thin text-xs">Current</p>
                  <p className="text-thin text-xs">Taming Eff.</p>
                  <p className="text-thin text-xs">With Bonus</p>
                  <p className="text-thin text-xs">Max after taming</p>
                </div>
              </section>
              <p className="my-3 text-center text-sm dark:text-gray-200">
                {tame.dino.name} breeding:
              </p>
              {typeof tame.dino.maturationTime !== "undefined" &&
                (typeof tame.dino.incubationTime !== "undefined" ||
                  typeof tame.dino.basePoints !== "undefined") && (
                  <section className="my-3 rounded-md p-4 text-stone-600 dark:text-white">
                    <ol className="w-full items-center justify-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
                      <li className="dark:text-pea-500 text-pea-600 flex items-center space-x-2.5">
                        <span className="border-pea-600 dark:border-pea-500 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                          1
                        </span>
                        <span>
                          <h3 className="font-medium leading-tight">
                            Incubation
                          </h3>
                          <p className="text-sm">
                            {timeFormatL(tame.dino.incubationTime / 1)} Hatch Multiplier
                          </p>
                        </span>
                      </li>
                      <li>
                        <input
                          id="1"
                          type="checkbox"
                          className="peer/item1 hidden"
                        />
                        <label
                          htmlFor="1"
                          className="peer-checked/item1:dark:fill-pea-500 peer-checked/item1:fill-pea-600 fill-gray-500 dark:fill-gray-400 "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 "
                            viewBox="0 0 256 512"
                          >
                            <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
                          </svg>
                        </label>
                      </li>
                      <li className="flex items-center space-x-2.5 text-gray-500 dark:text-gray-400">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-500 dark:border-gray-400">
                          2
                        </span>
                        <span>
                          <h3 className="font-medium leading-tight">Baby</h3>
                          <p className="text-sm">
                            {timeFormatL((tame.dino.maturationTime * 1) / 10)}
                          </p>
                        </span>
                      </li>
                      <li>
                        <input
                          id="2"
                          type="checkbox"
                          className="peer/item2 hidden"
                        />
                        <label
                          htmlFor="2"
                          className="peer-checked/item2:dark:fill-pea-500 peer-checked/item2:fill-pea-600 fill-gray-500 dark:fill-gray-400 "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 "
                            viewBox="0 0 256 512"
                          >
                            <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
                          </svg>
                        </label>
                      </li>
                      <li className="flex items-center space-x-2.5 text-gray-500 dark:text-gray-400">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-500 dark:border-gray-400">
                          3
                        </span>
                        <span>
                          <h3 className="font-medium leading-tight">
                            Juvenile
                          </h3>
                          <p className="text-sm">
                            {timeFormatL(
                              (tame.dino.maturationTime * 1) / 2 -
                              (tame.dino.maturationTime * 1) / 10
                            )}
                          </p>
                        </span>
                      </li>
                      <li>
                        <input
                          id="3"
                          type="checkbox"
                          className="peer/item3 hidden"
                        />
                        <label
                          htmlFor="3"
                          className="peer-checked/item3:dark:fill-pea-500 peer-checked/item3:fill-pea-600 fill-gray-500 dark:fill-gray-400 "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 "
                            viewBox="0 0 256 512"
                          >
                            <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
                          </svg>
                        </label>
                      </li>
                      <li className="flex items-center space-x-2.5 text-gray-500 dark:text-gray-400">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-500 dark:border-gray-400">
                          4
                        </span>
                        <span>
                          <h3 className="font-medium leading-tight">
                            Adolescent
                          </h3>
                          <p className="text-sm">
                            {timeFormatL((tame.dino.maturationTime * 1) / 2)} Maturemultiplier
                          </p>
                        </span>
                      </li>
                      <li>
                        <input
                          id="4"
                          type="checkbox"
                          className="peer/item4 hidden"
                        />
                        <label
                          htmlFor="4"
                          className="peer-checked/item4:dark:fill-pea-500 peer-checked/item4:fill-pea-600 fill-gray-500 dark:fill-gray-400 "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 "
                            viewBox="0 0 256 512"
                          >
                            <path d="M219.9 266.7L75.89 426.7c-5.906 6.562-16.03 7.094-22.59 1.188c-6.918-6.271-6.783-16.39-1.188-22.62L186.5 256L52.11 106.7C46.23 100.1 46.75 90.04 53.29 84.1C59.86 78.2 69.98 78.73 75.89 85.29l144 159.1C225.4 251.4 225.4 260.6 219.9 266.7z" />
                          </svg>
                        </label>
                      </li>
                      <li className="flex items-center space-x-2.5 text-gray-500 dark:text-gray-400">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-500 dark:border-gray-400">
                          5
                        </span>
                        <span>
                          <h3 className="font-medium leading-tight">Total</h3>
                          <p className="text-sm">
                            {timeFormatL(tame.dino.maturationTime * 1)}
                          </p>
                        </span>
                      </li>
                    </ol>
                  </section>
                )}
            </>
          )}
        </div> */}
    </div>
  );
};

export default Dino;

// const {
//   formState: { isDirty, isValid, isSubmitting, dirtyFields },
//   getValues,
//   setValue,
// } = useForm({ defaultValues: { name: "Dodo", level: 1 } });
// let [dino, setDino] = useState(null);
// let [select, setSelect] = useState(null);
// let [tame, setTame] = useState(null);
// let [points, setPoints] = useState(null);
// let [level, setLevel] = useState<stats>({
//   h: 0,
//   s: 0,
//   o: 0,
//   f: 0,
//   w: 0,
//   d: 0,
//   m: 0,
//   t: 0,
// });

// const onAdd = (data) => {
//   let id = data.target.id.replace("add", "");
//   setLevel({ ...level, [id]: level[id] + 1 });
//   setPoints(points - 1);
//   let dyno = dino.find((d) => d.stat === id);
//   if (!dyno) return null;
//   // dyno.dino = (level[id] + 1) * dyno.increaseperlevel + dyno.base;
//   dyno.dino = (level[id] + 1) * dyno.increasePerLevelWild + dyno.base;
// };
// const onRemove = (data) => {
//   let id = data.target.id.replace("rem", "");
//   setLevel({ ...level, [id]: level[id] - 1 });
//   setPoints(points + 1);
//   let dyno = dino.find((d) => d.stat === id);
//   dyno.dino = (level[id] - 1) * dyno.increasePerLevelWild + dyno.base;
// };

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "COMPLETE":
//       return state.map((todo) => {
//         if (todo.id === action.id) {
//           return { ...todo, complete: !todo.complete };
//         } else {
//           return todo;
//         }
//       });
//     case "use_exclusive":

//     default:
//       return state;
//   }
// };
// let xVariant = false;
// const [taming, dispatch] = useReducer(reducer, []);

// const onSubmit = (data) => {
//   // console.log(getEstimatedStat("food", data.name, data.level))
//   let dinon = arkdinos.find(
//     (d) => d.name.toLowerCase() === data.name.toLowerCase()
//   );
//   if (!dinon) return null;
//   let t = Object.entries(dinon.baseStats).map(([key, value]) => {
//     return {
//       stat: key,
//       base: value.b,
//       increasePerLevelWild: value.w || null,
//       increasePerLevelTamed: value.t || null,
//       dino:
//         value.b && value.w && level[key]
//           ? value.b + value.w * level[key]
//           : null,
//     };
//   });
//   setValue("level", data.level);
//   setPoints(data.level - 1);
//   setDino(t);
//   let c = calcData({ creature: dinon, level: data.level, method: "v" });
//   for (let i in c.food) {
//     c.food[i].results = calcTame({
//       cr: dinon,
//       level: data.level,
//       foods: c.food,
//       useExclusive: i,
//     });
//   }
//   dinon["level"] = data.level;
//   setTame(calcTame({ cr: dinon, level: data.level, foods: c.food }));
//   setSelect(c);
// };

// const genRandomStats = () => {
//   // scramble level
//   let newlevel = {};
//   let i = points;
//   while (i > 0) {
//     let stat = dino[Math.floor(Math.random() * dino.length)];
//     newlevel[stat.stat] = (newlevel[stat.stat] || 0) + 1;
//     i--;
//   }
//   let newlvl: any = combineBySummingKeys(level, newlevel);
//   setLevel(newlvl);
//   setPoints(i);
// };

// let settings = {
//   consumptionMultiplier: 1,
//   tamingMultiplier: 1,
// };

// const calcData = ({ creature, level, method = "v", selectedFood }: any) => {
//   const affinityNeeded =
//     creature.affinityNeeded + creature.affinityIncreasePerLevel * level;
//   const foodConsumption =
//     creature.foodConsumptionBase *
//     creature.foodConsumptionMult *
//     settings.consumptionMultiplier *
//     (method === "n" ? creature.nonViolentFoodRateMultiplier : 1);

//   const foods = creature.eats
//     .map((foodName: any, index: number) => {
//       const food: any = items.items.find(
//         (item: any) => item.name.toLowerCase() === foodName.toLowerCase()
//       );
//       if (!food) return null;
//       const foodValue = food.stats
//         ? food.stats.find((stat) => stat.id === 8)?.value
//         : 0;
//       const affinityValue =
//         food.stats.find((stat) => stat.id === 15)?.value || 0;
//       const foodMaxRaw = affinityNeeded / affinityValue / 4;
//       const foodMax = Math.ceil(foodMaxRaw);
//       const isFoodSelected = food.itemId === selectedFood;
//       let interval = null;
//       let interval1 = null;
//       let foodSecondsPer = 0;
//       let foodSeconds = 0;
//       if (method === "n") {
//         const baseStat = creature.baseStats?.f;
//         if (
//           typeof baseStat?.b === "number" &&
//           typeof baseStat?.w === "number"
//         ) {
//           const averagePerStat = Math.round(level / 7);
//           const estimatedFood = baseStat.b + baseStat.w * averagePerStat;
//           const requiredFood = Math.max(estimatedFood * 0.1, foodValue);
//           interval1 = requiredFood / foodConsumption;
//         }
//         interval = foodValue / foodConsumption;
//         if (foodMax > 1) {
//           foodSecondsPer = foodValue / foodConsumption;
//           foodSeconds = Math.ceil(
//             Math.max(foodMax - (typeof interval1 === "number" ? 2 : 1), 0) *
//             foodSecondsPer +
//             (interval1 || 0)
//           );
//         }
//       } else {
//         foodSecondsPer = foodValue / foodConsumption;
//         foodSeconds = Math.ceil(foodMax * foodSecondsPer);
//       }
//       return {
//         id: food.itemId,
//         stats: food.stats,
//         name: food.name,
//         icon: food.image,
//         max: foodMax,
//         food: foodValue,
//         seconds: foodSeconds,
//         secondsPer: foodSecondsPer,
//         percentPer: 100 / foodMaxRaw,
//         interval,
//         interval1,
//         use: isFoodSelected ? foodMax : 0,
//         key: index,
//       };
//     })
//     .filter((food) => !!food);

//   return {
//     food: foods.map((f, i) => {
//       return { ...f, key: i };
//     }),
//     affinityNeeded,
//   };
// };
// const useExclusive = (usedFoodIndex: number) => {
//   // dispatch({ type: "use_exclusive", id: usedFoodIndex });
//   setSelect({
//     ...select,
//     food: select.food.map((f, index) => {
//       if (index == usedFoodIndex) {
//         return { ...f, use: f.max };
//       } else {
//         return { ...f, use: 0 };
//       }
//     }),
//   });
//   // setTame(calcTame({ cr: dino, level: level, foods: select.food }));
// };

// const calcTame = ({ cr, level, foods, useExclusive, method = "v" }: any) => {
//   let effectiveness = 100;
//   // Replace with item json
//   let narcotics = {
//     ascerbic: {
//       torpor: 25,
//       secs: 2,
//     },
//     bio: {
//       torpor: 80,
//       secs: 16,
//     },
//     narcotics: {
//       torpor: 40,
//       secs: 8,
//     },
//     narcoberries: {
//       torpor: 7.5,
//       secs: 3,
//     },
//   };
//   let affinityNeeded =
//     cr.affinityNeeded + cr.affinityIncreasePerLevel * level;
//   // sanguineElixir = affinityNeeded *= 0.7

//   let affinityLeft = affinityNeeded;

//   let foodConsumption =
//     cr.foodConsumptionBase *
//     cr.foodConsumptionMult *
//     settings.consumptionMultiplier;
//   let totalFood = 0;

//   let tamingMultiplier = cr.disableMultiplier
//     ? 4
//     : settings.tamingMultiplier * 4;

//   if (method == "n") {
//     foodConsumption = foodConsumption * cr.nonViolentFoodRateMultiplier;
//   }
//   let tooMuchFood = false;
//   let enoughFood = false;
//   let numUsedTotal = 0;
//   let numNeeded = 0;
//   let numToUse = 0;
//   let totalSecs = 0;
//   foods.forEach((food: any) => {
//     if (!food) return;
//     let foodVal = food.stats.find((f: any) => f.id === 8)
//       ? food.stats.find((f: any) => f.id === 8).value
//       : 0;
//     let affinityVal = food.stats.find((f: any) => f.id === 15)
//       ? food.stats.find((f: any) => f.id === 15).value
//       : 0;

//     if (affinityLeft > 0) {
//       if (useExclusive >= 0) {
//         if (food.key == useExclusive) {
//           food.use = food.max;
//         } else {
//           food.use = 0;
//         }
//       }
//       if (method == "n") {
//         numNeeded = Math.ceil(
//           affinityLeft /
//           affinityVal /
//           tamingMultiplier /
//           cr.nonViolentFoodRateMultiplier
//         );
//       } else {
//         numNeeded = Math.ceil(affinityLeft / affinityVal / tamingMultiplier);
//       }

//       if (numNeeded >= food.use) {
//         numToUse = food.use;
//       } else {
//         tooMuchFood = true;
//         numToUse = numNeeded;
//       }

//       if (method == "n") {
//         affinityLeft -=
//           numToUse *
//           affinityVal *
//           tamingMultiplier *
//           cr.nonViolentFoodRateMultiplier;
//       } else {
//         affinityLeft -= numToUse * affinityVal * tamingMultiplier;
//       }
//       totalFood += numToUse * foodVal;
//       let i = 1;
//       while (i <= numToUse) {
//         if (method == "n") {
//           effectiveness -=
//             (Math.pow(effectiveness, 2) * cr.tamingBonusAttribute) /
//             affinityVal /
//             tamingMultiplier /
//             cr.nonViolentFoodRateMultiplier;
//         } else {
//           effectiveness -=
//             (Math.pow(effectiveness, 2) * cr.tamingBonusAttribute) /
//             affinityVal /
//             100;
//         }
//         numUsedTotal++;
//         i++;
//       }
//       if (effectiveness < 0) {
//         effectiveness = 0;
//       }
//     } else if (food.use > 0) {
//       tooMuchFood = true;
//     }
//   });

//   let neededValues = Array();

//   if (affinityLeft <= 0) {
//     enoughFood = true;
//   } else {
//     enoughFood = false;

//     foods.forEach((food: any) => {
//       numNeeded = Math.ceil(
//         affinityLeft /
//         food.stats.find((f: any) => f.id === 15).value /
//         tamingMultiplier
//       );
//       neededValues[food.key] = numNeeded;
//     });
//   }

//   let percentLeft = affinityLeft / affinityNeeded;
//   let percentTamed = 1 - percentLeft;
//   let totalTorpor = cr.baseTamingTime + cr.tamingInterval * (level - 1);
//   let torporDepletionPS =
//     cr.torporDepletionPS +
//     Math.pow(level - 1, 0.800403041) / (22.39671632 / cr.torporDepletionPS);
//   let levelsGained = Math.floor((level * 0.5 * effectiveness) / 100);
//   let ascerbicMushroomsMin = Math.max(
//     Math.ceil(
//       (totalSecs * torporDepletionPS - totalTorpor) /
//       (narcotics.ascerbic.torpor +
//         torporDepletionPS * narcotics.ascerbic.secs)
//     ),
//     0
//   );
//   let biotoxinsMin = Math.max(
//     Math.ceil(
//       (totalSecs * torporDepletionPS - totalTorpor) /
//       (narcotics.bio.torpor + torporDepletionPS * narcotics.bio.secs)
//     ),
//     0
//   );
//   let narcoticsMin = Math.max(
//     Math.ceil(
//       (totalSecs * torporDepletionPS - totalTorpor) /
//       (narcotics.narcotics.torpor +
//         torporDepletionPS * narcotics.narcotics.secs)
//     ),
//     0
//   );
//   let narcoberriesMin = Math.max(
//     Math.ceil(
//       (totalSecs * torporDepletionPS - totalTorpor) /
//       (narcotics.narcoberries.torpor +
//         torporDepletionPS * narcotics.narcoberries.secs)
//     ),
//     0
//   );
//   return {
//     dino: cr,
//     effectiveness,
//     neededValues,
//     enoughFood,
//     tooMuchFood,
//     totalFood,
//     totalSecs,
//     levelsGained,
//     totalTorpor,
//     torporDepletionPS,
//     percentTamed,
//     numUsedTotal,
//     ascerbicMushroomsMin,
//     biotoxinsMin,
//     narcoticsMin,
//     narcoberriesMin,
//   };
// };

// const calcMaturation = () => {
//   let maturation = 0;
//   let maturationCalcCurrent = 0;
//   let weightCurrent = 0;
//   let weightTotal = 30;
//   let mutationTimeTotal = 15002;
//   if (weightCurrent > weightTotal) {
//     weightCurrent = weightTotal;
//   }

//   weightCurrent = Math.max(weightCurrent, 0);
//   let percentDone = weightCurrent / weightTotal;
//   let timeElapsed = percentDone * mutationTimeTotal;
//   let timeStarted = Date.now() - timeElapsed;
//   let timeRemaining = (1 - percentDone) * mutationTimeTotal;

//   console.log(timeRemaining);
// };
