import React, { useState } from 'react'
import Popup from './Popup';
import Button from './Button';
import FeedbackItemPopupComments from './FeedbackItemPopupComments';
import axios from 'axios';
import { MoonLoader } from 'react-spinners';
import { useSession } from 'next-auth/react';
import { Icons } from './Icons';
import Attachment from './Attachment';
import AttachfilesButton from './AttachfilesButton';


const FeedbackItemPopup = (
  {
    _id,
    title,
    description,
    votes,
    setShow,
    onVoteChange,
    uploads,
    user,
    onUpdate
  }) => {
  const [isVotesLoding, setIsVotesLoding] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newUploads, setNewUploads] = useState(uploads);
  const [isEditMode, setIsEditMode] = useState(false);
  const { data:session } = useSession();

  const handleVoteButtonClick = () => {
    setIsVotesLoding(true)
    axios.post("/api/vote", {feedbackId: _id}).then( async() => {
      await onVoteChange();
      setIsVotesLoding(false);
    })
  };

  const handleEditButtonClick = () => {
    setIsEditMode(true);
  };

  const handleRemoveFileButtonClick = (ev, linkToRemove) => {
    ev.preventDefault();
    setNewUploads(
      prevNewUploads => prevNewUploads.filter(l => l !== linkToRemove)
    );
  };

  const handleCancelButtonClick = () => {
    setIsEditMode(false);
    setNewTitle(title);
    setNewDescription(description);
    setNewUploads(uploads);
  };

  const handleNewUploads = (newLinks) => {
    setNewUploads((prevUploads) => [...prevUploads, ...newLinks])
  };

  const handleSaveButtonClick = () => {
    axios.put("/api/feedback", {
      id:_id,
      newTitle,
      newDescription,
      newUploads
    }).then(() => {
      setIsEditMode(false);
      onUpdate({
        newTitle,
        newDescription,
        newUploads
      });
    });
  };

  const myVoted = votes.find((v) => v.userEmail === session?.user?.email)

  return (
    <Popup title={''} setShow={setShow}>
      <div className="p-8 pb-2">
        {isEditMode && (
          <input
            value={newTitle}
            className="block w-full mb-2 py-2 pl-2 border rounded-md outline-none"
            onChange={(ev) => setNewTitle(ev.target.value)}
          />
        )}
        {!isEditMode && (
          <h2 className="text-lg font-bold mb-2">{title}</h2>
        )}
        {isEditMode && (
          <textarea
            value={newDescription}
            onChange={(ev) => setNewDescription(ev.target.value)}
            className="block w-full mb-2 pt-1 pl-2 border rounded-md outline-none"
          />
        )}
        {!isEditMode && (
          <p className="text-gray-600" >{description}</p>
        )};

        {uploads?.length > 0 && (
          <div className="mt-4">
            <span className="text-sm text-gray-600">Attachments:</span>
            <div className="flex gap-2">
              {(isEditMode ? newUploads : uploads).map((link, index) => (
                <Attachment
                  handleRemoveFileButtonClick={handleRemoveFileButtonClick}
                  showRemoveButton={isEditMode}
                  link={link}
                  key={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-2 justify-end px-8 py-2 border-b">
        {isEditMode && (
          <>
            <AttachfilesButton onNewFiles={handleNewUploads} />
            <Button onClick={handleCancelButtonClick}>
              <Icons.close className='w-4 h-4'/>
              Cancel
            </Button>
            <Button primary={1} onClick={handleSaveButtonClick}>
              {/* <Icons.tick className='w-4 h-4'/>  */}
              Save changes
            </Button>
          </>
        )}
        {!isEditMode && user?.email && session?.user?.email === user?.email &&
          <>
            <Button onClick={handleEditButtonClick}>
              <Icons.edit className='w-4 h-4'/>
              Edit
            </Button>
            <Button>
              <Icons.trash className='w-4 h-4'/>
              Delete
            </Button>
          </>
        }
        {!isEditMode && (
           <Button
            onClick={handleVoteButtonClick}
            primary={1}>
           {isVotesLoding
             ? <MoonLoader size={18}/>
             : (
               <>
                 {myVoted
                   ? (
                     <>
                       <Icons.tick className='w-4 h-4' />
                       <span>Upvoted {votes?.length || "0"}</span>
                     </>
                   )
                   : (
                     <>
                       <span className="triangle-vote-up"></span>
                       <span>Upvote {votes?.length || "0"}</span>
                     </>
                   )}
               </>
             )
           }
           
         </Button>
        )}
       
      </div>
      <div className="px-8 py-4">
        <FeedbackItemPopupComments
          feedbackId={_id}
        />
      </div>

    </Popup>
  )
};

export default FeedbackItemPopup;