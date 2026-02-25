import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const LocationPicker = ({ value, onChange, onCoordinatesChange, placeholder = "Search city, country..." }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch location suggestions from Nominatim API
  const fetchSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=8&addresstype=city,country`
      );
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        // Format suggestions
        const formatted = data.map(item => ({
          label: item.address?.city 
            ? `${item.address.city}, ${item.address.country || ''}`
            : item.display_name,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          displayName: item.display_name
        }));
        setSuggestions(formatted);
        setIsOpen(true);
      }
    } catch (err) {
      console.error('Location search error:', err);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debounce
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for API call
    searchTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    setSearchTerm(suggestion.label);
    onChange(suggestion.label);
    if (onCoordinatesChange) {
      onCoordinatesChange({
        latitude: suggestion.latitude,
        longitude: suggestion.longitude
      });
    }
    setIsOpen(false);
    setSuggestions([]);
  };

  // Handle clear button
  const handleClear = () => {
    setSearchTerm('');
    onChange('');
    setSuggestions([]);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          <Search size={18} />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full p-4 pl-10 pr-10 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cosmic-primary/20 transition-all text-black"
        />

        {searchTerm && (
          <button
            onClick={handleClear}
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        )}

        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin">
              <Search size={18} className="text-cosmic-primary" />
            </div>
          </div>
        )}
      </div>

      {/* Dropdown suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-purple-50 border-b border-gray-100 last:border-b-0 transition-colors text-gray-800 text-sm"
            >
              <div className="font-semibold text-gray-900">{suggestion.label}</div>
              <div className="text-xs text-gray-500 mt-1">{suggestion.displayName}</div>
            </button>
          ))}
        </div>
      )}

      {isOpen && suggestions.length === 0 && searchTerm.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-4 text-center text-gray-500 text-sm">
          {isLoading ? 'Searching locations...' : 'No locations found'}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
