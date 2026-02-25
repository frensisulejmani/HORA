import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const getPath = (name) => {
    const paths = {
      'Home': '/home',
      'Zodiac Signs': '/zodiac',
      'AI Chatbot': '/aichatbot',
      'Tarot Readings': '/tarot',
      'Horoscope Forecast': '/horoscope',
      'Natal Chart': '/natal',
      'Games': '/games',
      'AI Chatbot': '/aichatbot',
      'About': '/about',
      'Privacy Policy': '/privacypolicy',
    };
    return paths[name] || `/${name.toLowerCase().replace(/\s+/g, '')}`;
  };

  return (
    <footer className="relative z-10 bg-[#030303] border-t border-purple-500/30 py-20 px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        
        <div className="col-span-1 md:col-span-2 flex flex-col items-start">
          <span className="text-4xl font-bold text-purple-500 tracking-tighter">HORA</span>
          <p className="text-sm mt-6 opacity-50 leading-loose max-w-62">
            Merging astronomical precision with spiritual exploration to guide your soul's journey across the stars.
          </p>
        </div>
        
        {['Readings', 'Links', 'Connect'].map((section, idx) => (
          <div key={section} className={`col-span-1 ${idx > 0 ? 'md:ml-12' : ''}`}> 
            <h6 className="text-purple-500 text-base uppercase tracking-widest font-bold mb-4">
              {section}
            </h6>
            <ul className="space-y-3 opacity-50 text-sm md:text-base">
              {idx === 0 && ['Natal Chart', 'Tarot Readings', 'AI Chatbot', 'Horoscope Forecast'].map(l => (
                <li key={l}>
                  <Link to={getPath(l)} className="hover:text-purple-500 transition-colors whitespace-nowrap block">
                    {l}
                  </Link>
                </li>
              ))}
              {idx === 1 && ['Home', 'Zodiac Signs', 'Games', 'AI Chatbot'].map(l => (
                <li key={l}>
                  <Link to={getPath(l)} className="hover:text-purple-500 transition-colors block">
                    {l}
                  </Link>
                </li>
              ))}
              {idx === 2 && ['Email', 'About', 'Privacy Policy'].map(l => (
                <li key={l}>
                  <Link to={getPath(l)} className="hover:text-purple-500 transition-colors block">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="text-center mt-20 opacity-30 text-[12px] tracking-widest">
        © 2026 HORA. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
};

export default Footer;