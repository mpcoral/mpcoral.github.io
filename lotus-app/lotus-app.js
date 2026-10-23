const requirementChapters = [
  ["1. Operadores e autenticação", [
    ["RF001", "Cadastro de operadores: permitir cadastrar operadores do sistema."],
    ["RF002", "Senha de operador: permitir definir senha com, no mínimo, quatro caracteres."],
    ["RF003", "Ativação e inativação: permitir controlar se um operador está ativo."],
    ["RF004", "Autenticação na troca de operador: exigir senha para trocar o operador em uso."],
    ["RF005", "Identificação das operações: registrar o operador responsável pelas operações relevantes."],
    ["RF006", "Histórico do operador: preservar a identificação do operador nos registros históricos pertinentes."],
    ["RF007", "Identificação de operações automáticas: identificar o operador sistêmico como (AUTO) nos fechamentos automáticos de caixa."]
  ]],
  ["2. Cadastro e gerenciamento de produtos", [
    ["RF008", "Cadastro de produtos: permitir cadastrar produtos com código único e nome obrigatório."],
    ["RF009", "Validação de preço: exigir preço de venda superior a zero."],
    ["RF010", "Cadastro de custo: permitir cadastrar custo unitário igual ou superior a zero."],
    ["RF011", "Estoque mínimo: permitir definir o estoque mínimo de cada produto."],
    ["RF012", "Produto por unidade ou caixa: permitir cadastrar produtos vendidos por unidade ou por caixa."],
    ["RF013", "Custo unitário por caixa: calcular o custo unitário com base no custo da caixa e na quantidade de unidades por caixa."],
    ["RF014", "Indicadores comerciais: calcular lucro unitário, margem e markup a partir dos dados do produto."],
    ["RF015", "Proteção de informações gerenciais: exibir custo, lucro, margem e markup no card do produto somente para o perfil gerente."],
    ["RF016", "Inativação de produtos: permitir desativar produtos sem eliminar seu histórico de vendas."]
  ]],
  ["3. Estoque, lotes, validade e perdas", [
    ["RF017", "Cadastro de lotes: permitir cadastrar lotes vinculados aos produtos."],
    ["RF018", "Validade obrigatória do lote: exigir informação de validade no cadastro do lote."],
    ["RF019", "Controle de estoque por lote: manter o estoque associado aos respectivos lotes."],
    ["RF020", "Seleção de lote na venda: exigir a identificação de um lote para registrar a venda."],
    ["RF021", "Critério FEFO: priorizar o lote com vencimento mais próximo quando aplicável à seleção automática."],
    ["RF022", "Venda com estoque insuficiente: permitir concluir uma venda mesmo quando o estoque disponível for insuficiente."],
    ["RF023", "Estoque negativo: permitir que o saldo de estoque fique negativo após uma venda."],
    ["RF024", "Aviso de estoque baixo: sinalizar visualmente produtos com estoque abaixo do mínimo."],
    ["RF025", "Aviso de validade: sinalizar produtos vencidos e próximos do vencimento."],
    ["RF026", "Filtro de validade próxima: permitir filtrar lotes com vencimento próximo, considerando a janela de 30 dias prevista no sistema."],
    ["RF027", "Registro de perdas: permitir registrar perda de produtos informando produto, quantidade e lote."],
    ["RF028", "Motivo da perda: exigir o motivo do registro de perda."],
    ["RF029", "Validação da perda por lote: impedir o registro de perda superior ao estoque disponível no lote selecionado."]
  ]],
  ["4. Vendas, carrinho e cupons", [
    ["RF030", "Busca de produtos: permitir localizar produtos para adicionar à venda."],
    ["RF031", "Inclusão de itens: permitir adicionar produtos ao carrinho e apresentar feedback visual da inclusão."],
    ["RF032", "Quantidade vendida: permitir definir a quantidade de cada item da venda."],
    ["RF033", "Desconto percentual: permitir aplicar desconto percentual aos itens."],
    ["RF034", "Cálculo do total: calcular o valor da venda considerando quantidades e descontos."],
    ["RF035", "Venda por caixa: permitir registrar vendas de produtos cadastrados no formato caixa."],
    ["RF036", "Baixa de estoque: reduzir o estoque correspondente quando a venda é concluída."],
    ["RF037", "Persistência da venda: salvar os dados da venda no banco de dados."],
    ["RF038", "Persistência do cupom: armazenar o cupom da venda como registro para consulta posterior."],
    ["RF039", "Consulta de vendas: permitir consultar as vendas pelo histórico."],
    ["RF040", "Reimpressão ou consulta de cupom: permitir abrir o cupom persistido a partir dos registros disponíveis."],
    ["RF041", "Cancelamento pelo histórico: permitir solicitar o cancelamento de uma venda pelo histórico."],
    ["RF042", "Registro do cancelamento: preservar o registro da venda cancelada, incluindo a ação e a observação informada."],
    ["RF043", "Restauração do estoque: restaurar o estoque associado aos itens de uma venda cancelada."]
  ]],
  ["5. Pagamentos, valores recebidos e troco", [
    ["RF044", "Formas de pagamento: permitir pagamentos em dinheiro, PIX, débito, crédito e FIADO/A prazo."],
    ["RF045", "Pagamento misto: permitir combinar diferentes formas de pagamento em uma venda."],
    ["RF046", "Valores por forma de pagamento: permitir informar os valores destinados às formas de pagamento utilizadas."],
    ["RF047", "Valor entregue em dinheiro: considerar o valor total entregue pelo cliente para calcular o troco."],
    ["RF048", "Cálculo de troco: calcular o troco quando o pagamento em dinheiro exceder o valor que deve ser coberto por dinheiro, em uma venda sem FIADO."],
    ["RF049", "Bloqueio de excesso sem dinheiro: impedir que um excedente de pagamento seja tratado como troco quando não houver dinheiro na composição do pagamento."],
    ["RF050", "Normalização do dinheiro: calcular o valor líquido em dinheiro após descontar o troco."],
    ["RF051", "Registro financeiro consistente: distinguir o valor bruto recebido do valor líquido retido pelo caixa."],
    ["RF052", "Entrada líquida no caixa: contabilizar no caixa apenas o valor líquido correspondente ao dinheiro recebido."],
    ["RF053", "Registro do troco: manter o valor do troco disponível para consulta e auditoria."],
    ["RF054", "Exibição de troco no cupom: apresentar o troco no cupom quando aplicável."]
  ]],
  ["6. FIADO, recebíveis e pagamentos a prazo", [
    ["RF055", "Venda a prazo: permitir concluir uma venda com pagamento FIADO/A prazo, sem recebimento imediato dessa parcela."],
    ["RF056", "Baixa de estoque no FIADO: reduzir o estoque normalmente quando a venda a prazo é concluída."],
    ["RF057", "Registro da dívida: criar um registro de dívida vinculado à venda a prazo."],
    ["RF058", "Cliente obrigatório: exigir a identificação do cliente para registrar FIADO."],
    ["RF059", "FIADO em pagamento misto: permitir combinar FIADO com outras formas de pagamento."],
    ["RF060", "FIADO automático: calcular automaticamente o FIADO como o saldo restante após considerar as outras formas de pagamento."],
    ["RF061", "FIADO não editável no misto: não exigir que o operador informe manualmente o valor calculado do FIADO."],
    ["RF062", "Parcela única de FIADO: permitir apenas uma linha de FIADO na composição de pagamento misto."],
    ["RF063", "Sem troco com FIADO: não calcular troco quando houver FIADO na composição do pagamento."],
    ["RF064", "Sem entrada imediata no caixa: não contabilizar a parcela FIADO como dinheiro recebido no momento da venda."],
    ["RF065", "Recebimento parcial: permitir receber parte de uma dívida sem encerrá-la."],
    ["RF066", "Saldo após recebimento parcial: manter a dívida em aberto com o saldo restante atualizado."],
    ["RF067", "Quitação da dívida: encerrar a dívida quando o saldo for totalmente pago."],
    ["RF068", "Histórico de recebimentos: registrar os recebimentos posteriores da dívida."],
    ["RF069", "Métodos de recebimento: permitir receber FIADO por dinheiro, PIX, débito, crédito ou composição de métodos compatível com o fluxo de recebimento."],
    ["RF070", "Recebimento em dinheiro: registrar no caixa o valor líquido efetivamente recebido em dinheiro durante a quitação de FIADO."],
    ["RF071", "Cancelamento de FIADO: tratar o registro de dívida vinculado quando a venda correspondente é cancelada."],
    ["RF072", "Separação de pendências: manter as dívidas FIADO separadas dos recebíveis de cartão/crédito parcelado."]
  ]],
  ["7. Cadastro e histórico de clientes", [
    ["RF073", "Cadastro de clientes: permitir cadastrar clientes manualmente."],
    ["RF074", "Criação automática de cliente: permitir criar um cadastro de cliente durante uma venda a prazo quando necessário."],
    ["RF075", "Nome obrigatório e telefone opcional: exigir nome do cliente e permitir que o telefone fique em branco."],
    ["RF076", "Busca de clientes: permitir pesquisar clientes por nome ou telefone."],
    ["RF077", "Edição de clientes: permitir atualizar dados de clientes cadastrados."],
    ["RF078", "Inativação de clientes: permitir remover clientes das buscas normais sem apagar o histórico relacionado."],
    ["RF079", "Filtro de devedores: permitir filtrar clientes que possuem dívidas a prazo em aberto."],
    ["RF080", "Saldo por cliente: exibir o saldo de FIADO em aberto de cada cliente e destacá-lo visualmente quando houver dívida."],
    ["RF081", "Histórico de compras a prazo: permitir abrir o histórico de FIADO do cliente, com compras abertas e pagas, valor original, valor pago e saldo pendente."]
  ]],
  ["8. Controle e fechamento de caixa", [
    ["RF082", "Abertura de caixa: permitir abrir o caixa informando o saldo inicial."],
    ["RF083", "Suprimento: permitir registrar entradas adicionais de dinheiro no caixa."],
    ["RF084", "Sangria: permitir registrar retiradas de dinheiro do caixa."],
    ["RF085", "Integração de vendas em dinheiro: integrar as vendas pagas em dinheiro ao histórico do caixa."],
    ["RF086", "Integração de pagamentos mistos: considerar somente a parcela líquida de dinheiro das vendas com pagamento misto."],
    ["RF087", "Exclusão de valores não recebidos: não contabilizar FIADO nem troco devolvido como receita de caixa."],
    ["RF088", "Saldo esperado: calcular o saldo esperado do caixa a partir do saldo inicial, suprimentos, sangrias e entradas líquidas."],
    ["RF089", "Fechamento com contagem física: permitir informar a contagem física do dinheiro disponível."],
    ["RF090", "Diferença de fechamento: apresentar a diferença entre o saldo esperado e o valor contado."],
    ["RF091", "Histórico de fechamentos: preservar os registros de fechamentos anteriores, inclusive os automáticos."],
    ["RF092", "Fechamento automático: registrar o fechamento automático do caixa quando ocorre a virada do dia."],
    ["RF093", "Movimentações do caixa: permitir consultar os movimentos registrados, com informações de data e valores."]
  ]],
  ["9. Testers", [
    ["RF094", "Quantidade de testers: permitir definir a quantidade de testers vinculados a um produto."],
    ["RF095", "Geração de testers: gerar os registros de testers correspondentes à quantidade definida."],
    ["RF096", "Status de tester: permitir controlar os status ATIVO, ACABOU e SUMIU."],
    ["RF097", "Histórico de eventos: registrar o histórico de alterações de status dos testers."],
    ["RF098", "Observações de testers: permitir registrar observações relacionadas aos testers."],
    ["RF099", "Identificação do operador: manter a identificação do operador nos eventos pertinentes de testers."],
    ["RF100", "Inativação automática: inativar os testers vinculados quando o produto correspondente for desativado."],
    ["RF101", "Proteção de testers inativos: impedir alterações de status em testers inativos."],
    ["RF102", "Consulta de testers com problemas: apresentar a quantidade consolidada de testers com status ACABOU ou SUMIU, considerando somente registros ativos."]
  ]],
  ["10. Relatórios e situação atual", [
    ["RF103", "Filtros por período: permitir consultar relatórios diários, semanais, mensais, anuais e por período personalizado."],
    ["RF104", "Filtro por operador: permitir filtrar relatórios por todos os operadores ou por um operador específico."],
    ["RF105", "Atualização automática: atualizar os relatórios quando os filtros forem alterados."],
    ["RF106", "Navegação de datas: permitir navegar entre datas e períodos usando controles de avanço e retorno."],
    ["RF107", "Período personalizado: permitir informar datas de início e fim para consulta."],
    ["RF108", "Card de recebíveis: apresentar os recebíveis pendentes de cartão/crédito parcelado, sem misturá-los com FIADO."],
    ["RF109", "Recebíveis por vencimento: permitir consultar recebíveis agrupados por data de vencimento."],
    ["RF110", "Card de FIADO: apresentar o total das dívidas a prazo em aberto."],
    ["RF111", "Consulta de FIADO: listar as dívidas em aberto da mais antiga para a mais recente e permitir pesquisar os registros."],
    ["RF112", "Recebimento pelo relatório: permitir acessar o fluxo de recebimento de uma dívida a partir do relatório."],
    ["RF113", "Consulta de cupom em modal: permitir abrir o cupom de uma venda a partir dos registros apresentados nos relatórios."],
    ["RF114", "Card de validade: permitir consultar os detalhes dos produtos e lotes sinalizados por validade."],
    ["RF115", "Card de estoque mínimo: permitir consultar os produtos abaixo do estoque mínimo."],
    ["RF116", "Card de testers: permitir abrir os detalhes dos testers com problemas."],
    ["RF117", "Resumo de vendas por pagamento: apresentar a distribuição das vendas por forma de pagamento, incluindo FIADO como categoria separada."],
    ["RF118", "Valores efetivamente recebidos: manter os relatórios financeiros de caixa coerentes com os valores líquidos efetivamente recebidos, sem tratar FIADO ou troco como entrada de dinheiro."]
  ]],
  ["11. Indicadores e análise de lucro", [
    ["RF119", "Lucro unitário no cadastro: calcular automaticamente o lucro unitário no cadastro e na edição de produtos."],
    ["RF120", "Indicadores restritos ao gerente: restringir a visualização de custo, lucro, margem e markup nos cards de produtos ao perfil gerente."],
    ["RF121", "Card de lucro: apresentar um card de lucro na área de situação atual dos relatórios."],
    ["RF122", "Filtro do lucro: calcular os indicadores do relatório de lucro conforme o período e o operador selecionados."],
    ["RF123", "Separação entre lucro e caixa: não tratar o lucro como entrada de dinheiro no caixa."],
    ["RF124", "Lucro de venda a prazo: considerar a venda a prazo na data em que a venda ocorre."],
    ["RF125", "Recebimento posterior: não contabilizar novamente o lucro da venda quando uma dívida a prazo for recebida."],
    ["RF126", "Cancelamento e lucro: excluir vendas canceladas da apuração de lucro."],
    ["RF127", "Descontos na apuração: considerar os descontos concedidos ao calcular o resultado dos itens vendidos."],
    ["RF128", "Indicadores do relatório de lucro: apresentar indicadores de lucro, valor vendido, custo, margem e prejuízo."],
    ["RF129", "Visão por venda: permitir consultar o resultado financeiro agrupado por venda."],
    ["RF130", "Visão por item: permitir consultar o resultado por item vendido."],
    ["RF131", "Ranking por produto: apresentar ranking de produtos por lucro."],
    ["RF132", "Filtros de resultado: permitir filtrar resultados por todos, lucro ou prejuízo."],
    ["RF133", "Destaque de resultados: distinguir visualmente resultados positivos, negativos e neutros."],
    ["RF134", "Consulta do cupom pelo lucro: permitir abrir o cupom persistido da venda a partir do relatório de lucro."],
    ["RF135", "Indicador de prejuízo: apresentar a quantidade de vendas com prejuízo e o maior prejuízo do período."]
  ]],
  ["12. Gráficos", [
    ["RF136", "Painel de gráficos: disponibilizar uma tela específica para consulta gráfica dos indicadores do sistema."],
    ["RF137", "Indicadores de vendas: permitir visualizar métricas como total de vendas, faturamento, itens vendidos e cancelamentos."],
    ["RF138", "Agrupamento temporal: apresentar os dados em agregações diárias, semanais, mensais ou anuais, conforme o modo selecionado."],
    ["RF139", "Navegação por período: permitir navegar entre janelas temporais dos gráficos."],
    ["RF140", "Atualização dos gráficos: atualizar a visualização quando o período ou modo de consulta for alterado."]
  ]],
  ["13. Exportação, impressão e backup", [
    ["RF141", "Exportação para Excel: permitir exportar os dados disponibilizados pelo sistema para arquivo Excel."],
    ["RF142", "Impressão de cupom: permitir imprimir o cupom da venda."],
    ["RF143", "Backup manual: permitir criar uma cópia do banco de dados em local escolhido pelo usuário."],
    ["RF144", "Identificação do backup: permitir salvar a cópia com nome distinto do banco em uso."],
    ["RF145", "Preservação do cupom: permitir consultar ou reimprimir o cupom persistido sem reconstruí-lo a partir dos dados atuais do produto."]
  ]]
].map(([title, rows]) => ({
  title,
  items: rows.map(([id, text]) => ({ id, text }))
}));

