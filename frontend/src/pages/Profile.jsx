import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, Paper, Button, List, ListItem, ListItemText } from "@mui/material";
import { Sidebar } from "../components/Sidebar";
import { getProfile, listFollowers, listFollowing } from "../services/api";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState("followers"); // Define qual lista será exibida
  const [open, setOpen] = useState(true);

  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profile = await getProfile(token);
        const followersList = await listFollowers(token);
        const followingList = await listFollowing(token);

        setUserData(profile);
        setFollowers(followersList);
        setFollowing(followingList);
      } catch (err) {
        console.error("Erro ao carregar dados do perfil:", err);
      }
    };

    fetchProfileData();
  }, [token]);

  if (!userData) {
    return <Typography>Carregando...</Typography>;
  }

  return (
    <div className="layout-container">
      <Sidebar open={open} setOpen={setOpen} />
      <Box
        sx={{
          p: 4,
          mx: "auto",
          mt: 0,
          maxWidth: 800,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* Informações do Usuário */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: "12px",
            
            
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#6A4C9C",
              width: 100,
              height: 100,
              fontSize: "2.5rem",
            }}
          >
            {userData.avatar ? (
              <img
                src={userData.avatar}
                alt={`${userData.username}'s avatar`}
                style={{ width: "100%", height: "100%", borderRadius: "50%" }}
              />
            ) : (
              userData.username.charAt(0).toUpperCase()
            )}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#6A4C9C" }}>
              {userData.username}
            </Typography>
            <Typography variant="body1" sx={{ color: "#6a1b9a" }}>
              @{userData.username}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "#6a1b9a" }}>
              {userData.bio || "Este usuário ainda não adicionou uma biografia."}
            </Typography>
          </Box>
        </Paper>

        {/* Botões para alternar entre Seguidores e Seguindo */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant={activeTab === "followers" ? "contained" : "outlined"}
            onClick={() => setActiveTab("followers")}
            sx={{
              backgroundColor: activeTab === "followers" ? "#6A4C9C" : "transparent",
              color: activeTab === "followers" ? "#fff" : "#6A4C9C",
              "&:hover": {
                backgroundColor: activeTab === "followers" ? "#5A3A8C" : "#f3e5f5",
              },
            }}
          >
            Seguidores
          </Button>
          <Button
            variant={activeTab === "following" ? "contained" : "outlined"}
            onClick={() => setActiveTab("following")}
            sx={{
              backgroundColor: activeTab === "following" ? "#6A4C9C" : "transparent",
              color: activeTab === "following" ? "#fff" : "#6A4C9C",
              "&:hover": {
                backgroundColor: activeTab === "following" ? "#5A3A8C" : "#f3e5f5",
              },
            }}
          >
            Seguindo
          </Button>
        </Box>

        {/* Lista dinâmica de Seguidores ou Seguindo */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: "12px",
            
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#6A4C9C", mb: 2 }}>
            {activeTab === "followers" ? "Seguidores" : "Seguindo"}
          </Typography>
          <List>
            {(activeTab === "followers" ? followers : following).length > 0 ? (
              (activeTab === "followers" ? followers : following).map((user) => (
                <ListItem key={user.username} sx={{ p: 1 }}>
                  <Avatar sx={{ bgcolor: "#6A4C9C", mr: 2 }}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <ListItemText
                    primary={`@${user.username}`}
                    primaryTypographyProps={{ color: "#6a1b9a", fontWeight: "bold" }}
                  />
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" sx={{ color: "#6a1b9a" }}>
                {activeTab === "followers"
                  ? "Nenhum seguidor ainda."
                  : "Você ainda não segue ninguém."}
              </Typography>
            )}
          </List>
        </Paper>
      </Box>
    </div>
  );
};

export default Profile;
