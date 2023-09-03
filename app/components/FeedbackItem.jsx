import { useState } from 'react'
import Popup from "./Popup";
import Button from './Button';
import { signIn, useSession } from 'next-auth/react';
import axios from 'axios';
import { MoonLoader } from 'react-spinners';
import { Icons } from './Icons';

const FeedbackItem = ({
  _id,
  onOpen,
  title,
  description,
  votes,
  onVotesChange,
}) => {

  const [ showLoginPopup, setShowLoginPopup ] = useState(false);
  const [ isVoteLoading, setIsVoteLoading ] = useState(false);

  const { data: session } = useSession();
  const isLoggedIn = !!session?.user?.email;

  const handleVoteButtonClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if(!isLoggedIn) {
      localStorage.setItem("vote_after_login", _id );
      setShowLoginPopup(true);
    } else {
      setIsVoteLoading(true);
      axios.post("/api/vote", {feedbackId: _id}).then( async() => {
        await onVotesChange();
        setIsVoteLoading(false);
      });
    };
  };

  const handleGoogleLoginButtonClick = async(e) => {
    e.stopPropagation();
    e.preventDefault();
    await signIn('google');
  };
  const MyVoted = !!votes.find((v) => v.userEmail === session?.user?.email );

  const shortDesc = description.substring(0, 200);

  return (
    <a
      href=""
      onClick={(e) => {e.preventDefault();onOpen()}}
      className="my-8 flex gap-8 items-center">
        <div className="flex-grow">
          <h2 className="font-bold">{title}</h2>
          <p className="text-gray-600 text-sm">
            {shortDesc}
            {shortDesc.length < description.length ? "...." : ""}
          </p>
        </div>

        <div>
          {showLoginPopup && (
            <Popup title={"Confirm your vote"} narrow setShow={setShowLoginPopup} >
              <div className="p-5 flex w-full md:h-full h-screen justify-center items-center">
                <Button
                  className="bg-slate-900 w-fit text-slate-200 hover:bg-opacity-100 text-opacity-90 hover:text-opacity-100 bg-opacity-90 text-base py-1.5 px-3"
                  onClick={handleGoogleLoginButtonClick}
                >
                  <Icons.google />
                  Login with Google
                </Button>
              </div>
            </Popup>
          )}
          
          {
            <Button
              primary={MyVoted}
              onClick={handleVoteButtonClick}
              className="shadow-md border"
              disabled={isVoteLoading}
            >
            {isVoteLoading
              ? <MoonLoader color='blue' size={18} className="" />
              :  <>
                <span className="triangle-vote-up"></span>
                {votes?.length || "0"}
                </>
            }
            </Button>
          }
          
        </div>
    </a>
  )
};

export default FeedbackItem;