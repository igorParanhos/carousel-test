"use client";
import { default as NextImage } from "next/image";
import styles from "./Carousel.module.css";
import { Box } from "@mantine/core";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";

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
  const [loaded, setLoaded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null!);
  const carouselRef = useRef<HTMLUListElement>(null!);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 0);
  }, []);

  const replicas = useMemo(() => {
    if (!loaded || typeof window === "undefined" || !carouselRef.current)
      return [];

    const carouselWidth = carouselRef.current.getBoundingClientRect().width;
    const wrapperWidth = wrapperRef.current.getBoundingClientRect().width;
    const replicaCount = Math.ceil(wrapperWidth / carouselWidth);

    let elements = [];
    for (let i = 0; i < replicaCount; i++) {
      elements.push(
        <ImagesContainer key={`image_${i + 1}`} images={imagesList} />
      );
    }
    return elements;
  }, [loaded]);

  const elements = [
    <ImagesContainer key="image_0" images={imagesList} ref={carouselRef} />,
    ...replicas,
  ];

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
