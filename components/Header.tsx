
import React from 'react';
import { LogoIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between pb-4 border-b border-gray-700">
      <div className="flex items-center gap-4">
        <LogoIcon className="h-10 w-10 text-cyan-400" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Global-A11y Agent</h1>
          <p className="text-sm text-gray-400">Autonomous i18n, L10N, and WCAG Compliance</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
