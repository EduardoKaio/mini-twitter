import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  CssBaseline,
  Avatar,
  Typography,
  Box,
  useTheme,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ExitToApp as ExitToAppIcon,
  Home as HomeIcon,
  PostAdd as PostIcon,
  PersonSearch as Search,
} from "@mui/icons-material";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { getProfile } from "../services/api";

const drawerWidth = 240;
const drawerWidthClosed = 70;

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [username, setUsername] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUsername(""); // Limpa o estado do username
    navigate("/login");
    window.location.reload(); // Recarrega a página para limpar o estado do React
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access");
      if (token) {
        try {
          const data = await getProfile(token);
          setUsername(data.username);
        } catch (error) {
          console.error("Erro ao carregar o perfil:", error);
        }
      }
    };

    fetchProfile();
  }, []);

  const menuItems = [
    { label: "Feed", path: "/feed", icon: <HomeIcon /> },
    { label: "Meus Posts", path: "/my-posts", icon: <PostIcon /> },
    { label: "Buscar Usuários", path: "/search-users", icon: <Search /> }, // Nova opção
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Chama ao carregar a página

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
  }, [location.pathname]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      body, * {
        font-family: 'Poppins', sans-serif !important; /* Força a aplicação da fonte */
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style); // Remove o estilo ao desmontar o componente
    };
  }, []);

  return (
    <>
      <CssBaseline />
      <style>
        {`
          * {
            font-family: 'Poppins', sans-serif; /* Aplica a fonte globalmente */
          }
        `}
      </style>
      <Drawer
        variant="permanent"
        anchor="left"
        open={open}
        sx={{
          width: open ? drawerWidth : drawerWidthClosed,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : drawerWidthClosed,
            fontFamily: "'Poppins', sans-serif", // Garante a fonte no Drawer
            transition: "width 0.3s ease",
            background: "#5A3A8C",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: open ? "flex-start" : "center", // Alinha no centro apenas quando comprimida
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            overflow: "hidden", // Remove barra de rolagem
          },
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: open ? "flex-start" : "center",
            width: "100%", // Garante que ocupe toda a largura
          }}
        >
          <List sx={{ width: "100%" }}> {/* Garante que a lista ocupe toda a largura */}
            <ListItemButton
              onClick={() => setOpen(!open)}
              sx={{
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
                justifyContent: open ? "flex-start" : "center",
              }}
            >
              <ListItemIcon sx={{ color: "#fff", justifyContent: open ? "flex-start" : "center" }}>
                <MenuIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Menu" />}
            </ListItemButton>

            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />

            {menuItems.map((item) => (
              <Tooltip title={open ? "" : item.label} placement="right" key={item.label}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    },
                    justifyContent: open ? "flex-start" : "center",
                  }}
                >
                  <ListItemIcon sx={{ color: "#fff", justifyContent: open ? "flex-start" : "center" }}>
                    {item.icon}
                  </ListItemIcon>
                  {open && <ListItemText primary={item.label} />}
                </ListItemButton>
              </Tooltip>
            ))}

            <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />

            <Tooltip title={open ? "" : "Sair"} placement="right">
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                  justifyContent: open ? "flex-start" : "center",
                }}
              >
                <ListItemIcon sx={{ justifyContent: open ? "flex-start" : "center" }}>
                  <ExitToAppIcon sx={{ color: "white" }} />
                </ListItemIcon>
                {open && <ListItemText primary="Sair" />}
              </ListItemButton>
            </Tooltip>
          </List>
        </Box>

        {/* Avatar e Username na parte inferior */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "flex-start" : "center", // Centraliza apenas quando comprimida
            gap: 1,
            backgroundColor: open ? "rgba(0, 0, 0, 0.1)" : "transparent",
            borderRadius: "8px",
            mx: 1,
            mb: 2,
            transition: "background-color 0.3s ease",
            width: "92%", // Garante que ocupe toda a largura
            cursor: "pointer", // Adiciona cursor de ponteiro
            textDecoration: "none", // Remove sublinhado
            color: "#fff", // Cor do texto
            
          }}
          component={Link}
          to="/profile" // Link para a página de perfil
        >
          <Avatar sx={{ bgcolor: "#ab47bc", width: 40, height: 40 }}>
            {username ? username[0]?.toUpperCase() : "U"}
          </Avatar>
          {open && (
            <Typography variant="body2" noWrap>
              {username || "Usuário"}
            </Typography>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export { Sidebar, drawerWidth, drawerWidthClosed };
