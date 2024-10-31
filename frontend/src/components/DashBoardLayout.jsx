import { useContext, useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  theme,
  Tooltip,
  Drawer,
  Button,
} from "antd";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import ComputerIcon from "@mui/icons-material/Computer";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PetsIcon from "@mui/icons-material/Pets";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ClinicIcon from "@mui/icons-material/LocalHospital";
import AdminIcon from "@mui/icons-material/SupervisedUserCircle";
import CalendarIcon from "@mui/icons-material/Event";
import ClientsIcon from "@mui/icons-material/Group";
import PetsIconAlt from "@mui/icons-material/Pets";
import VetsIcon from "@mui/icons-material/MedicalServices";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';


const { Header, Content, Sider, Footer } = Layout;

const DashboardLayout = ({
  children,
  hideSidebar = false,
  padding = "24px",
  margin = "24px",
}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { role, fetchUserRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isActive, setIsActive] = useState(document.cookie.includes("true"));
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    setIsActive(document.cookie.includes("true"));
    fetchUserRole();

    // Escuchar cambios de tamaño de pantalla para actualizar el estado de `isSmallScreen`
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [document.cookie, fetchUserRole]);

  const handleClick = (route) => {
    navigate(`/${route}`);
  };

  const logOut = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/log-out/",
        {},
        { withCredentials: true }
      );
      document.cookie = "active=false;path=/;";
      navigate("/login");
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  const loggedInMenu = {
    items: [
      {
        key: "profile",
        icon: <AccountCircleIcon />,
        label: "Consultar perfil",
        onClick: () => handleClick("profile"),
      },
      {
        key: "logout",
        icon: <LogoutIcon />,
        label: "Cerrar sesión",
        onClick: logOut,
      },
    ],
  };

  const loggedOutMenu = {
    items: [
      {
        key: "login",
        icon: <LoginIcon />,
        label: "Iniciar sesión",
        onClick: () => handleClick("login"),
      },
      {
        key: "signup",
        icon: <PersonAddIcon />,
        label: "Registrarme",
        onClick: () => handleClick("signup"),
      },
    ],
  };

  const createHeaderItems = () => {
    let items = [
      {
        key: "1",
        label: "Sobre nosotros",
        onClick: () => handleClick("about"),
      },
      {
        key: "2",
        label: "Servicios",
        onClick: () => handleClick("services"),
      },
      {
        key: "3",
        label: "Contacto",
        onClick: () => handleClick("#"),
      },
    ];

    if (role === 1 || role === 2 || role === 3) {
      items.push({
        key: "adminPanel",
        label: "Administrar",
        onClick: () => handleClick("dashboard"),
      });
    }

    if (role === 4) {
      items.push({
        key: "clientPanel",
        label: "Mi Panel",
        onClick: () => handleClick("dashboard"),
      });
    }

    return items;
  };

  const selectedHeaderKey = () => {
    switch (location.pathname) {
      case "/services":
        return "2";
      case "/dashboard":
        return role === 4 ? "clientPanel" : "adminPanel";
      default:
        return "";
    }
  };

  const createSidebarItems = () => {
    let items = [
      {
        key: "dashboard",
        icon: <DashboardIcon />,
        label: "Dashboard",
        onClick: () => handleClick("dashboard"),
      },
    ];

    if (role === 1 || role === 2) {
      items.push({
        key: "sub1",
        icon: <SearchIcon />,
        label: "Consultas",
        children: [
          {
            key: "consultSchedules",
            icon: <CalendarIcon />,
            label: "Horarios",
            onClick: () => handleClick("consultSchedules"),
          },
          {
            key: "consultclients",
            icon: <ClientsIcon />,
            label: "Clientes",
            onClick: () => handleClick("consultclients"),
          },
          {
            key: "consultpets",
            icon: <PetsIconAlt />,
            label: "Mascotas",
            onClick: () => handleClick("consultpets"),
          },
          {
            key: "consultrecords",
            icon: <AssignmentIcon />,
            label: "Expedientes",
            onClick: () => handleClick("consultrecords"),
          },
          {
            key: "consultvets",
            icon: <VetsIcon />,
            label: "Veterinarios",
            onClick: () => handleClick("consultvets"),
          },
          {
            key: "consultCitas",
            icon: <CalendarMonthIcon />,
            label: "Citas",
            onClick: () => handleClick("appointments"),
          },
          ...(role === 1
            ? [
                {
                  key: "consultClinics",
                  icon: <ClinicIcon />,
                  label: "Clínicas",
                  onClick: () => handleClick("clinics"),
                },
                {
                  key: "consultAdmins",
                  icon: <AdminIcon />,
                  label: "Administradores",
                  onClick: () => handleClick("consultAdmins"),
                },
                
              ]
            : []),
        ],
      });
    }

    if (role === 4) {
      items.push({
        key: "consultMyPets",
        icon: <PetsIcon />,
        label: "Mis Mascotas",
        onClick: () => handleClick("consultMyPets"),
      });
    }

    return items;
  };

  const selectedKey = () => {
    switch (location.pathname) {
      case "/consultSchedules":
        return "consultSchedules";
      case "/consultclients":
        return "consultclients";
      case "/consultpets":
        return "consultpets";
      case "/consultvets":
        return "consultvets";
      case "/consultMyPets":
        return "consultMyPets";
      case "/Owner":
        return "consultClinics";
      case "/consultAdmins":
        return "consultAdmins";
      case "/dashboard":
        return "dashboard";
      default:
        return "dashboard";
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          position: "fixed",
          width: "100%",
          zIndex: 1000,
        }}
      >
        <Tooltip title="Ir a la página principal" placement="bottom">
          <div
            onClick={() => handleClick("")}
            className="logo-container"
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "auto",
              cursor: "pointer",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <img
              src="./src/assets/icons/logo.png"
              alt="VetLink logo"
              style={{ width: 40, height: 40, marginRight: "16px" }}
            />
            <span
              style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}
            >
              VetLink
            </span>
          </div>
        </Tooltip>

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedHeaderKey()]}
          items={createHeaderItems()}
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        />
        {!hideSidebar && (
          <Button
            icon={<MenuUnfoldOutlined />}
            onClick={toggleDrawer}
            className="lg:hidden"
            style={{ marginLeft: "16px" }}
          />
        )}
        <Dropdown
          menu={isActive ? loggedInMenu : loggedOutMenu}
          placement="bottomRight"
        >
          <Avatar
            style={{
              backgroundColor: isActive ? "#1890ff" : "#808080",
              cursor: "pointer",
              marginLeft: "16px",
            }}
            icon={<PersonIcon />}
          />
        </Dropdown>
      </Header>

      <Layout style={{ marginTop: 64 /* Compensar el header fijo */ }}>
        {!hideSidebar && !isSmallScreen && (
          <Sider
            width={200}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            style={{
              background: colorBgContainer,
              position: "fixed",
              height: "100%",
              zIndex: 1000,
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={[selectedKey()]}
              style={{
                height: "100%",
                borderRight: 0,
                background: colorBgContainer,
              }}
              items={createSidebarItems()}
            />
          </Sider>
        )}

        {/* Drawer en pantallas pequeñas */}
        {!hideSidebar && isSmallScreen && (
          <Drawer
            width={200}
            title="Menú"
            placement="left"
            onClose={toggleDrawer}
            open={drawerOpen}
            styles={{ body: { padding: 0 } }}
          >
            <Menu
              mode="inline"
              selectedKeys={[selectedKey()]}
              items={createSidebarItems()}
            />
          </Drawer>
        )}

        <Layout
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: hideSidebar || isSmallScreen ? 0 : collapsed ? 80 : 200,
          }}
        >
          <Content
            style={{
              flexGrow: 1,
              padding,
              margin,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
            }}
          >
            {children}
          </Content>

          <Footer
            style={{
              textAlign: "center",
              padding: "16px 0",
              height: "48px",
              background: colorBgContainer,
              borderTop: "1px solid #e8e8e8",
              marginTop: "auto",
            }}
          >
            <div style={{ color: "#595959" }}>
              &copy; {new Date().getFullYear()} VetLink. Todos los derechos
              reservados.
            </div>
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
