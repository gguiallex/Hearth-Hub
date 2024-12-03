# Hearth Hub 🏥

**Hearth Hub** é um aplicativo móvel de gestão hospitalar desenvolvido para integrar diferentes perfis de usuários em um único sistema. Ele visa otimizar a comunicação, o gerenciamento de dados e a eficiência operacional em hospitais, oferecendo suporte à tomada de decisão de forma ágil e precisa.

---

## 📋 Sumário
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Execução](#-instalação-e-execução)
- [Licença](#-licença)

---

## ✨ Funcionalidades

### 📌 Pacientes:
- Marcar consultas.
- Visualizar exames (pendentes e realizados).
- Validar a conta via e-mail.

### 📌 Médicos:
- Visualizar consultas (passadas, futuras e do dia).
- Prescrever exames.
- Monitorar o número de consultas diárias.

### 📌 Enfermeiros:
- Visualizar e atualizar status de exames.

### 📌 Administradores:
- Aprovar, rejeitar ou gerenciar funcionários.
- Gerenciar exames e especialidades.
- Visualizar gráficos operacionais:
  - **Pacientes:** Consultas por especialidade.
  - **Médicos:** Consultas por período.
  - **Enfermeiros:** Exames realizados por médico.

---

## 🛠 Tecnologias Utilizadas
- **Frontend**: [Ionic](https://ionicframework.com) v7.2, [Angular](https://angular.io) v17.0.2
- **Backend**: [Node.js](https://nodejs.org) v20.12.1, [Express](https://expressjs.com)
- **Banco de Dados**: [MySQL](https://www.mysql.com)
- **Arquitetura**: RESTful
- **Hospedagem**:
  - **Frontend e Backend**: [Vercel](https://vercel.com)
  - **Banco de Dados**: [Railway](https://railway.app)

---

## ✅ Pré-requisitos
Antes de começar, certifique-se de ter:
- [Node.js](https://nodejs.org) instalado.
- [MySQL](https://www.mysql.com) configurado e rodando.
- Gerenciador de pacotes [npm](https://www.npmjs.com) ou [yarn](https://yarnpkg.com).

---

## 🚀 Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/gguiallex/Hearth-Hub
   cd hearth-hub
   ```
2. **Instale as dependências:**
    ```bash
    npm install
    ```
3. **Configure o Banco de Dados:**
    - Atualize o arquivo `.env` com suas credenciais do MySQL.
4. **Execute o backend:**
    ```bash
    npm run start:backend
    ```
5. **Execute o frontend:**
    ```bash
    ionic serve
    ```
---

## 📜 Licença
Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.
