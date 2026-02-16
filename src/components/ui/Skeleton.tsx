import React from "react";

const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...rest }) => {
  return (
    <div
      aria-hidden
      className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-md ${className}`}
      {...rest}
    />
  );
};

export default Skeleton;
