import React from 'react';
import { Star, ArrowRight, PhoneCall, Award } from 'lucide-react';

const AboutSection = () => {
  return (
    <div className="w-full bg-white font-sans text-[#1a1f2c]">
      {/* Top Stats Banner */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {/* Stat 1 */}
            <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start text-center lg:text-left pt-6 md:pt-0 first:pt-0">
              <h2 className="text-5xl font-extrabold mr-0 lg:mr-4 mb-2 lg:mb-0 text-[#232332]">
                99<sup className="text-3xl font-bold">%</sup>
              </h2>
              <span className="text-[15px] font-semibold text-gray-700 leading-snug">
                Track and analyze <br className="hidden lg:block" />business reports.
              </span>
            </div>
            {/* Stat 2 */}
            <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start text-center lg:text-left pt-6 md:pt-0 md:pl-8 lg:pl-12">
              <h2 className="text-5xl font-extrabold mr-0 lg:mr-4 mb-2 lg:mb-0 tracking-tighter text-[#232332]">
                4.98
              </h2>
              <div>
                <div className="flex text-orange-400 mb-1 justify-center lg:justify-start">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current text-purple-600" />
                </div>
                <span className="text-[15px] font-semibold text-gray-700">Best rated agency</span>
              </div>
            </div>
            {/* Stat 3 */}
            <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start text-center lg:text-left pt-6 md:pt-0 md:pl-8 lg:pl-12">
              <h2 className="text-5xl font-extrabold mr-0 lg:mr-4 mb-2 lg:mb-0 text-[#232332]">
                98<sup className="text-3xl font-bold">%</sup>
              </h2>
              <span className="text-[15px] font-semibold text-gray-700 leading-snug">
                Genuine repeated <br className="hidden lg:block" />happy customers.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main About Area */}
      <section className="max-w-[1400px] mx-auto px-6 py-20 lg:py-28 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Images & Graphic */}
          <div className="relative flex justify-center items-center h-[500px] lg:h-[600px]">
            {/* Circular Background Gradient */}
            <div className="absolute w-[350px] h-[350px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] rounded-full bg-gradient-to-tr from-rose-100 via-rose-50 to-blue-50 opacity-80 z-0"></div>
            
            {/* Central Text inside Circle */}
            <div className="absolute z-10 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-8xl md:text-[120px] lg:text-[140px] font-extrabold text-[#232332] tracking-tighter leading-none relative">
                28<sup className="text-5xl lg:text-[70px] absolute top-2 lg:top-4 ml-1">+</sup>
              </span>
              <span className="text-lg lg:text-xl font-semibold text-gray-700 w-48 mt-4 leading-tight">
                Years working experience
              </span>
            </div>

            {/* Trophy Image overlayed */}
            <img 
              src="/about-trophy.png" 
              alt="Trophy" 
              className="absolute z-20 w-[80%] md:w-[60%] lg:w-[70%] max-w-[450px] left-0 bottom-0 lg:-ml-12 lg:-mb-10 object-contain drop-shadow-2xl mix-blend-multiply"
            />

            {/* Blue Floating Badge */}
            <div className="absolute top-10 right-4 md:right-16 lg:right-10 z-30 animate-[bounce_5s_infinite]">
              <div className="w-28 h-28 lg:w-[130px] lg:h-[130px] rounded-full bg-[#3b2dbb] flex flex-col items-center justify-center text-white shadow-2xl relative">
                <div className="absolute -top-3 bg-white rounded-full p-1 shadow-md">
                   <div className="bg-[#3b2dbb] rounded-full p-1.5">
                     <Award className="w-4 h-4 text-white" />
                   </div>
                </div>
                <span className="text-[10px] font-bold tracking-[0.1em] text-center leading-tight mt-2">CREATIVE<br/>VISION</span>
              </div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:pl-4">
            <span className="inline-block px-6 py-2.5 mb-8 text-xs font-bold tracking-[0.15em] uppercase text-[#4f46e5] bg-gray-100/80 rounded-full">
              Creative approach
            </span>
            <h3 className="text-4xl md:text-5xl lg:text-[54px] font-extrabold text-[#232332] leading-[1.15] tracking-tight mb-8">
              Powerful agency for corporate business.
            </h3>
            <p className="text-[17px] text-gray-500 mb-12 max-w-xl leading-relaxed">
              We strive to develop real-world web solutions that are ideal for small to large projects with bespoke project requirements. We create compelling web designs, which are the right-fit for your target groups and also deliver optimized.
            </p>
            <div className="flex flex-col sm:flex-row items-center sm:space-x-8 space-y-6 sm:space-y-0">
              <button className="group flex items-center space-x-2 bg-[#232332] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#34344a] transition-colors shadow-lg">
                <span className="text-[15px]">Read about us</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a href="tel:1800222000" className="flex items-center space-x-2 text-[17px] font-bold text-[#232332] hover:text-[#4f46e5] transition-colors">
                <PhoneCall className="w-5 h-5 text-gray-400" />
                <span>1 800 222 000</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Counters */}
        <div className="mt-28 lg:mt-36 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 text-center max-w-6xl mx-auto">
          {/* Counter 1 */}
          <div className="flex flex-col items-center">
            <div className="relative inline-block mb-3">
              <h4 className="text-[52px] font-extrabold text-[#232332] tracking-tighter relative z-10 leading-none">4586</h4>
              <div className="absolute bottom-1 left-0 w-full h-3.5 bg-gradient-to-r from-[#f46b45] to-[#7154c1] opacity-20 z-0 rounded-full"></div>
            </div>
            <span className="text-xs font-bold tracking-[0.1em] uppercase text-gray-700">Telephonic talk</span>
          </div>
          {/* Counter 2 */}
          <div className="flex flex-col items-center">
            <div className="relative inline-block mb-3">
              <h4 className="text-[52px] font-extrabold text-[#232332] tracking-tighter relative z-10 leading-none">583</h4>
              <div className="absolute bottom-1 left-0 w-full h-3.5 bg-gradient-to-r from-[#f46b45] to-[#7154c1] opacity-20 z-0 rounded-full"></div>
            </div>
            <span className="text-xs font-bold tracking-[0.1em] uppercase text-gray-700">Cases solved</span>
          </div>
          {/* Counter 3 */}
          <div className="flex flex-col items-center">
            <div className="relative inline-block mb-3">
              <h4 className="text-[52px] font-extrabold text-[#232332] tracking-tighter relative z-10 leading-none">6548</h4>
              <div className="absolute bottom-1 left-0 w-full h-3.5 bg-gradient-to-r from-[#f46b45] to-[#7154c1] opacity-20 z-0 rounded-full"></div>
            </div>
            <span className="text-xs font-bold tracking-[0.1em] uppercase text-gray-700">Coffee cups</span>
          </div>
          {/* Counter 4 */}
          <div className="flex flex-col items-center">
            <div className="relative inline-block mb-3">
              <h4 className="text-[52px] font-extrabold text-[#232332] tracking-tighter relative z-10 leading-none">836</h4>
              <div className="absolute bottom-1 left-0 w-full h-3.5 bg-gradient-to-r from-[#f46b45] to-[#7154c1] opacity-20 z-0 rounded-full"></div>
            </div>
            <span className="text-xs font-bold tracking-[0.1em] uppercase text-gray-700">Happy clients</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;
