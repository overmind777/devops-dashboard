import * as React from "react";

function HeaderComponent(): React.JSX.Element {
  return (
    <header className="flex gap-[5px] items-center justify-between pl-[10px] pr-[10px] bg-gray-800 dark:bg-gray-200 text-white">
      <div className='flex-none w-10 h-10'>
        <img src={'./src/assets/dashboard.png'} alt='Logo'></img>
      </div>
      <h2 className='grow '>DevOps Dashboard</h2>
      <p className='flex-none'>Name</p>
    </header>
  );
}

export default HeaderComponent;