import React from 'react';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa'; // ícone preenchido
import "../assets/css/Feed.css";

const LikeButton = ({ count, onClick, liked }) => {
  return (
    <button className="like-button" onClick={onClick}>
      {liked ? (
        <FaHeart className="like-icon liked" />
      ) : (
        <FiHeart className="like-icon" />
      )}
      <span className="like-count">{count}</span>
    </button>
  );
};

export default LikeButton;
//