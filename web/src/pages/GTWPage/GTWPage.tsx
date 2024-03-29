import {
  Form,
  FormError,
  RWGqlError,
  useFieldArray,
  useForm,
} from "@redwoodjs/forms";
import { MetaTags } from "@redwoodjs/web";
import { Fragment, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { toast } from "@redwoodjs/web/dist/toast";
import { Input } from "src/components/Util/Input/Input";
import Text from "src/components/Util/Text/Text";

interface GTWPageProps {
  error: RWGqlError;
  loading: boolean;
}
const GtwPage = (props: GTWPageProps) => {
  // TODO: Replace with data from db
  const ArkDinos = [
    "Ankylosaurus",
    "Argentavis",
    "Arthropluera",
    "Baryonyx",
    "Beelzebufo",
    "Brontosaurus",
    "Carbonemys",
    "Castoroides",
    "Carnotaurus",
    "Compy",
    "Daeodon",
    "Dilophosaurus",
    "Dimetrodon",
    "Diplocaulus",
    "Diplodocus",
    "Doedicurus",
    "Dodo",
    "Dung Beetle",
    "Equus",
    "Gallimimus",
    "Giganotosaurus",
    "Gigantopithecus",
    "Glowtail",
    "Dragon",
    "Gryphon",
    "Hesperornis",
    "Ichthyornis",
    "Iguanodon",
    "Kairuku",
    "Karkinos",
    "Kaprosuchus",
    "Megachelon",
    "Megalania",
    "Megaloceros",
    "Megalodon",
    "Megatherium",
    "Moschops",
    "Oviraptor",
    "Paraceratherium",
    "Pegomastax",
    "Plesiosaur",
    "Parasaur",
    "Polar Bear",
    "Procoptodon",
    "Pteranodon",
    "Pulmonoscorpius",
    "Quetzal",
    "Raptor",
    "Rex",
    "Rock Drake",
    "Sabertooth",
    "Sarco",
    "Sarcosuchus",
    "Spino",
    "Stegosaurus",
    "Therizinosaurus",
    "Thorny Dragon",
    "Titanoboa",
    "Titanosaur",
    "Triceratops",
    "Troodon",
    "Tusoteuthis",
    "Tyrannosaurus",
    "Velonasaur",
    "Woolly Rhino",
    "Wyvern",
    "Yutyrannus",
    "Ankylo",
    "Desmodus",
    "Fenrir",
    "Araneo",
    "Gacha",
    "Mantis",
    "Megalosaurus",
    "Ovis",
    "Pachy",
    "Pachyrhinosaurus",
    "Purlovia",
    "Scout",
    "Bulbdog",
    "Cnidaria",
    "Dunkleosteus",
    "Eurypterid",
    "Ichthyosaurus",
    "Liopleurodon",
    "Lystrosaurus",
    "Mammoth",
    "Manta",
    "Mosasaurus",
    "Onyc",
    "Pachycephalosaurus",
    "Astrocetus",
    "Basilosaurus",
    "Astrodelphis",
    "Fjordhawk",
    "Featherlight",
    "Gasbags",
    "Dimorphodon",
    "Snow Owl",
    "Sinomacrops",
    "Phoenix",
    "Tapejara",
    "Titanomyrma",
    "Pelagornis",
    "Griffin",
    "Vulture",
    "Angler",
    "Electrophorus",
    "Piranha",
    "Otter",
    "Ichtyosaurus",
    "Trilobite",
    "Leedsichthys",
    "Lamprey",
    "Ammonite",
    "Amargasaurus",
    "Allosaurus",
    "Achatina",
    "Andrewsarchus",
    "Beezlebufo",
    "Bloodstalker",
    "Dilophosaur",
    "Enforcer",
    "Giant Bee",
    "Chalicotherium",
    "Deinonychus",
    "Dinopithecus",
    "Jerboa",
    "Hyaenodon",
    "Ferox",
    "Direbear",
    "Kentrosaurus",
    "Maewing",
    "Nameless",
    "Phiomia",
    "Sabertooth Salmon",
    "Spinosaur",
    "Shinehorn",
    "Thylacoleo",
    "Rollrat",
    "Terrorbird",
    "Reaper",
    "Seeker",
    "Shadowmane",
    "Ravager",
    "Rockelemental",
    "Therezinosaurus",
    "Unicorn",
    "Yeti",
    "Deathworm",
    "Mesopithecus",
    "Mek",
    "Morellatops",
    "Noglin",
    "Leech",
    "Moeder",
    "Voidwyrm",
    "Lymantria",
    "Archaeopteryx",
  ];

  const sameLetters = (str1: string, str2: string) => {
    if (str1.length !== str2.length) return false;

    const obj1 = {};
    const obj2 = {};

    for (const letter of str1) {
      obj1[letter] = (obj1[letter] || 1) + 1;
    }
    for (const letter of str2) {
      obj2[letter] = (obj2[letter] || 1) + 1;
    }

    for (const key in obj1) {
      if (!obj2.hasOwnProperty(key)) return false;
      if (obj1[key] !== obj2[key]) return false;
    }
    return true;
  };

  const getWord = (word: string) => {
    return ArkDinos.filter((dino) => {
      if (sameLetters(dino.toLowerCase(), word.trim().toLowerCase())) {
        return dino;
      }
    });
  };

  const QUERY = gql`
    query GTWDinos {
      dinos {
        id
        name
      }
    }
  `;
  // useQuery(QUERY)
  const [word, setWord] = useState("");
  const handlechange = (e) => {
    setWord(e.target.value);
    if (getWord(e.target.value)[0] === undefined) return;
    toast.success("Copied to clipboard");
    navigator.clipboard.writeText(getWord(e.target.value)[0]);
  };

  const debouncedChangeHandler = useMemo(() => debounce(handlechange, 500), []);
  // function hasLetters(word: string, letters: string): boolean {
  //   // Convert the word and letters to lowercase to make the comparison case-insensitive
  //   word = word.toLowerCase();
  //   letters = letters.toLowerCase();

  //   // Loop through each letter in the letters string
  //   for (let i = 0; i < letters.length; i++) {
  //     // If the letter is not found in the word, return false
  //     if (word.indexOf(letters[i]) === -1) {
  //       return false;
  //     }
  //   }

  //   // If all letters are found in the word, return true
  //   return true;
  // }

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      attack: [{ name: "test" }],
    },
  });

  const {
    fields: attackFields,
    append: appendAttack,
    remove: removeAttack,
  } = useFieldArray({
    control,
    name: "attack", // the name of the field array in your form data
  });

  const onSubmit = data => {
    console.log("data", data);
  }

  return (
    <>
      <MetaTags
        title="Guess the word"
        description="Type in random dino scabbled and get the solved word!"
      />

      <div className="container-xl flex flex-col m-3 text-center text-black dark:text-white">
        <div className="text-center">
          <h1 className="rw-label p-3 text-center text-2xl ">
            {getWord(word)}
          </h1>
        </div>


        <Form error={props.error} onSubmit={handleSubmit(onSubmit)} className="m-6 p-3 flex justify-center">
          <FormError
            error={props.error}
            wrapperClassName="rw-form-error-wrapper"
            titleClassName="rw-form-error-title"
            listClassName="rw-form-error-list"
          />
          <Input
            type="text"
            variant="outlined"
            name="scrambledWord"
            label="Scrambled Dino Word"
            placeholder="Scrambled Word:"
            color="success"
            InputLabelProps={{
              shrink: true
            }}
            InputProps={{
              inputProps: {
                onInput: (event) => debouncedChangeHandler(event)
              }
            }}
          />

          {attackFields.map((f, i) => (
            <Fragment>
              <input className="" {...register(`attack.${i}.name`, { required: true })} />
            </Fragment>
          ))}
          <button type="button"
            onClick={() =>
              appendAttack({
                name: "",
              })
            }
          >add</button>


          <button type="submit">submit</button>
        </Form>
      </div>
    </>
  );
};

export default GtwPage;
