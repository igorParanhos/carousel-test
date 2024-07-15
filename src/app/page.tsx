import { Carousel } from "./components/Carousel/Carousel";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Carousel />
    </main>
  );
}
