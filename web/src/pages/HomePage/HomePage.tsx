import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { useAuth } from '@redwoodjs/auth'
import { useEffect } from 'react'

const HomePage = () => {


  return (
    <>
      <MetaTags title="Home" description="Home page" />
      {/* <button type="button" onClick={logOut}>logout</button> */}
      {/* {
        isAuthenticated ? <h1>HomePage</h1> : <h1>Not logged in</h1>
      } */}
      <p>
        Find me in <code>./web/src/pages/HomePage/HomePage.tsx</code>

      </p>
      <p>
        My default route is named <code>home</code>, link to me with `
        <Link to={routes.home()}>Home</Link>`
      </p>
    </>
  )
}

export default HomePage
