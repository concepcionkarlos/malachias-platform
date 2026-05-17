import Navbar        from './components/Navbar';
import Hero          from './components/Hero';
import SectionDivider from './components/SectionDivider';
import About         from './components/About';
import Music         from './components/Music';
import Mission       from './components/Mission';
import Merch         from './components/Merch';
import Booking       from './components/Booking';
import Newsletter    from './components/Newsletter';
import Footer        from './components/Footer';

export default function Home() {
  return (
    <main className="bg-black min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <SectionDivider accent="gold"    label="Our Story"  />
      <About />
      <SectionDivider accent="gold"    label="The Music"  />
      <Music />
      <SectionDivider accent="crimson" label="The Mission" />
      <Mission />
      <SectionDivider accent="gold"    label="Gear Up"    />
      <Merch />
      <SectionDivider accent="crimson" label="Book Us"    />
      <Booking />
      <SectionDivider accent="gold"    label="Brotherhood" />
      <Newsletter />
      <Footer />
    </main>
  );
}
