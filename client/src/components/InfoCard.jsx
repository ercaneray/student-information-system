import React from "react";

export default function InfoCard({ title, children }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h1 className="text-xl font-bold pb-2">{title}</h1>
      {children}
    </div>
  );
}