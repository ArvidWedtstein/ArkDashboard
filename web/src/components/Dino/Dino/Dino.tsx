import { Form, NumberField } from "@redwoodjs/forms";
import { Link, routes, navigate } from "@redwoodjs/router";
import { useMutation } from "@redwoodjs/web";
import { toast } from "@redwoodjs/web/toast";
import { timeFormatL } from "src/lib/formatters";
import { useCallback, useState } from "react";

import type { DeleteDinoMutationVariables, FindDinoById } from "types/graphql";
import clsx from "clsx";

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
    mature: 1
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
          <div className="m-0 mb-4 text-2xl uppercase tracking-widest">
            <strong className="text-3xl font-light">{dino.name}</strong>
          </div>

          <div className="mr-4 mb-4 italic">
            <p>{dino.description}</p>
          </div>
          {/* <div className="mr-4 mb-4 inline-block">
            <strong>Seen:</strong> 0
          </div> */}
          {dino.immobilized_by && dino.immobilized_by.length > 0 && (
            <div className="mr-4 mb-4 flex flex-row space-x-1">
              <strong>Immobilized By:</strong>

              {dino.immobilized_by.map((w) => (
                <Link to={routes.item({ id: "1" })}>
                  <img
                    className="w-8"
                    title={w}
                    alt={w}
                    src={`https://arkids.net/image/item/120/${w
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

          {dino.eats && dino.eats.length > 0 && (
            <>
              <div className="text-lg">Food</div>
              <div className="mb-4">
                {dino.eats.map((f) => (
                  <p className="leading-5">{f}</p>
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
              setMaturation(parseInt(event.target.value))
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
      {dino.egg_max !== 0 && dino.egg_min !== 0 && (
        <section className="mt-4 text-white">
          <img src={`https://www.dododex.com/media/item/Dodo_Egg.png`} alt={dino.name} />
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium leading-tight">Egg</h3>
            <p className="text-sm">
              {dino.egg_min} - {dino.egg_max}°C
            </p>
          </div>
        </section>
      )}
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
