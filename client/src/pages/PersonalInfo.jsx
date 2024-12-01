import React, { useContext } from "react";
import CustomSidebar from "../components/CustomSidebar";
import { AuthContext } from "../context/AuthContext";
import InfoCard from "../components/InfoCard";
const PersonalInfo = () => {

  const user = useContext(AuthContext);
  return (
    <div className="flex">
      <CustomSidebar />
      <div className="flex-1 ml-64 p-4 " >
        <h1 className="text-xl font-bold">Özlük Bilgileri</h1>
        <div className="flex flex-row gap-4 mt-4">
          <InfoCard title="Öğrenci No">
            <p>{user.student_id}</p>
          </InfoCard>
          <InfoCard title="Ad Soyad">
            <p>{user.first_name + " " + user.last_name}</p>
          </InfoCard>
          <InfoCard title="Fakülte">
            <p>{user.faculty}</p>
          </InfoCard>
          <InfoCard title="Bölüm">
            <p>{user.department}</p>
          </InfoCard>
          <InfoCard title="Sınıf">
            <p>{user.class}</p>
          </InfoCard>
          <InfoCard title="AGNO">
            <p>{user.agno}</p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo
