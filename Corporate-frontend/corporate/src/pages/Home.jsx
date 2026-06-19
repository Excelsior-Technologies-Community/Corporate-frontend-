import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />
      
      <main>
        <Hero />
        <AboutSection />
      </main>
    </div>
  );
};

export default Home;
