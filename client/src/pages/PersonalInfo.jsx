import React, { useContext } from "react";
import CustomSidebar from "../components/CustomSidebar";
import InfoCard from "../components/InfoCard";
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
const PersonalInfo = () => {

  const user = useAuthUser();
  console.log(user)
  return (
    <div className="flex">
      <CustomSidebar />
      <div className="flex-1 ml-64 p-4 " >
        <h1 className="text-xl font-bold">Özlük Bilgileri</h1>
        <div className="flex flex-row gap-4 mt-4">
          <InfoCard title="Öğrenci No">
            <p>{user.StudentID}</p>
          </InfoCard>
          <InfoCard title="Ad Soyad">
            <p>{user.FirstName + " " + user.LastName}</p>
          </InfoCard>
          <InfoCard title="Fakülte">
            <p>{user.Faculty}</p>
          </InfoCard>
          <InfoCard title="Bölüm">
            <p>{user.Department}</p>
          </InfoCard>
          <InfoCard title="Sınıf">
            <p>{user.Class}</p>
          </InfoCard>
          <InfoCard title="AGNO">
            <p>{user.Agno}</p>
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo
