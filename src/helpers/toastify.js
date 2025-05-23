import { toast, cssTransition } from 'react-toastify';
import 'animate.css/animate.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { IoCloseSharp } from 'react-icons/io5';

const toastify = (type, message, closeTime = 3000) => {
  toast[type](message, {
    position: 'top-right',
    autoClose: closeTime,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: bounce,
    closeButton: <IoCloseSharp size={24} />,
  });
};
export default toastify;

const bounce = cssTransition({
  enter: 'animate__animated animate__bounceIn',
  exit: 'animate__animated animate__bounceOut',
});
