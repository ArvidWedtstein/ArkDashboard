import {
  FieldError,
  Form,
  FormError,
  Label,
  RWGqlError,
  TextField,
} from "@redwoodjs/forms";
import { MetaTags } from "@redwoodjs/web";
import { useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { toast } from "@redwoodjs/web/dist/toast";
import FibonacciSphere from "src/components/Util/FibonacciSphere/FibonacciSphere";
import { SimplexNoise3D } from "src/lib/formatters";
import { InputOutlined } from "src/components/Util/Input/Input";

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

  function hasLetters(word: string, letters: string): boolean {
    // Convert the word and letters to lowercase to make the comparison case-insensitive
    word = word.toLowerCase();
    letters = letters.toLowerCase();

    // Loop through each letter in the letters string
    for (let i = 0; i < letters.length; i++) {
      // If the letter is not found in the word, return false
      if (word.indexOf(letters[i]) === -1) {
        return false;
      }
    }

    // If all letters are found in the word, return true
    return true;
  }
  const debouncedChangeHandler = useMemo(() => debounce(handlechange, 500), []);

  // MATRIX GRID
  // const ref = useRef<HTMLCanvasElement>(null);
  // useEffect(() => {
  //   if (ref.current) {
  //     const interval = 1000 / 60; // fps
  //     const noiseStr = 10;
  //     const row = 12;
  //     const simplex = new SimplexNoise3D(321);

  //     const ctx = ref.current.getContext("2d");
  //     const grids = [];
  //     class Grid {
  //       index: number;
  //       rowCount: number;
  //       ex: number;
  //       ey: number;
  //       size: number;
  //       boxSize: number;
  //       sx: number;
  //       sy: number;
  //       x: number;
  //       y: number;
  //       noise: number;
  //       sizePercent: number;
  //       constructor(index, rowCount) {
  //         this.index = index;
  //         this.rowCount = rowCount;

  //         this.ex = this.index % this.rowCount;
  //         this.ey = Math.floor(this.index / this.rowCount);
  //       }
  //       resize(canvasWidth, canvasHeight) {
  //         const minSize = Math.min(canvasWidth, canvasHeight);
  //         this.size = minSize / this.rowCount;
  //         this.boxSize = this.size * (0.3 + 0.7 * this.noise);

  //         this.sx = canvasWidth / 2 - minSize / 2;
  //         this.sy = canvasHeight / 2 - minSize / 2;

  //         this.x = this.sx + this.ex * this.size;
  //         this.y = this.sy + this.ey * this.size;
  //       }
  //       update(simplex: SimplexNoise3D, noiseStr, time) {
  //         this.noise =
  //           (simplex.noise(this.ex / noiseStr, this.ey / noiseStr, time) + 1) /
  //           2;
  //         this.sizePercent = 0.1 + 0.89 * this.noise;
  //         this.boxSize = this.size * this.sizePercent;
  //       }
  //       draw(ctx) {
  //         ctx.lineWidth = 1;
  //         ctx.strokeStyle = "#f1f1f1";
  //         ctx.fillStyle = "#191919";
  //         ctx.fillRect(this.x, this.y, this.size, this.size);
  //         ctx.strokeRect(this.x, this.y, this.size, this.size);

  //         ctx.fillStyle = `rgba(241, 241, 241, ${this.sizePercent})`;
  //         ctx.fillRect(this.x, this.y, this.boxSize, this.boxSize);
  //       }
  //     }
  //     function render() {
  //       let now, delta;
  //       let then = Date.now();
  //       function frame(timestamp) {
  //         requestAnimationFrame(frame);
  //         now = Date.now();
  //         delta = now - then;
  //         if (delta < interval) return;
  //         then = now - (delta % interval);

  //         ctx.clearRect(0, 0, ref.current.width, ref.current.height);

  //         ctx.save();
  //         ctx.translate(ref.current.width, ref.current.height);
  //         ctx.rotate(Math.PI);

  //         grids.forEach((grid) => {
  //           grid.resize(ref.current.width, ref.current.height);
  //           grid.update(simplex, noiseStr, timestamp * 0.0005);
  //           grid.draw(ctx);
  //         });

  //         ctx.restore();
  //       }
  //       requestAnimationFrame(frame);
  //     }
  //     for (let index = 0; index < Math.pow(row, 2); index++) {
  //       const grid = new Grid(index, row);
  //       grids.push(grid);
  //     }

  //     render();
  //   }
  // }, []);
  return (
    <>
      <MetaTags
        title="Guess the word"
        description="Type in random dino scabbled and get the solved word!"
      />

      <div className="container-xl m-3 text-center">
        {/* <FibonacciSphere
          animate={true}
          text={ArkDinos.filter((f) => hasLetters(f.toString(), word))}
          className="h-1/3 w-1/3 text-white"
        /> */}
        <div className="text-center">
          <h1 className="rw-label p-3 text-center text-2xl text-black dark:text-white">
            {getWord(word)}
          </h1>
        </div>
        <Form error={props.error} className="m-6 p-3 flex justify-center">
          <FormError
            error={props.error}
            wrapperClassName="rw-form-error-wrapper"
            titleClassName="rw-form-error-title"
            listClassName="rw-form-error-list"
          />

          <InputOutlined
            type="text"
            name="scrambledWord"
            label="Scrambled Dino Word"
            placeholder="Scrambled Word:"
            onInput={(event) => {
              debouncedChangeHandler(event);
            }}
          />
        </Form>
        {/* <canvas ref={ref}></canvas> */}
      </div>
    </>
  );
};

export default GtwPage;
