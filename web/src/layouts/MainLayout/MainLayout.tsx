import { SkipNavContent } from "@redwoodjs/router";
import { usePageLoadingContext } from "@redwoodjs/router";
import { Toaster } from "@redwoodjs/web/toast";
import Footer from "src/components/Footer/Footer";
import Navbar from "src/components/Navbar/Navbar";
import Sidebar from "src/components/Sidebar/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: LayoutProps) => {
  const { loading } = usePageLoadingContext();
  return (
    <div className="w-full">
      {/* <SkipNavLink contentId="main-content"></SkipNavLink> */}
      {/* <Navbar /> */}
      <Toaster toastOptions={{ className: "rw-toast", duration: 6000 }} />
      <div className="flex w-full flex-col sm:flex-row">
        <Sidebar />
        <SkipNavContent id="main-content" />
        <main className="h-auto min-h-screen overflow-x-hidden sm:w-full sm:overflow-x-auto">
          {loading && (
            <div className="z-50 flex h-full w-full items-center justify-center">
              <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};
export default MainLayout;
