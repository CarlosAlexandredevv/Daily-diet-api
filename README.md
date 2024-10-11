# Desafio 02 Formação Node.js: API de Gerenciamento de Refeições

Fala, Dev! 😎

Sejam bem-vindos ao meu projeto desenvolvido como parte do desafio da formação de Node.js. Aqui, apliquei os conhecimentos aprendidos para construir uma API completa de gerenciamento de refeições, com funcionalidades de CRUD e métricas de dieta.

## Tecnologias Utilizadas

- **Node.js**: O ambiente de execução para criar a API.
- **Fastify**: Framework para construção de APIs de alta performance em Node.js.
- **TypeScript**: Garantindo tipagem estática e mais segurança no código.
- **Knex**: Query builder para trabalhar com bancos de dados SQL.
- **SQLite**: Banco de dados leve e fácil de configurar para persistência de dados.
- **Zod**: Biblioteca de validação de esquemas.

## Funcionalidades da API

Aqui estão as funcionalidades que implementei:

- **Criação de Usuário**: Permite registrar um novo usuário.
- **Identificação do Usuário**: A API identifica o usuário em todas as requisições.
- **Registro de Refeições**: O usuário pode registrar uma refeição com as seguintes informações:
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta
- **Edição de Refeição**: O usuário pode editar todos os dados de uma refeição registrada.
- **Remoção de Refeição**: O usuário pode apagar uma refeição.
- **Listagem de Refeições**: O usuário pode listar todas as refeições que registrou.
- **Visualização de uma Única Refeição**: Permite visualizar os detalhes de uma refeição específica.
- **Recuperação de Métricas do Usuário**: O usuário pode acessar informações sobre suas refeições:
  - Quantidade total de refeições registradas
  - Quantidade total de refeições dentro da dieta
  - Quantidade total de refeições fora da dieta
  - Melhor sequência de refeições dentro da dieta

# Rotas da API de Gerenciamento de Refeições

## 1. Rotas de Refeições

### 1.1. Criar uma Refeição

**POST** `/meals/`

- **Descrição**: Cria uma nova refeição.
- **Request Body**:
  ```json
  {
    "name": "Nome da refeição",
    "description": "Descrição detalhada da refeição",
    "mealDatetime": "Data e hora da refeição",
    "isDiet": true,
    "userId": "ID do usuário"
  }
  ````
  - **Resposta**:
   **201 Created**
    ```json
    {
      "message" "Refeição criada com sucesso"
    }

  ## 1.2. Atualizar uma Refeição
- **Método**: `PUT`
- **Endpoint**: `/meals/:id`
- **Descrição**: Atualiza os dados de uma refeição existente.
- **Request Body**:
  ```json
  {
    "name": "Nome atualizado",
    "description": "Descrição atualizada",
    "mealDatetime": "Nova data e hora",
    "isDiet": false,
    "userId": "ID do usuário"
  }
 - **Resposta**:
 - **200 OK**
    ```json
    {
      "message": "Refeição atualizada com sucesso"
    }

  - **404 Not Found**
  ```json
  {
    "message": "Refeição não encontrada ou não pertence ao usuário"
  }
```

  ## 1.3. Deletar uma Refeição
- **Método**: `DELETE`
- **Endpoint**: `/meals/:id`
- **Descrição**: Remove uma refeição existente.
- **Query Parameters**:
  - `userId`: ID do usuário que está tentando deletar a refeição.
- **Resposta**:
  - **200 OK**:
    ```json
    {
      "message": "Refeição deletada com sucesso"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Refeição não encontrada ou não pertence ao usuário"
    }
    ```

  ## 1.4. Listar Refeições de um Usuário
- **Método**: `GET`
- **Endpoint**: `/meals/user/:userId`
- **Descrição**: Recupera todas as refeições registradas para um usuário específico.
- **Parâmetros**:
  - `userId`: ID do usuário cujas refeições devem ser recuperadas.
- **Resposta**:
  - **200 OK**:
    ```json
    [
      {
        "id": "ID da refeição",
        "name": "Nome da refeição",
        "description": "Descrição da refeição",
        "mealDatetime": "Data e hora da refeição",
        "isDiet": true,
        "user_id": "ID do usuário"
      },
    ]
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Nenhuma refeição encontrada para este usuário."
    }
    ```

    ## 1.5. Recuperar uma Refeição Específica de um Usuário
- **Método**: `GET`
- **Endpoint**: `/meals/user/:userId/:id`
- **Descrição**: Recupera os detalhes de uma refeição específica associada a um usuário.
- **Parâmetros**:
  - `userId`: ID do usuário.
  - `id`: ID da refeição.
- **Resposta**:
  - **200 OK**:
    ```json
    {
      "id": "ID da refeição",
      "name": "Nome da refeição",
      "description": "Descrição da refeição",
      "mealDatetime": "Data e hora da refeição",
      "isDiet": true,
      "user_id": "ID do usuário"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Refeição não encontrada."
    }
    ```
    ## 1.6. Recuperar Métricas de Refeições de um Usuário
- **Método**: `GET`
- **Endpoint**: `/meals/user/:userId/metrics`
- **Descrição**: Recupera as métricas relacionadas às refeições de um usuário, incluindo total de refeições, refeições dentro da dieta, refeições fora da dieta e a maior sequência de refeições na dieta.
- **Parâmetros**:
  - `userId`: ID do usuário.
- **Resposta**:
  - **200 OK**:
    ```json
    {
      "totalMeals": 25,
      "totalDietMeals": 15,
      "totalNonDietMeals": 10,
      "bestDietStreak": 5
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Nenhuma refeição encontrada para este usuário."
    }
    ```
  - **500 Internal Server Error**:
    ```json
    {
      "message": "Erro ao buscar métricas."
    }
    ```

    ## 2. Rotas de Usuários

    ### 2.1. Criar um Usuário
- **Método**: `POST`
- **Endpoint**: `/users`
- **Descrição**: Cria um novo usuário.
- **Request Body**:
  ```json
  {
    "name": "Nome do usuário"
  }

 - **Resposta**:
   **201 Created**
    ```json
    {
      "message" "Usuario criada com sucesso"
    }
``
    ### 2.2. Listar Usuários
- **Método**: `GET`
- **Endpoint**: `/users`
- **Descrição**: Retorna todos os usuários cadastrados.
- **Resposta**:
  - **200 OK**:
    ```json
    [
      {
        "id": "ID do usuário",
        "name": "Nome do usuário"
      },
      {
        "id": "ID do usuário",
        "name": "Nome do usuário"
      }
    ]
``
    ### 2.3. Consultar Usuário pelo ID
- **Método**: `GET`
- **Endpoint**: `/users/:id`
- **Descrição**: Retorna os detalhes de um usuário específico com base no ID fornecido.
- **Parâmetros**:
  - `id`: O ID do usuário que será consultado.
- **Resposta**:
  - **200 OK**:
    ```json
    {
      "id": "ID do usuário",
      "name": "Nome do usuário"
    }
    ```
  - **404 Not Found**:
    ```json
    {
      "message": "Usuário não encontrado."
    }
    ```









