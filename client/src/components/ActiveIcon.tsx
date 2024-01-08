import React from "react";

function ActiveIcon({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={`absolute bottom-0 right-0 w-[10px] h-[10px] rounded-full ${
        isActive ? "bg-green-500" : "bg-gray-500"
      }`}
    />
  );
}

export default ActiveIcon;
