# Performancy CRM

Uma aplicação moderna de gestão de vendas com integração ao Zoho CRM.

![Performancy Dashboard](./docs/screenshot.png)

## 🚀 Funcionalidades

- **Dashboard de Vendas**: Visualize métricas em tempo real do seu pipeline
- **Kanban Board**: Arraste e solte deals entre os estágios
- **Integração Zoho CRM**: Sincronize automaticamente com sua conta Zoho
- **Distribuição por Stage**: Acompanhe o valor total em cada etapa do funil
- **Métricas Avançadas**: Pipeline total, weighted pipeline, taxa de conversão

## 📋 Requisitos

- Node.js 18+
- NPM ou Yarn
- Conta Zoho CRM (opcional, para integração)

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <repo-url>
cd performancy-crm
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse [http://localhost:3000](http://localhost:3000)

## 🔗 Configuração do Zoho CRM

### Passo 1: Criar uma aplicação no Zoho

1. Acesse [api-console.zoho.com](https://api-console.zoho.com)
2. Clique em "Add Client"
3. Selecione "Self Client"
4. Anote o **Client ID** e **Client Secret**

### Passo 2: Gerar o Refresh Token

1. No API Console, vá para a aplicação criada
2. Clique em "Generate Code"
3. No campo Scope, insira:
   ```
   ZohoCRM.modules.ALL,ZohoCRM.settings.ALL
   ```
4. Defina o tempo de expiração e clique em "Create"
5. Copie o código gerado

6. Faça uma requisição POST para obter o Refresh Token:
   ```bash
   curl -X POST https://accounts.zoho.com/oauth/v2/token \
     -d "grant_type=authorization_code" \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET" \
     -d "code=YOUR_CODE"
   ```

7. Copie o **refresh_token** da resposta

### Passo 3: Configurar na aplicação

1. Acesse a página de Configurações na aplicação
2. Insira suas credenciais
3. Clique em "Salvar Configurações"
4. Teste a conexão

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx              # Página principal (Funil)
│   ├── configuracoes/        # Página de configurações
│   ├── layout.tsx            # Layout principal
│   └── globals.css           # Estilos globais
├── components/
│   ├── Sidebar.tsx           # Navegação lateral
│   ├── MetricCard.tsx        # Cards de métricas
│   ├── StageDistribution.tsx # Distribuição por stage
│   ├── KanbanBoard.tsx       # Kanban board principal
│   ├── KanbanColumn.tsx      # Colunas do kanban
│   └── DealCard.tsx          # Cards de deals
├── services/
│   └── zoho.ts               # Serviço de integração Zoho
├── store/
│   └── index.ts              # Estado global (Zustand)
└── types/
    └── index.ts              # Definições de tipos
```

## 🎨 Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilos utilitários
- **Zustand** - Gerenciamento de estado
- **@dnd-kit** - Drag and Drop
- **Recharts** - Gráficos
- **Lucide React** - Ícones
- **Axios** - Requisições HTTP

## 📊 Estágios do Pipeline

| Estágio | Probabilidade |
|---------|---------------|
| Lead | 10% |
| Discovery | 20% |
| Qualified | 40% |
| Proposal | 60% |
| Negotiation | 80% |
| Closed Won | 100% |
| Closed Lost | 0% |

## 🔐 Segurança

- As credenciais do Zoho são armazenadas localmente no navegador
- Tokens são renovados automaticamente
- Comunicação via HTTPS com a API do Zoho

## 📝 Scripts

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Gera a build de produção
npm run start    # Inicia o servidor de produção
npm run lint     # Executa o linter
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

