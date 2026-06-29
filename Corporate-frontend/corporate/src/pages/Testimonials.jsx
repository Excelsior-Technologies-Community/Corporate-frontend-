import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ChevronDown, Star } from 'lucide-react';

const TwitterIcon = () => (
  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/testimonials');
        setTestimonials(res.data.data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-current" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 text-gray-300 fill-current" />); // Simplified half star for UI consistency
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-200 fill-current" />);
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <Navbar />

      <main>
        {/* Banner Section */}
        <section 
          className="relative h-[600px] flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop")' }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-[#1a1f2c]/60"></div>
          
          <div className="relative z-10 text-center flex flex-col items-center justify-center pt-20">
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-8">
              Customer stories
            </h1>
          </div>

          <a href="#stories" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce">
            <ChevronDown className="w-8 h-8 opacity-80" />
          </a>
        </section>

        {/* Highlight Story Section */}
        <section id="stories" className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left side Image with Rating Card */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative inline-block w-full text-center">
                <img 
                  src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=800&auto=format&fit=crop" 
                  alt="Customer" 
                  className="rounded-full w-full max-w-[500px] mx-auto object-cover aspect-square shadow-xl"
                />
                
                {/* Floating Rating Card */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.1)] w-80 flex items-center justify-between">
                  <div className="border-r border-gray-200 pr-6">
                    <span className="text-5xl font-extrabold text-[#1a1f2c] tracking-tighter">4.9</span>
                  </div>
                  <div className="pl-6 flex flex-col items-start">
                    <div className="flex gap-1 text-[#f97316] mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[15px] font-semibold text-[#1a1f2c]">Best rated agency</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side content */}
            <div className="w-full lg:w-1/2 pt-12 lg:pt-0">
              <div className="mb-6 flex items-center">
                 {/* ThemeZaa logo placeholder */}
                 <div className="flex items-center gap-2 text-[#f97316] font-bold text-xl">
                   <div className="w-8 h-8 border-2 border-current rounded transform rotate-45 flex items-center justify-center">
                     <span className="transform -rotate-45 text-sm">TZ</span>
                   </div>
                   <span className="text-[#1a1f2c] ml-1">ThemeZaa</span>
                 </div>
              </div>
              <h2 className="text-4xl md:text-[42px] font-bold text-[#1a1f2c] leading-tight mb-6 tracking-tight">
                Exceeded all my expectations.
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-10 w-full lg:w-11/12">
                We strive to develop real-world web solutions that are ideal for small to large projects with bespoke project requirements. We create compelling web designs, which are the right-fit for your target.
              </p>
              
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-[#4f46e5]">
                  <TwitterIcon />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-[#1a1f2c]">Alexander Johnson</h4>
                  <p className="text-gray-500">Themezaa, Co founder</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Logos Marquee */}
        <section className="py-10 border-t border-gray-100 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {/* Duplicated for seamless loop */}
            {[1, 2].map((group) => (
              <div key={group} className="flex gap-20 px-10 items-center opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                <span className="text-4xl font-black tracking-tighter font-serif text-gray-400">in<span className="text-gray-800">vision</span></span>
                <span className="text-4xl font-bold tracking-widest text-[#400090]">YAHOO!</span>
                <span className="text-4xl font-bold font-sans tracking-tighter text-[#ff9900]">amazon</span>
                <span className="text-4xl font-black tracking-tight text-[#0071ce]">Walmart</span>
                <span className="text-4xl font-black tracking-widest text-[#E50914] uppercase">Netflix</span>
              </div>
            ))}
          </div>
        </section>

        {/* Stats and Reviews Grid */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-24 border-t border-gray-100 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            
            {/* Stats Header */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-20">
              <div className="flex items-center gap-6">
                <img 
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=150&h=150&auto=format&fit=crop" 
                  alt="Customer avatar" 
                  className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white"
                />
                <h3 className="text-2xl text-[#1a1f2c] max-w-sm leading-snug">
                  Trusted by <span className="font-extrabold text-[#4f46e5] border-b-2 border-[#4f46e5]">25,000+</span> happy customers are using crafto.
                </h3>
              </div>

              <div className="flex items-center gap-16 text-center lg:text-left">
                <div>
                  <h4 className="text-5xl font-extrabold text-[#1a1f2c] mb-2 tracking-tighter">200+</h4>
                  <p className="text-gray-500 font-medium leading-tight">Creative team to<br/>care for projects.</p>
                </div>
                <div>
                  <h4 className="text-5xl font-extrabold text-[#1a1f2c] mb-2 tracking-tighter">4.9</h4>
                  <div className="flex text-[#f97316] mb-1 justify-center lg:justify-start">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-500 font-medium">2,488 Rating</p>
                </div>
              </div>
            </div>

            {/* Review Cards Grid */}
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading customer stories...</div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No customer stories available at the moment.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-white rounded-xl p-10 shadow-[0_10px_30px_rgba(0,0,0,0.06)] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <img src={testimonial.avatar_url} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover" />
                        <div>
                          <h5 className="text-lg font-bold text-[#1a1f2c]">{testimonial.name}</h5>
                          <p className="text-gray-500 text-sm">{testimonial.role}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-8">
                        {testimonial.content}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-[#1a1f2c]">{Number(testimonial.rating).toFixed(1)}</span>
                        <div className="flex text-[#f97316]">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                      <span className="bg-[#1a1f2c] text-white text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider">
                        {testimonial.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Trustpilot Banner */}
            <div className="mt-20 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
              <span className="text-xl font-medium text-[#1a1f2c]">
                More than <strong className="font-bold border-b-2 border-gray-900 pb-0.5">10000+</strong> happy customers reviews on
              </span>
              <div className="flex items-center gap-2">
                <Star className="w-8 h-8 fill-[#00b67a] text-[#00b67a]" />
                <span className="text-2xl font-bold tracking-tight text-[#1a1f2c]">Trustpilot</span>
                <div className="bg-[#00b67a] text-white px-3 py-1 rounded text-sm font-bold ml-2 tracking-wide flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" />
                  <Star className="w-3 h-3 fill-white" />
                  <Star className="w-3 h-3 fill-white" />
                  <Star className="w-3 h-3 fill-white" />
                  <Star className="w-3 h-3 fill-white" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Marquee Keyframes for tailwind config injection */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Testimonials;
