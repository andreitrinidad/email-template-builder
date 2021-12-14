import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { forwardRef } from "react";
import { icons } from "../helpers/icons";


const Button = forwardRef((props, ref) => {

    return (
        <button ref={ref} {...props} className={`select-none cursor-pointer block text-left bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold py-2 px-4 text-xs rounded-sm disabled:opacity-50 disabled:cursor-not-allowed ${props.className} `}>
            <FontAwesomeIcon icon={icons[props.icon]} className="mr-2 " />
            {props.title}
        </button>
    )
});



export default Button;
