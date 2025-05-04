# Etapa 1: imagem base com Python
FROM python:3.12-slim

# Etapa 2: definir diretório de trabalho
WORKDIR /app

# Etapa 3: copiar dependências
COPY requirements.txt .

# Etapa 4: instalar dependências
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Etapa 5: copiar o restante da aplicação
COPY . .

# Etapa 6: variável de ambiente para desabilitar prompts do Django
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Etapa 7: porta exposta (padrão do Django)
EXPOSE 8000

# Etapa 8: comando de inicialização
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]