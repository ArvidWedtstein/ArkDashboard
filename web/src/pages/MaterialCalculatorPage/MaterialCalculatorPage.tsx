import { MetaTags } from '@redwoodjs/web'
import MaterialCalculatorCell from 'src/components/MaterialCalculator/MaterialCalculatorCell'

const MaterialCalculatorPage = () => {
  return (
    <>
      <MetaTags title="MaterialCalculator" description="Ark Survival Evolved Material Calculator" />
      <MaterialCalculatorCell />
    </>
  )
}

export default MaterialCalculatorPage
