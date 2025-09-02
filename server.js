// Importar pacotes/bibliotecas
import express from "express";
import dotenv from "dotenv";

// Importar Lista de Array
import dados from "./src/data/dados.js";
const { bruxos, varinhas, pocoes, animais } = dados;

// Criar aplicação com Express e configurar para aceitar JSON
const app = express();
app.use(express.json());

// Carregar variáveis de ambiente e definir constante para porta do servidor
dotenv.config();
const serverPort = process.env.PORT || 3000;

// Rota principal GET para "/"
app.get("/", (req, res) => {
  res.send("🚀 Servidor funcionando...");
});

// Rota de varinhas com filtro query
app.get("/varinhas", (req, res) => {
  const { material, nucleo, comprimento } = req.query;
  let resultado = varinhas;

  if (material) {
    resultado = resultado.filter((b) =>
      b.material.toLowerCase().includes(material.toLowerCase())
    );
  }

  if (comprimento) {
    resultado = resultado.filter((b) =>
      b.comprimento.toLowerCase().includes(comprimento.toLowerCase())
    );
  }

  if (nucleo) {
    resultado = resultado.filter((b) =>
      b.nucleo.toLowerCase().includes(nucleo.toLowerCase())
    );
  }

  res.status(200).json({
    total: resultado.length,
    data: resultado,
  });
});

// Rota de animais com filtro query
app.get("/animais", (req, res) => {
  const { nome, tipo } = req.query;
  let resultado = animais;

  if (nome) {
    resultado = resultado.filter((b) =>
      b.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }

  if (tipo) {
    resultado = resultado.filter((b) =>
      b.tipo.toLowerCase().includes(tipo.toLowerCase())
    );
  }

  res.status(200).json({
    total: resultado.length,
    data: resultado,
  });
});

// Rota de pocoes com filtro query
app.get("/pocoes", (req, res) => {
  const { nome, efeito } = req.query;
  let resultado = pocoes;

  if (nome) {
    resultado = resultado.filter((b) =>
      b.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }

  if (efeito) {
    resultado = resultado.filter((b) =>
      b.efeito.toLowerCase().includes(efeito.toLowerCase())
    );
  }

  res.status(200).json({
    total: resultado.length,
    data: resultado,
  });
});

// rota de bruxos com filtro query
app.get("/bruxos", (req, res) => {
  const { casa, ano, especialidade, nome } = req.query;
  let resultado = bruxos;

  if (!nome || !casa) {
    res.status(404).json({
      erro: "Nome e casa são obrigatórios!",
    });
  }

  if (casa) {
    resultado = resultado.filter((b) =>
      b.casa.toLowerCase().includes(casa.toLowerCase())
    );
  }

  if (ano) {
    resultado = resultado.filter((b) => b.ano == ano);
  }

  if (especialidade) {
    resultado = resultado.filter((b) =>
      b.especialidade.toLowerCase().includes(especialidade.toLowerCase())
    );
  }

  if (nome) {
    resultado = resultado.filter((b) =>
      b.nome.toLowerCase().includes(nome.toLowerCase())
    );
  }

  res.status(200).json({
    total: resultado.length,
    data: resultado,
  });

  if (!nome || !casa) {
    res.status(4040).json({
      erro: "Nome e casa são obrigatórios!",
    });
  }
});

// Rota para criar Bruxo
app.post("/bruxos", (req, res) => {
  const { nome, casa, ano, varinha, mascote, patrono, especialidade, vivo } =
    req.body;

  console.log(nome, casa, ano, varinha, mascote, patrono, especialidade, vivo);

  if (!nome || !casa) {
    return res.status(404).json({
      sucess: false,
      message: "Nome e casa são obrigatórios para um bruxo!",
    });
  }

  const novoBruxo = {
    id: bruxos.length++,
    nome,
    casa: casa,
    ano: parseInt(ano),
    varinha: varinha,
    mascote,
    patrono,
    especialidade: especialidade || "Ainda não atribuido",
    vivo: vivo,
  };

  // adicionar na lista
  bruxos.push(novoBruxo);

  res.status(200).json({
    sucess: true,
    message: "Novo bruxo adicionado a Hogwarts!",
    data: novoBruxo,
  });
});

// Rota para criar varinha
app.post("/varinhas", (req, res) => {
  const { material, nucleo, comprimento } = req.body;

  if (!material || !nucleo || !comprimento) {
    return res.status(404).json({
      sucess: false,
      message:
        "Nucleo, material e comprimento são obrigatórios para uma varinha!",
    });
  }

  const novaVarinha = {
    id: varinhas.length++,
    material,
    nucleo,
    comprimento,
  };

  // adicionar na lista
  varinhas.push(novaVarinha);

  res.status(200).json({
    sucess: true,
    message: "Nova varinha adicionada!",
    data: novaVarinha,
  });
});

// ATIVIDADE BôNUS
app.get("/stats", (req, res) => {
  const bruxosPorCasa = {};

  // A nova variável (bruxo) a cada loop recebe todos os objetos do array
  for (const bruxo of bruxos) {
    if (bruxosPorCasa[bruxo.casa]) {
      // agora, o código verifica se o nome da casa já existe na contagem. Se já existir, quer dizer que já tem bruxos nessa casa, então soma 1
      bruxosPorCasa[bruxo.casa]++;
    } else {
      // se não existem outras casas com esse nome, então é a primeira vez que ela aparece, atribuindo o vlaor 1
      bruxosPorCasa[bruxo.casa] = 1;
    }
  }

  const materiaisDeVarinha = {};

  // percorrendo os objetos
  for (const varinha of varinhas) {
    // compara a contagem atual com aquela com mais registros
    if (materiaisDeVarinha[varinha.material]) {
      // se a contagem atual foi a maior, as variáveis serão atualizadas com o novo valor e o nome do material
      materiaisDeVarinha[varinha.material] += 1;
    } else {
      materiaisDeVarinha[varinha.material] = 1;
    }
  }

  let materialMaisComum;
  let materialQuantoSeRepete = 0;

  for (const material in materiaisDeVarinha) {
    if (materiaisDeVarinha[material] > materialQuantoSeRepete) {
      materialQuantoSeRepete = materiaisDeVarinha[material];
      materialMaisComum = material;
    }
  }

  res.status(200).json({
    bruxosPorCasa,
    materialDeVarinhaMaisComum: materialMaisComum,
  });
});

// Iniciar servidor escutando na porta definida
app.listen(serverPort, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${serverPort} 🚀`);
});