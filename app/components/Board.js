import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

import FeedbackItem from "@/app/components/FeedbackItem";
import FeedbackFormPopup from "@/app/components/FeedbackFormPopup";
import Button from "@/app/components/Button"
import FeedbackItemPopup from "@/app/components/FeedbackItemPopup";
import { MoonLoader } from "react-spinners";
import { Icons } from "./Icons";
import { debounce } from "lodash";

export default function Board() {

  const [showFeedbackPopupForm, setShowFeedbackPopupForm] = useState(false);
  const [showFeedbackPopupItem, setShowFeedbackPopupItem] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const fetchingFeedbacksRef = useRef(false);
  const [fetchingFeedbacks, setFetchingFeedbacks] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const waitingRef = useRef(false);
  const [votesLoading, setVotesLoading] = useState(false);
  const [sort, setSort] = useState("votes");
  const sortRef = useRef("votes");
  const loadedRows = useRef(0);
  const everythingLoadedRef = useRef(false);
  const [votes, setVotes] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState('');
  const searchPhraseRef = useRef('');
  const { data:session } = useSession();

  // console.log(votes)

  useEffect(() => {
    fetchFeedbacks();
  }, []);
  
  useEffect(() => {
    fetchVotes();
  }, [feedbacks]);

  useEffect(() => {
    loadedRows.current = 0;
    sortRef.current = sort;
    everythingLoadedRef.current = false;
    searchPhraseRef.current = searchPhrase;
    if (feedbacks?.length > 0) {
      setFeedbacks([]);
    };

    setWaiting(true);
    waitingRef.current = true;

    // fetchFeedbacks();
    debounceFatchFeebacksRef.current();

  }, [sort, searchPhrase]);

  useEffect(() => {
    if (session?.user?.email) {
      // feedback Voting post after login
      const feedbackToVote = localStorage.getItem("vote_after_login");
      if (feedbackToVote) {
        // console.log(feedbackToVote)
        
        // api call
        axios.post("/api/vote", {feedbackId:feedbackToVote} ).then( async() => {
          localStorage.removeItem("vote_after_login");
          fetchVotes();
        });
      };

      // feedback post after login
      const feedbackToPost = localStorage.getItem("post_after_login");
      if (feedbackToPost) {

        const feedbackData = JSON.parse(feedbackToPost);
        // api call
        axios.post("/api/feedback", feedbackData ).then( async(res) => {
          // console.log(res)
          await fetchFeedbacks();
          // setShowFeedbackPopupItem(res.data);
          localStorage.removeItem("post_after_login");
        });
      };

      // comment post after login
      const commentToPost = localStorage.getItem("comment_after_login");
      if(commentToPost) {
        const commentData = JSON.parse(commentToPost);
        axios.post("/api/comment", commentData).then(async() => {
          axios.get(`/api/feedback?id=${commentData.feedbackId}`).then((res) => {
            setShowFeedbackPopupItem(res.data);
            localStorage.removeItem("comment_after_login")
          });
        });
      }
    };
  }, [session?.user?.email]);

  const handleScroll = () => {
    const html = window.document.querySelector("html");
    const howMuchScrolled = html.scrollTop;
    const howMuchIsScroll = html.scrollHeight;
    const leftToScroll = howMuchIsScroll - howMuchScrolled - html.clientHeight;
    if (leftToScroll <= 100) {
      fetchFeedbacks(true)
    }
    // console.log(leftToScroll);

  };

  const registerScrollListener = () => {
    window.addEventListener("scroll", handleScroll )
  };

  const unRegisterScrollListener = () => {
    window.removeEventListener("scroll", handleScroll )
  };

  useEffect(() => {
    registerScrollListener();
    return () => {unRegisterScrollListener();}
  }, []);

  const fetchFeedbacks = async(append=false) => {
    // if we are fetching then stop here OR do not apply any advance fetch req to server;
    if (fetchingFeedbacksRef.current) return;

    if (everythingLoadedRef.current) return;

    fetchingFeedbacksRef.current = true
    setFetchingFeedbacks(true);
    axios.get(`/api/feedback?sort=${sortRef.current}&loadedRows=${loadedRows.current}
      &search=${searchPhraseRef.current}`).then((res) => {
        if (append) {
          setFeedbacks(currentFeedbacks => [...currentFeedbacks, ...res.data])
        } else {
          setFeedbacks(res.data);
        };
        if (res.data?.length > 0) {
          loadedRows.current += res.data.length;
        };
        if (res.data?.length === 0) {
          everythingLoadedRef.current = true;
        };

        fetchingFeedbacksRef.current = false;
        setFetchingFeedbacks(false);
        waitingRef.current = false;
        setWaiting(false);
    });
  };

  // this fetchFeedbacks arrow function is availabe at line:120
  const debounceFatchFeebacksRef = useRef(debounce(fetchFeedbacks, 300));

  const fetchVotes = async() => {
    setVotesLoading(true);
    const feedbackIds = feedbacks.map((f) => f._id);
    const res = await axios.get(`/api/vote?feedbackIds=${feedbackIds.join(',')}`)
    setVotes(res.data);
    setVotesLoading(false);
  };

  const openFeedbackPopupForm = () => {
    setShowFeedbackPopupForm(true);
  };

  const openFeedbackPopupItem = (feedback) => {
    setShowFeedbackPopupItem(feedback);
  };

  const handleFeedbackUpdate = async(newData) => {
    setShowFeedbackPopupItem(prevData => {
      return { ...prevData, ...newData }
    });
    await fetchFeedbacks();
  };

  const name = session?.user?.name
  const userEmail = session?.user?.email
  const profilePicture = session?.user?.image

  return (
    <div className="md:pb-8">
      <main className="bg-white md:max-w-2xl mx-auto md:shadow-lg md:rounded-lg 
      md:mt-4 overflow-hidden">
        <header className="bg-gradient-to-r from-cyan-400 to-blue-400 p-8">
          {userEmail &&
          <div className="flex">
            <div className="flex flex-col grow">
              <h1 className="font-bold text-xl">
                Coding with {name || "Sandeep Thakur"}
              </h1>
              <p className="text-opacity-50 text-base text-slate-700">{userEmail}</p>
            </div>
            <img className="w-8 h-8 md:w-10 md:h-10 rounded-full" src={profilePicture} alt={"profilePicture"} />
            
          </div>
          }
          { !userEmail &&
            <h1 className="font-bold text-xl">
            Coding with {name || "Sandeep Thakur"}
            </h1>
          }
          <p className="text-opacity-90 text-slate-700 mt-1">
            Help me decide what should I build next or how can i improve
          </p>
        </header>

        <div className="bg-gray-100 px-8 py-4 gap-4 flex flex-col items-center border-b sm:flex-row">
          <div className="grow flex items-center gap-8 text-gray-400">
            
            <select
              className="bg-transparent py-2 outline-none px-2 border rounded-full
              bg-slate-100 border-slate-300 focus-within:bg-slate-200"
              name=""
              id=""
              value={sort}
              onChange={ev => {setSort(ev.target.value)}}
            >
              <option value="votes">Most Voted</option>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
            {/* search */}
            <div className="relative border rounded-full bg-slate-100 border-slate-300 focus-within:bg-slate-200">
              <Icons.search className="absolute hidden top-3 left-2 pointer-events-none w-4 h-4" />
              <input
                placeholder="Search"
                type="text"
                value={searchPhrase}
                onChange={ e => setSearchPhrase(e.target.value)}
                className="bg-transparent p-2 pl-7 text-black outline-none" />
            </div>
          </div>
          <div>
            <Button
              primary={1}
              onClick={openFeedbackPopupForm}
            >
              Make a suggestion
            </Button>
          </div>
        </div>

        <div className="px-8">
          {feedbacks?.length === 0 && fetchingFeedbacks && !waiting && (
            <div className="flex justify-center items-center p-8 text-4xl text-gray-200">
              Nothing Found
            </div>
          )}
          {feedbacks.map( (feedback, index) => (
              <FeedbackItem
                key={index}
                {...feedback}
                onVotesChange={fetchVotes}
                votes={votes.filter(v => v.feedbackId.toString() === feedback._id.toString())}
                parentLoadingVotes={votesLoading}
                onOpen={() => openFeedbackPopupItem(feedback)}  />
            ))
          }
          {(fetchingFeedbacks || waiting) && (
            <div className="p-4 flex justify-center items-center">
              <MoonLoader size={36} />
            </div>
          )}
        </div>

        {showFeedbackPopupForm && (
          <FeedbackFormPopup
            onCreate={fetchFeedbacks}
            setShow={setShowFeedbackPopupForm}
          />
        )}

        {showFeedbackPopupItem && (
          <FeedbackItemPopup
            {...showFeedbackPopupItem}
            votes={votes.filter((v) => v.feedbackId.toString() === showFeedbackPopupItem._id )}
            onVoteChange={fetchVotes}
            onUpdate={handleFeedbackUpdate}
            setShow={setShowFeedbackPopupItem}
          />
        )}

      </main>
      
    </div>
  )
};