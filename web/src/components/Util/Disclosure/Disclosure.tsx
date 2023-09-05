interface IDisclosureProps {
  title: string;
  children: React.ReactNode;
}

const Disclosure = ({ title, children }: IDisclosureProps) => {
  return (
    <details className="border-t border-gray-200 py-6 transition-all duration-300 ease-in-out [&>summary>svg]:open:rotate-45">
      <summary className="-my-3 flex items-center justify-between text-white transition-all duration-300 ease-in-out">
        <span className="rw-label !mt-0 grow">{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 500 500"
          className="h-4 w-4 fill-current stroke-current transition-all duration-300 ease-in-out shrink-0"
        >
          <path d="M432 256C432 264.8 424.8 272 416 272h-176V448c0 8.844-7.156 16.01-16 16.01S208 456.8 208 448V272H32c-8.844 0-16-7.15-16-15.99C16 247.2 23.16 240 32 240h176V64c0-8.844 7.156-15.99 16-15.99S240 55.16 240 64v176H416C424.8 240 432 247.2 432 256z" />
        </svg>
      </summary>
      <div className="animate-fade-in pt-6 text-black dark:text-white">
        {children}
      </div>
    </details>
  );
};

export default Disclosure;
