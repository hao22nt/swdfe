// import toast from 'react-hot-toast';
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineUsers,
  HiOutlineCube,
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentChartBar,
  HiAcademicCap, 
} from 'react-icons/hi2';
import { FaBook } from "react-icons/fa";



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
        url: '/admissionin4',
        icon: HiOutlineCube,
        label: 'AdmissInfor',
      },
      {
        isLink: true,
        url: '/subjects',
        icon:FaBook ,
        label: 'Subject',
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
