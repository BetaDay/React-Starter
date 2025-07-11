import React, { useState } from 'react';

import Footer from '../components/footer';
import { FaChevronDown } from 'react-icons/fa';
import Chatbot from '../components/Chatbot';

type Faq = {
  question: string;
  answer: string;
};

const faqData: Faq[] = [
  {
    question: 'How do I apply for a house listed on PataHouse?',
    answer: 'To apply, click the "Show Contact" button on the house card to get the landlord’s phone and email.',
  },
  {
    question: 'Is PataHouse free to use?',
    answer: 'Yes, browsing and filtering houses is completely free. We connect you directly to the property owner.',
  },
  {
    question: 'Can I list my house for rent?',
    answer: 'Currently, only verified landlords and agents can list properties. Contact our support for onboarding.',
  },
  {
    question: 'Are all listed houses located in Nakuru?',
    answer: 'Yes, all properties listed on our platform are within Nakuru and its surrounding estates.',
  },
];

type FaqItemProps = {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
};

const FaqItem: React.FC<FaqItemProps> = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b overflow-hidden">
    <button
      onClick={onClick}
      className="w-full flex justify-between items-center py-4 px-2 text-left text-gray-800 font-semibold hover:text-orange-600 hover:bg-orange-50 rounded transition duration-300"
    >
      {question}
      <FaChevronDown
        className={`ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>

    <div
      className="transition-all duration-500 ease-in-out overflow-hidden"
      style={{
        maxHeight: isOpen ? '300px' : '0px',
        opacity: isOpen ? 1 : 0,
        paddingBottom: isOpen ? '1rem' : '0rem',
        paddingLeft: isOpen ? '0.25rem' : '0rem',
        paddingRight: isOpen ? '0.5rem' : '0rem',
      }}
    >
      <div className="text-gray-600 text-sm">{answer}</div>
    </div>
  </div>
);

const Faqs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState<string>('');

  const toggle = (index: number): void => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqData.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
   
      <section className="min-h-screen px-4 pt-24 pb-12 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 items-start">
          {/* Left: FAQ Content */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl font-bold text-orange-600 mb-4">Frequently Asked Questions</h1>
            <p className="text-gray-500 mb-6">Find answers to common questions about using PataHouse.</p>

            {/* Search Input */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* FAQ List */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 divide-y transition-all duration-300 p-6 hover:shadow-xl">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <FaqItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === index}
                    onClick={() => toggle(index)}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 py-6">No FAQs match your search.</p>
              )}
            </div>
          </div>

          {/* Right: Image */}
          <div className="w-full lg:w-1/2 flex justify-center items-center align-middle">
            <img
              src="./images/faq2.png"
              alt="FAQ illustration"
              className="max-h-[500px] w-full object-contain bg-transparent mt-24"
            />
          </div>
        </div>
      </section>
      <Footer />

      {/* Floating chatbot */}
      <Chatbot />
    </>
  );
};

export default Faqs;