const requirementsContainer = document.getElementById("requirements-list");

requirementChapters.forEach((chapter, index) => {
  const details = document.createElement("details");
  details.className = "group";

  const summary = document.createElement("summary");
  summary.innerHTML = `
<span class="group-number">${String(index + 1).padStart(2, "0")}</span>
<span class="group-title"></span>
<span class="count">${chapter.items.length} requisitos</span>
<span class="chevron" aria-hidden="true">+</span>
  `;

  summary.querySelector(".group-title").textContent = chapter.title;

  const panel = document.createElement("div");
  panel.className = "group-panel";

  const list = document.createElement("ol");
  list.className = "req-list";

  chapter.items.forEach(item => {
    const li = document.createElement("li");
    li.className = "req-item";

    const id = document.createElement("span");
    id.className = "req-id";
    id.textContent = item.id;

    const text = document.createElement("span");
    text.className = "req-text";
    text.textContent = item.text;

    li.append(id, text);
    list.appendChild(li);
  });

  panel.appendChild(list);
  details.append(summary, panel);
  requirementsContainer.appendChild(details);
});

document.getElementById("open-all").addEventListener("click", () => {
  document.querySelectorAll(".group").forEach(group => {
    group.open = true;
  });
});

document.getElementById("close-all").addEventListener("click", () => {
  document.querySelectorAll(".group").forEach(group => {
    group.open = false;
  });
});