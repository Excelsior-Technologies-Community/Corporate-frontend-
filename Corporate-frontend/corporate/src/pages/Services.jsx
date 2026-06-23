import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ChevronDown, Star, Award, MessageCircle, ArrowRight, Target, Coins, BarChart3, Briefcase, Globe, Lightbulb, TrendingUp, Users, Search } from 'lucide-react';
import axios from 'axios';

// Map icon name strings from DB to Lucide React components
const ICON_MAP = {
  Target, Coins, BarChart3, Briefcase, Globe, Lightbulb, TrendingUp, Users, Award, Search,
};

const getIcon = (name) => ICON_MAP[name] || Briefcase;

const Services = () => {
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/services');
        setServices(res.data.data);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setServicesLoading(false);
      }
    };
    fetchServices();
  }, []);
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section 
          className="relative pt-[120px] pb-[160px] flex items-center justify-center overflow-hidden bg-cover bg-center"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop")',
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-[#252c3f]/85"></div>
          
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h1 className="text-[55px] md:text-[70px] font-bold text-white tracking-tight mb-8">
              Services
            </h1>
            <a 
              href="#down-section" 
              className="inline-flex items-center justify-center w-12 h-12 rounded-full text-white hover:bg-white/10 transition-colors"
              aria-label="Scroll down"
            >
              <ChevronDown size={28} />
            </a>
          </div>
        </section>

        {/* Content Section (Overlapping) */}
        <section id="down-section" className="relative pb-24 pt-16 z-20 overflow-hidden">
          {/* Background Patterns */}
          <div className="absolute top-40 left-[10%] opacity-50 z-0" style={{transform: "rotate(-5deg)"}}>
             <img src="images/demo-corporate-services-bg-01.png" alt="" className="max-w-full" onError={(e) => e.target.style.display='none'} />
          </div>
          <div className="absolute top-10 right-0 opacity-50 z-0">
             <img src="images/demo-corporate-services-bg-02.png" alt="" className="max-w-full" onError={(e) => e.target.style.display='none'} />
          </div>

          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
              
              {/* Left Column - Stats Box */}
              <div className="w-full lg:w-5/12 lg:mt-4">
                <div className="bg-white rounded-[16px] shadow-[0_15px_50px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col relative z-20">
                  
                  {/* Stat 1 */}
                  <div className="py-12 lg:py-16 px-6 border-b border-gray-100 flex justify-center">
                    <div className="flex items-center w-full max-w-[310px]">
                      <div className="w-[110px] flex-shrink-0 text-center mr-6">
                        <h2 className="text-[60px] font-bold text-[#1a1f2c] leading-none tracking-tighter">
                          99<sup className="text-[26px] font-bold -top-6 relative">%</sup>
                        </h2>
                      </div>
                      <div className="flex-1">
                        <span className="text-[15px] font-semibold text-[#1a1f2c] leading-[1.4] block opacity-90">
                          Track and analyze<br/>business reports.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="py-12 lg:py-16 px-6 border-b border-gray-100 flex justify-center">
                    <div className="flex items-center w-full max-w-[310px]">
                      <div className="w-[110px] flex-shrink-0 text-center mr-6">
                        <h2 className="text-[60px] font-bold text-[#1a1f2c] leading-none tracking-tighter">
                          4.9
                        </h2>
                      </div>
                      <div className="flex-1">
                        <div className="flex mb-1.5">
                          <Star size={18} fill="currentColor" className="mr-[2px] text-orange-500" />
                          <Star size={18} fill="currentColor" className="mr-[2px] text-red-500" />
                          <Star size={18} fill="currentColor" className="mr-[2px] text-pink-500" />
                          <Star size={18} fill="currentColor" className="mr-[2px] text-purple-600" />
                          <Star size={18} fill="currentColor" className="text-indigo-700" />
                        </div>
                        <span className="text-[15px] font-semibold text-[#1a1f2c] leading-[1.4] block opacity-90">
                          Best rated agency
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stat 3 */}
                  <div className="py-12 lg:py-16 px-6 flex justify-center">
                    <div className="flex items-center w-full max-w-[310px]">
                      <div className="w-[110px] flex-shrink-0 text-center mr-6">
                        <h2 className="text-[60px] font-bold text-[#1a1f2c] leading-none tracking-tighter">
                          98<sup className="text-[26px] font-bold -top-6 relative">%</sup>
                        </h2>
                      </div>
                      <div className="flex-1">
                        <span className="text-[15px] font-semibold text-[#1a1f2c] leading-[1.4] block opacity-90">
                          Genuine repeated<br/>happy customers.
                        </span>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>

              {/* Right Column - Text Content */}
              <div className="w-full lg:w-6/12 lg:pl-10 mt-12 lg:mt-12">
                <span className="inline-block px-5 py-2 mb-5 text-[12px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 rounded-full">
                  Creative approach
                </span>
                
                <h3 className="text-[38px] md:text-[44px] font-bold text-[#1a1f2c] leading-[1.1] tracking-tight mb-6 max-w-md">
                  Reach your business goals in record time.
                </h3>
                
                <p className="text-[15px] text-gray-500 leading-relaxed max-w-lg mb-8">
                  Lorem ipsum simply dummy printing typesetting industry lorem Ipsum been the industry's dummy text ever since when an unknown printer took a galley.
                </p>

                <div className="bg-gradient-to-r from-[#f97316] via-[#d946ef] to-[#4338ca] rounded-md px-6 py-4 mb-8 flex items-center max-w-[450px] shadow-[0_10px_20px_rgba(217,70,239,0.15)]">
                  <div className="mr-4 text-amber-300">
                     <Award size={24} strokeWidth={2.5} />
                  </div>
                  <span className="text-white font-medium text-[15px]">
                    Best corporate services agency in world.
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <div className="flex items-center mb-4 sm:mb-0">
                    <span className="text-[38px] font-bold text-[#1a1f2c] mr-4 leading-none tracking-tight">722+</span>
                    <div className="bg-[#1a1f2c] rounded px-2.5 py-1 flex">
                      <Star size={11} fill="currentColor" className="text-white mx-[1px]" />
                      <Star size={11} fill="currentColor" className="text-white mx-[1px]" />
                      <Star size={11} fill="currentColor" className="text-white mx-[1px]" />
                      <Star size={11} fill="currentColor" className="text-white mx-[1px]" />
                      <Star size={11} fill="currentColor" className="text-white mx-[1px]" />
                    </div>
                  </div>
                  <div className="sm:ml-6 sm:pl-6 sm:border-l-[2px] sm:border-gray-300 max-w-[200px]">
                    <p className="text-[14px] text-[#1a1f2c] font-semibold leading-snug m-0">
                      5 star reviews from our satisfied customers.
                    </p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* Corporate Services Grid Section */}
        <section className="relative py-24 bg-[#f8f9fc] z-10">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Header */}
            <div className="text-center mb-16">
              <span className="inline-block px-5 py-2 mb-4 text-[12px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 rounded-full">
                Creative approach
              </span>
              <h3 className="text-[38px] md:text-[44px] font-bold text-[#1a1f2c] leading-tight tracking-tight">
                Corporate services
              </h3>
            </div>

            {/* Dynamic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              
              {servicesLoading ? (
                // Loading skeleton
                [1,2,3].map(i => (
                  <div key={i} className="bg-white rounded-lg shadow-[0_15px_40px_rgba(0,0,0,0.06)] overflow-hidden animate-pulse">
                    <div className="h-64 bg-gray-200"></div>
                    <div className="p-10">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                      <div className="h-4 bg-gray-100 rounded w-2/3 mx-auto"></div>
                    </div>
                    <div className="border-t border-gray-100 py-5 flex justify-center">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))
              ) : services.length === 0 ? (
                <div className="col-span-3 py-20 text-center text-gray-400">
                  <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-semibold">No services available yet.</p>
                </div>
              ) : (
                services.map((service) => {
                  const IconComponent = getIcon(service.icon);
                  return (
                    <div key={service.id} className="bg-white rounded-lg shadow-[0_15px_40px_rgba(0,0,0,0.06)] overflow-hidden group cursor-pointer flex flex-col">
                      <div className="relative h-64 overflow-hidden flex-shrink-0">
                        <img
                          src={service.image_url}
                          alt={service.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop'; }}
                        />
                        <div className="absolute top-5 right-5 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full z-10">
                          {service.label}
                        </div>
                      </div>
                      <div className="bg-white group-hover:bg-[#4338ca] transition-colors duration-300 flex flex-col flex-grow">
                        <div className="px-10 py-10 text-center flex flex-col items-center flex-grow">
                          <div className="h-0 opacity-0 group-hover:h-12 group-hover:opacity-100 group-hover:mb-4 transition-all duration-300 flex justify-center items-center overflow-hidden">
                            <IconComponent size={44} className="text-white" strokeWidth={1.2} />
                          </div>
                          <h4 className="text-[19px] font-bold text-[#1a1f2c] group-hover:text-white mb-4 transition-colors duration-300">{service.title}</h4>
                          <p className="text-[15px] text-gray-500 group-hover:text-indigo-100/90 leading-relaxed mb-4 max-w-[240px] transition-colors duration-300">
                            {service.description}
                          </p>
                        </div>
                        <div className="border-t border-gray-100 group-hover:border-indigo-500 py-5 text-center transition-colors duration-300">
                          <a href="#" className="inline-flex items-center text-[13px] font-bold text-[#1a1f2c] group-hover:text-white uppercase tracking-wider transition-colors duration-300">
                            Explore services <ArrowRight size={16} className="ml-2" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom CTA */}
            <div className="flex justify-center items-center">
              <div className="flex items-center">
                <div className="mr-3 text-indigo-700">
                  <MessageCircle size={26} strokeWidth={2.5} />
                </div>
                <div className="text-[13.5px] font-bold uppercase tracking-wider">
                  <span className="text-[#1a1f2c] mr-2">Let's make something great work together.</span>
                  <a href="#" className="text-indigo-700 border-b-2 border-indigo-300 hover:border-indigo-700 pb-0.5 transition-colors">Got a project in mind?</a>
                </div>
              </div>
            </div>
            
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Services;
