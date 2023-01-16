import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import MaterialCalculatorForm from 'src/components/MaterialCalculator/MaterialCalculatorForm/MaterialCalculatorForm'


const MaterialCalculatorPage = () => {
  return (
    <>
      <MetaTags title="MaterialCalculator" description="MaterialCalculator page" />
      <div className="rounded-lg m-3">
        <header className="p-4 dark:text-white text-black">
          <h2 className="rw-heading text-xl dark:text-white text-black">Material Calculator</h2>
        </header>
        <div className="p-4 rounded-b-lg">
          <MaterialCalculatorForm />
        </div>
      </div>
    </>
  )
}

export default MaterialCalculatorPage
