import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'
import Navbar from 'src/components/Navbar/Navbar'
import Sidebar from 'src/components/Sidebar/Sidebar'

type LayoutProps = {
  title: string
  titleTo: string
  buttonLabel: string
  buttonTo: string
  children: React.ReactNode
}

const ScaffoldLayout = ({
  title,
  titleTo,
  buttonLabel,
  buttonTo,
  children,
}: LayoutProps) => {
  const {
    isAuthenticated
  } = useAuth();
  return ( // dark:bg-[#131417] dark:bg-slate-600
    // <div className="mx-3 h-full">
    //   <Toaster containerClassName='mx-3' toastOptions={{ className: 'rw-toast', duration: 6000 }} />
    //   <header className="rw-header">
    //     <h1 className="rw-heading rw-heading-primary">
    //       <Link to={routes[titleTo]()} className="text-blue-400 underline dark:text-gray-300">
    //         {title}
    //       </Link>
    //     </h1>
    //     {isAuthenticated && <Link to={routes[buttonTo]()} className="rw-button rw-button-green test">
    //       <div className="rw-button-icon">+</div> {buttonLabel}
    //     </Link>}
    //   </header>
    //   <main className="rw-main">{children}</main>
    // </div>
    <div className="w-full flex flex-col h-[100vh] overflow-hidden">
      <Navbar title={title} titleTo={titleTo} buttonLabel={buttonLabel} buttonTo={buttonTo} />
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      {/* <main className="container-xl">{children}</main> */}
      <div className="flex sm:flex-row flex-col w-full overflow-hidden">
        <Sidebar />
        <main className="overflow-y-auto sm:w-full rounded-2xl p-3 m-3">{children}</main> {/* bg-white dark:bg-[#3b424f] */}
      </div>
    </div>
  )
}

export default ScaffoldLayout
