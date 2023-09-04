import React, { useEffect, useState } from 'react'
import Avatar from './Avatar';
import CommentForm from './CommentForm';
import axios from 'axios';
import Attachment from './Attachment';
import TimeAgo from 'timeago-react'; // var TimeAgo = require('timeago-react');
import { useSession } from 'next-auth/react';
import AttachfilesButton from './AttachfilesButton';

const FeedbackItemPopupComments = ({feedbackId}) => {

  const [ comments, setComments ] = useState([]);
  const [ editingComment, setEditingComment ] = useState(null);
  const [ newCommentText, setNewCommentText ] = useState("");
  const [ newCommentUploads, setNewCommentUploads ] = useState([]);

  const {data:session} = useSession();

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = () => {
    axios.get(`/api/comment?feedbackId=${feedbackId}`).then((res) => {
      setComments(res.data);
    });
  };
  
  const handleEditButtonClick = (comment) => {
    setEditingComment(comment);
    setNewCommentText(comment.text);
    setNewCommentUploads(comment.uploads);
  };

  const handleCancelButtonClick = () => {
    setNewCommentText("")
    setNewCommentUploads([]);
    setEditingComment(null);
  };

  const handleRemoveFileButtonClick = (ev, linkToRemove) => {
    ev.preventDefault();
    setNewCommentUploads(prev => prev.filter(l => l !== linkToRemove))
  };

  const handleNewLinks = (newLinks) => {
    setNewCommentUploads(currentLinks => [ ...currentLinks, ...newLinks] )
  };

  const handleSaveChangesButtonClick = async() => {
    const newData = {
      text: newCommentText,
      uploads: newCommentUploads,
    };

    await axios.put("/api/comment", {id:editingComment._id, ...newData});

    setComments(existingComments => {
      return (existingComments.map((comment) => {
        if (comment._id === editingComment._id) {
          // return replace old comment by edit and updating new comment that match the id with of editing comment Id;
          return {...comment, ...newData};
        } else {
          // return old all comment that does not match with the id of editing comment;
          return comment;
        }
      }))
    });

    setEditingComment(null);
  }

  return (
    <div className="h-full">  
      {comments?.length > 0 && comments.map((comment, i) => {
        const editingThis = editingComment && editingComment?._id === comment?._id;
        const isAuthor =  !!comment.user.email && comment.user.email === session
        ?.user?.email;
        return (
          <div key={i} className="mb-8">
            <div className="flex gap-4">
              <Avatar url={comment?.user?.image}  />
              <div className="w-full">
                {editingThis && (
                  <textarea
                    value={newCommentText}
                    onChange={ev => setNewCommentText(ev.target.value)}
                    className="border p-2 mb-2 block w-full" />
                )}
                {!editingThis && (
                  <p className="text-gray-600">{comment?.text}</p>
                )}
                <div className="mt-2 text-gray-400 text-sm">
                  {comment?.user?.name} &nbsp;&middot;&nbsp; <TimeAgo
                      datetime={comment?.createdAt}
                      locale='en_US'
                    />
                    {!editingThis && isAuthor && (
                      <>
                        &nbsp;&middot;&nbsp;&nbsp;&nbsp;
                        <span
                          onClick={() => handleEditButtonClick(comment)}
                          className="hover:underline cursor-pointer"
                        >
                          Edit
                        </span>&nbsp;&nbsp;
                        <span className="hover:underline cursor-pointer">
                          Delete
                        </span>                                                
                      </>
                    )}
                    {editingThis && (
                          <>&nbsp;&middot;&nbsp;
                            <span
                              onClick={handleCancelButtonClick}
                              className="hover:underline cursor-pointer">
                              Cancel
                            </span>&nbsp;&nbsp;
                            <span
                              onClick={handleSaveChangesButtonClick}
                              className="hover:underline cursor-pointer">
                              Save changes
                            </span>
                          </>
                    )}
                </div>
                {(editingThis ? newCommentUploads : comment?.uploads)?.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {(editingThis ? newCommentUploads : comment?.uploads)?.map((link, i) => (
                      <Attachment
                        handleRemoveFileButtonClick={handleRemoveFileButtonClick}
                        showRemoveButton={editingThis}
                        link={link}
                        key={i}
                      />
                    ))}
                  </div>
                )}
                {editingThis && (
                  <div className="mt-2">
                    <AttachfilesButton onNewFiles={handleNewLinks} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) 
      })}
      {!editingComment && (
        <CommentForm
          feedbackId={feedbackId}
          onPost={fetchComments}
        />
      )}
    </div>
  )
};

export default FeedbackItemPopupComments