import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import { followUser, listFollowing, getUser } from "../services/api"; // Ajustado para importar o novo método `getUser`
import { Sidebar } from "../components/Sidebar";
import FollowButton from "../components/FollowButton";

const SearchUsers = () => {
  const [username, setUsername] = useState("");
  const [userFound, setUserFound] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(true);
  const [followingsList, setFollowingsList] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const followingUsers = await listFollowing(token);
        const usernames = followingUsers.map(user => user.username);
        setFollowingsList(usernames);
      } catch (err) {
        console.error("Erro ao carregar usuários seguidos:", err);
      }
    };

    fetchFollowings();
  }, [token]);

  const handleSearch = async () => {
    setError("");
    setUserFound(null);

    if (!username.trim()) {
      setError("Digite um nome de usuário.");
      return;
    }

    try {
      // Requisição para buscar o usuário
      const userResponse = await getUser(username, token); // Supondo que você tenha um método `getUser` que retorna o usuário
      const isAlreadyFollowing = followingsList.includes(username);
      setUserFound({ 
        username: userResponse.username, 
        avatar: userResponse.avatar, // Se tiver um avatar
        isFollowing: isAlreadyFollowing 
      });
    } catch (err) {
      setError("Usuário não encontrado.");
    }
  };

  const handleFollowChange = (newState) => {
    setUserFound(prev => ({ ...prev, isFollowing: newState }));
    setFollowingsList(prev =>
      newState
        ? [...prev, userFound.username]
        : prev.filter(u => u !== userFound.username)
    );
  };

  return (
    <div className="layout-container">
      <Sidebar open={open} setOpen={setOpen} />
      <div className="">
        <Box
          sx={{
            p: 4,
            mx: "auto",
            mt: 0,
            maxWidth: 700,
          }}
        >
          <Typography variant="h2" gutterBottom
            sx={{ 
              fontSize: '1.8rem',
              color: '#6A4C9C',
              marginBottom: '2rem',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            Buscar Usuários
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3 }}>
            <TextField
              label="Nome de usuário"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              sx={{
                backgroundColor: "#6A4C9C",
                height: "56px",
                width: "160px",
                fontSize: "1rem",
                "&:hover": { backgroundColor: "#5A3A8C" },
              }}
            >
              Buscar
            </Button>
          </Box>
          {userFound && (
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2,
                mt: 2,
                borderRadius: "12px",
                backgroundColor: "#f3e5f5",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: "#6A4C9C",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  {userFound.avatar ? (
                    <img
                      src={userFound.avatar}
                      alt={`${userFound.username}'s avatar`}
                      style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                    />
                  ) : (
                    userFound.username.charAt(0).toUpperCase()
                  )}
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#6a1b9a",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  @{userFound.username}
                </Typography>
              </Box>
              <FollowButton
                isFollowing={userFound.isFollowing}
                username={userFound.username}
                token={token}
                onFollowChange={handleFollowChange}
                sx={{
                  backgroundColor: userFound.isFollowing ? "#e0e0e0" : "#6A4C9C",
                  color: userFound.isFollowing ? "#000" : "#fff",
                  "&:hover": {
                    backgroundColor: userFound.isFollowing ? "#d6d6d6" : "#5A3A8C",
                  },
                  borderRadius: "20px",
                  padding: "6px 16px",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                }}
              />
            </Paper>
          )}
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}
        </Box>
      </div>
    </div>
  );
};

export default SearchUsers;
