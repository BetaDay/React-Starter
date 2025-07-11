import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faPhone,
  faFax,
  faRss,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faXTwitter,
  faLinkedinIn,
  faYoutube,
  faGooglePlusG,
  faPinterest,
} from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 text-gray-800">
      {/* Top Border Line */}
      <div className="mx-[6vw] border-t-2 border-orange-400/50 pt-10" />

      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left mb-6">
          {/* Left: Logo */}
          <div className="w-full md:w-2/3 mb-6 md:mb-0">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center mb-4">
                <img src="images/logoF.svg" alt="Logo" className="h-10 mr-3" />
              </div>
            </div>
          </div>

          {/* Right: Contact Info + Social Icons */}
          <div className="w-full md:w-1/3 flex flex-col items-center md:items-end space-y-4">
            <div className="text-xs md:text-sm text-gray-600 space-y-2">
              <div className="flex pt-3 items-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-orange-600" />
                <span>Nakuru, Kenya</span>
              </div>
              <div className="flex items-center justify-center md:justify-end flex-wrap pb-4">
                <FontAwesomeIcon icon={faPhone} className="mr-2 text-orange-600" />
                <span>+254 111 817 007</span>
                <span className="mx-4 text-orange-600">|</span>
                <FontAwesomeIcon icon={faFax} className="mr-2 text-orange-600" />
                <span>+254 117 223 832</span>
              </div>
            </div>

            <div className="flex space-x-4 justify-center md:justify-end">
              {[
                { icon: faFacebookF, label: 'Facebook' },
                { icon: faXTwitter, label: 'Twitter' },
                { icon: faLinkedinIn, label: 'LinkedIn' },
                { icon: faYoutube, label: 'YouTube' },
                { icon: faGooglePlusG, label: 'Google Plus' },
                { icon: faPinterest, label: 'Pinterest' },
                { icon: faRss, label: 'RSS' },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="text-orange-600 hover:text-orange-700"
                  aria-label={item.label}
                >
                  <FontAwesomeIcon icon={item.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-gray-200 pt-4 text-xs md:text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center flex-wrap pb-10">
          <div className="flex flex-wrap justify-center md:justify-start space-x-4 text-gray-600 mb-2">
            {['About Us', 'Contact Us', 'Help', 'Privacy Policy', 'Disclaimer'].map((label, idx) => (
              <a key={idx} href="#" className="hover:text-orange-600">
                {label}
              </a>
            ))}
          </div>
          <div className="text-gray-600 text-center md:text-right">
            <a href="#" className="hover:text-orange-600">
              &copy; 2025 PataHouse. All rights reserved.
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
