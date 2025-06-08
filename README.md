# Relatório Técnico - [Felipe de Melo Brito]

## 1. Visão Geral da Solução

Este projeto consistiu na recuperação e finalização de uma aplicação de gerenciamento de tarefas em Angular. O trabalho envolveu desde a correção de erros críticos que impediam a inicialização do projeto até a implementação de novas funcionalidades, passando pela resolução de uma lista extensa de bugs de funcionalidade e usabilidade. O objetivo foi transformar um código instável e incompleto em uma aplicação robusta, funcional e com uma experiência de usuário aprimorada.

## 2. Como Executar a Aplicação

Para executar a aplicação em um ambiente de desenvolvimento local, siga os passos abaixo:

1.  **Clonar o Repositório**
    ```bash
    git clone https://github.com/felipemelo11/desafio-imts-gerenciador-tarefas.git
    cd desafio-imts-gerenciador-tarefas
    ```

2.  **Instalar as Dependências**
    *É necessário ter o Node.js e o npm instalados.*
    ```bash
    npm install
    ```

3.  **Executar a Aplicação**
    *O comando `npm start` iniciará o servidor de desenvolvimento.*
    ```bash
    npm start
    ```
    A aplicação estará disponível em `http://localhost:4200/`.

## 3. Correção dos Erros Iniciais (npm start)

A aplicação, no estado em que foi recebida, não iniciava com o comando `npm start`. A investigação inicial revelou múltiplos problemas que foram corrigidos:

* **Script `start` Ausente:** O arquivo `package.json` não possuía o script `start`.
    * **Solução:** Adicionado `"start": "ng serve"` à seção de scripts do `package.json`.
* **Comando `ng` não reconhecido:** O Angular CLI não estava instalado globalmente, impedindo o sistema de reconhecer o comando `ng`.
    * **Solução:** Executada a instalação global do Angular CLI com `npm install -g @angular/cli`.
* **Dependências não instaladas:** O diretório `node_modules` estava ausente.
    * **Solução:** Executado o comando `npm install` para baixar todas as dependências do projeto listadas no `package.json`.
* **Erros de Compilação:** Após a instalação das dependências, a aplicação ainda apresentava diversos erros de compilação:
    * **Typo no Componente:** `HeaderComponent` era chamado, mas estava declarado como `HeadeComponent`. Corrigido em `src/app/layout/header/header.component.ts`.
    * **Módulo de Rotas Ausente:** O `RouterModule` não era importado no `AppModule`, causando erro no uso do `<router-outlet>`. Corrigido com a importação do `AppRoutingModule` em `src/app/app.module.ts`.
    * **Componente Quebrado:** `NewTaskComponent` não possuía o decorador `@Component` e não importava o `TodoService`. Corrigido em `src/app/todo/new-task/new-task.component.ts`.
    * **Pacote de Ícones Ausente:** O `angular.json` referia-se ao pacote `@fortawesome/fontawesome-free`, que não estava listado nas dependências. Corrigido com a instalação via `npm install @fortawesome/fontawesome-free`.

## 4. Relatório de Correção de Bugs

A seguir, a descrição de cada bug da lista do QA, sua causa raiz e a solução implementada.

* **Tarefa adicionada duas vezes:**
    * **Causa:** Chamada duplicada do método `this.todoService.addTodo()` no arquivo `new-task.component.ts`.
    * **Solução:** Removida uma das chamadas ao método.

* **Só era possível salvar uma tarefa por vez:**
    * **Causa:** Uma lógica de controle com uma variável `count` impedia que o método `addTask()` fosse executado mais de uma vez.
    * **Solução:** A variável `count` e toda a lógica de bloqueio associada foram removidas do `new-task.component.ts`.

* **Botão de limpar tarefas com texto em inglês:**
    * **Causa:** O getter `labelClearAll` em `todo.component.ts` retornava a string "Clear All".
    * **Solução:** O retorno do getter foi alterado para "Limpar Tarefas Concluídas".

* **Botões de "Exibir/Ocultar Tarefas Concluídas" com comportamento invertido:**
    * **Causa:** A expressão ternária no `todo.component.html` exibia o texto oposto ao estado real da aplicação.
    * **Solução:** Os textos da expressão ternária foram invertidos para corresponderem corretamente à ação do botão.

* **"Limpar Tarefas Concluídas" sem confirmação:**
    * **Causa:** A função `clearCompletedTasks()` em `todo.component.ts` executava a ação diretamente.
    * **Solução:** A lógica foi envolvida em uma chamada ao `SweetAlert2` para pedir confirmação ao usuário antes de prosseguir.

* **"Limpar Tarefas Concluídas" removendo tarefas erradas:**
    * **Causa:** O método `.filter()` no `todo.service.ts` estava mantendo as tarefas concluídas (`completed === true`) em vez das não concluídas.
    * **Solução:** A lógica do filtro foi corrigida para `!completed`, mantendo apenas as tarefas não concluídas.

