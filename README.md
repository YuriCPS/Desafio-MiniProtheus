# MiniProtheus

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![Angular](https://img.shields.io/badge/Angular-19-DD0031?logo=angular)](https://angular.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Entity Framework](https://img.shields.io/badge/EF_Core-8.0-512BD4?logo=dotnet)](https://learn.microsoft.com/ef/)

Aplicação full-stack de gerenciamento de produtos desenvolvida como desafio técnico para a **TOTVS**. O sistema implementa um CRUD completo com backend em **.NET 8** e frontend em **Angular 19**, seguindo boas práticas de arquitetura e desenvolvimento.

> **Demo Online:** [https://mini-protheus.yuricps.com](https://mini-protheus.yuricps.com/)

---

## Sobre o Projeto

O **MiniProtheus** é uma aplicação web para cadastro e gerenciamento de produtos, inspirada no contexto de sistemas ERP. A aplicação permite criar, visualizar, editar, excluir e buscar produtos, com suporte a campos fiscais brasileiros como **NCM**, **CEST** e **Código de Barras (EAN/GTIN)**.

---

## Tecnologias

### Backend
| Tecnologia | Versão | Descrição |
|---|---|---|
| .NET | 8.0 | Framework principal da API |
| ASP.NET Core | 8.0 | Framework web (Controllers + MVC) |
| Entity Framework Core | 8.0 | ORM para acesso a dados |
| EF Core In-Memory | 8.0 | Banco de dados em memória |
| Swagger / OpenAPI | 6.6.2 | Documentação interativa da API |

### Frontend
| Tecnologia | Versão | Descrição |
|---|---|---|
| Angular | 19.2 | Framework SPA |
| TypeScript | 5.7 | Linguagem tipada |
| RxJS | 7.8 | Programação reativa |
| Tailwind CSS | 4.2 | Framework de estilização utilitário |
| Karma + Jasmine | - | Testes unitários |

### DevOps
| Tecnologia | Descrição |
|---|---|
| Docker | Containerização com multi-stage build |

---

## Funcionalidades

- **CRUD completo de produtos** — Criar, listar, editar e excluir produtos
- **Busca em tempo real** — Pesquisa por nome ou SKU com debounce de 300ms
- **Validação dupla** — Validação no frontend (Reactive Forms) e no backend (Data Annotations + regras de negócio)
- **Campos fiscais brasileiros** — Suporte a NCM, CEST e Código de Barras (EAN-13/GTIN-14)
- **Restrição de unicidade** — SKU e Código de Barras são únicos, com tratamento de conflito (HTTP 409)
- **Hover Card** — Pré-visualização de detalhes do produto ao passar o mouse sobre a linha da tabela, com posicionamento inteligente
- **Interface responsiva** — Layout adaptável com Tailwind CSS
- **Documentação da API** — Swagger UI disponível em `/swagger`

---

## Arquitetura

### Estrutura de Pastas

```
MiniProtheus/
├── MiniProtheus.sln
│
├── MiniProtheus.Server/              # Backend (.NET 8)
│   ├── Controllers/
│   │   └── ProductsController.cs     # Endpoints REST
│   ├── Services/
│   │   └── ProductService.cs         # Lógica de negócio
│   ├── Interfaces/
│   │   └── IProductService.cs        # Contrato do serviço
│   ├── Models/
│   │   └── Product.cs                # Entidade do banco
│   ├── DTOs/
│   │   ├── CreateProductDto.cs       # Input de criação
│   │   ├── UpdateProductDto.cs       # Input de atualização
│   │   └── ProductResponseDto.cs     # Output da API
│   ├── Data/
│   │   └── AppDbContext.cs           # Contexto do EF Core
│   ├── Exceptions/
│   │   └── BusinessException.cs      # Exceção de regra de negócio
│   ├── Program.cs                    # Entry point e configuração
│   └── Dockerfile                    # Build multi-stage
│
└── miniprotheus.client/              # Frontend (Angular 19)
    └── src/app/
        ├── app.module.ts             # Módulo raiz
        ├── app-routing.module.ts     # Rotas da aplicação
        ├── models/
        │   └── product.model.ts      # Interface do produto
        ├── services/
        │   └── product.service.ts    # Client HTTP da API
        ├── products/
        │   └── products.module.ts    # Módulo lazy-loaded
        └── components/
            ├── product-list/         # Listagem com busca
            ├── product-form/         # Formulário (criar/editar)
            └── product-hover-card/   # Card de pré-visualização
```

### Padrões Utilizados

- **Service Layer Pattern** — Separação entre Controller e lógica de negócio
- **DTO Pattern** — Objetos de transferência para input/output da API
- **Repository (via DbContext)** — Acesso a dados encapsulado pelo EF Core
- **Lazy Loading** — Módulo de produtos carregado sob demanda no Angular
- **Reactive Forms** — Formulários reativos com validação declarativa

---

## API Endpoints

Base URL: `/api/products`

| Método | Rota | Descrição | Retorno |
|---|---|---|---|
| `GET` | `/api/products` | Lista todos os produtos | `200` — Lista de produtos |
| `GET` | `/api/products?search={termo}` | Busca por nome ou SKU | `200` — Lista filtrada |
| `GET` | `/api/products/{id}` | Busca produto por ID | `200` / `404` |
| `POST` | `/api/products` | Cria um novo produto | `201` / `400` / `409` |
| `PUT` | `/api/products/{id}` | Atualiza um produto | `200` / `400` / `404` / `409` |
| `DELETE` | `/api/products/{id}` | Remove um produto | `204` / `404` |

> A documentação interativa da API (Swagger) está disponível em [`/swagger`](https://mini-protheus.yuricps.com/swagger).

---

## Modelo de Dados

### Product

| Campo | Tipo | Obrigatório | Validação |
|---|---|---|---|
| `Id` | `int` | Auto | Chave primária |
| `SKU` | `string` | Sim | Máx. 50 caracteres, **único** |
| `Name` | `string` | Sim | Máx. 200 caracteres |
| `Description` | `string` | Não | Máx. 1000 caracteres |
| `Price` | `decimal` | Sim | Maior que 0, precisão 18,2 |
| `Stock` | `int` | Sim | Maior ou igual a 0 |
| `Barcode` | `string` | Não | Máx. 14 caracteres, **único** |
| `NCM` | `string` | Não | Máx. 10 caracteres (código fiscal) |
| `CEST` | `string` | Não | Máx. 9 caracteres (código fiscal) |
| `CreatedAt` | `DateTime` | Auto | Data de criação |
| `UpdatedAt` | `DateTime?` | Auto | Data da última atualização |

---

## Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) (v9+)
- [Angular CLI](https://angular.dev/tools/cli) (v19) — `npm install -g @angular/cli`

Ou apenas:
- [Docker](https://www.docker.com/)

---

## Como Executar

### Opção 1: Execução Local

**Backend:**
```bash
cd MiniProtheus.Server
dotnet restore
dotnet run --launch-profile https
```
O servidor estará disponível em `https://localhost:7278`.

**Frontend:**
```bash
cd miniprotheus.client
npm install
ng serve
```
O cliente estará disponível em `https://localhost:54470` e fará proxy das requisições `/api/*` para o backend.

### Opção 2: Docker

```bash
cd MiniProtheus.Server
docker build -f Dockerfile -t miniprotheus:latest .
docker run -p 8080:8080 -p 8081:8081 miniprotheus:latest
```
A aplicação estará disponível em `http://localhost:8080`.

---

## Demo Online

A aplicação está publicada e acessível em:

- **Aplicação:** [https://mini-protheus.yuricps.com](https://mini-protheus.yuricps.com/)
- **Swagger (API Docs):** [https://mini-protheus.yuricps.com/swagger](https://mini-protheus.yuricps.com/swagger)

---

## Testes

### Frontend
```bash
cd miniprotheus.client
npm test
```
Executa os testes unitários com Karma + Jasmine em modo watch.

---

## Rotas da Aplicação

| Rota | Componente | Descrição |
|---|---|---|
| `/products` | ProductListComponent | Listagem de produtos |
| `/products/new` | ProductFormComponent | Formulário de criação |
| `/products/edit/:id` | ProductFormComponent | Formulário de edição |

> A rota raiz (`/`) redireciona automaticamente para `/products`.

---
