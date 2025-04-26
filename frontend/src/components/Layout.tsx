// import React from 'react'
import HeaderComponent from './HeaderComponent';
import SideBarComponent from './SideBarComponent';
import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className='flex flex-col h-screen overflow-hidden'>
      <div className='flex flex-col'>
        <HeaderComponent />
        <SideBarComponent names={['Monitoring', 'Containers', 'Logs', 'Settings']}/>
      </div>
      <main className='h-[100vh] flex p-4 bg-gray-50'>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;