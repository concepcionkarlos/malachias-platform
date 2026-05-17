import Navbar     from './components/Navbar';
import Hero       from './components/Hero';
import About      from './components/About';
import Music      from './components/Music';
import Mission    from './components/Mission';
import Merch      from './components/Merch';
import Booking    from './components/Booking';
import Newsletter from './components/Newsletter';
import Footer     from './components/Footer';

export default function Home() {
  return (
    <main className="bg-black min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Music />
      <Mission />
      <Merch />
      <Booking />
      <Newsletter />
      <Footer />
    </main>
  );
}
