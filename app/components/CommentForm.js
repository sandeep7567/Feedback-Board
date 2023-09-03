import React, { useState } from "react"
import AttachfilesButton from '@/app/components/AttachfilesButton';
import Button from '@/app/components/Button';
import Attachment from "./Attachment";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";

const CommentForm = ({feedbackId, onPost}) => {

  const [ commentText, setCommentText ] = useState("");
  const [uploads, setUploads] = useState([]);
  // const [lcoalData, setLocalData] = useState(null);

  const {data:session} = useSession();

  const addUploads = (newLinks) => {
    setUploads(prevLinks => [ ...prevLinks, ...newLinks ])
  };

  const removeUplaod = (ev, linkToRemove) => {
    ev.preventDefault();
    ev.stopPropagation();
    setUploads((prevLinks) => prevLinks.filter((link) => link !== linkToRemove))
  };

  const handleCommentButtonClick = async(ev) => {
    ev.preventDefault();
    const commentData = {
      text: commentText,
      uploads,
      feedbackId,
    };

    if (session) {
      await axios.post("api/comment", commentData,);
      setCommentText("");
      setUploads([]);
      onPost();

    } else {
      // localstorage
      localStorage.setItem("comment_after_login", JSON.stringify(commentData));
      // setLocalData(commentData);
      await signIn("google");
    }
    
  };

  return (
    <form >
        <textarea
          className="border rounded-md w-full p-2"
          name=""
          placeholder="Let us know what you think"
          id=""
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
        />
        {uploads?.length > 0 && (
          <div className="">
            <div className="text-sm text-gray-600 mb-2 mt-3">
              Files
            </div>
            <div className="flex gap-3">
              {uploads.map((link) => (
                <div>
                  <Attachment
                    link={link}
                    showRemoveButton
                    handleRemoveFileButtonClick={(ev, link) => removeUplaod( ev, link)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2 mt-5">
          <AttachfilesButton
            onNewFiles={addUploads}
          />
          <Button
            primary
            disabled={commentText === ""}
            onClick={handleCommentButtonClick}
          >
              {session ? "Comment" : "Login and comment"}
          </Button>
        </div>
    </form>
  )
}

export default CommentForm