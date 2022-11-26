import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import Account from 'src/components/Account';

const AccountPage = () => {
  return (
    <>
      <MetaTags title="Account" description="Account page" />

      <div className="container-xl p-3 text-center">
        <Account />
      </div>
    </>
  )
}

export default AccountPage
