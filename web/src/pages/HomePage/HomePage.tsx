import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { useAuth } from '@redwoodjs/auth'
import { useEffect, useState } from 'react'


const HomePage = () => {


  return (
    <>
      <MetaTags title="Home" description="Home page" />
      <div className="container text-center p-4">
        <p>
          Find me in <code>./web/src/pages/HomePage/HomePage.tsx</code>
        </p>
        <p>
          My default route is named <code>home</code>, link to me with `
          <Link to={routes.home()}>Home</Link>`
        </p>
      </div>

    </>
  )
}

export default HomePage
