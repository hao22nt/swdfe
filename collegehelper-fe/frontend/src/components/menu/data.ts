// import toast from 'react-hot-toast';
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineUsers,
  HiOutlineCube,
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentChartBar,
  HiOutlinePencilSquare,
  HiOutlineCalendarDays,
  HiOutlineArrowLeftOnRectangle,
  HiAcademicCap, 
} from 'react-icons/hi2';

// import { IoSettingsOutline } from 'react-icons/io5';

export const menu = [
  {
    catalog: 'main',
    listItems: [
      {
        isLink: true,
        url: '/',
        icon: HiOutlineHome,
        label: 'homepage',
      },
      {
        isLink: true,
        url: '/profile',
        icon: HiOutlineUser,
        label: 'profile',
      },
    ],
  },
  {
    catalog: 'Management',
    listItems: [
      {
        isLink: true,
        url: '/users',
        icon: HiOutlineUsers,
        label: 'users',
      },
      {
        isLink: true,
        url: '/admission',
        icon: HiOutlineCube,
        label: 'Admission',
      },
      {
        isLink: true,
        url: '/major',
        icon: HiOutlineClipboardDocumentList,
        label: 'Major',
      },
      {
        isLink: true,
        url: '/posts',
        icon: HiOutlineDocumentChartBar,
        label: 'posts',
      },
      {
        isLink: true,
        url: '/university',
        icon: HiAcademicCap,
        label: 'University',
      },
    ],
  },
  

];
