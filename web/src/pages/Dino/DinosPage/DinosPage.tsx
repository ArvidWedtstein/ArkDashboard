import DinosCell from 'src/components/Dino/DinosCell'

const DinosPage = ({ page = 1, search = "", type = "", diet = "", temperament = "" }) => {
  return <DinosCell page={page} search={search} type={type} diet={diet} temperament={temperament} />
}

export default DinosPage
