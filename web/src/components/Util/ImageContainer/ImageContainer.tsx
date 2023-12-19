import clsx from "clsx";
import { ReactNode, forwardRef, useEffect, useRef, useState } from "react";
import useIntersectionObserver from "src/components/useIntersectionObserver";

interface ImageContainerProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  defaultsrc?: string;
  alt?: string;
  caption?: string | ReactNode;
  className?: string;
  /**
   * @default 500
   */
  width?: number;
  /**
   * @default 500
   *
   */
  height?: number;
  key?: string;
}
const ImageContainer = forwardRef<HTMLElement, ImageContainerProps>((props, ref) => {
  const {
    src,
    defaultsrc = "",
    alt,
    caption,
    className,
    width = 500,
    height = 500,
    key,
  } = props;

  // const [imageLoaded, setImageLoaded] = useState(false);
  // const imageRef = useRef(null);


  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) {
  //         setImageLoaded(true);
  //         observer.unobserve(imageRef.current);
  //       }
  //     },
  //     { threshold: 0.5 } // Adjust the threshold as per your needs
  //   );

  //   if (imageRef.current) {
  //     observer.observe(imageRef.current);
  //   }

  //   return () => {
  //     if (imageRef.current) {
  //       observer.unobserve(imageRef.current);
  //     }
  //   };
  // }, []);
  const imageRef = useRef(null);

  useIntersectionObserver({
    target: imageRef.current,
    onIntersect: (entries, observerElement) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (isIntersecting) {

          (target as HTMLImageElement).src = src;
          observerElement.unobserve(imageRef.current);
        }
      })
    },
  });

  // const aspectRatio = (width / height) * 100
  return (
    <figure ref={ref} className={clsx("relative overflow-hidden transition-opacity duration-300 ease-linear", className)}>
      <img
        className="h-auto max-w-full rounded-lg transition-all duration-1000"
        // onLoad={() => console.log('load')}
        ref={imageRef}
        alt={alt}
        loading="lazy"
        {...props}
        onError={(e) => {
          if (defaultsrc) e.currentTarget.src = defaultsrc;
        }}
      />
      {!!caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
  // return (
  //   <div
  //     key={key}
  //     ref={ref}
  //     className={clsx(
  //       "relative overflow-hidden transition-opacity duration-300 ease-linear",
  //       className
  //     )}
  //   >
  //     {isVisible && (
  //       <figure className={"max-w-3xl w-fit"}>
  //         <img
  //           className="h-auto max-w-full rounded-lg transition-all duration-1000"
  //           // onLoad={() => console.log('load')}
  //           src={src}
  //           alt={alt}
  //           {...props}
  //           onError={(e) => {
  //             if (defaultsrc) e.currentTarget.src = defaultsrc;
  //           }}
  //         />
  //         {!!caption && (
  //           <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
  //             {caption}
  //           </figcaption>
  //         )}
  //       </figure>
  //     )}
  //   </div>
  // );
});

export default ImageContainer;
