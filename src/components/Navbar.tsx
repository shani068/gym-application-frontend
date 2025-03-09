import React from 'react'
import DropDown from './DropDown';
import  { OffcanvasSidebar } from './Offcanvas';


const Navbar = () => {
  return (
    <div className='flex justify-between items-center py-4 px-10 bg-slate-400 text-white'>
        <div>
            <OffcanvasSidebar />
        </div>
        <div>
            <DropDown />
        </div>
    </div>
  )
}

export default Navbar