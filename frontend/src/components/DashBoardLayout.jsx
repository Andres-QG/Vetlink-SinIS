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
  FloatButton,
  Popover,
} from "antd";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Menu as MenuIcon } from "@mui/icons-material";
import { RightOutlined, CloseOutlined } from "@ant-design/icons";
import MedicalServices from "@mui/icons-material/MedicalServices";
import AssignmentIcon from "@mui/icons-material/Assignment";
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
import VetsIcon from "@mui/icons-material/MedicalServices";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PetsIconAlt from "@mui/icons-material/Pets";
import { Vaccines } from "@mui/icons-material";
import PaymentIcon from "@mui/icons-material/Payment";
import { ConfigProvider } from "antd";
import { style } from "@mui/system";
import { backdropClasses } from "@mui/material";

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
  const [isActive, setIsActive] = useState(
    document.cookie.includes("active=true")
  );
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    setIsActive(document.cookie.includes("active=true"));
    fetchUserRole();

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    const interval = setInterval(() => {
      const sessionCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("active="));
      const currentCookieState = sessionCookie
        ? sessionCookie.split("=")[1] === "true"
        : false;

      if (currentCookieState !== isActive) {
        setIsActive(currentCookieState);
        if (!currentCookieState) {
          refreshSession();
        }
      }
    }, 15000);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, [fetchUserRole, isActive]);

  const handleClick = (route) => {
    navigate(`/${route}`);
  };

  const refreshSession = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/log-out/",
        {},
        { withCredentials: true }
      );
      document.cookie = "active=false;path=/;";
      window.location.reload();
    } catch (error) {
      console.error("Error en el cerrando sesión:", error);
    }
  };

  const logOut = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/log-out/",
        {},
        { withCredentials: true }
      );
      document.cookie = "active=false;path=/;";
      setIsActive(false);
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

  const createHeaderItems = () => [
    { key: "1", label: "Sobre nosotros", onClick: () => handleClick("about") },
    { key: "2", label: "Servicios", onClick: () => handleClick("services") },
    { key: "3", label: "Contacto", onClick: () => handleClick("#") },
    ...(role === 1 || role === 2 || role === 3
      ? [
          {
            key: "adminPanel",
            label: "Administrar",
            onClick: () => handleClick("dashboard"),
          },
        ]
      : []),
    ...(role === 4
      ? [
          {
            key: "clientPanel",
            label: "Mi Panel",
            onClick: () => handleClick("dashboard"),
          },
        ]
      : []),
  ];

  const selectedHeaderKey = () => {
    switch (location.pathname) {
      case "/":
        return "LandingPage";
      case "/services":
        return "2";
      case "/dashboard":
        return role === 4 ? "clientPanel" : "adminPanel";
      default:
        return "";
    }
  };

  const createSidebarItems = () => [
    {
      key: "dashboard",
      icon: <DashboardIcon />,
      label: "Dashboard",
      onClick: () => handleClick("dashboard"),
    },
    ...(role <= 3
      ? [
          {
            key: "consultSchedules",
            icon: <CalendarIcon />,
            label: "Horarios",
            onClick: () => handleClick("consultSchedules"),
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
            key: "consultvaccines",
            icon: <Vaccines />,
            label: "Vacunas",
            onClick: () => handleClick("consultvaccines"),
          },
          {
            key: "Consultsymptoms",
            icon: <MedicalServices />,
            label: "Síntomas",
            onClick: () => handleClick("Consultsymptoms"),
          },
          {
            key: "consultTreatment",
            icon: <MedicalServices />,
            label: "Tratamientos",
            onClick: () => handleClick("ConsultTreatment"),
          },
        ]
      : []),
    ...(role === 1 || role === 2
      ? [
          {
            key: "consultclients",
            icon: <ClientsIcon />,
            label: "Clientes",
            onClick: () => handleClick("consultclients"),
          },
          {
            key: "consultvets",
            icon: <VetsIcon />,
            label: "Veterinarios",
            onClick: () => handleClick("consultvets"),
          },
          {
            key: "consultservices",
            icon: <MedicalServices />,
            label: "Servicios",
            onClick: () => handleClick("consultservices"),
          },
        ]
      : []),
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
    ...(role === 4
      ? [
          {
            key: "consultMyPets",
            icon: <PetsIcon />,
            label: "Mis Mascotas",
            onClick: () => handleClick("consultMyPets"),
          },
          {
            key: "consultVaccinations",
            icon: <Vaccines />,
            label: "Vacunación",
            onClick: () => handleClick("consultVaccinations"),
          },
          {
            key: "consultMyPaymentMethods",
            icon: <PaymentIcon />,
            label: "Métodos de Pago",
            onClick: () => handleClick("consultMyPaymentMethods"),
          },
          {
            key: "consultMyAppointments",
            icon: <CalendarMonthIcon />,
            label: "Mis Citas",
            onClick: () => handleClick("myappointments"),
          },
        ]
      : []),
    ...(role <= 3
      ? [
          {
            key: "consultCitas",
            icon: <CalendarMonthIcon />,
            label: "Citas",
            onClick: () => handleClick("appointments"),
          },
        ]
      : []),
  ];

  const selectedKey = () => {
    switch (location.pathname) {
      case "/ConsultTreatment":
        return "consultTreatment";
      case "/consultSchedules":
        return "consultSchedules";
      case "/Consultsymptoms":
        return "ConsultSymptoms";
      case "/consultclients":
        return "consultclients";
      case "/consultpets":
        return "consultpets";
      case "/consultvets":
        return "consultvets";
      case "/consultservices":
        return "consultservices";
      case "/consultrecords":
        return "consultrecords";
      case "/clinics":
        return "consultClinics";
      case "/consultMyPets":
        return "consultMyPets";
      case "/consultMyPaymentMethods":
        return "consultMyPaymentMethods";
      case "/Owner":
        return "consultClinics";
      case "/consultAdmins":
        return "consultAdmins";
      case "/appointments":
        return "consultCitas";
      case "/myappointments":
        return "consultMyAppointments";
      case "/dashboard":
        return "dashboard";
      case "/consultvaccines":
        return "consultvaccines";
      case "/consultVaccinations":
        return "consultVaccinations";
      default:
        return "dashboard";
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <ConfigProvider
  theme={{
    components: {
      Menu: {
           itemSelectedColor: "#00308F",
           itemSelectedBg: "#ecf0f9",
          },
        },
      }}
    >
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

          {isSmallScreen ? (
            <Popover
              content={
                <Menu
                  items={createHeaderItems()}
                  selectedKeys={[selectedHeaderKey()]}
                />
              }
              trigger="click"
            >
              <Button
                icon={<MenuIcon />}
                style={{
                  backgroundColor: "#001529",
                  color: "white",
                  border: "none",
                }}
              />
            </Popover>
          ) : (
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
          )}
          <Dropdown
            menu={isActive ? loggedInMenu : loggedOutMenu}
            placement="bottomRight"
          >
            <Avatar
              style={{
                backgroundColor: isActive ? "#0BA6A9" : "#808080",
                cursor: "pointer",
                marginLeft: "16px",
              }}
              icon={<PersonIcon />}
            />
          </Dropdown>
        </Header>

        <Layout style={{ marginTop: 64 }}>
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
                zIndex: 10,
              }}
            >
              <Menu
                mode="inline"
                selectedKeys={[selectedKey()]}
                itemActiveBg={"#000000"}
                style={{
                  height: "100%",
                  borderRight: 0,
                  background: colorBgContainer,
                }}
                items={createSidebarItems()}
              />
            </Sider>
          )}

          {!hideSidebar && isSmallScreen && (
            <>
              <FloatButton
                icon={drawerOpen ? <CloseOutlined /> : <RightOutlined />}
                onClick={toggleDrawer}
                style={{
                  bottom: 24,
                  right: 24,
                  color: "white",
                  border: "2px solid #001529", // Cambia #0BA6A9 por el color de borde que prefieras
                }}
              />
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
            </>
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
    </ConfigProvider>
  );
};

export default DashboardLayout;
