import { Form, NumberField } from "@redwoodjs/forms";
import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { timeFormatL, combineBySummingKeys } from "src/lib/formatters";
import { useCallback, useState } from "react";

import type { DeleteDinoMutationVariables, FindDinoById } from "types/graphql";
import clsx from "clsx";
import Table from "src/components/Util/Table/Table";

import arkitems from "../../../../public/arkitems.json";

const DELETE_DINO_MUTATION = gql`
  mutation DeleteDinoMutation($id: String!) {
    deleteDino(id: $id) {
      id
    }
  }
`;

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


  const [maturation, setMaturation] = useState(0);
  const calcMaturationPercent = useCallback(() => {
    let timeElapsed = maturation * parseInt(dino.maturation_time) * 1;
    return timeElapsed / 100;
  }, [maturation, setMaturation])
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
    hexagonReward: 1
  }
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
        />
        <div className="py-4 px-8 text-sm font-light text-white">
          <div className="m-0 mb-4 text-sm">
            <strong className="text-3xl font-light uppercase tracking-widest">{dino.name}</strong>
            <div className="flex flex-row space-x-2 italic">
              <span>{dino.synonyms.join(', ')}</span>
            </div>
          </div>


          <div className="mr-4 mb-4 italic">
            <p>{dino.description}</p>
          </div>
          {/* <div className="mr-4 mb-4 inline-block">
            <strong>Ridable:</strong> {dino["ridable"] ? "Yes" : "No"}
          </div> */}
          {dino.immobilized_by && dino.immobilized_by.length > 0 && (
            <div className="mr-4 mb-4 flex flex-row space-x-1">
              <strong>Immobilized By:</strong>

              {dino.immobilized_by.map((w) => (
                <Link to={routes.item({ id: w })}>
                  <img
                    className="w-8"
                    title={arkitems.items.find(item => item.id === Number(w))?.name}
                    alt={arkitems.items.find(item => item.id === Number(w))?.name}
                    src={`https://arkids.net/image/item/120/${arkitems.items.find(item => item.id === Number(w))?.name
                      .replaceAll(" ", "-")
                      .replace("plant-species-y", "plant-species-y-trap")}.png`}
                  />
                </Link>
              ))}
            </div>
          )}
          {dino.can_destroy && dino.can_destroy.length > 0 && (
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
          )}
          {/* <br /> */}
          {/* <div className="mr-4 mb-4 inline-block">
            <strong>Weight:</strong> 69kg
          </div>
          <div className="mr-4 mb-4 inline-block">
            <strong>Height:</strong> 0.3m
          </div> */}
          <br />
          <div className="mr-4 mb-4 inline-block">
            <strong>Type:</strong>{" "}
            {dino.violent_tame ? "Aggressive" : "Passive"}
          </div>

          {!dino.disable_food && dino.eats && dino.eats.length > 0 && (
            <>
              <div className="text-lg">Food</div>
              <div className="mb-4">
                {dino.eats.map((f) => (
                  <p className="leading-5 flex">
                    {arkitems.items.find(item => item.id === Number(f))?.name}
                    <img
                      className="w-5"
                      title={arkitems.items.find(item => item.id === Number(f))?.name}
                      alt={arkitems.items.find(item => item.id === Number(f))?.name}
                      src={`https://arkids.net/image/item/120/${arkitems.items.find(item => item.id === Number(f))?.name
                        .replaceAll(" ", "-")
                        .replace("plant-species-y", "plant-species-y-trap")}.png`}
                    />
                  </p>
                ))}
              </div>
            </>
          )}
          <div className="text-lg">Some tegst</div>
          <div className="mr-4 mb-4 inline-block">
            <strong>Taming:</strong> yes
          </div>
        </div>
      </section>
      {(dino.maturation_time && dino.incubation_time) && (
        <section className="my-3 rounded-md p-4 text-stone-600 dark:text-white">
          <Form className="flex my-3 mx-auto justify-center">
            <NumberField name="matPerc" id="matPerc" className="w-20 rw-input rounded-none rounded-l-lg" placeholder="Maturation Percent" min={0} max={100} onInput={(event) => {
              setMaturation(parseInt(event.target ? event.target["value"] : 0))
            }} />
            <label htmlFor="matPerc" className="rw-input rounded-none rounded-r-lg">%</label>
          </Form>
          <ol className="w-full items-center justify-center space-y-4 sm:flex sm:space-x-8 sm:space-y-0">
            <li className={clsx("flex items-center space-x-2.5", {
              "dark:text-pea-500 text-pea-600 [&>*]:border-pea-600 [&>*]:dark:border-pea-500": calcMaturationPercent() >= dino.incubation_time / multipliers.hatch,
              "text-gray-500 dark:text-gray-400 [&>*]:border-gray-500 [&>*]:dark:border-gray-400": calcMaturationPercent() < dino.incubation_time / multipliers.hatch,
            })}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                1
              </span>
              <span>
                <h3 className="font-medium leading-tight">
                  Incubation
                </h3>
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
            <li className={clsx("flex items-center space-x-2.5", {
              "dark:text-pea-500 text-pea-600 [&>*]:border-pea-600 [&>*]:dark:border-pea-500": calcMaturationPercent() >= (parseInt(dino.maturation_time) * multipliers.mature) / 10,
              "text-gray-500 dark:text-gray-400 [&>*]:border-gray-500 [&>*]:dark:border-gray-400": calcMaturationPercent() < (parseInt(dino.maturation_time) * multipliers.mature) / 10,
            })}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                2
              </span>
              <span>
                <h3 className="font-medium leading-tight">Baby</h3>
                <p className="text-sm">
                  {timeFormatL((parseInt(dino.maturation_time) * multipliers.mature) / 10)}
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
            <li className={clsx("flex items-center space-x-2.5", {
              "dark:text-pea-500 text-pea-600 [&>*]:border-pea-600 [&>*]:dark:border-pea-500": calcMaturationPercent() >= (parseInt(dino.maturation_time) * multipliers.mature) / 2 -
                (parseInt(dino.maturation_time) * multipliers.mature) / 10,
              "text-gray-500 dark:text-gray-400 [&>*]:border-gray-500 [&>*]:dark:border-gray-400": calcMaturationPercent() < (parseInt(dino.maturation_time) * multipliers.mature) / 2 -
                (parseInt(dino.maturation_time) * multipliers.mature) / 10,
            })}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                3
              </span>
              <span>
                <h3 className="font-medium leading-tight">
                  Juvenile
                </h3>
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
            <li className={clsx("flex items-center space-x-2.5", {
              "dark:text-pea-500 text-pea-600 [&>*]:border-pea-600 [&>*]:dark:border-pea-500": calcMaturationPercent() >= (parseInt(dino.maturation_time) * 1) / 2,
              "text-gray-500 dark:text-gray-400 [&>*]:border-gray-500 [&>*]:dark:border-gray-400": calcMaturationPercent() < (parseInt(dino.maturation_time) * 1) / 2,
            })}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                4
              </span>
              <span>
                <h3 className="font-medium leading-tight">
                  Adolescent
                </h3>
                <p className="text-sm">
                  {timeFormatL((parseInt(dino.maturation_time) * multipliers.mature) / 2)}
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
            <li className={clsx("flex items-center space-x-2.5", {
              "dark:text-pea-500 text-pea-600 [&>*]:border-pea-600 [&>*]:dark:border-pea-500": calcMaturationPercent() >= parseInt(dino.maturation_time) * 1,
              "text-gray-500 dark:text-gray-400 [&>*]:border-gray-500 [&>*]:dark:border-gray-400": calcMaturationPercent() < parseInt(dino.maturation_time) * 1,
            })}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                5
              </span>
              <span>
                <h3 className="font-medium leading-tight">Total</h3>
                <p className="text-sm">
                  {timeFormatL(parseInt(dino.maturation_time) * multipliers.mature)}
                </p>
              </span>
            </li>
          </ol>
        </section>
      )}
      {(dino.egg_min && dino.egg_max) && dino.egg_max !== 0 && dino.egg_min !== 0 && (
        <section className="mt-4 text-white">
          <img src={`https://www.dododex.com/media/item/Dodo_Egg.png`} alt={dino.name} />
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium leading-tight">Egg</h3>
            <p className="text-sm">
              {dino.egg_min} - {dino.egg_max} °C
            </p>
          </div>
        </section>
      )}


      <section className="my-3 rounded-md p-4 text-stone-600 dark:text-white">

      </section>
      {/* <section className="mt-4 text-gray-400 dark:text-white">
        <Table
          rows={[combineBySummingKeys({
            t: false,
            w: false,
            a: false,
            s: false,
            m: false,
            tk: false,
          }, dino.can_destroy.reduce((a, v) => ({ ...a, [v]: true }), {}))]}
          columns={[
            {
              field: "t", label: "Thatch", renderCell: ({ value }) => {
                return value > 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="fill-pea-500 w-8 h-8">
                    <path d="M475.3 123.3l-272 272C200.2 398.4 196.1 400 192 400s-8.188-1.562-11.31-4.688l-144-144c-6.25-6.25-6.25-16.38 0-22.62s16.38-6.25 22.62 0L192 361.4l260.7-260.7c6.25-6.25 16.38-6.25 22.62 0S481.6 117.1 475.3 123.3z" />
                  </svg>) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="fill-red-500 w-8 h-8">
                    <path d="M315.3 411.3c-6.253 6.253-16.37 6.253-22.63 0L160 278.6l-132.7 132.7c-6.253 6.253-16.37 6.253-22.63 0c-6.253-6.253-6.253-16.37 0-22.63L137.4 256L4.69 123.3c-6.253-6.253-6.253-16.37 0-22.63c6.253-6.253 16.37-6.253 22.63 0L160 233.4l132.7-132.7c6.253-6.253 16.37-6.253 22.63 0c6.253 6.253 6.253 16.37 0 22.63L182.6 256l132.7 132.7C321.6 394.9 321.6 405.1 315.3 411.3z" />
                  </svg>
                )
              },
            },
            {
              field: "w", label: "Wood", renderCell: ({ value }) => {
                return value > 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="fill-pea-500 w-8 h-8">
                    <path d="M475.3 123.3l-272 272C200.2 398.4 196.1 400 192 400s-8.188-1.562-11.31-4.688l-144-144c-6.25-6.25-6.25-16.38 0-22.62s16.38-6.25 22.62 0L192 361.4l260.7-260.7c6.25-6.25 16.38-6.25 22.62 0S481.6 117.1 475.3 123.3z" />
                  </svg>) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="fill-red-500 w-8 h-8">
                    <path d="M315.3 411.3c-6.253 6.253-16.37 6.253-22.63 0L160 278.6l-132.7 132.7c-6.253 6.253-16.37 6.253-22.63 0c-6.253-6.253-6.253-16.37 0-22.63L137.4 256L4.69 123.3c-6.253-6.253-6.253-16.37 0-22.63c6.253-6.253 16.37-6.253 22.63 0L160 233.4l132.7-132.7c6.253-6.253 16.37-6.253 22.63 0c6.253 6.253 6.253 16.37 0 22.63L182.6 256l132.7 132.7C321.6 394.9 321.6 405.1 315.3 411.3z" />
                  </svg>
                )
              },
            },
            {
              field: "a", label: "Adobe", renderCell: ({ value }) => {
                return value > 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="fill-pea-500 w-8 h-8">
                    <path d="M475.3 123.3l-272 272C200.2 398.4 196.1 400 192 400s-8.188-1.562-11.31-4.688l-144-144c-6.25-6.25-6.25-16.38 0-22.62s16.38-6.25 22.62 0L192 361.4l260.7-260.7c6.25-6.25 16.38-6.25 22.62 0S481.6 117.1 475.3 123.3z" />
                  </svg>) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="fill-red-500 w-8 h-8">
                    <path d="M315.3 411.3c-6.253 6.253-16.37 6.253-22.63 0L160 278.6l-132.7 132.7c-6.253 6.253-16.37 6.253-22.63 0c-6.253-6.253-6.253-16.37 0-22.63L137.4 256L4.69 123.3c-6.253-6.253-6.253-16.37 0-22.63c6.253-6.253 16.37-6.253 22.63 0L160 233.4l132.7-132.7c6.253-6.253 16.37-6.253 22.63 0c6.253 6.253 6.253 16.37 0 22.63L182.6 256l132.7 132.7C321.6 394.9 321.6 405.1 315.3 411.3z" />
                  </svg>
                )
              },
            },
            {
              field: "s", label: "Stone", renderCell: ({ value }) => {
                return value > 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="fill-pea-500 w-8 h-8">
                    <path d="M475.3 123.3l-272 272C200.2 398.4 196.1 400 192 400s-8.188-1.562-11.31-4.688l-144-144c-6.25-6.25-6.25-16.38 0-22.62s16.38-6.25 22.62 0L192 361.4l260.7-260.7c6.25-6.25 16.38-6.25 22.62 0S481.6 117.1 475.3 123.3z" />
                  </svg>) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="fill-red-500 w-8 h-8">
                    <path d="M315.3 411.3c-6.253 6.253-16.37 6.253-22.63 0L160 278.6l-132.7 132.7c-6.253 6.253-16.37 6.253-22.63 0c-6.253-6.253-6.253-16.37 0-22.63L137.4 256L4.69 123.3c-6.253-6.253-6.253-16.37 0-22.63c6.253-6.253 16.37-6.253 22.63 0L160 233.4l132.7-132.7c6.253-6.253 16.37-6.253 22.63 0c6.253 6.253 6.253 16.37 0 22.63L182.6 256l132.7 132.7C321.6 394.9 321.6 405.1 315.3 411.3z" />
                  </svg>
                )
              },
            },
            {
              field: "m", label: "Metal", renderCell: ({ value }) => {
                return value > 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="fill-pea-500 w-8 h-8">
                    <path d="M475.3 123.3l-272 272C200.2 398.4 196.1 400 192 400s-8.188-1.562-11.31-4.688l-144-144c-6.25-6.25-6.25-16.38 0-22.62s16.38-6.25 22.62 0L192 361.4l260.7-260.7c6.25-6.25 16.38-6.25 22.62 0S481.6 117.1 475.3 123.3z" />
                  </svg>) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="fill-red-500 w-8 h-8">
                    <path d="M315.3 411.3c-6.253 6.253-16.37 6.253-22.63 0L160 278.6l-132.7 132.7c-6.253 6.253-16.37 6.253-22.63 0c-6.253-6.253-6.253-16.37 0-22.63L137.4 256L4.69 123.3c-6.253-6.253-6.253-16.37 0-22.63c6.253-6.253 16.37-6.253 22.63 0L160 233.4l132.7-132.7c6.253-6.253 16.37-6.253 22.63 0c6.253 6.253 6.253 16.37 0 22.63L182.6 256l132.7 132.7C321.6 394.9 321.6 405.1 315.3 411.3z" />
                  </svg>
                )
              },
            },
            {
              field: "tk", label: "Tek", renderCell: ({ value }) => {
                return value > 0 ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="fill-pea-500 w-8 h-8">
                    <path d="M475.3 123.3l-272 272C200.2 398.4 196.1 400 192 400s-8.188-1.562-11.31-4.688l-144-144c-6.25-6.25-6.25-16.38 0-22.62s16.38-6.25 22.62 0L192 361.4l260.7-260.7c6.25-6.25 16.38-6.25 22.62 0S481.6 117.1 475.3 123.3z" />
                  </svg>) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="fill-red-500 w-8 h-8">
                    <path d="M315.3 411.3c-6.253 6.253-16.37 6.253-22.63 0L160 278.6l-132.7 132.7c-6.253 6.253-16.37 6.253-22.63 0c-6.253-6.253-6.253-16.37 0-22.63L137.4 256L4.69 123.3c-6.253-6.253-6.253-16.37 0-22.63c6.253-6.253 16.37-6.253 22.63 0L160 233.4l132.7-132.7c6.253-6.253 16.37-6.253 22.63 0c6.253 6.253 6.253 16.37 0 22.63L182.6 256l132.7 132.7C321.6 394.9 321.6 405.1 315.3 411.3z" />
                  </svg>
                )
              },
            },
          ]}
        />
      </section> */}
      <section className="mt-4 text-gray-400 dark:text-white">
        <Table
          rows={[dino.base_stats]}
          columns={[
            { field: "h", label: "Health", valueFormatter: (value) => value.value.b },
            { field: "s", label: "Stamina", valueFormatter: (value) => value.value.b },
            { field: "w", label: "Weight", valueFormatter: (value) => value.value.b },
            { field: "f", label: "Food", valueFormatter: (value) => value.value.b },
            { field: "t", label: "Torpor", valueFormatter: (value) => value.value.b },
            !dino.water_movement && { field: "o", label: "Oxygen", valueFormatter: (value) => value.value.b },
            { field: "m", label: "Melee", valueFormatter: (value) => value.value.b },
            { field: "d", label: "Damage", valueFormatter: (value) => value.value.b },
          ]}
        />
      </section>
      <p>{JSON.stringify(dino.gather_eff)}</p>
      <section className="mt-4 text-gray-400 dark:text-white grid grid-cols-1 md:grid-cols-2">
        {dino.gather_eff && Object.values(dino.gather_eff) !== null && (
          <div className="space-y-2">
            <h4>Gather Efficiency</h4>
            <Table
              className="w-fit"
              header={false}
              rows={(dino.gather_eff as any[]).sort((a, b) => Number(b.value) - Number(a.value))}
              columns={[
                {
                  field: "itemId", label: "", valueFormatter: (value) => {
                    const item = arkitems.items.find(item => item.id === value.value)
                    return item && (
                      <div className="flex flex-row space-x-2 mr-3">
                        <img src={`https://www.arkresourcecalculator.com/assets/images/80px-${item.image}`} className="w-8 h-8 self-end" />
                        <p>{item.name}</p>
                      </div>
                    )
                  }
                },
                {
                  field: "value", label: "", valueFormatter: (value) => (
                    <div className="h-2 w-32 bg-gray-300 rounded-full flex flex-row divide-x divide-black">
                      {Array.from(Array(5)).map((_, i) => (
                        <div className={clsx(`first:rounded-l-full last:rounded-r-full h-full w-1/5`, {
                          "bg-transparent": Math.round(value.value) < i + 1,
                          "[&:nth-child(1)]:bg-red-500 [&:nth-child(2)]:bg-orange-500 [&:nth-child(3)]:bg-yellow-500 [&:nth-child(4)]:bg-lime-500 [&:nth-child(5)]:bg-green-500": Math.round(value.value) >= i + 1,
                        })}></div>
                      ))}
                    </div>
                  )
                },
              ]}
            />
          </div>)}
        {dino.weight_reduction && (<div className="space-y-2">
          <h4>Weight Reduction</h4>
          {/*<Table
            className="w-fit"
            header={false}
            rows={(dino.weight_reduction as any).sort((a, b) => b.value - a.value)}
            columns={[
              {
                field: "itemId", label: "", valueFormatter: (value) => {
                  const item = arkitems.items.find(item => item.id === value.value)
                  return item && (
                    <div className="flex flex-row space-x-2 mr-3">
                      <img src={`https://www.arkresourcecalculator.com/assets/images/80px-${item.image}`} className="w-8 h-8 self-end" />
                      <p>{item.name}</p>
                    </div>
                  )
                }
              },
              {
                field: "value", label: "", valueFormatter: (value) => (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="inline-block fill-current w-4">
                      <path d="M510.3 445.9L437.3 153.8C433.5 138.5 420.8 128 406.4 128H346.1c3.625-9.1 5.875-20.75 5.875-32c0-53-42.1-96-96-96S159.1 43 159.1 96c0 11.25 2.25 22 5.875 32H105.6c-14.38 0-27.13 10.5-30.88 25.75l-73.01 292.1C-6.641 479.1 16.36 512 47.99 512h416C495.6 512 518.6 479.1 510.3 445.9zM256 128C238.4 128 223.1 113.6 223.1 96S238.4 64 256 64c17.63 0 32 14.38 32 32S273.6 128 256 128z" />
                    </svg>
                    <p className="text-lime-300 mx-1">
                      50%
                    </p>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="text-lime-300 inline-block fill-current w-4">
                      <path d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z" />
                    </svg>

                  </div>
                )
              },
            ]}
          />*/}
        </div>)}
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
    </div>
  );
};

export default Dino;
