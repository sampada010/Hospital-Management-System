import React, { useState } from 'react';
import { Search, ChevronDown, Shield } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { navbarData } from '../data/NavbarData';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const handleMouseEnter = (index) => {
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper function to determine link path based on parent category and item text
  const getItemPath = (category, itemText) => {
    // Handle Centers of Excellence paths
    if (category === 'Centers of Excellence') {
      if (itemText === 'View All Specialties') {
        return '/specialties';
      } else if (['Cardiology', 'Neurology', 'Gastroenterology', 'Orthopedic', 'Oncology', 'Gynecology'].includes(itemText)) {
        // Convert specialty name to kebab-case and create consistent path
        return `/specialties/${itemText.toLowerCase().replace(/\s+/g, '-')}`;
      }
    }
    
    // Handle About Us paths
    if (category === 'About Us') {
      return `/about/${itemText.toLowerCase().replace(/\s+/g, '-')}`;
    }
    
    // Default behavior for other items
    return `/${itemText.toLowerCase().replace(/\s+/g, '-')}`;
  };

  // Check if a menu item is active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    if (path !== '/' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  // Check if user is an admin
  const isAdmin = user?.isAdmin === true;

  return (
    <div className="w-full bg-white shadow-md sticky top-0 z-50">
      {/* Top bar with search and contact info */}
      <div className="container mx-auto px-4 py-6 flex justify-center items-center">
        <div className="flex flex-col md:flex-row items-center gap-6 max-w-6xl w-full">
          {/* Centered search bar */}
          <div className="flex items-center justify-center flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Search Services"
              className="border border-gray-300 rounded-l-lg px-6 py-3 w-full focus:outline-none focus:ring-2 focus:ring-teal-400 text-lg"
            />
            <button className="bg-teal-600 text-white p-4 rounded-r-lg hover:bg-teal-700 transition-colors">
              <Search size={24} />
            </button>
          </div>
          
          <div className="flex gap-4">
            <div>
              <span className="text-sm text-gray-500">Emergency</span>
              <div className="flex items-center text-teal-600">
                <span className="mr-1">📞</span>
                <span className="font-medium text-lg">121</span>
              </div>
            </div>
            
            <div>
              <span className="text-sm text-gray-500">Hospital Lifeline</span>
              <div className="flex items-center text-teal-600">
                <span className="mr-1">📞</span>
                <span className="font-medium text-lg">7028587790</span>
              </div>
            </div>
            
           

            {isAuthenticated() ? (
              isAdmin ? (
                <button 
                  onClick={() => navigate('/admin/dashboard')}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center"
                >
                  <Shield size={18} className="mr-2" />
                  Admin Dashboard
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  User Dashboard
                </button>
              )
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/admin-login')}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center"
                >
                  <Shield size={18} className="mr-2" />
                  Admin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main navigation */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4">
          <nav className="flex flex-wrap justify-center">
            {navbarData.map((item, index) => {
              const path = item.name === 'Home' ? '/' : 
                        `/${item.name.toLowerCase().replace(/\s+/g, '-')}`;
              const activeItem = isActive(path);
              
              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={item.items ? () => handleMouseEnter(index) : undefined}
                  onMouseLeave={item.items ? handleMouseLeave : undefined}
                >
                  <Link
                    to={!item.items ? path : "#"}
                    onClick={(e) => {
                      if (item.items) {
                        e.preventDefault();
                      }
                    }}
                    className={`group py-5 px-6 text-base font-medium flex items-center transition-all ${
                      activeItem || activeDropdown === index
                        ? 'text-teal-600 bg-white'
                        : 'text-gray-700 hover:text-teal-600 hover:bg-white'
                    }`}
                  >
                    <span>{item.name}</span>
                    {item.items && (
                      <ChevronDown 
                        size={18} 
                        className={`ml-1 ${
                          activeDropdown === index ? 'text-teal-600' : 'text-gray-400 group-hover:text-teal-600'
                        } transition-colors`} 
                      />
                    )}
                    <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 transform ${
                      activeItem || activeDropdown === index ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    } transition-transform origin-left`}></div>
                  </Link>
                  
                  {/* Dropdown Menu - Only for items with dropdown */}
                  {item.items && activeDropdown === index && (
                    <div className="absolute z-50 left-0 mt-0 w-64 bg-white shadow-lg rounded-b-lg py-2 border-t-2 border-teal-600 animate-fadeIn">
                      {item.items.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={getItemPath(item.name, subItem)}
                          className="block px-6 py-2 hover:bg-gray-50 hover:text-teal-600 transition-colors"
                        >
                          {subItem}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Add CSS animation for dropdown */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Navbar;