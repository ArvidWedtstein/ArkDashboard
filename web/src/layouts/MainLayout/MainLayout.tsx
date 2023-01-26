import { Link, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'
import Navbar from 'src/components/Navbar/Navbar'
import Sidebar from 'src/components/Sidebar/Sidebar'


type LayoutProps = {
  children: React.ReactNode
}


const MainLayout = ({
  children,
}: LayoutProps) => {
  return (
    // <div className="overflow-hidden ">
    <div className="w-full flex flex-col h-[100vh]">
      <Navbar />
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      {/* <main className="container-xl">{children}</main> */}
      <div className="flex sm:flex-row flex-col w-full overflow-hidden">
        <Sidebar />
        <main className="overflow-y-auto sm:w-full">{children}</main>
      </div>
    </div>
  )
}
export default MainLayout
