import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

type Testimonial = {
  name: string;
  message: string;
  rating: number;
  img: string;
};

const testimonials: Testimonial[] = [
  {
    name: 'Alice Wanjiku',
    message: 'Great platform to volunteer! Love the user experience.',
    rating: 4,
    img: 'https://randomuser.me/api/portraits/women/21.jpg',
  },
  {
    name: 'Brian Mutiso',
    message: 'I got connected to amazing causes. Highly recommended!',
    rating: 3,
    img: 'https://randomuser.me/api/portraits/men/31.jpg',
  },
  {
    name: 'Faith Cherono',
    message: 'VolunteerHub made it easy to apply, participate, and make an impact. I love it!',
    rating: 5,
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'James Ochieng',
    message: 'The dashboard is clean and the events are legit.',
    rating: 4,
    img: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    name: 'Lilian Njeri',
    message: 'A beautiful way to give back to the community.',
    rating: 3,
    img: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    name: 'Kevin Kiprotich',
    message: 'Smooth onboarding and easy navigation. Thumbs up!',
    rating: 4,
    img: 'https://randomuser.me/api/portraits/men/78.jpg',
  },
];

export default function TestimonialCarousel(): JSX.Element {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [visibleCount, setVisibleCount] = useState<number>(3);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleCount(1);
      } else if (width < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex: number = Math.max(testimonials.length - visibleCount, 0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  const goTo = (index: number): void => {
    if (index >= 0 && index <= maxIndex) {
      setCurrentIndex(index);
    }
  };

  return (
    <div className="bg-gray-50 overflow-visible">
      <h2 className="text-2xl font-bold text-center text-orange-600 pt-10">Our Clients</h2>

      <div className="mx-auto w-full max-w-6xl overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            width: `${(100 / visibleCount) * testimonials.length}%`,
            transform: `translateX(-${(100 / testimonials.length) * currentIndex}%)`,
          }}
        >
          {testimonials.map((t, i) => {
            const centerIndex = currentIndex + Math.floor(visibleCount / 2);
            const isCenter = i === centerIndex;

            return (
              <div
                key={i}
                className="p-4"
                style={{
                  width: `${100 / testimonials.length}%`,
                  transform: `scale(${isCenter ? 1.07 : 0.95})`,
                  transition: 'transform 0.5s ease-in-out',
                  zIndex: isCenter ? 10 : 1,
                }}
              >
                <div className="bg-white shadow-md rounded-lg p-6 pt-20 relative h-full overflow-visible">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-20 h-20 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"
                  />
                  <div className="text-center mt-8">
                    <h3 className="font-semibold">{t.name}</h3>
                    <p className="text-sm text-gray-600 mt-2">{t.message}</p>
                    <div className="text-yellow-500 mt-3">
                      {[...Array(5)].map((_, starIndex) => (
                        <FontAwesomeIcon
                          key={starIndex}
                          icon={starIndex < t.rating ? solidStar : regularStar}
                          className="mr-1"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center mt-6 space-x-2 pb-10">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full ${i === currentIndex ? 'bg-orange-500' : 'bg-gray-300'}`}
          ></button>
        ))}
      </div>
    </div>
  );
}
