import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import MaterialCalculatorCell from 'src/components/MaterialCalculator/MaterialCalculatorCell'

const MaterialCalculatorPage = () => {
  return (
    <>
      <MetaTags title="MaterialCalculator" description="MaterialCalculator page" />
      <div className="rounded-lg">
        <div className="p-4 rounded-b-lg">
          <MaterialCalculatorCell />
        </div>
      </div>
    </>
  )
}

export default MaterialCalculatorPage
