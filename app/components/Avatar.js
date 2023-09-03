import React from 'react'

const Avatar = ({url=null}) => {
  return (
    <div>
      <div className="rounded-full overflow-hidden bg-blue-300 w-10 h-10 md:w-12 md:h-12" >
        {!!url && (
          <img src={url} alt={"profile picture"} />
        )}
      </div>
    </div>
  )
}

export default Avatar