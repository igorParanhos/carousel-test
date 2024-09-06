import { Carousel } from "./components/Carousel/Carousel";
import { Carousel as Carousel2 } from "./components/Carousel2/Carousel";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Carousel />
      <Carousel2 />
    </main>
  );
}
