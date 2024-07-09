import React from "react";
import logo from "../../assets/Luludex-7-8-2024.png";


export const Header = () => {
  return (
    <div>
      <header className="flex flex-col items-center">
        
          <img src={logo} alt="Luludex" className="h-24" />
       
      </header>
    </div>
  );
};
