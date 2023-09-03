import { useState } from "react"
import axios from "axios";

// components
import Button from "./Button";
import Popup from "./Popup";
import Attachment from "./Attachment";
import AttachfilesButton from "./AttachfilesButton";
import { signIn, useSession,  } from "next-auth/react";

const FeedbackFormPopup = ({setShow, onCreate}) => {

  
  const [ isLoading, setIsLoading ] = useState(false);  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploads, setUploads] = useState([]);

  const {data:session} = useSession();

  const handleCreatePostButtonClick = async(ev) => {
    ev.preventDefault();
    if(session) {
      try {
        setIsLoading(true);
        axios.post("/api/feedback", { title, description, uploads })
          .then( async() => {
            setShow(false);
            await onCreate();
          });
      } catch (error) {
        console.error("Something went wrong")
      } finally {
        setIsLoading(false);
      };
    } else {
      localStorage.setItem("post_after_login", JSON.stringify({
        title, description, uploads
      }));
      await signIn("google");
    };
  };

  const addNewUploads = (newLinks) => {
    setUploads((prevLinks) => [...prevLinks, ...newLinks]);
  };

  
  
  // console.log(uploads)
  const handleRemoveFileButtonClick = (ev, link) => {
    ev.preventDefault();
    setUploads((currentUpload) => {

      return (
        currentUpload.filter((val) => val !== link)
      );
    });
  };

  return (
    <Popup setShow={setShow} title={'Make a Suggestion'}>

      <form className="p-4">
        {/* title */}
        <label className="block mt-4 mb-1 text-slate-700">Title</label>
        <input
          type="text"
          name=""
          id=""
          value={title}
          onChange={ev => setTitle(ev.target.value)}
          placeholder="A short, description title"
          className="w-full border p-2 rounded-md"
        />

        {/* description input */}
        <label className="block mt-4 mb-1 text-slate-700">Desciption</label>
        <textarea
          name=""
          id=""
          value={description}
          onChange={ev => setDescription(ev.target.value)}
          placeholder="Please includes any details"
          className="w-full border p-2 rounded-md h-36"
        />

        <div>
          <label className="block mt-2 mb-1" htmlFor="">Files</label>
          <div>
            {uploads?.length <= 0 && (
              
              <div className="bg-gray-200 text-gray-900 text-opacity-40 h-16 w-16 rounded-full hover:animate-bounce flex items-center justify-center p-4 mt-2">Image</div>
            )}
            {uploads?.length > 0 && (
              <div className="flex gap-3">
                {uploads.map((link) => (
                  <Attachment
                    link={link}
                    showRemoveButton
                    handleRemoveFileButtonClick={(ev, link) =>
                      handleRemoveFileButtonClick(ev, link)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-2 justify-end">
          <AttachfilesButton
            onNewFiles={addNewUploads}
          />
          <Button primary onClick={handleCreatePostButtonClick}>
            {session ? "Create Post" : "Login and post"}
          </Button>
        </div>

      </form>

    </Popup>
  )
}

export default FeedbackFormPopup;