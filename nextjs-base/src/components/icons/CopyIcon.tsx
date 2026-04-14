import { Icon } from "@/typings/common";

export const CopyIcon = (props: Icon) => {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      strokeWidth="2"
      {...props}
    >
      <path
        d="M20.4167 16.3333H22.1667C23.4553 16.3333 24.5 15.2887 24.5 14V5.83333C24.5 4.54467 23.4553 3.5 22.1667 3.5H14C12.7113 3.5 11.6667 4.54467 11.6667 5.83333V7.58333M5.83333 11.6667H14C15.2887 11.6667 16.3333 12.7113 16.3333 14V22.1667C16.3333 23.4553 15.2887 24.5 14 24.5H5.83333C4.54467 24.5 3.5 23.4553 3.5 22.1667V14C3.5 12.7113 4.54467 11.6667 5.83333 11.6667Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
