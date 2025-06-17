import React, { useState } from 'react';
import UserMenu from '../UserMenu/UserMenu';
import ArrowIcon from '../ArrowIcon/ArrowIcon';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <h1 className="header__title">Awesome Kanban Board</h1>
      
      <div className="header__user" onClick={toggleMenu}>
        <div className="header__avatar">
          <span className="header__avatar-text">U</span>
        </div>
        <ArrowIcon isUp={isMenuOpen} />
        
        {isMenuOpen && <UserMenu onClose={() => setIsMenuOpen(false)} />}
      </div>
    </header>
  );
};

export default Header;