import React from "react";
import { Outlet } from "react-router-dom";

const HostAuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Outlet />
    </div>
  );
};

export default HostAuthLayout;