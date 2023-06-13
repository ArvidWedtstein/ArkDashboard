type LayoutProps = {
  children: React.ReactNode;
};

const ScaffoldLayout = ({ children }: LayoutProps) => {
  return (
    <div className="m-3 p-3">
      {/* bg-white dark:bg-[#3b424f] */}
      {children}
    </div>
  );
};

export default ScaffoldLayout;
