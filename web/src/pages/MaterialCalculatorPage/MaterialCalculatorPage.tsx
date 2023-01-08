import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import MaterialCalculatorForm from 'src/components/MaterialCalculator/MaterialCalculatorForm/MaterialCalculatorForm'


const MaterialCalculatorPage = () => {
  return (
    <>
      <MetaTags title="MaterialCalculator" description="MaterialCalculator page" />
      <div className="rw-segment mx-3">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">Material Calculator</h2>
        </header>
        <div className="rw-segment-main">
          <MaterialCalculatorForm />
        </div>
      </div>
    </>
  )
}

export default MaterialCalculatorPage
