import React, { useState } from "react";
import { Button, Modal, Box, Typography } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { followUser, unfollowUser } from "../services/api";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  minWidth: 300,
  textAlign: "center",
};

const FollowButton = ({ isFollowing, username, token, onFollowChange }) => {
  const [following, setFollowing] = useState(isFollowing);
  const [openModal, setOpenModal] = useState(false);

  const handleFollow = async () => {
    try {
      await followUser(username, token);
      setFollowing(true);
      onFollowChange(true);
      
    } catch (err) {
      console.error("Erro ao seguir usuário:", err);
    }
  };

  const handleConfirmUnfollow = async () => {
    try {
      await unfollowUser(username, token);
      setFollowing(false);
      onFollowChange(false);
      setOpenModal(false);
    //   window.location.reload(); // Recarrega a página para refletir a mudança
    } catch (err) {
      console.error("Erro ao deixar de seguir usuário:", err);
    }
  };

  return (
    <>
      {following ? (
        <Button
          variant="contained"
          startIcon={<HowToRegIcon />}
          color="secondary"
          onClick={() => setOpenModal(true)}
          sx={{
            backgroundColor: "#6A4C9C",
            "&:hover": { backgroundColor: "#5A3A8C" },
          }}
        >
          Seguindo
        </Button>
      ) : (
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          onClick={handleFollow}
          sx={{
            borderColor: "#6A4C9C",
            color: "#6A4C9C",
            "&:hover": {
              backgroundColor: "#F3E5F5",
              borderColor: "#6A4C9C",
            },
          }}
        >
          Seguir
        </Button>
      )}

      {/* Modal de confirmação */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Deseja deixar de seguir {username}?
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button variant="outlined" onClick={() => setOpenModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmUnfollow}
              sx={{
                backgroundColor: "#6A4C9C",
                "&:hover": { backgroundColor: "#5A3A8C" },
              }}
            >
              Confirmar
            </Button>
            
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default FollowButton;
