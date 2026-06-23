import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>;
const TwitterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>;
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.036 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/></svg>;
const DribbbleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 0C3.584 0 0 3.584 0 8s3.584 8 8 8c4.408 0 8-3.584 8-8s-3.592-8-8-8m5.284 3.688a6.8 6.8 0 0 1 1.545 4.251c-.226-.043-2.482-.503-4.755-.217-.052-.112-.096-.234-.148-.355-.139-.33-.295-.668-.451-.99 2.516-1.023 3.662-2.498 3.81-2.69zM8 1.18c1.735 0 3.323.65 4.53 1.718-.122.174-1.155 1.553-3.584 2.464-1.12-2.056-2.36-3.74-2.551-4A6.95 6.95 0 0 1 8 1.18m-2.907.642A43.1 43.1 0 0 1 7.627 5.77c-3.193.85-6.013.833-6.317.833a6.86 6.86 0 0 1 3.783-4.78zM1.153 8.98c.314 0 3.206.018 6.465-1.016a38.1 38.1 0 0 1 1.044 2.53c-3.928 1.184-5.659 3.282-5.929 3.636A6.8 6.8 0 0 1 1.153 8.98m2.465 4.605c.294-.39 2.15-2.527 6.132-3.662.33.831.609 1.707.824 2.61-2.555 1.526-3.585 2.699-3.75 2.905a6.83 6.83 0 0 1-3.206-1.853m5.945 2.137c.18-.225 1.143-1.441 3.422-2.931.258.941.385 1.916.385 2.915a6.84 6.84 0 0 1-3.807.016"/></svg>;

const Footer = () => {
  return (
    <footer className="pt-20 pb-10 border-t border-gray-200 bg-white font-sans">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 mb-16 justify-between">
          
          {/* Brand Column */}
          <div className="lg:col-span-3 sm:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <div className="text-2xl font-bold text-[#1a1f2c] flex items-baseline tracking-tight">
                Corporate
                <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] ml-0.5"></span>
              </div>
            </Link>
            <p className="text-gray-500 mb-6 leading-relaxed max-w-[280px] text-[15px]">
              Gearing your company through an innovative strategy.
            </p>
            <div className="flex space-x-5">
              <a href="#" className="text-[#1a1f2c] hover:text-[#f43f5e] transition-colors" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="#" className="text-[#1a1f2c] hover:text-[#f43f5e] transition-colors" aria-label="Dribbble">
                <DribbbleIcon />
              </a>
              <a href="#" className="text-[#1a1f2c] hover:text-[#f43f5e] transition-colors" aria-label="Twitter">
                <TwitterIcon />
              </a>
              <a href="#" className="text-[#1a1f2c] hover:text-[#f43f5e] transition-colors" aria-label="Instagram">
                <InstagramIcon />
              </a>
            </div>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-2">
            <h4 className="text-[#1a1f2c] font-semibold mb-5 text-[17px]">Company</h4>
            <ul className="space-y-3 text-[15px]">
              <li><Link to="/about" className="text-gray-500 hover:text-[#f43f5e] transition-colors">Who we are</Link></li>
              <li>
                <Link to="/services" className="text-gray-500 hover:text-[#f43f5e] transition-colors inline-flex items-center">
                  Our services
                  <span className="ml-2 bg-[#1a1f2c] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase leading-tight">Hot</span>
                </Link>
              </li>
              <li><Link to="/clients" className="text-gray-500 hover:text-[#f43f5e] transition-colors">Our clients</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-[#f43f5e] transition-colors">Contact us</Link></li>
            </ul>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-2">
            <h4 className="text-[#1a1f2c] font-semibold mb-5 text-[17px]">Services</h4>
            <ul className="space-y-3 text-[15px]">
              <li><Link to="/services/planning" className="text-gray-500 hover:text-[#f43f5e] transition-colors">Planning</Link></li>
              <li><Link to="/services/research" className="text-gray-500 hover:text-[#f43f5e] transition-colors">Research</Link></li>
              <li><Link to="/services/consulting" className="text-gray-500 hover:text-[#f43f5e] transition-colors">Consulting</Link></li>
              <li><Link to="/services/analysis" className="text-gray-500 hover:text-[#f43f5e] transition-colors">Analysis</Link></li>
            </ul>
          </div>

          {/* Customer Column */}
          <div className="lg:col-span-2">
            <h4 className="text-[#1a1f2c] font-semibold mb-5 text-[17px]">Customer</h4>
            <ul className="space-y-3 text-[15px]">
              <li><Link to="/support" className="text-gray-500 hover:text-[#f43f5e] transition-colors">Client support</Link></li>
              <li><Link to="/help" className="text-gray-500 hover:text-[#f43f5e] transition-colors">Help center</Link></li>
              <li><Link to="/status" className="text-gray-500 hover:text-[#f43f5e] transition-colors">System status</Link></li>
              <li><Link to="/feedback" className="text-gray-500 hover:text-[#f43f5e] transition-colors">Feedback</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3 sm:col-span-2">
            <h4 className="text-[#1a1f2c] font-semibold mb-5 text-[17px]">Subscribe newsletter</h4>
            <p className="text-gray-500 mb-5 leading-relaxed text-[15px]">
              Subscribe our newsletter to get the latest news and updates!
            </p>
            <form className="relative w-full" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full pl-4 pr-12 py-3 bg-transparent border border-gray-200 rounded text-[15px] outline-none focus:border-gray-400 text-gray-700 transition-colors placeholder:text-gray-400"
                required
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-gray-400 hover:text-[#1a1f2c] transition-colors"
                aria-label="Submit"
              >
                <Mail size={18} />
              </button>
            </form>
          </div>
          
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-200 mb-8"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col lg:flex-row justify-between items-center text-[15px]">
          <p className="text-gray-500 mb-4 lg:mb-0">
            © 2026 Crafto is Proudly Powered by <a href="https://www.themezaa.com/" target="_blank" rel="noopener noreferrer" className="text-[#1a1f2c] font-semibold border-b border-[#1a1f2c] pb-[1px] hover:text-[#f43f5e] hover:border-[#f43f5e] transition-colors">ThemeZaa</a>
          </p>
          <ul className="flex flex-wrap justify-center space-x-6 text-gray-500">
            <li><a href="#" className="hover:text-[#f43f5e] transition-colors">Privacy policy</a></li>
            <li><a href="#" className="hover:text-[#f43f5e] transition-colors">Terms and conditions</a></li>
            <li><a href="#" className="hover:text-[#f43f5e] transition-colors">Copyright</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
