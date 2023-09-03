import { Icons } from "./Icons";

const Attachment = ({link, showRemoveButton=false, handleRemoveFileButtonClick}) => {
  return (
    <a href={link} target="_blank" className="h-16 relative">
      {showRemoveButton &&
        <button
          onClick={(ev) => handleRemoveFileButtonClick(ev, link)}
          className="absolute -right-2 -top-2 bg-red-400 p-1 rounded-md text-white">
          <Icons.trash className="w-4 h-4"/>
        </button>
      }
      {/.(jpg|png)$/.test(link)
        ? (<img className="h-16 w-auto rounded-md" src={link} alt={link} />) 
        : (
            <div className="bg-gray-200 h-16 w-28 p-2 flex items-center rounded-md">
              <Icons.paperClip className="w-4 h-4" />
              {`${link.split("/")[4]}.${link.split("/")[8].split(".")[1]}`}
            </div>
        )}
    </a>
  );
}

export default Attachment