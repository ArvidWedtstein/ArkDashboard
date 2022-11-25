import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'
import Navbar from 'src/components/Navbar'

type LayoutProps = {
  children: React.ReactNode
}


const MainLayout = ({
  children,
}: LayoutProps) => {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <main className="container-xl mx-3">{children}</main>
    </div>
  )
}

export default MainLayout

// TODO: add shopping system