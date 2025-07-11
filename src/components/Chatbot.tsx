import React, { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';

type Message = {
  from: 'user' | 'bot';
  text: string;
};

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Hi! How can I help you?' },
  ]);
  const [input, setInput] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [nameReplyCount, setNameReplyCount] = useState<number>(0);
  const [typing, setTyping] = useState<boolean>(false);
  const [typingDots, setTypingDots] = useState<string>('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (!typing) return;
    const dotCycle = ['.', '..', '...'];
    let index = 0;
    const interval = setInterval(() => {
      setTypingDots(dotCycle[index]);
      index = (index + 1) % dotCycle.length;
    }, 400);
    return () => clearInterval(interval);
  }, [typing]);

  const fallbackIntent = (msg: string): string => {
    if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
      return "Are you asking about rent prices? You can filter listings by price on the 'Houses' page.";
    }
    if (msg.includes('location') || msg.includes('where')) {
      return "Are you looking for available areas? We currently list houses in Nakuru County.";
    }
    if (msg.includes('agent') && msg.includes('find')) {
      return "To find an agent, please visit the agent section or ask support to guide you.";
    }
    if (msg.includes('problem') || msg.includes('issue') || msg.includes('error')) {
      return "Sorry to hear that! Please describe your issue and we’ll help you out.";
    }
    if (msg.includes('register') || msg.includes('sign up')) {
      return "To register, click on the 'Sign Up' button on the top right and fill in your details.";
    }
    if (msg.includes("can't") || msg.includes('not working')) {
      return "Hmm, it looks like something isn't working. Could you explain what you're trying to do?";
    }
    if (msg.includes('more info') || msg.includes('explain')) {
      return 'Sure, can you clarify what you’d like more information about?';
    }
    return 'Thanks for your message. Could you please clarify or rephrase your question so I can help better?';
  };

  const slangGreetings: string[] = [
    'niaje', 'uko aje', 'uko poa', 'uko freshi', 'aisee', 'kwani niaje',
    'form ni gani', 'niko fiti', 'niaje bro', 'wasup'
  ];

  const sendMessage = (): void => {
    if (!input.trim()) return;

    const userMessage = input.toLowerCase();
    let botReply = '';

    const nameMatch = userMessage.match(/^(my name is|i am|am called|mimi ni)\s+([a-z\s]+)/i);
    if (nameMatch) {
      const extractedName = nameMatch[2].trim().split(' ')[0];
      const capitalized = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
      setUserName(capitalized);
      setNameReplyCount(1);
      botReply = `Nice to meet you, ${capitalized}! How can I assist you today?`;
    } else if (
      ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening',
        'jambo', 'habari', 'salama', 'sasa', 'vipi', 'mambo']
        .concat(slangGreetings)
        .some(greeting => userMessage.includes(greeting))
    ) {
      botReply = 'Hello! How can I help you today?';
    } else if (
      userMessage.includes('thank') || userMessage.includes('asante') ||
      userMessage.includes('thanks') || userMessage.includes('appreciate') ||
      userMessage.includes('grateful')
    ) {
      botReply = "You're most welcome! Happy to assist you anytime.";
    } else {
      botReply = fallbackIntent(userMessage);
    }

    if (userName && !nameMatch && nameReplyCount > 0 && nameReplyCount < 3) {
      botReply = `${userName}, ${botReply}`;
      setNameReplyCount(prev => prev + 1);
    }

    setMessages(prev => [...prev, { from: 'user', text: input }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: botReply }]);
      setTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') sendMessage();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="bg-white w-80 h-96 rounded-xl shadow-xl flex flex-col">
          <div className="bg-orange-600 text-white px-4 py-2 rounded-t-xl flex justify-between items-center">
            <span>Chat with PataBot</span>
            <button onClick={() => setOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg max-w-[80%] ${msg.from === 'bot'
                  ? 'bg-blue-100 shadow text-gray-500 self-start'
                  : 'bg-orange-500 text-white self-end ml-auto'
                  }`}
              >
                {msg.text}
              </div>
            ))}
            {typing && (
              <div className="p-2 rounded-lg bg-blue-50 text-gray-400 shadow self-start text-sm max-w-[80%]">
                Typing{typingDots}
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="flex border-t p-2">
            <input
              type="text"
              className="flex-1 px-2 py-1 text-sm border rounded-l-md outline-none"
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="bg-white text-gray-700 px-3 rounded-r-md text-sm"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition"
        >
          <FaRobot size={20} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
