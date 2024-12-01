import React from 'react'
import CustomSidebar from "../components/CustomSidebar";

function Courses() {
  return (
    <div className="flex">
    <CustomSidebar />
    <div className="flex-1 ml-64 p-4">
      <h1>Ders alma</h1>
      <p>Burada sayfanızın diğer içeriklerini yerleştirebilirsiniz.</p>
    </div>
  </div>
  )
}

export default Courses