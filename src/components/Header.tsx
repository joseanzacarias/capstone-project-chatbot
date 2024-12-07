import React from 'react';

interface HeaderProps {
  scenariosData: { id: string; name: string; description: string }[];
  selectedScenarioId: string;
  onScenarioChange: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ scenariosData, selectedScenarioId, onScenarioChange }) => {
  return (
    <div className="bg-gray-800 text-white p-4 shadow-md flex justify-start items-start">
      <select
        value={selectedScenarioId}
        onChange={(e) => onScenarioChange(e.target.value)}
        className="bg-gray-700 text-white text-base p-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {scenariosData.map((scenario) => (
          <option key={scenario.id} value={scenario.id} className="text-black cursor-pointer">
            {scenario.name} - {scenario.description}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Header;
