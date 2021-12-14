import { faAdjust, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconButton from "./IconButton";

function Header(props) {
    return (
        <div
            {...props}
            className={`flex justify-between items-center text-xs uppercase font-bold mb-3 ${props.className}`}
        >
            {/* {props.children} */}

        </div>
    );
}

export default Header;
