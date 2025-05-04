import React, { useEffect, useState } from 'react';
import { getMyPosts, deletePost, updatePost } from '../services/api';
import PostCard from '../components/PostCard';
import { Sidebar } from "../components/Sidebar";
import "../assets/css/Feed.css";
import PostForm from '../components/PostForm';
import FollowButton from "../components/FollowButton";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import { DeleteOutline, Cancel } from '@mui/icons-material';

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successCreateMessage, setSuccessCreateMessage] = useState(false);
  const [successEditMessage, setSuccessEditMessage] = useState(false);
  const [successDeleteMessage, setSuccessDeleteMessage] = useState(false);
  const token = localStorage.getItem('access');
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!token) {
        setError('Token de autenticação não encontrado. Faça login novamente.');
        return;
      }
      try {
        const data = await getMyPosts(token);
        setPosts(data || []);
      } catch (err) {
        setError('Erro ao carregar seus posts');
        console.error(err);
      }
    };

    fetchMyPosts();
  }, [token]);

  const handlePostCreated = (savedPost) => {
    setPosts((prevPosts) => {
      const exists = prevPosts.find((post) => post.id === savedPost.id);
      if (exists) {
        setSuccessEditMessage(true);  // Post editado
        return prevPosts.map((post) => (post.id === savedPost.id ? savedPost : post));
      } else {
        setSuccessCreateMessage(true);  // Post criado
        return [savedPost, ...prevPosts];
      }
    });
    setEditingPost(null);
  };

  const handleLikeUpdate = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id
          ? { ...post, is_liked: updatedPost.is_liked, likes_count: updatedPost.likes_count }
          : post
      )
    );
  };

  const handleDeleteClick = (postId) => {
    setSelectedPostId(postId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePost(selectedPostId, token);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== selectedPostId));
      setSuccessDeleteMessage(true);
    } catch (err) {
      console.error('Erro ao excluir post:', err);
      setError('Erro ao excluir o post');
    } finally {
      setConfirmOpen(false);
      setSelectedPostId(null);
    }
  };
  

  return (
    <div className="layout-container">
      <Sidebar open={open} setOpen={setOpen} />
      <div className="feed-content">
        <div className="feed-container">
          <h2>Meus Posts</h2>
          <PostForm
            onPostCreated={handlePostCreated}
            token={token}
            postToEdit={editingPost}
            onCancelEdit={() => setEditingPost(null)}
          />
          {error && <p className="error-message">{error}</p>}
          {!error && posts.length === 0 && <p>Você ainda não criou nenhuma publicação.</p>}
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLikeUpdate={handleLikeUpdate}
              isOwner={true}
              onEdit={(postToEdit) => setEditingPost(postToEdit)}
              onDelete={handleDeleteClick}
              disableLink={true}
              isMyPostsPage={true} // Indica que está na página "Meus Posts"
              extraActions={
                post.author && ( // Verifica se post.author existe
                  <FollowButton
                    isFollowing={post.is_following}
                    username={post.author.username}
                    token={token}
                    onFollowChange={(newState) => console.log("Follow state changed:", newState)}
                  />
                )
              }
            />
          ))}

          {/* Modal de Confirmação */}
          <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogContent>
              Tem certeza que deseja excluir este post?
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setConfirmOpen(false)}
                sx={{ color: '#7b1fa2' }} // Roxo escuro do seu sistema
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmDelete}
                sx={{ color: 'white', backgroundColor: '#7b1fa2' }} 
              >
                Excluir
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={successCreateMessage}
            autoHideDuration={3000}
            onClose={() => setSuccessCreateMessage(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setSuccessCreateMessage(false)}
              severity="success"
              sx={{
                backgroundColor: '#7b1fa2',
                color: '#fff',
                '& .MuiAlert-icon': {
                  color: '#fff'
                }
              }}
            >
              Post criado com sucesso!
            </Alert>
          </Snackbar>

          {/* Snackbar - Edição */}
          <Snackbar
            open={successEditMessage}
            autoHideDuration={3000}
            onClose={() => setSuccessEditMessage(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setSuccessEditMessage(false)}
              severity="success"
              sx={{
                backgroundColor: '#7b1fa2',
                color: '#fff',
                '& .MuiAlert-icon': {
                  color: '#fff'
                }
              }}
            >
              Post editado com sucesso!
            </Alert>
          </Snackbar>

          {/* Snackbar - Exclusão */}
          <Snackbar
            open={successDeleteMessage}
            autoHideDuration={3000}
            onClose={() => setSuccessDeleteMessage(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setSuccessDeleteMessage(false)}
              severity="success"
              sx={{
                backgroundColor: '#7b1fa2',
                color: '#fff',
                '& .MuiAlert-icon': {
                  color: '#fff'
                }
              }}
            >
              Post excluído com sucesso!
            </Alert>
          </Snackbar>

        </div>
      </div>
    </div>
  );
};

export default MyPosts;
