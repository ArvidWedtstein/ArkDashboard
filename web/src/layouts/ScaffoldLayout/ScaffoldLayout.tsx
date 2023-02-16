

type LayoutProps = {
  children: React.ReactNode
}

const ScaffoldLayout = ({
  children,
}: LayoutProps) => {

  return (
    <div className="rounded-2xl p-3 m-3">{/* bg-white dark:bg-[#3b424f] */}
      {children}
    </div>
    // <div className="w-full flex flex-col h-[100vh] overflow-hidden" >
    //   <Navbar />
    //   <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
    //   <div className="flex sm:flex-row flex-col w-full overflow-hidden">
    //     <Sidebar />
    //     <main className="overflow-y-auto sm:w-full rounded-2xl p-3 m-3">{children}</main>
    //   </div>
    // </div>
    //   <div className="mx-3 h-full">
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
  )
}

export default ScaffoldLayout
