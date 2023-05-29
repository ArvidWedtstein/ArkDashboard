import clsx from "clsx";
import { ReactNode, useRef, useState } from "react";
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
  key?: any;
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
      {/* {!imageLoaded && (
        <img
          src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiTw9vKUkfzdUkGVByistee-qWWG21sxiU8IT8cSjfBw&s`}
          alt="loading placeholder"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
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
