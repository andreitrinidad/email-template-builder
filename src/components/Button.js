import { forwardRef } from "react";

const Button = forwardRef((props, ref) => (
  <a ref={ref} {...props} className={`${props.className} block mb-3 last:mb-0 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 text-sm `} />
));



export default Button
