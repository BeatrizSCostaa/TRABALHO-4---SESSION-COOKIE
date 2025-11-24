import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const host = "localhost";
const port = 3000;
var listaProdutos = [];

const server = express();

server.use(
  session({
    secret: "Minh4S3nhaS3cr3t4",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 15,
    },
  })
);

server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.get("/", (req, resp) => {
  resp.redirect("/menuinicial");
});
server.get("/menuinicial", (req, resp) => {
  let ultimoacesso = req.cookies?.ultimoacesso;

  const data = new Date();
  resp.cookie("ultimoacesso", data);

  resp.setHeader("Content-Type", "text/html; charset=UTF-8");
  resp.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Menu Inicial</title>

        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
    </head>

    <body> 
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">

          <a class="navbar-brand" href="/">MENU</a>

          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">

              <li class="nav-item">
                <a class="nav-link" href="/menuinicial">Home</a>
              </li>

              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                  Cadastros
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="/cadastroProduto">Cadastrar Produto</a></li>
                  <li><a class="dropdown-item" href="/listarProdutos">Listar Produtos Cadastrados</a></li>
                </ul>
              </li>

              <li class="nav-item">
                <a class="nav-link" href="/login">Login</a>
              </li>

              <li class="nav-item">
                <a class="nav-link" href="/logout">Logout</a>
              </li>

            </ul>
          </div>

          <div class="container-fluid">
            <div class="d-flex">
              <div class="p-2 ms-auto" style="color: white;">
                <p>Último Acesso: ${ultimoacesso || "Primeiro acesso"}</p>
            </div>
          </div>
        </div>
          
          </div>
          </div>

        </div>
      </nav>

      <div class="container mt-4">
        <h1>Bem-vindo ao sistema!</h1>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
  `);

  resp.end();
});

server.get("/login", (req, resp) => {
  resp.send(`

  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login</title>

      <link rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
      
      <style>
        body {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f7f7f7;
        }
        .card {
          width: 380px;
        }
      </style>
  </head>

  <body>

    <div class="card shadow">
      <div class="card-body">
        <h3 class="text-center mb-4">Login</h3>

        <form action="/efetuarLogin" method="POST">

          <div class="form-group">
            <label for="login">Usuário</label>
            <input type="text" id="login" name="login" class="form-control" placeholder="Digite o usuário">
          </div>

          <div class="form-group">
            <label for="senha">Senha</label>
            <input type="password" id="senha" name="senha" class="form-control" placeholder="Digite a senha">
          </div>

          <button type="submit" class="btn btn-primary btn-block mt-3">
            Entrar
          </button>

        </form>

      </div>
    </div>

  </body>
  </html>
  `);
});

server.post("/efetuarLogin", (req, resp) => {
  const login = req.body.login;
  const senha = req.body.senha;

  if (login && senha) {
    req.session.dadosLogin = {
      usuarioLogado: true,
      nome: login,
    };
    resp.redirect("/menuinicial");
  } else {
    let conteudologin = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login</title>

      <link rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
      
      <style>
        body {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f7f7f7;
        }
        .card {
          width: 380px;
        }
      </style>
  </head>

  <body>

    <div class="card shadow">
      <div class="card-body">
        <h3 class="text-center mb-4">Login</h3>

        <form action="/efetuarLogin" method="POST">
`;

    conteudologin += `
  <div class="form-group">
    <label for="login">Usuário</label>
    <input type="text" id="login" name="login" class="form-control" value="${login}" placeholder="Digite o usuário">
  </div>
`;

    if (!login) {
      conteudologin += `
    <p class="text-danger">Por favor, insira o login.</p>
  `;
    }

    conteudologin += `
  <div class="form-group">
    <label for="senha">Senha</label>
    <input type="password" id="senha" name="senha" class="form-control" value="${senha}" placeholder="Digite a senha">
  </div>
`;

    if (!senha) {
      conteudologin += `
    <p class="text-danger">Por favor, insira a senha.</p>
  `;
    }

    conteudologin += `
  <button type="submit" class="btn btn-primary btn-block mt-3">
    Entrar
  </button>

  </form>

      </div>
    </div>

  </body>
  </html>
`;

    resp.send(conteudologin);
  }
});

