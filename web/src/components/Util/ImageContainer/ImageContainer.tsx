import clsx from "clsx";
import { ReactNode, useEffect, useRef, useState } from "react";
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
const ImageContainer = ({ ...props }: ImageContainerProps) => {
  const {
    src,
    defaultsrc,
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
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useIntersectionObserver({
    target: ref,
    onIntersect: ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        setIsVisible(true);
        observerElement.unobserve(ref.current);
      }
    },
  });

  // const aspectRatio = (width / height) * 100

  return (
    <div
      key={key}
      ref={ref}
      className={clsx(
        "relative overflow-hidden transition-opacity duration-300 ease-linear",
        className
      )}
    // style={{ paddingBottom: `${aspectRatio}%` }}
    >
      {/*
      {imageLoaded ? (
        <img src={src} alt={alt} ref={imageRef} />
      ) : (
        <img src={defaultsrc} alt="Placeholder" />
      )} */}
      {isVisible && (
        <figure className="max-w-3xl">
          <img
            className="h-auto max-w-full rounded-lg transition-all duration-1000"
            // onLoad={() => setImageLoaded(true)}
            src={src}
            alt={alt}
            {...props}
            onError={(e) => {
              if (defaultsrc) e.currentTarget.src = defaultsrc;
            }}
          // style={{ opacity: imageLoaded ? 1 : 0 }}
          />
          {!!caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              {caption}
            </figcaption>
          )}
        </figure>
      )}
    </div>
  );
};

export default ImageContainer;
