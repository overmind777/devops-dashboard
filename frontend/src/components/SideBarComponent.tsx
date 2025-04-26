import * as React from 'react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'


function SideBarComponent({ names }: {names: string[]}): React.JSX.Element {

  return (
    <div className="w-full p-[20px] bg-gray-200 dark:bg-gray-200">
      <ul className="w-full flex row gap-[5px] align-items-center">
        {names.map((name: string, i: number) => {
          return (
            <li key={i} className="flex-1 p-[10px] text-black cursor-pointer border border-gray-400 rounded-[10px] shadow shadow-gray-600
             hover:bg-blue-500 hover:translate-x-[2px] hover:translate-y-[-5px] duration-300 hover:text-white"
            >
              <NavLink to={`/${name.toLowerCase()}`}>{name}</NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SideBarComponent