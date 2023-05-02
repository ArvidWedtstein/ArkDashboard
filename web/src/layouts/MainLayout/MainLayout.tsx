import { SkipNavContent } from "@redwoodjs/router";
import { Link, routes, usePageLoadingContext } from "@redwoodjs/router";
import { Toaster } from "@redwoodjs/web/toast";
import Navbar from "src/components/Navbar/Navbar";
import Sidebar from "src/components/Sidebar/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: LayoutProps) => {
  const { loading } = usePageLoadingContext();
  return (
    // <div className="overflow-hidden h-[100vh]">
    <div className="flex w-full flex-col">
      {/* <SkipNavLink contentId="main-content"></SkipNavLink> */}
      <Navbar />
      <Toaster toastOptions={{ className: "rw-toast", duration: 6000 }} />
      <div className="flex w-full flex-col sm:flex-row">
        <Sidebar />
        <SkipNavContent id="main-content" />
        <main className="overflow-y-auto sm:w-full">
          {loading && (
            <div className="z-50 flex h-full w-full items-center justify-center">
              <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};
export default MainLayout;
