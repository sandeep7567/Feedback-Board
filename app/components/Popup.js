import React from 'react'
import { Icons } from "./Icons";

const Popup = ({children, setShow, title, narrow}) => {

  const close = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    setShow(false);
  };

  return (
    <div onClick={close} className="fixed inset-0 bg-white md:bg-black md:bg-opacity-80 flex md:items-center">
      <button onClick={close} className="hidden md:block fixed top-4 right-4 cursor-pointer text-white">
        <Icons.close className='h-8 w-8'/>
      </button>
      
      {/* md: device */}
      <div className="w-full h-full scroll-smooth overflow-y-scroll">
        <div
          onClick={(e) => e.stopPropagation()}
          className={`${narrow ? "md:max-w-xl" : "md:max-w-2xl"}
             bg-white md:mx-auto md:rounded-lg md:overflow-hidden md:my-8`}>
          <div className="relative min-h-[2.5rem] md:min-h-0">
            <button onClick={close}  className="absolute top-4 left-4 md:hidden text-gray-600">
              <Icons.left />
            </button>
            {!!title && (
              <h2 className="py-4 text-center border-b">
               {title}
              </h2>
            )}
           
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Popup