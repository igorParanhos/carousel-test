"use client";
import { default as NextImage } from "next/image";
import styles from "./Carousel.module.css";
import { Box } from "@mantine/core";
import { ReactEventHandler, forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useResizeObserver } from "@mantine/hooks";

// This is the list of images that will be displayed in the carousel.
const imageUrls = [
  "https://via.placeholder.com/800x400",
  "https://via.placeholder.com/800x400",
  "https://via.placeholder.com/800x400",
];
function Image({
  src,
  onImageLoad,
}: {
  src: string;
  onImageLoad?: ReactEventHandler<HTMLImageElement>;
}) {
  return (
    <NextImage
      className={styles.image}
      width="0"
      height="0"
      src={src}
      alt="placeholder"
      onLoad={onImageLoad}
    />
  );
}

type ImagesContainerProps = {
  images: string[];
  onLoadComplete?: () => void;
};

export const ImagesContainer = forwardRef<
  HTMLUListElement,
  ImagesContainerProps
>(({ images, onLoadComplete }, ref) => {
  const loadedImagesCount = useRef(0);

  const setLoaded = useCallback(() => {
    loadedImagesCount.current += 1;
    if (loadedImagesCount.current === images.length) {
      onLoadComplete?.();
    }
  }, []);

  return (
    <Box component="ul" className={styles.carousel} ref={ref}>
      {images.map((imageUrl, index) => (
        <li key={index} className={styles.carouselItem}>
          <Image aria-label="test" onImageLoad={onLoadComplete ? setLoaded : undefined} src={imageUrl} />
        </li>
      ))}
    </Box>
  );
});
ImagesContainer.displayName = "ImagesContainer";

export function Carousel() {
  const [isLoaded, setIsLoaded] = useState(false);

  const [carouselRef, carouselRect] = useResizeObserver();
  const [wrapperRef, wrapperRect] = useResizeObserver();

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  const replicas = useMemo(() => {
    if (!isLoaded || typeof window === "undefined" || !carouselRef.current)
      return [];

    const carouselWidth = carouselRect.width;
    const wrapperWidth = wrapperRect.width;
    const replicaCount = Math.ceil(wrapperWidth / carouselWidth);

    let elements = [];
    for (let i = 0; i < replicaCount; i++) {
      elements.push(
        <ImagesContainer
          key={`image_${i + 1}`}
          images={imageUrls}
          onLoadComplete={handleImageLoad}
        />
      );
    }
    return elements;
  }, [isLoaded, carouselRect, wrapperRect]);

  const elements = useMemo(
    () => [
      <ImagesContainer
        key="image_0"
        images={imageUrls}
        ref={carouselRef}
        onLoadComplete={handleImageLoad}
      />,
      ...replicas,
    ],
    [replicas]
  );

  return (
    <Box
      ref={wrapperRef}
      component="div"
      className={`${styles.wrapper} ${isLoaded ? styles.animated : ""}`}
    >
      {elements}
    </Box>
  );
}
