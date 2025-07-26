# Cérebro no Comando! 🧠🇬🇧

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Um site interativo para treinar inglês instrumental e se preparar para provas de proficiência com exercícios dinâmicos e desafios de vocabulário.


## 📌 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#✨-funcionalidades)
- [Demonstração](#🎮-demonstração)
- [Como Usar](#🛠️-como-usar)
- [Estrutura do Projeto](#📂-estrutura-do-projeto)
- [Desenvolvimento](#💻-desenvolvimento)
- [Contribuição](#🤝-contribuição)
- [Licença](#📜-licença)
- [Contato](#📧-contato)

## 🌟 Visão Geral

O "Cérebro no Comando!" é uma plataforma educacional que transforma o aprendizado de inglês instrumental em uma experiência gamificada, com:

- Módulos temáticos progressivos
- Sistema de feedback imediato
- Desafios cronometrados
- Acompanhamento visual do progresso
- Mascote interativo que reage às suas respostas

## ✨ Funcionalidades

### 📚 Módulos de Aprendizado
- Exercícios de múltipla escolha
- Questões verdadeiro/falso
- Perguntas abertas
- Textos de referência acadêmica

### 🎯 Desafios
- Jogo de pareamento inglês-português
- Três níveis de dificuldade
- Contagem regressiva
- Pontuação baseada no desempenho

### 📊 Progresso
- Barra de conclusão visual
- Contagem de acertos
- Desbloqueio de desafios conforme desempenho

## 🎮 Demonstração

![Demonstração do Site](demo.gif)

## 🛠️ Como Usar

1. Acesse o site [aqui](#) (link para deploy)
2. Escolha um módulo de estudo
3. Responda os exercícios sequenciais
4. Complete o módulo para desbloquear desafios
5. Melhore seu desempenho para acessar níveis mais difíceis

## 📂 Estrutura do Projeto

```
cerebro-no-comando/
├── index.html          # Página principal
├── style.css           # Estilos
├── script.js           # Lógica principal
├── img/                # Assets visuais
│   ├── cerebro_*.png   # Expressões do mascote
├── som/                # Efeitos sonoros
│   ├── som_*.mp3       # Feedback auditivo
└── data/               # Conteúdo dos módulos
    ├── data.json       # Módulo 1
    ├── data2.json      # Módulo 2
    └── ...             # Demais módulos
```

## 💻 Desenvolvimento

### Pré-requisitos
- Navegador moderno
- Servidor local para desenvolvimento (Live Server, XAMPP, etc.)

### Estrutura dos Módulos (JSON)
```json
{
  "id": "modulo1",
  "titulo": "Título do Módulo",
  "descricao": "Descrição do conteúdo",
  "texto_base": "Texto de referência...",
  "exercicios": [
    {
      "pergunta": "Pergunta?",
      "tipo": "multipla_escolha",
      "opcoes": ["A", "B", "C"],
      "resposta_correta": "B",
      "explicacao": "Explicação detalhada"
    }
  ],
  "desafios": {
    "facil": {
      "tempo_limite_segundos": 60,
      "palavras": [
        {"ingles": "apple", "portugues": "maçã"}
      ]
    }
  }
}
```

## 🤝 Contribuição

Contribuições são bem-vindas! Siga estes passos:

1. Faça um Fork do projeto
2. Crie sua Branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add new feature'`)
4. Push para a Branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📜 Licença

Distribuído sob licença MIT. Veja `LICENSE` para mais informações.

## 📧 Contato

Link do Projeto: [https://github.com/gleilsonpedro/cerebro-no-comando](github.com)

---

<div align="center">
  <sub>Criado por <a href="https://github.com/gleilsonpedro">você</a></sub>
</div>

---
