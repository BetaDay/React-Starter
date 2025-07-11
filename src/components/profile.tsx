import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Profile: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Smooth fade
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  const avatarImages: string[] = ['Mark.jpg', 'Sharon.jpg', 'Adrian.jpg', 'Allan.jpg', 'Vincent.png', '7.jfif'];

  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row gap-8 h-full">
      {/* Left Image Grid */}
      <div className="w-full md:w-1/2 min-h-[50vh]">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[50vh]">
          {/* Container 1 */}
          <div
            className="h-[180px] md:h-[240px] relative group overflow-hidden rounded shadow m-[10px] cursor-pointer"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <img src="/images/Lish.jpg" alt="Image 1" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
              <p className="text-gray-300 text-sm font-semibold opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 text-center w-[90%]">
                Courtesy of Lish AI Labs Empowering Technology for the Future.
              </p>
            </div>
          </div>

          {/* Container 2 */}
          <div
            className="h-[280px] md:h-[320px] relative group overflow-hidden rounded shadow m-[10px] cursor-pointer"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <img src="/images/riria.jpg" alt="Image 2" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
              <p className="text-gray-300 text-sm font-semibold opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 text-center w-[90%]">
                Dedicated to your Comfort
              </p>
            </div>
          </div>

          {/* Container 3 */}
          <div
            className="h-[280px] md:h-[320px] relative group overflow-hidden rounded shadow m-[10px] cursor-pointer md:-mt-[70px] z-10"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <img src="/images/nakuru.webp" alt="Image 3" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
              <p className="text-gray-300 text-sm font-semibold opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 text-center w-[90%]">
                Discover Nakuru
              </p>
            </div>
          </div>

          {/* Container 4 */}
          <div
            className="h-[180px] md:h-[240px] relative group overflow-hidden rounded shadow m-[10px] cursor-pointer"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <img src="/images/GoldenLife.jpg" alt="Image 4" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
              <p className="text-gray-300 text-sm font-semibold opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 text-center w-[90%]">
                Your Ideal Getaway
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div
        className="w-full md:w-2/3 flex flex-col justify-center p-6"
       
      >
        <h2 className="text-2xl font-bold mb-4 text-center md:text-left text-orange-600">About Us</h2>
        <p className="text-gray-700 text-sm leading-relaxed text-center md:text-left font-sans">
          Pata House is a Kenyan real‑estate platform headquartered in Ongata Rongai, Nairobi, aimed at helping people find and list properties. Pata House is a Kenyan real‑estate platform headquartered in Ongata Rongai, Nairobi, aimed at helping people find and list properties.
        </p>

        {/* Avatar Images */}
        <div className="imagex group relative flex items-center h-[50px] mt-[30px] ml-[20px]">
          <div className="avatars flex transition-all duration-500 ease-in-out">
            {avatarImages.map((src, index) => (
              <img
                key={index}
                src={`/images/${src}`}
                alt={`Avatar ${index + 1}`}
                className="avatar -ml-9 group-hover:ml-0 rounded-full border-2 shadow-xl bg-white h-20 w-20 transition-transform duration-300 hover:scale-150 object-fill"
                style={{
                  boxShadow: '0 6px 24px rgba(0,0,0,0.16)',
                  backgroundColor: '#fff',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
