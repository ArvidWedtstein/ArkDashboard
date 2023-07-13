import DinosCell from 'src/components/Dino/DinosCell'

const DinosPage = ({ page = 1, search = "", category = "" }) => {
  return <DinosCell page={page} search={search} category={category} />
}

export default DinosPage
