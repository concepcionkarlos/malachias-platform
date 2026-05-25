import Navbar       from './components/Navbar';
import Hero         from './components/Hero';
import About        from './components/About';
import Music        from './components/Music';
import Journal      from './components/Journal';
import Merch        from './components/Merch';
import Mission      from './components/Mission';
import Testimonies  from './components/Testimonies';
import Press        from './components/Press';
import Booking      from './components/Booking';
import Newsletter   from './components/Newsletter';
import Footer       from './components/Footer';
import SectionDivider from './components/SectionDivider';

export default function Home() {
  return (
    <main className="bg-black min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <SectionDivider accent="gold" />
      <About />
      <Music />
      <Journal />
      <Merch />
      <SectionDivider accent="crimson" />
      <Mission />
      <Testimonies />
      <SectionDivider accent="gold" label="BROTHERHOOD" />
      <Press />
      <Booking />
      <Newsletter />
      <Footer />
    </main>
  );
}
