"use client";
import { default as NextImage } from "next/image";
import styles from "./Carousel.module.css";
import { Box } from "@mantine/core";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { useResizeObserver } from "@mantine/hooks";

// This is the list of images that will be displayed in the carousel.
const imagesList = [
  "https://via.placeholder.com/800x400",
  "https://via.placeholder.com/800x400",
  "https://via.placeholder.com/800x400",
];

function Image({ src }: { src: string }) {
  return (
    <NextImage
      className={styles.image}
      width="0"
      height="0"
      src={src}
      alt="placeholder"
    />
  );
}

type ImagesContainerProps = {
  images: string[];
};

// This component renders a list of images. It uses the 'forwardRef' function to allow the parent component to access its DOM node.
export const ImagesContainer = forwardRef<
  HTMLUListElement,
  ImagesContainerProps
>(({ images }, ref) => (
  <Box component="ul" className={styles.carousel} ref={ref}>
    {images.map((src, index) => (
      <li key={index} className={styles.carouselItem}>
        <Image aria-label="test" src={src} />
      </li>
    ))}
  </Box>
));
ImagesContainer.displayName = "ImagesContainer";

export function Carousel() {
  // The 'loaded' state is used to control when the animation starts. It's initially set to false and then changed to true after a delay.
  const [loaded, setLoaded] = useState(false);

  // These hooks are used to observe changes in the size of the carousel and its wrapper. They return a reference to the observed element and its dimensions.
  const [carouselRef, carouselRect] = useResizeObserver();
  const [wrapperRef, wrapperRect] = useResizeObserver();

  // This effect sets the 'loaded' state to true after a delay. This triggers the start of the animation.
  useEffect(() => {
    setTimeout(() => setLoaded(true), 0);
  }, []);

  // This memoized value represents the replicated images containers. It's recalculated whenever the 'loaded' state or the dimensions of the carousel or its wrapper change.
  const replicas = useMemo(() => {
    if (!loaded || typeof window === "undefined" || !carouselRef.current)
      return [];

    const carouselWidth = carouselRect.width;
    const wrapperWidth = wrapperRect.width;
    const replicaCount = Math.ceil(wrapperWidth / carouselWidth);

    let elements = [];
    for (let i = 0; i < replicaCount; i++) {
      elements.push(
        <ImagesContainer key={`image_${i + 1}`} images={imagesList} />
      );
    }
    return elements;
  }, [loaded, carouselRect, wrapperRect]);

  // This array contains all the image containers that will be rendered inside the carousel.
  const elements = [
    <ImagesContainer key="image_0" images={imagesList} ref={carouselRef} />,
    ...replicas,
  ];

  // The carousel is wrapped in a div that gets the 'animated' class when the 'loaded' state is true. This starts the animation.
  return (
    <Box
      ref={wrapperRef}
      component="div"
      className={`${styles.wrapper} ${loaded ? styles.animated : ""}`}
    >
      {elements}
    </Box>
  );
}
