import { FieldError, Form, FormError, Label, RWGqlError, TextField } from '@redwoodjs/forms'
import { MetaTags } from '@redwoodjs/web'
import { useMemo, useState } from 'react'
import debounce from 'lodash.debounce';
import { toast } from '@redwoodjs/web/dist/toast';
import FibonacciSphere from 'src/components/Util/FibonacciSphere/FibonacciSphere';

const ArkDinos = [
  "Ankylosaurus", "Argentavis", "Arthropluera", "Baryonyx", "Beelzebufo", "Brontosaurus", "Carbonemys", "Castoroides",
  "Carnotaurus", "Compy", "Daeodon", "Dilophosaurus", "Dimetrodon", "Diplocaulus", "Diplodocus", "Doedicurus", "Dodo", "Dung Beetle",
  "Equus", "Gallimimus", "Giganotosaurus", "Gigantopithecus", "Glowtail", "Dragon", "Gryphon", "Hesperornis", "Ichthyornis",
  "Iguanodon", "Kairuku", "Karkinos", "Kaprosuchus", "Megachelon", "Megalania", "Megaloceros", "Megalodon", "Megatherium", "Moschops",
  "Oviraptor", "Paraceratherium", "Pegomastax", "Plesiosaur", "Parasaur", "Polar Bear", "Procoptodon", "Pteranodon", "Pulmonoscorpius",
  "Quetzal", "Raptor", "Rex", "Rock Drake", "Sabertooth", "Sarco", "Sarcosuchus", "Spino", "Stegosaurus", "Therizinosaurus", "Thorny Dragon",
  "Titanoboa", "Titanosaur", "Triceratops", "Troodon", "Tusoteuthis", "Tyrannosaurus", "Velonasaur", "Woolly Rhino", "Wyvern", "Yutyrannus", "Ankylo",
  "Desmodus", "Fenrir", "Araneo", "Gacha", "Mantis", "Megalosaurus", "Ovis", "Pachy", "Pachyrhinosaurus", "Purlovia", "Scout", "Bulbdog", "Cnidaria",
  "Dunkleosteus", "Eurypterid", "Ichthyosaurus", "Liopleurodon", "Lystrosaurus", "Mammoth", "Manta", "Mosasaurus", "Onyc", "Pachycephalosaurus",
  "Astrocetus", "Basilosaurus", "Astrodelphis", "Fjordhawk", "Featherlight", "Gasbags", "Dimorphodon", "Snow Owl", "Sinomacrops", "Phoenix", "Tapejara",
  "Titanomyrma", "Pelagornis", "Griffin", "Vulture", "Angler", "Electrophorus", "Piranha", "Otter", "Ichtyosaurus", "Trilobite", "Leedsichthys", "Lamprey",
  "Ammonite", "Amargasaurus", "Allosaurus", "Achatina", "Andrewsarchus", "Beezlebufo", "Bloodstalker", "Dilophosaur", "Enforcer", "Giant Bee", "Chalicotherium",
  "Deinonychus", "Dinopithecus", "Jerboa", "Hyaenodon", "Ferox", "Direbear", "Kentrosaurus", "Maewing", "Nameless", "Phiomia", "Sabertooth Salmon", "Spinosaur",
  "Shinehorn", "Thylacoleo", "Rollrat", "Terrorbird", "Reaper", "Seeker", "Shadowmane", "Ravager", "Rockelemental", "Therezinosaurus", "Unicorn", "Yeti",
  "Deathworm", "Mesopithecus", "Mek", "Morellatops", "Noglin", "Leech", "Moeder", "Voidwyrm", "Lymantria", "Archaeopteryx"
]


function sameLetters(str1: string, str2: string) {
  if (str1.length !== str2.length) return false;

  const obj1 = {}
  const obj2 = {}

  for (const letter of str1) {
    obj1[letter] = (obj1[letter] || 1) + 1
  }
  for (const letter of str2) {
    obj2[letter] = (obj2[letter] || 1) + 1
  }

  for (const key in obj1) {
    if (!obj2.hasOwnProperty(key)) return false
    if (obj1[key] !== obj2[key]) return false
  }
  return true
}

const getWord = (word: string) => {
  return ArkDinos.filter((dino) => {
    if (sameLetters(dino.toLowerCase(), word.trim().toLowerCase())) {
      return dino
    }
  })
}

interface GTWPageProps {
  error: RWGqlError
  loading: boolean
}
const GtwPage = (props: GTWPageProps) => {
  // const QUERY = gql`
  //   query {
  //     dinos {
  //       id
  //       name
  //     }
  //   }
  // `
  // useQuery(QUERY)


  const [word, setWord] = useState('')
  const handlechange = (e) => {
    setWord(e.target.value)

    if (getWord(e.target.value)[0] === undefined) return;
    toast.success('Copied to clipboard')
    navigator.clipboard.writeText(getWord(e.target.value)[0]);
  }

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
  const debouncedChangeHandler = useMemo(() => debounce(handlechange, 500), [])
  return (
    <>
      <MetaTags title="Gtw" description="Gtw page" />

      <div className="container-xl text-center m-3">
        <FibonacciSphere animate={true} text={ArkDinos.filter((f) => hasLetters(f.toString(), word))} className="text-white w-1/3 h-1/3" />
        <Form error={props.error} className="m-6 p-3">
          <FormError
            error={props.error}
            wrapperClassName="rw-form-error-wrapper"
            titleClassName="rw-form-error-title"
            listClassName="rw-form-error-list"
          />
          <Label
            name="scrambledWord"
            className="rw-label my-3"
            errorClassName="rw-label rw-label-error"
          >
            Scrambled Word:
          </Label>

          <TextField
            name="scrambledWord"
            typeof='text'
            className="rw-input"
            errorClassName="rw-input rw-input-error"

            onInput={(event) => {
              debouncedChangeHandler(event)
            }}
          />


          <FieldError name="scrambledWord" className="rw-field-error" />

        </Form>
        <div className="text-center">
          <h1 className="p-3 text-2xl rw-label rw-text-center">{getWord(word)}</h1>
        </div>
      </div>
    </>
  )
}

export default GtwPage
