const Button = (props) => {
  const extraClasses = props?.className || "";
  const isPrimary = !!props?.primary ? " bg-blue-500 text-white" : "text-gray-600" 
  // const primeBtn = 
  return (
    <button
      disabled={props.disabled}
      {...props}
      className={`
                ${isPrimary}
                ${props.disabled ? "text-opacity-70 bg-opacity-70 cursor-not-allowed" : ' '}
                ${extraClasses}
                flex items-center gap-2 px-4 py-1 rounded-md text-opacity-90`}
    />
  );

};

export default Button;