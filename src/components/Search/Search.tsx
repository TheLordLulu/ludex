import React from "react";

export const Search = () => {
  return (
    <div className="flex flex-col items-center">
      <label className="input input-ghost input-sm input-primary flex items-center gap-2 w-2/3">
        <input type="text" className="grow" placeholder="Search" />
    
      </label>
    </div>
  );
};
