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
    <div className="overflow-hidden w-full flex flex-col h-full ">
      <Navbar />
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      {/* <main className="container-xl">{children}</main> */}
      <div className="flex  w-full h-full">
        <Sidebar />
        <main className="w-full ">{children}</main>
      </div>
    </div>
  )
}
export default MainLayout
