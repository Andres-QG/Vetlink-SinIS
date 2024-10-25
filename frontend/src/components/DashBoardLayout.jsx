import { useContext, useState, useEffect } from "react";
import { Layout, Menu, Avatar, Dropdown, theme, Tooltip } from "antd";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ComputerIcon from "@mui/icons-material/Computer";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PetsIcon from "@mui/icons-material/Pets";

const { Header, Content, Sider, Footer } = Layout;

const DashboardLayout = ({
  children,
  hideSidebar = false, // Opción para ocultar el sidebar
  padding = "24px", // Valores predeterminados de padding
  margin = "24px", // Valores predeterminados de margin
}) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { role, fetchUserRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isActive, setIsActive] = useState(document.cookie.includes("true"));
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setIsActive(document.cookie.includes("true"));
    fetchUserRole();
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
      { key: "3", label: "Contacto", onClick: () => handleClick("#") },
    ];

    if (role === 1 || role === 2) {
      items.push({
        key: "4",
        label: "Administración",
        onClick: () => handleClick("admin"),
      });
    }

    if (role === 4) {
      items.push({
        key: "5",
        label: "Mis Mascotas",
        onClick: () => handleClick("consultMyPets"),
      });
    }

    return items;
  };

  const selectedHeaderKey = () => {
    switch (location.pathname) {
      case "/services":
        return "2";
      case "/about":
        return "1";
      default:
        return "";
    }
  };

  const createSidebarItems = () => {
    let items = [
      { key: "1", icon: <PersonIcon />, label: "Dashboard" },
      { key: "2", icon: <ComputerIcon />, label: "Orders" },
    ];

    if (role === 1 || role === 2) {
      items.push({
        key: "sub1",
        icon: <SearchIcon />,
        label: "Consultas",
        children: [
          {
            key: "3",
            label: "Horarios",
            onClick: () => handleClick("consultSchedules"),
          },
          {
            key: "4",
            label: "Clientes",
            onClick: () => handleClick("consultclients"),
          },
          {
            key: "5",
            label: "Mascotas",
            onClick: () => handleClick("consultpets"),
          },
          {
            key: "6",
            label: "Veterinarios",
            onClick: () => handleClick("consultvets"),
          },
        ],
      });
    }

    if (role === 4 || role === 2) {
      items.push({
        key: "7",
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
        return "3";
      case "/consultclients":
        return "4";
      case "/consultpets":
        return "5";
      case "/consultvets":
        return "6";
      case "/consultMyPets":
        return "7";
      default:
        return "1";
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          flexWrap: "wrap",
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
            justifyContent: "end",
            flexWrap: "wrap",
          }}
        />
        <Dropdown
          menu={isActive ? loggedInMenu : loggedOutMenu}
          placement="bottomRight"
        >
          <Avatar
            style={{
              backgroundColor: isActive ? "#1890ff" : "#808080",
              cursor: "pointer",
            }}
            icon={<PersonIcon />}
          />
        </Dropdown>
      </Header>

      <Layout>
        {!hideSidebar && (
          <Sider
            width={200}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            style={{ background: colorBgContainer }}
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

        <Layout style={{ display: "flex", flexDirection: "column" }}>
          <Content
            style={{
              flexGrow: 1,
              padding,
              margin,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
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
