import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CheckoutModal from '../components/CheckoutModal';
import { ChevronDown, Check, X, CalendarCheck, Wallet, Clock, Plus, Minus, MessageSquare, Mail } from 'lucide-react';

const Pricing = () => {
  const [activeFaq, setActiveFaq] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const faqs = [
    {
      question: "Find network providers in your area",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam, quis nostrud exercitation."
    },
    {
      question: "See your claims, check on coverage and more",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam, quis nostrud exercitation."
    },
    {
      question: "Easy access more mental health providers",
      answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam, quis nostrud exercitation."
    }
  ];

  const handleOpenModal = (planDetails) => {
    setSelectedPlan(planDetails);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <Navbar />

      <main>
        {/* Banner Section */}
        <section 
          className="relative h-[500px] flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop")' }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-[#1a1f2c]/60"></div>
          
          <div className="relative z-10 text-center flex flex-col items-center justify-center pt-20">
            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-8">
              Pricing plans
            </h1>
          </div>

          <a href="#pricing-table" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce">
            <ChevronDown className="w-8 h-8 opacity-80" />
          </a>
        </section>

        {/* Pricing Tables Section */}
        <section id="pricing-table" className="py-24 max-w-7xl mx-auto px-6 lg:px-8 relative -mt-20 z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 lg:gap-8 items-end max-w-5xl mx-auto">
            
            {/* Starter Plan */}
            <div className="bg-white rounded-xl overflow-hidden mb-8 md:mb-0 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transform transition-transform hover:-translate-y-2 duration-300">
              <div className="p-10 text-center relative top-[-3px]">
                <span className="bg-blue-50 text-[#4f46e5] text-[13px] font-bold uppercase tracking-wider py-1.5 px-6 rounded-full mb-4 inline-block">Starter</span>
                <h3 className="text-[28px] font-bold text-[#1a1f2c] mt-2">Individual</h3>
              </div>
              <div className="bg-white">
                <ul className="text-center md:text-left">
                  <li className="flex items-center justify-center md:justify-start py-4 px-10 border-t border-gray-100 text-gray-600 font-medium text-[15px]">
                    <span className="w-5 h-5 rounded-full bg-[#00b67a] text-white flex items-center justify-center mr-3 shrink-0">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    Marketing strategy
                  </li>
                  <li className="flex items-center justify-center md:justify-start py-4 px-10 border-t border-gray-100 text-gray-600 font-medium text-[15px]">
                    <span className="w-5 h-5 rounded-full bg-[#00b67a] text-white flex items-center justify-center mr-3 shrink-0">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    Competitive work analysis
                  </li>
                  <li className="flex items-center justify-center md:justify-start py-4 px-10 border-t border-gray-100 text-gray-600 font-medium text-[15px]">
                    <span className="w-5 h-5 rounded-full bg-[#e84f4f] text-white flex items-center justify-center mr-3 shrink-0">
                      <X className="w-3 h-3" strokeWidth={3} />
                    </span>
                    Social media share audit
                  </li>
                  <li className="flex items-center justify-center md:justify-start py-4 px-10 border-t border-gray-100 text-gray-600 font-medium text-[15px]">
                    <span className="w-5 h-5 rounded-full bg-[#e84f4f] text-white flex items-center justify-center mr-3 shrink-0">
                      <X className="w-3 h-3" strokeWidth={3} />
                    </span>
                    Monthly management
                  </li>
                </ul>
                <div className="mt-8 text-center px-10">
                  <div className="flex items-center justify-center mb-6">
                    <span className="text-[44px] font-extrabold text-[#1a1f2c] tracking-tighter mr-3">$29</span>
                    <span className="text-[14px] text-gray-500 text-left leading-[1.3] w-28">Per user/month<br/>billed annually*</span>
                  </div>
                  <button 
                    onClick={() => handleOpenModal({ name: 'Individual', price: 29, description: 'Perfect for freelancers and individual professionals.' })}
                    className="w-full py-3.5 px-6 bg-[#252840] hover:bg-black text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 group text-[15px]">
                    Join this plan
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  <p className="text-center text-[15px] text-gray-400 mt-5 font-medium pb-8">Cancel anytime</p>
                </div>
              </div>
            </div>

            {/* Professional Plan (Highlighted) */}
            <div className="bg-white rounded-xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.15)] relative z-10 transform md:scale-[1.03] transition-transform hover:-translate-y-2 duration-300">
              <div className="bg-gradient-to-r from-[#f97316] via-[#a855f7] to-[#4f46e5] text-white text-[13px] font-bold uppercase tracking-wider py-2 text-center">
                Popular
              </div>
              <div className="p-10 text-center relative top-[-3px]">
                <span className="bg-blue-50 text-[#4f46e5] text-[13px] font-bold uppercase tracking-wider py-1.5 px-6 rounded-full mb-4 inline-block">Professional</span>
                <h3 className="text-[28px] font-bold text-[#1a1f2c] mt-2">Business</h3>
              </div>
              <div>
                <ul className="text-center md:text-left bg-white">
                  <li className="flex items-center justify-center md:justify-start py-4 px-10 border-t border-gray-100 text-gray-600 font-medium text-[15px]">
                    <span className="w-5 h-5 rounded-full bg-[#00b67a] text-white flex items-center justify-center mr-3 shrink-0">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    Marketing strategy
                  </li>
                  <li className="flex items-center justify-center md:justify-start py-4 px-10 border-t border-gray-100 text-gray-600 font-medium text-[15px]">
                    <span className="w-5 h-5 rounded-full bg-[#00b67a] text-white flex items-center justify-center mr-3 shrink-0">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    Competitive work analysis
                  </li>
                  <li className="flex items-center justify-center md:justify-start py-4 px-10 border-t border-gray-100 text-gray-600 font-medium text-[15px]">
                    <span className="w-5 h-5 rounded-full bg-[#00b67a] text-white flex items-center justify-center mr-3 shrink-0">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    Social media share audit
                  </li>
                  <li className="flex items-center justify-center md:justify-start py-4 px-10 border-t border-gray-100 text-gray-600 font-medium text-[15px]">
                    <span className="w-5 h-5 rounded-full bg-[#e84f4f] text-white flex items-center justify-center mr-3 shrink-0">
                      <X className="w-3 h-3" strokeWidth={3} />
                    </span>
                    Monthly management
                  </li>
                </ul>
                <div className="bg-[#252840] pt-10 px-10">
                  <div className="flex items-center justify-center mb-6">
                    <span className="text-[44px] font-extrabold text-white tracking-tighter mr-3">$39</span>
                    <span className="text-[14px] text-gray-400 text-left leading-[1.3] w-28">Per user/month<br/>billed annually*</span>
                  </div>
                  <button 
                    onClick={() => handleOpenModal({ name: 'Business', price: 39, description: 'Ideal for growing businesses and small teams.' })}
                    className="w-full py-3.5 px-6 bg-white hover:bg-gray-100 text-[#1a1f2c] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 group text-[15px]">
                    Join this plan
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  <p className="text-center text-[15px] text-gray-400 mt-5 font-medium opacity-80 pb-8">Cancel anytime</p>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-xl overflow-hidden mt-8 md:mt-0 shadow-[0_10px_30px_rgba(0,0,0,0.06)] transform transition-transform hover:-translate-y-2 duration-300">
              <div className="p-10 text-center relative top-[-3px]">
                <span className="bg-blue-50 text-[#4f46e5] text-[13px] font-bold uppercase tracking-wider py-1.5 px-6 rounded-full mb-4 inline-block">Enterprise</span>
                <h3 className="text-[28px] font-bold text-[#1a1f2c] mt-2">Corporate</h3>
              </div>
              <div className="bg-white">
                <ul className="text-center md:text-left">
                  <li className="flex items-center justify-center md:justify-start py-4 px-10 border-t border-gray-100 text-gray-600 font-medium text-[15px]">
                    <span className="w-5 h-5 rounded-full bg-[#00b67a] text-white flex items-center justify-center mr-3 shrink-0">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    Marketing strategy
                  </li>
                  <li className="flex items-center justify-center md:justify-start py-4 px-10 border-t border-gray-100 text-gray-600 font-medium text-[15px]">
                    <span className="w-5 h-5 rounded-full bg-[#00b67a] text-white flex items-center justify-center mr-3 shrink-0">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    Competitive work analysis
                  </li>
                  <li className="flex items-center justify-center md:justify-start py-4 px-10 border-t border-gray-100 text-gray-600 font-medium text-[15px]">
                    <span className="w-5 h-5 rounded-full bg-[#00b67a] text-white flex items-center justify-center mr-3 shrink-0">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    Social media share audit
                  </li>
                  <li className="flex items-center justify-center md:justify-start py-4 px-10 border-t border-gray-100 text-gray-600 font-medium text-[15px]">
                    <span className="w-5 h-5 rounded-full bg-[#00b67a] text-white flex items-center justify-center mr-3 shrink-0">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    Monthly management
                  </li>
                </ul>
                <div className="mt-8 text-center px-10">
                  <div className="flex items-center justify-center mb-6">
                    <span className="text-[44px] font-extrabold text-[#1a1f2c] tracking-tighter mr-3">$59</span>
                    <span className="text-[14px] text-gray-500 text-left leading-[1.3] w-28">Per user/month<br/>billed annually*</span>
                  </div>
                  <button 
                    onClick={() => handleOpenModal({ name: 'Corporate', price: 59, description: 'Advanced features for large scale organizations.' })}
                    className="w-full py-3.5 px-6 bg-[#252840] hover:bg-black text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 group text-[15px]">
                    Join this plan
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  <p className="text-center text-[15px] text-gray-400 mt-5 font-medium pb-8">Cancel anytime</p>
                </div>
              </div>
            </div>

          </div>

          {/* Features Row */}
          <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20">
            <div className="flex items-center gap-3">
              <CalendarCheck className="w-6 h-6 text-gray-700" />
              <span className="text-lg font-bold text-[#1a1f2c]">Get 30 day free trial</span>
            </div>
            <div className="flex items-center gap-3">
              <Wallet className="w-6 h-6 text-gray-700" />
              <span className="text-lg font-bold text-[#1a1f2c]">No any hidden fees pay</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-gray-700" />
              <span className="text-lg font-bold text-[#1a1f2c]">You can cancel anytime</span>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 rounded-3xl p-10 lg:p-16 relative overflow-hidden">
            {/* Background Icon */}
            <div className="absolute -top-10 -right-10 opacity-[0.03] text-[#4f46e5]">
              <MessageSquare className="w-96 h-96" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row gap-16">
              {/* Left Side: Header */}
              <div className="w-full lg:w-1/3">
                <span className="bg-[#4f46e5] text-white text-[11px] font-bold uppercase tracking-wider py-1.5 px-4 rounded-full mb-6 inline-block">
                  Basic information
                </span>
                <h2 className="text-4xl lg:text-5xl font-bold text-[#1a1f2c] tracking-tight leading-tight mb-6">
                  Frequently asked questions
                </h2>
              </div>

              {/* Right Side: Accordion */}
              <div className="w-full lg:w-2/3">
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className={`border-b ${index === faqs.length - 1 ? 'border-transparent' : 'border-gray-200'}`}>
                      <button 
                        className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                        onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}
                      >
                        <span className="text-xl font-bold text-[#1a1f2c] group-hover:text-[#4f46e5] transition-colors pr-8">
                          {faq.question}
                        </span>
                        <span className="text-gray-400 shrink-0 transition-transform duration-300">
                          {activeFaq === index ? (
                            <Minus className="w-6 h-6 text-[#1a1f2c]" />
                          ) : (
                          <Plus className="w-6 h-6" />
                          )}
                        </span>
                      </button>
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          activeFaq === index ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p className="text-lg text-gray-500 leading-relaxed max-w-3xl">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Contact */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-[#4f46e5]" />
              <span className="text-lg font-bold text-[#1a1f2c]">
                Looking for help? <a href="#" className="border-b border-[#1a1f2c] pb-0.5 hover:text-[#4f46e5] hover:border-[#4f46e5] transition-colors">Submit a ticket</a>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-[#4f46e5]" />
              <span className="text-lg font-bold text-[#1a1f2c]">
                Keep in Touch. <a href="#" className="border-b border-[#1a1f2c] pb-0.5 hover:text-[#4f46e5] hover:border-[#4f46e5] transition-colors">Like us on Facebook</a>
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        plan={selectedPlan} 
      />
    </div>
  );
};

export default Pricing;
