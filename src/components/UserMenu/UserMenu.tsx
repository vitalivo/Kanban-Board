import React, { useEffect, useRef } from 'react';
import './UserMenu.css';

interface UserMenuProps {
  onClose: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const menuItems = ['Profile', 'Log Out'];

  return (
    <div ref={menuRef} className="user-menu">
      {menuItems.map((item) => (
        <button key={item} className="user-menu__item">
          {item}
        </button>
      ))}
    </div>
  );
};

export default UserMenu;