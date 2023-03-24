import { useFieldArray } from '@redwoodjs/forms'
import { SkipNavLink } from '@redwoodjs/router'
import { SkipNavContent } from '@redwoodjs/router'
import { Link, routes, usePageLoadingContext } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'
import Navbar from 'src/components/Navbar/Navbar'
import Sidebar from 'src/components/Sidebar/Sidebar'


type LayoutProps = {
  children: React.ReactNode
}


const MainLayout = ({
  children,
}: LayoutProps) => {
  const { loading } = usePageLoadingContext()
  return (
    // <div className="overflow-hidden ">
    <div className="w-full flex flex-col h-[100vh]">
      <SkipNavLink />
      <Navbar />
      <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
      <div className="flex sm:flex-row flex-col w-full overflow-hidden">
        <Sidebar />
        <SkipNavContent />
        <main className="overflow-y-auto sm:w-full">
          {loading && (
            <div className="w-full h-full bg-white bg-opacity-50 z-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
export default MainLayout
