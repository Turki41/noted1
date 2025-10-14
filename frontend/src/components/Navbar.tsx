import { useState } from 'react'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'
import SideMenu from './SideMenu'

const Navbar = () => {
  const [openSideMenu, setOpenSideMenu] = useState(false)

  return (
    <div className='flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30'>
      <button
        onClick={() => setOpenSideMenu(!openSideMenu)}
        className='block lg:hidden outline-none text-black'
      >
        {openSideMenu ? (
          <HiOutlineX className='text-2xl' />
        ) : (
          <HiOutlineMenu className='text-2xl' />
        )}
      </button>

      <h2 className='text-lg font-medium text-black'>One Mind</h2>

      {/* Slide-in animation */}
      <div
        className={`fixed top-[61px] left-0 bg-white shadow-md h-screen w-64 transform transition-transform duration-300 ease-in-out
          ${openSideMenu ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <SideMenu />
      </div>
    </div>
  )
}

export default Navbar
