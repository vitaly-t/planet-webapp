import React from 'react';

const NotionLinkIcon = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 24 24"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="none"
    >
      <g>
        <rect fill="none" height="24" width="24" />
        <path
          fill={props.color ? props.color : '#5f6368'}
          d="M20.41,8.41l-4.83-4.83C15.21,3.21,14.7,3,14.17,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V9.83 C21,9.3,20.79,8.79,20.41,8.41z M7,7h7v2H7V7z M17,17H7v-2h10V17z M17,13H7v-2h10V13z"
        />
      </g>
    </svg>
  );
};

export default NotionLinkIcon;