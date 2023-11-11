import { SkipNavContent } from "@redwoodjs/router";
import { usePageLoadingContext } from "@redwoodjs/router";
import { Toaster } from "@redwoodjs/web/toast";
import Footer from "src/components/Footer/Footer";
import Sidebar from "src/components/Sidebar/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: LayoutProps) => {
  const { loading } = usePageLoadingContext();
  return (
    <>
      {/* <SkipNavLink contentId="main-content"></SkipNavLink> */}
      <Toaster
        aria-label="Global notifications"
        toastOptions={{
          className: "rw-toast",
          duration: 6000,
          position: "top-right",
        }}
      />
      <div className="flex w-full flex-col sm:flex-row">
        <Sidebar />
        <SkipNavContent id="main-content" />
        <main className="m-3 h-auto min-h-screen overflow-x-hidden p-3 sm:w-full sm:overflow-x-auto">
          {loading && (
            <div className="z-50 flex h-full w-full items-center justify-center">
              <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-gray-900" />
            </div>
          )}
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
};
export default MainLayout;