// validação de login = verificar se o usuário está logado
function verificarUsuarioLogado(req, resp, proximo) {
  if (!req.session.dadosLogin || !req.session.dadosLogin.usuarioLogado) {
    return resp.send(`
      <h3>Você precisa realizar o login para acessar esta página.</h3>
      <a href="/login">Clique aqui para fazer login</a>
    `);
  }
  proximo();
}
server.get("/logout", (req, resp) => {
  resp.send(`
    <link rel="stylesheet"
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">

    <div class="container mt-5">
      <h3>Você saiu do sistema.</h3>
      <a href="/menuinicial" class="btn btn-primary mt-3">Voltar ao Menu</a>
    </div>
  `);
});

server.get("/cadastroProduto", verificarUsuarioLogado, (req, resp) => {
  resp.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cadastro de Produtos</title>

      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" 
        rel="stylesheet"
      />
    </head>

    <body class="bg-light">

      <div class="container mt-5">
        <div class="card shadow-lg p-4">
          <h2 class="text-center mb-4">Cadastro de Produto</h2>

          <form action="/produtoscadastrados" method="POST">

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Código de Barras</label>
                <input type="text" class="form-control" name="codigoBarras" required>
              </div>

              <div class="col-md-6">
                <label class="form-label">Descrição</label>
                <input type="text" class="form-control" name="descricao" required>
              </div>
            </div>

            <div class="row g-3 mt-3">
              <div class="col-md-4">
                <label class="form-label">Preço de Custo (R$)</label>
                <input type="number" step="0.01" class="form-control" name="precoCusto" required>
              </div>

              <div class="col-md-4">
                <label class="form-label">Preço de Venda (R$)</label>
                <input type="number" step="0.01" class="form-control" name="precoVenda" required>
              </div>

              <div class="col-md-4">
                <label class="form-label">Data de Validade</label>
                <input type="date" class="form-control" name="validade" required>
              </div>
            </div>

            <div class="row g-3 mt-3">
              <div class="col-md-6">
                <label class="form-label">Quantidade em Estoque</label>
                <input type="number" class="form-control" name="estoque" required>
              </div>

              <div class="col-md-6">
                <label class="form-label">Nome do Fabricante</label>
                <input type="text" class="form-control" name="fabricante" required>
              </div>
            </div>

            <div class="row mt-4">
              <div class="col-md-6">
                <button type="submit" class="btn btn-primary w-100"> Cadastrar </button>
              </div>

              <div class="col-md-6">
                <a href="/menuinicial" class="btn btn-secondary w-100"> Voltar </a>
              </div>
            </div>

          </form>
        </div>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
  `);
});

server.post("/produtoscadastrados", verificarUsuarioLogado, (req, resp) => {
  const codigoBarras = req.body.codigoBarras;
  const descricao = req.body.descricao;
  const precoCusto = req.body.precoCusto;
  const precoVenda = req.body.precoVenda;
  const validade = req.body.validade;
  const estoque = req.body.estoque;
  const fabricante = req.body.fabricante;

  if (
    codigoBarras &&
    descricao &&
    precoCusto &&
    precoVenda &&
    validade &&
    estoque &&
    fabricante
  ) {
    listaProdutos.push({
      codigoBarras,
      descricao,
      precoCusto,
      precoVenda,
      validade,
      estoque,
      fabricante,
    });

    console.log("Produto cadastrado com sucesso:", descricao);
    resp.redirect("/listarProdutos");
  } else {
    // Reexibir formulário com mensagens de erro e valores preenchidos
    let conteudo = `
      <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cadastro de Produto</title>

      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" 
        rel="stylesheet"
      />
    </head>

    <body class="bg-light">

      <div class="container mt-5">
        <div class="card shadow-lg p-4">
          <h2 class="text-center mb-4">Cadastro de Produto</h2>

          <form action="/produtoscadastrados" method="POST">

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Código de Barras</label>
                <input type="text" class="form-control" name="codigoBarras" value="${
                  codigoBarras || ""
                }">
              </div>`;

    if (!codigoBarras) {
      conteudo += `
            <div>
                <p class="text-danger">Por favor, informe o código de barras.</p>
            </div>
        `;
    }

    conteudo += `
              <div class="col-md-6">
                <label class="form-label">Descrição</label> 
                <input type="text" class="form-control" name="descricao" value="${
                  descricao || ""
                }">
              </div>`;

    if (!descricao) {
      conteudo += ` 
              <div>
                <p class="text-danger">Por favor, informe a descrição.</p>
              </div>
        `;
    }

    conteudo += `
            <div class="row g-3 mt-3">
              <div class="col-md-4">
                <label class="form-label">Preço de Custo (R$)</label>
                <input type="number" step="0.01" class="form-control" name="precoCusto" value="${
                  precoCusto || ""
                }">
              </div>

              <div class="col-md-4">
                <label class="form-label">Preço de Venda (R$)</label>
                <input type="number" step="0.01" class="form-control" name="precoVenda" value="${
                  precoVenda || ""
                }">
              </div>

              <div class="col-md-4">
                <label class="form-label">Data de Validade</label>
                <input type="date" class="form-control" name="validade" value="${
                  validade || ""
                }">
              </div>
            </div>
    `;

    if (!precoCusto) {
      conteudo += `
              <div>
                <p class = "text-danger">Por favor, informe o preço de custo.</p>
              </div>
            `;
    }

    if (!precoVenda) {
      conteudo += `
              <div>
                <p class = "text-danger">Por favor, informe o preço de venda.</p>
              </div>
            `;
    }

    if (!validade) {
      conteudo += `
              <div>
                <p class = "text-danger">Por favor, informe a data de validade.</p>
              </div>
            `;
    }

    conteudo += `
            <div class="row g-3 mt-3">
              <div class="col-md-6">
                <label class="form-label">Quantidade em Estoque</label>
                <input type="number" class="form-control" name="estoque" value="${
                  estoque || ""
                }">
              </div>
            `;

    if (!estoque) {
      conteudo += `
                <div>
                  <p class = "text-danger">Por favor, informe a quantidade em estoque.</p>
                </div>
                `;
    }

    conteudo += `

              <div class="col-md-6">
                <label class="form-label">Nome do Fabricante</label>
                <input type="text" class="form-control" name="fabricante" value="${
                  fabricante || ""
                }">
              </div>
            </div>

            `;

    if (!fabricante) {
      conteudo += `
              <div>
                <p class = "text-danger">Por favor, informe o fabricante.</p>
              </div>  
            `;
    }

    conteudo += `

            <div class="row mt-4">
              <div class="col-md-6">
              <button type="submit" class="btn btn-primary w-100"> Cadastrar </button>
            </div>

            <div class="col-md-6">
              <a href="/menuinicial" class="btn btn-secondary w-100"> Voltar </a>
            </div>
      </div>
          </form>
        </div>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
    `;

    resp.send(conteudo);
  }
});

server.get("/listarProdutos", (req, resp) => {
  const ultimo = req.cookies?.ultimoacesso || "Primeiro acesso";

  let conteudo = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <title>Lista de Produtos</title>
    <link rel="stylesheet"
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
  </head>

  <body>
  <div class="container mt-5">
    <h2>Produtos Cadastrados</h2>
    <table class="table table-bordered">
      <thead class="thead-dark">
        <tr>
          <th>Código de Barras</th>
          <th>Descrição</th>
          <th>Preço Custo (R$)</th>
          <th>Preço Venda (R$)</th>
          <th>Validade</th>
          <th>Estoque</th>
          <th>Fabricante</th>
        </tr>
      </thead>
      <tbody>`;

  for (let i = 0; i < listaProdutos.length; i++) {
    conteudo += `
      <tr>
        <td>${listaProdutos[i].codigoBarras}</td>
        <td>${listaProdutos[i].descricao}</td>
        <td>${listaProdutos[i].precoCusto}</td>
        <td>${listaProdutos[i].precoVenda}</td>
        <td>${listaProdutos[i].validade}</td>
        <td>${listaProdutos[i].estoque}</td>
        <td>${listaProdutos[i].fabricante}</td>
      </tr>`;
  }

  conteudo += `
      </tbody>
    </table>
    <div class="text-left mt-3">
        <a href="/cadastroProduto" class="btn btn-secondary btn-sm">Voltar</a>
    </div>
  </div>
  </body>
  </html>`;

  resp.send(conteudo);
});

server.listen(port, host, () => {
  console.log(`Servidor rodando em http://${host}:${port}/menuinicial`);
});
