import { useAuth } from '@redwoodjs/auth'
import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

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
    <div className="h-full">
      <Toaster containerClassName='mx-3' toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <header className="rw-header">
        <h1 className="rw-heading rw-heading-primary">
          <Link to={routes[titleTo]()} className="text-blue-400 underline dark:text-gray-300">
            {title}
          </Link>
        </h1>
        {isAuthenticated && <Link to={routes[buttonTo]()} className="rw-button rw-button-green test">
          <div className="rw-button-icon">+</div> {buttonLabel}
        </Link>}
      </header>
      <main className="rw-main">{children}</main>
    </div>
  )
}

export default ScaffoldLayout
