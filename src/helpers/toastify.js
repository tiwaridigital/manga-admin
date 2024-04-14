import { cssTransition, toast } from 'react-toastify';
import { IoCloseSharp } from 'react-icons/io5';

const toastify = (type, message) => {
  toast[type](message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
    transition: bounce,
    closeButton: <IoCloseSharp size={24} />
  });
};
export default toastify;

const bounce = cssTransition({
  enter: 'animate__animated animate__bounceIn',
  exit: 'animate__animated animate__bounceOut'
});

