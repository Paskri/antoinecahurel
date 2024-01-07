import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { AudioProvider } from '../hooks/useAudio';
import Pages from '../layout/Pages';
import Projects from '../layout/Projects';
export default function HomeContent() {
  return (
    <>
      <AudioProvider>
        <Header />
        <main>
          <Pages />
          <Projects />
        </main>

      </AudioProvider>

    </>
  );
}
