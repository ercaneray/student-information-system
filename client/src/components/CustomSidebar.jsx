import React, {useContext} from "react";
import { PanelMenu } from "primereact/panelmenu";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";

const CustomSidebar = () => {

  const navigate = useNavigate();
  const user = useContext(AuthContext);
  const items = [
    { label: "Kişisel Bilgiler", icon: "pi pi-user", command: () => { navigate("/info") }  },
    {
      label: "Öğrenim",
      icon: "pi pi-graduation-cap",
      items: [
        { label: "Agno Hesapla", icon: "pi pi-calculator", command: () => { navigate("/calculator") }  },
        { label: "Ders Alma ", icon: "pi pi-book", command: () => { navigate("/courses") }   },
        { label: "Ders Alma Listesi", icon: "pi pi-book", command: () => { navigate("/course-list") }   },
      ],
    },
    { label: "Mesajlaşma", icon: "pi pi-envelope", command: () => { navigate("/messages") }   },
    { label: "Mezuniyet İşlemleri", icon: "pi pi-briefcase", command: () => { navigate("/graduation") }   },
    { label: "Yardım", icon: "pi pi-question-circle", command: () => window.open("https://destek.atauni.edu.tr/kb/index.php") },
    { label: "Çıkış", icon: "pi pi-sign-out", command: () => { navigate("/login") }   },
  ];

  

  return (
    <div className="w-64 h-screen bg-blue-950 text-white flex flex-col fixed top-0 left-0 shadow-lg">
      <div className="flex flex-col items-center py-6 border-b border-white/20">
        <img
          src="https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
          alt="Profile"
          className="w-12 h-12 rounded-full mb-3"
        />
        <h4 className="text-lg font-semibold">{user.FirstName +" "+ user.LastName}</h4>
        <div className="flex gap-2 mt-2">
          <i className="pi pi-flag text-white"></i>
          <i className="pi pi-home text-white"></i>
          <i className="pi pi-bell text-white"></i>
          <i className="pi pi-info-circle text-white"></i>
          <i className="pi pi-external-link text-white"></i>
        </div>
      </div>
      <div className="flex-1 p-4">
        <PanelMenu model={items} className="w-full text-red-800 " />
      </div>
    </div>
  );
};

export default CustomSidebar;