* **Botão "Editar" não funcional:**
    * **Causa:** Nenhuma lógica de edição estava implementada.
    * **Solução:** Foi implementado um fluxo de comunicação entre componentes:
        1.  O `TodoItemComponent` emite um evento (`@Output`) quando "Editar" é clicado.
        2.  O `TodoService` gerencia o estado da tarefa em edição usando um `BehaviorSubject`.
        3.  O `NewTaskComponent` se inscreve nesse estado para preencher o formulário e alternar entre os modos de criação e edição.
        4.  O método `updateTodo` no serviço foi ajustado para atualizar o título da tarefa.

* **Botão "Editar" desalinhado:**
    * **Causa:** O contêiner dos botões de ação (`.todo-item_actions-container`) não possuía estilização para alinhar seus filhos.
    * **Solução:** Adicionado `display: flex` e `gap` ao contêiner em `todo-item.component.css` para alinhar os botões lado a lado.

* **Botão "Remover" sem a cor vermelha:**
    * **Causa:** Um estilo inline (`style="color: black"`) no `todo-item.component.html` estava sobrescrevendo a cor definida no CSS.
    * **Solução:** O atributo de estilo inline foi removido do botão, permitindo que a cor vermelha do arquivo `.css` fosse aplicada.

* **Lista sem barra de rolagem:**
    * **Causa:** O contêiner da lista (`.todo-list_container`) não tinha altura máxima nem a propriedade `overflow` definidas.
    * **Solução:** Adicionadas as propriedades `max-height: 400px` e `overflow-y: auto` ao contêiner em `todo.component.css`.

* **Salvando tarefas em branco (vazio ou com espaços):**
    * **Causa:** O método `addTask()` em `new-task.component.ts` não validava o conteúdo do campo de texto.
    * **Solução:** Adicionada uma verificação `if (!this.newTaskTitle.trim())` no início da função para impedir a criação de tarefas com título inválido.

## 5. Relatório de Implementação de Melhorias

* **Ordenar de A a Z:**
    * **Abordagem:** Um botão foi adicionado ao `todo.component.html` que chama o método `sortByName()`. Este método usa a função `Array.prototype.sort()` com `localeCompare()` para reordenar o array de tarefas visíveis alfabeticamente.

* **Adicionar tarefa com a tecla Enter:**
    * **Abordagem:** O evento `(keyup.enter)` foi adicionado ao campo de input em `new-task.component.html`, chamando o mesmo método `addTask()` utilizado pelo botão "Salvar".

* **Adição de múltiplas tarefas com `|`:**
    * **Abordagem:** A lógica em `addTask()` foi modificada. Ela agora usa `this.newTaskTitle.split('|')` para criar um array de títulos. Um loop `forEach` itera sobre esse array, validando e adicionando uma tarefa para cada título não vazio.

* **Filtro de palavras obscenas:**
    * **Abordagem:** Utilizada a biblioteca `bad-words`. A verificação `filter.isProfane()` foi adicionada ao método `addTask()` antes de criar ou atualizar uma tarefa. Caso uma palavra imprópria seja detectada, um alerta do `SweetAlert2` é exibido e a ação é bloqueada.

* **Exportar para PDF:**
    * **Abordagem:** Utilizada a biblioteca `jsPDF`. Um botão "Exportar para PDF" foi adicionado, que chama o método `exportToPDF()`. Este método instancia um novo documento PDF, adiciona um título e itera sobre a lista de tarefas, adicionando cada uma como uma linha de texto no documento antes de salvá-lo.

* **Alertas e confirmações com SweetAlert:**
    * **Abordagem:** Utilizada a biblioteca `sweetalert2`. Todas as chamadas nativas `alert()` e `confirm()` foram substituídas por chamadas a `Swal.fire()`, com ícones, textos e botões customizados para uma experiência de usuário mais moderna e agradável. Isso incluiu uma melhoria extra, não listada, de adicionar confirmação ao remover tarefas individuais.

## 6. Relatório de Débito Técnico

Todos os bugs e melhorias listados na especificação do desafio foram concluídos com sucesso. Não há débitos técnicos em relação aos requisitos solicitados.

## 7. Relatório de Melhorias

A aplicação agora é estável, mas pode ser evoluída com diversas funcionalidades, como:
* **Persistência de Dados em Backend:** Substituir o `localStorage` por uma API REST conectada a um banco de dados real (ex: Node.js + Express + PostgreSQL/MongoDB).
* **Autenticação de Usuários:** Permitir que múltiplos usuários tenham suas próprias listas de tarefas privadas.
* **Categorias ou Tags:** Adicionar a possibilidade de categorizar tarefas para melhor organização.
* **Datas de Vencimento e Prioridades:** Implementar campos de data e níveis de prioridade (baixa, média, alta) nas tarefas.
* **Melhorias de Acessibilidade (a11y):** Realizar uma auditoria de acessibilidade para garantir que a aplicação seja utilizável por pessoas com deficiências.
* **Testes Automatizados:** Implementar testes unitários (com Karma/Jasmine) e de ponta a ponta (com Cypress ou Protractor) para garantir a qualidade e estabilidade do código a longo prazo.

## 8. Decisões e Considerações (Opcional)

Optei por utilizar um `BehaviorSubject` no `TodoService` para gerenciar o estado da tarefa em edição. Essa abordagem, em vez de passar dados via `@Input`, desacopla os componentes `TodoItem` e `NewTask`, tornando a arquitetura mais limpa e escalável para futuras manutenções.
