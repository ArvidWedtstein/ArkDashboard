import { useEffect } from "react";

type IntersectionObserverProps = {
  onIntersect: IntersectionObserverCallback;
  threshold?: number | number[];
  rootMargin?: number;
  target: Element;
}
const useIntersectionObserver = ({
  target,
  onIntersect,
  threshold = 0.1,
  rootMargin = 0
}: IntersectionObserverProps) => {
  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      ...(rootMargin ? { rootMargin: `${rootMargin}px` } : null),
      threshold
    });
    if (target) {
      observer.observe(target);
    }
    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [target]);
};
export default useIntersectionObserver;