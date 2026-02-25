import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Import your pages
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Sun from './pages/Sun';
import Soulmate from './pages/Soulmate';
import AIChatbot from './pages/AIChatbot';
import Tarot from './pages/Tarot';
import Zodiac from './pages/Zodiac';
import HumanDesign from './pages/HumanDesign';
import DestinyMatrix from './pages/DestinyMatrix';
import Moon from './pages/Moon';
import Ascendant from './pages/Ascendant';
import Natal from './pages/Natal';
import Astrocartography from './pages/Astrocartography';
import Games from './pages/Games';
import StarMatcher from './pages/StarMatcher';
import ZodiacQuest from './pages/ZodiacQuest';
import MoonEnergyQuiz from './pages/MoonEnergyQuiz';
import SoulElementQuiz from './pages/SoulElementQuiz';
import PastLifeCareerQuiz from './pages/PastLifeCareerQuiz';
import Horoscope from './pages/Horoscope';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="scrollbar-hide overflow-y-auto">
          <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sun" element={<Sun />} />
        <Route path="/soulmate" element={<Soulmate />} />
        <Route path="/aichatbot" element={<AIChatbot />} />
        <Route path="/tarot" element={<Tarot />} />
        <Route path="/zodiac" element={<Zodiac />} />
        <Route path="/humandesign" element={<HumanDesign />} />
        <Route path="/destinymatrix" element={<DestinyMatrix />} />
        <Route path="/moon" element={<Moon />} />
        <Route path="/ascendant" element={<Ascendant />} />
        <Route path="/natal" element={<Natal />} />
        <Route path="/astrocartography" element={<Astrocartography />} />
        <Route path="/games" element={<Games />} />
        <Route path="/star-matcher" element={<StarMatcher />} />
        <Route path="/zodiac-quest" element={<ZodiacQuest />} />
        <Route path="/moon-energy-quiz" element={<MoonEnergyQuiz />} />
        <Route path="/soul-element-quiz" element={<SoulElementQuiz />} />
        <Route path="/past-life-career-quiz" element={<PastLifeCareerQuiz />} />
        <Route path="/horoscope" element={<Horoscope />} />
        <Route path="/about" element={<About />} />
        <Route path="/sun/:signName" element={<Sun />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>

        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;