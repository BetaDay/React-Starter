import React, { useState, useEffect } from 'react';

type Slide = {
  id: number;
  title?: string;
  description?: string;
  button?: string;
  image: string;
};

const slides: Slide[] = [
  {
    id: 1,
    title: 'Where Dream Homes Meet Real Life!',
    description:
      'Whether you are searching, setting, or upgrading, our platform connects you to top-tier properties, smart home services, and real time support.',
    button: 'Explore Now',
    image: '/images/carousel-1.png',
  },
  {
    id: 2,
    title: 'Rooted in Heritage. Driven by Imagination',
    button: 'View Listings',
    image: '/images/carousel-2.png',
  },
  {
    id: 3,
    image: '/images/carousel-3.png',
  },
];

const HeroCarousel: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = slides[current];

  return (
    <div className="w-full h-screen bg-[#9BDAEF]/50 flex items-center justify-center relative">
      <div className="w-full h-full flex flex-col md:flex-row items-center">
        {/* Left Content */}
        <div className="w-full md:w-[30%] flex items-center justify-center h-1/2 md:h-full px-6 py-10 md:py-0">
          {currentSlide.id === 3 ? (
            <div className="flex flex-col items-center justify-center relative w-80 h-[34rem]">
              {/* SVG Curve */}
              <svg
                viewBox="0 0 400 400"
                className="absolute w-full h-full z-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M150 20 C50 100, 50 300, 150 380"
                  stroke="#F4511E"
                  strokeWidth="4"
                  fill="transparent"
                />
              </svg>

              {/* Circles */}
              {['Fast', 'Reliable', 'Affordable'].map((text, idx) => {
                const positions = [
                  'top-4 left-1/2 transform -translate-x-1/2',
                  'top-[38%] left-[20%] transform -translate-x-1/2',
                  'bottom-6 left-1/2 transform -translate-x-1/2',
                ];
                return (
                  <div
                    key={text}
                    className={`absolute ${positions[idx]} z-10 bg-[#F2542D] w-[130px] h-[130px] rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-lg`}
                  >
                    {text}
                  </div>
                );
              })}

              <button className="absolute bottom-[-4rem] px-6 py-2 bg-[#F2542D] text-white rounded shadow hover:bg-[#d94422] transition">
                Explore
              </button>
            </div>
          ) : (
            <div className="max-w-md space-y-6 text-center md:text-left">
              <h1
                className={`text-3xl sm:text-4xl md:text-5xl font-bold ${
                  currentSlide.id === 2 ? 'text-white' : 'text-gray-800'
                }`}
              >
                {currentSlide.title}
              </h1>

              {currentSlide.description && (
                <p
                  className={`text-base sm:text-lg text-gray-700 ${
                    currentSlide.id === 1 ? 'border-l-4 border-orange-500 pl-4' : ''
                  }`}
                >
                  {currentSlide.description}
                </p>
              )}

              {currentSlide.button && (
                <button className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition">
                  {currentSlide.button}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Image */}
        <div className="w-full md:w-[70%] h-1/2 md:h-full">
          <img
            src={currentSlide.image}
            alt="hero"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-5 md:bottom-10 flex justify-center w-full space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition ${
              current === index ? 'bg-orange-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
