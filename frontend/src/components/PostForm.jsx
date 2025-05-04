import React, { useState, useEffect, useRef } from 'react';
import { createPost, updatePost } from '../services/api';

const PostForm = ({ onPostCreated, token, postToEdit, onCancelEdit }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');  // Mensagem de sucesso
  const fileInputRef = useRef(null);  // Referência para o input de arquivo
  const formRef = useRef(null);  // Referência para o formulário (para rolar para o topo)

  useEffect(() => {
    if (postToEdit) {
      setText(postToEdit.text || '');
      setPreviewImage(postToEdit.image || null);
      setImage(null); // Limpa imagem nova
      // Rolagem automática para o topo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setText('');
      setImage(null);
      setPreviewImage(null);
    }
  }, [postToEdit]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewImage(URL.createObjectURL(file));  // Atualiza a imagem de preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) {
      setError('Digite um texto ou envie uma imagem.');
      
      return;
    }

    const formData = new FormData();
    formData.append('text', text);
      if (image) formData.append('image', image);

      try {
        setLoading(true);
        setError('');
        let result;
        if (postToEdit) {
          result = await updatePost(postToEdit.id, formData, token);
          if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
          result = await createPost(formData, token);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
        onPostCreated(result);
        setText('');
        setImage(null);
        setPreviewImage(null);  // Limpa o preview da imagem após o envio
        if (onCancelEdit) onCancelEdit();
      } catch (err) {
        console.error('Erro detalhado:', err);
        setError(postToEdit ? 'Erro ao atualizar post.' : 'Erro ao criar post.');
      } finally {
        setLoading(false);
      }
  };

  const handleCancelEdit = () => {
    // Limpar todos os campos ao cancelar a edição
    setText('');
    setImage(null);
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';  // Limpar o campo de arquivo
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <div ref={formRef}>
      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="O que está pensando?"
          rows={3}
        />
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}  // Referência para o input de arquivo
          />
        </div>

        {/* Exibindo o preview da imagem se existir */}
        {previewImage && (
          <div>
            <img src={previewImage} alt="Imagem atual" style={{ width: '15rem', marginTop: '10px', maxHeight: '10rem'}} />
          </div>
        )}

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>} {/* Exibe a mensagem de sucesso */}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={loading}>
            {loading ? (postToEdit ? 'Salvando...' : 'Publicando...') : (postToEdit ? 'Salvar alterações' : 'Publicar')}
          </button>
          {postToEdit && (
            <button type="button" onClick={handleCancelEdit}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PostForm;
