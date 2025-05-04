import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';
import FollowButton from './FollowButton';
import { likePost, listFollowing } from '../services/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import HowToRegIcon from '@mui/icons-material/HowToReg'; // Ícone para "seguindo"
import { IconButton, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';

const PostCard = ({ post, isOwner = false, onEdit, onDelete, onLikeUpdate, disableLink = false, isMyPostsPage = false, onFollowChange }) => {
  const token = localStorage.getItem('access');
  const currentUser = localStorage.getItem('username');
  const [isFollowing, setIsFollowing] = useState(post.is_following || false);

  const handleLike = async () => {
    try {
      // Atualiza o estado local do post imediatamente
      if (onLikeUpdate) {
        onLikeUpdate({
          id: post.id,
          is_liked: !post.is_liked,
          likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1,
        });
      }

      // Chama a API para persistir a alteração
      await likePost(post.id, token);
    } catch (error) {
      console.error('Erro ao curtir o post:', error);
    }
  };

  const formattedDate = new Date(post.created_at).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="post-card">
      {disableLink ? (
        <div>
          <div className="post-header">
            <strong>@{post.user}</strong>
            {isMyPostsPage || post.user === currentUser ? (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: "#6A4C9C",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "5px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                }}
              >
                <HowToRegIcon className="follow-icon" />
                Eu
              </Box>
            ) : (
              <FollowButton
                isFollowing={isFollowing}
                username={post.user}
                token={token}
                onFollowChange={(newValue) => {
                  setIsFollowing(newValue);
                  if (onFollowChange) {
                    onFollowChange(post.user, newValue); // Notifica a mudança de follow
                  }
                }}
              />
            )}
          </div>
          <p className="post-content">{post.text}</p>
          {post.image && (
            <img src={post.image} className="post-image" alt="Post visual" />
          )}
          <div className="post-date-container">
            <span className="post-date">{formattedDate}</span>
          </div>
        </div>
      ) : (
        <Link to={`/post/${post.id}`} className="post-link">
          <div className="post-header">
            <strong>@{post.user}</strong>
            {isMyPostsPage || post.user === currentUser ? (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  backgroundColor: "#6A4C9C",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "5px",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                }}
              >
                <HowToRegIcon className="follow-icon" />
                Eu
              </Box>
            ) : (
              <FollowButton
                isFollowing={isFollowing}
                username={post.user}
                token={token}
                onFollowChange={(newValue) => {
                  setIsFollowing(newValue);
                  if (onFollowChange) {
                    onFollowChange(post.user, newValue); // Notifica a mudança de follow
                  }
                }}
              />
            )}
          </div>
          <p className="post-content">{post.text}</p>
          {post.image && (
            <img src={post.image} className="post-image" alt="Post visual" />
          )}
          <div className="post-date-container">
            <span className="post-date">{formattedDate}</span>
          </div>
        </Link>
      )}
      <div className="post-footer">
        <div className="post-actions">
          {isOwner && (
            <>
              <Tooltip title="Editar">
                <IconButton onClick={() => onEdit?.(post)} color="primary">
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Excluir">
                <IconButton onClick={() => onDelete?.(post.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </div>
        <div className="post-like">
          <LikeButton count={post.likes_count} liked={post.is_liked} onClick={() => handleLike()} />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
