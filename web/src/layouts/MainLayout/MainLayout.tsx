import { SkipNavContent } from "@redwoodjs/router";
import { usePageLoadingContext } from "@redwoodjs/router";
import { Toaster } from "@redwoodjs/web/toast";
import { Fragment } from "react";
import Footer from "src/components/Footer/Footer";
import Sidebar from "src/components/Sidebar/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: LayoutProps) => {
  const { loading } = usePageLoadingContext();
  return (
    <Fragment>
      {/* <SkipNavLink contentId="main-content"></SkipNavLink> */}
      <Toaster
        aria-label="Global notifications"
        toastOptions={{
          className: "rounded border-2 bg-zinc-50 p-4 text-black dark:bg-zinc-800 dark:text-white",
          duration: 6000,
          position: "top-right",
        }}
      />
      <div className="flex">
        <Sidebar />
        <SkipNavContent id="main-content" />
        <main className="flex-grow h-auto min-h-screen overflow-auto sm:w-full">
          {loading && (
            <div className="z-50 flex h-full w-full items-center justify-center">
              <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-gray-900" />
            </div>
          )}
          {children}
        </main>
      </div>
      <Footer />
    </Fragment>
  );
};
export default MainLayout;
