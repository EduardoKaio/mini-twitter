import React, { useEffect, useState } from 'react';
import { getFeed } from '../services/api';
import PostCard from '../components/PostCard';
import { Sidebar } from "../components/Sidebar"
import "../assets/css/Feed.css"
import CreatePostForm from '../components/PostForm';
import FollowButton from "../components/FollowButton";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(true);
  const token = localStorage.getItem('access');
  
  const fetchFeed = async (url) => {
    try {
      const data = url ? await getFeed(url) : await getFeed();
      setPosts((prevPosts) => url ? [...prevPosts, ...data.results] : data.results);
      setNextPage(data.next);
    } catch (err) {
      setError('Erro ao carregar o feed');
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);
  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };
  // Função para atualizar um post específico após a alteração do like
  const handleLikeUpdate = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id
          ? { ...post, is_liked: updatedPost.is_liked, likes_count: updatedPost.likes_count }
          : post
      )
    );
  };
  const handleFollowChange = (username, isNowFollowing) => {
    setPosts((prevPosts) =>
      isNowFollowing
        ? prevPosts.map((post) =>
            post.user === username ? { ...post, is_following: true } : post
          )
        : prevPosts.filter((post) => post.user !== username) // Remove posts do usuário
    );
  };

  return (
    <div className="layout-container">
      <Sidebar open={open} setOpen={setOpen} />
      <div className="feed-content">
        <div className="feed-container">
          <h2>Feed</h2>
          
          {error && <p className="error-message">{error}</p>}
          {!error && posts.length === 0 && <p>Nenhuma publicação ainda.</p>}
          {posts.length > 0 && posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onLikeUpdate={handleLikeUpdate} 
              disableLink={true}
              onFollowChange={handleFollowChange}
            />
          ))}
          {nextPage && posts.length > 0 && (
            <button 
              className="carregar-mais"
              onClick={() => fetchFeed(nextPage)}
            >
              Carregar mais
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
