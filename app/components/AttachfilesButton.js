import axios from 'axios';
import React, { useState } from 'react'
import { MoonLoader } from 'react-spinners';
import { Icons } from './Icons';

const AttachfilesButton = ({onNewFiles}) => {

  const [ isUploading, setIsUploading ] = useState(false);
  
  const handleAttachFileInputChange = async(ev) => {
    
    try {
      setIsUploading(true)

      const files = [...ev.target.files];
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      };
      const res = await axios.post("/api/upload", data );

      const file = res?.data;

      console.log(file);
      onNewFiles(file);

    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false)
    }
  };

  return (
    <label className='flex gap-2 py-2 px-4 cursor-pointer items-center' htmlFor="pic">
            {isUploading && <MoonLoader size={18}  />}
            {!isUploading && <Icons.upload className={"w-4 h-4"}/>}
            <span className={`${isUploading ? " text-gray-300" : " text-gray-600"}`}>
              {isUploading ? "Uploading..." : "Attach File" }
            </span>
            <input
              accept="image/*"
              multiple
              onChange={handleAttachFileInputChange}
              type="file"
              name="file"
              id="pic"
              className="hidden"
            />
    </label>
  )
}

export default AttachfilesButton