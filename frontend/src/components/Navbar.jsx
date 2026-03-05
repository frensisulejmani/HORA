import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import logo from '../assets/Logo.png';

const Navbar = () => {
  return (
    <header className="fixed top-0 w-full z-1000">
      <nav className="flex justify-between items-center py-5 px-6 md:px-16 backdrop-blur-md bg-transparent">
        <Link to="/home" className="flex items-center gap-3 text-white no-underline">
          <img 
            src={logo} 
            alt="Hora Logo" 
            className="w-11 h-11 rounded-full border border-purple-500" 
          />
          <span className="text-2xl font-semibold tracking-wider">Hora</span>
        </Link>

        <div className="hidden md:flex items-center gap-10 font-bold">
          {['Home', 'Zodiac', 'Hora AI', 'Games', 'About'].map((item) => (
            <Link 
              key={item} 
              // Updated logic: if item is 'Hora AI', use '/aichatbot', otherwise format normally
              to={item === 'Hora AI' ? '/aichatbot' : `/${item.toLowerCase().replace(' ', '')}`}
              className="text-white/80 text-base no-underline hover:text-purple-400 hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all"
            >
              {item}
            </Link>
          ))}
          <Link to="/profile" className="group">
            <div className="p-1.5 border border-white/20 rounded-full flex items-center justify-center group-hover:border-purple-500 group-hover:bg-purple-500/10 transition-all">
              <User size={23} className="text-white" />
            </div>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;