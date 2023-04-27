import clsx from "clsx"
import { useRef, useState } from "react"
import useIntersectionObserver from "src/components/useIntersectionObserver"

interface ImageContainerProps {
  src: string
  alt?: string
  caption?: string
  className?: string
  /**
   * @default 500
   */
  width?: number
  /**
   * @default 500
   *
   */
  height?: number
  key?: any
}
const ImageContainer = ({
  src,
  alt,
  caption,
  className,
  width = 500,
  height = 500,
  key
}: ImageContainerProps) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useIntersectionObserver({
    target: ref,
    onIntersect: ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        setIsVisible(true)
        observerElement.unobserve(ref.current)
      }
    }
  })

  const aspectRatio = (width / height) * 100

  return (
    <div
      key={key}
      ref={ref}
      className={clsx("relative overflow-hidden transition-opacity duration-300 ease-linear", className)}
    >
      {isVisible && (
        <figure className="max-w-lg  overflow-hidden" style={{ paddingBottom: `${aspectRatio}%` }}>
          <img className="h-auto max-w-full rounded-lg" src={src} alt={alt} />
          {!!caption && <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">{caption}</figcaption>}
        </figure>
      )}
    </div>
  )
}

export default ImageContainer