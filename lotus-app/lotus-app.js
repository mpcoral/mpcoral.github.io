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

// ==========================================
// REQUISITOS EM INGLÊS
// Mesma ordem dos capítulos e itens em português (os IDs não mudam).
// ==========================================

const requirementChaptersEn = [
  ["1. Operators and authentication", [
    "Operator registration: allow registering system operators.",
    "Operator password: allow setting a password with at least four characters.",
    "Activation and deactivation: allow controlling whether an operator is active.",
    "Authentication when switching operators: require a password to switch the operator in use.",
    "Operation tracking: record the operator responsible for relevant operations.",
    "Operator history: keep the operator's identification in the relevant historical records.",
    "Automatic operations: identify the system operator as (AUTO) in automatic cash register closings."
  ]],
  ["2. Product registration and management", [
    "Product registration: allow registering products with a unique code and a required name.",
    "Price validation: require a sale price greater than zero.",
    "Cost registration: allow a unit cost equal to or greater than zero.",
    "Minimum stock: allow setting each product's minimum stock.",
    "Product by unit or box: allow registering products sold by unit or by box.",
    "Unit cost per box: calculate the unit cost from the box cost and the number of units per box.",
    "Business indicators: calculate unit profit, margin and markup from the product data.",
    "Protecting management data: show cost, profit, margin and markup on the product card only to the manager profile.",
    "Product deactivation: allow deactivating products without deleting their sales history."
  ]],
  ["3. Stock, batches, expiry and losses", [
    "Batch registration: allow registering batches linked to products.",
    "Required batch expiry: require an expiry date when registering a batch.",
    "Stock control by batch: keep stock tied to its batches.",
    "Batch selection on sale: require a batch to be identified to record the sale.",
    "FEFO rule: prioritize the batch with the nearest expiry when selection is automatic.",
    "Sale with insufficient stock: allow completing a sale even when available stock is insufficient.",
    "Negative stock: allow the stock balance to go negative after a sale.",
    "Low stock alert: visually flag products with stock below the minimum.",
    "Expiry alert: flag expired products and those close to expiring.",
    "Upcoming expiry filter: allow filtering batches close to expiring, using the system's 30-day window.",
    "Loss registration: allow recording product losses with product, quantity and batch.",
    "Loss reason: require the reason for the loss.",
    "Batch loss validation: prevent recording a loss greater than the stock available in the selected batch."
  ]],
  ["4. Sales, cart and receipts", [
    "Product search: allow finding products to add to the sale.",
    "Adding items: allow adding products to the cart with visual feedback.",
    "Quantity sold: allow setting the quantity of each item in the sale.",
    "Percentage discount: allow applying a percentage discount to items.",
    "Total calculation: calculate the sale total considering quantities and discounts.",
    "Sale by box: allow recording sales of products registered as boxes.",
    "Stock deduction: reduce the matching stock when the sale is completed.",
    "Sale persistence: save the sale data to the database.",
    "Receipt persistence: store the sale receipt as a record for later lookup.",
    "Sales lookup: allow looking up sales in the history.",
    "Receipt reprint or lookup: allow opening the stored receipt from the available records.",
    "Cancellation from history: allow requesting a sale's cancellation from the history.",
    "Cancellation record: keep the record of the canceled sale, including the action and the note entered.",
    "Stock restoration: restore the stock tied to the items of a canceled sale."
  ]],
  ["5. Payments, amounts received and change", [
    "Payment methods: allow payments by cash, PIX, debit, credit and store credit.",
    "Split payment: allow combining different payment methods in one sale.",
    "Amount per method: allow entering the amount for each payment method used.",
    "Cash handed over: use the total cash handed over by the customer to calculate change.",
    "Change calculation: calculate change when cash exceeds the amount it must cover, in a sale without store credit.",
    "No excess without cash: prevent a payment excess from being treated as change when there is no cash in the payment.",
    "Cash normalization: calculate the net cash amount after deducting change.",
    "Consistent financial record: distinguish the gross amount received from the net amount kept in the register.",
    "Net register entry: count in the register only the net amount of cash received.",
    "Change record: keep the change amount available for lookup and auditing.",
    "Change on the receipt: show the change on the receipt when applicable."
  ]],
  ["6. Store credit, receivables and deferred payments", [
    "Credit sale: allow completing a sale with store credit, without immediate payment of that part.",
    "Stock deduction on credit: reduce stock normally when a credit sale is completed.",
    "Debt record: create a debt record linked to the credit sale.",
    "Customer required: require the customer to be identified to record store credit.",
    "Credit in split payment: allow combining store credit with other payment methods.",
    "Automatic credit: calculate the store credit as the balance left after the other payment methods.",
    "Credit not editable in split payment: don't require the operator to enter the calculated credit amount.",
    "Single credit line: allow only one store credit line in a split payment.",
    "No change with credit: don't calculate change when store credit is part of the payment.",
    "No immediate register entry: don't count the store credit part as cash received at the time of sale.",
    "Partial payment: allow receiving part of a debt without closing it.",
    "Balance after partial payment: keep the debt open with the updated remaining balance.",
    "Debt settlement: close the debt when the balance is fully paid.",
    "Payment history: record later payments made on the debt.",
    "Payment methods for debts: allow receiving store credit by cash, PIX, debit, credit or a compatible combination.",
    "Cash payments: record in the register the net amount actually received in cash when settling store credit.",
    "Credit cancellation: handle the linked debt record when the matching sale is canceled.",
    "Separate pending items: keep store credit debts separate from card and installment receivables."
  ]],
  ["7. Customer registration and history", [
    "Customer registration: allow registering customers manually.",
    "Automatic customer creation: allow creating a customer record during a credit sale when needed.",
    "Required name, optional phone: require the customer's name and allow the phone to be left blank.",
    "Customer search: allow searching customers by name or phone.",
    "Customer editing: allow updating the data of registered customers.",
    "Customer deactivation: allow removing customers from regular searches without deleting their history.",
    "Debtor filter: allow filtering customers with open credit debts.",
    "Balance per customer: show each customer's open credit balance and highlight it when there is debt.",
    "Credit purchase history: allow opening a customer's credit history, with open and paid purchases, original amount, amount paid and remaining balance."
  ]],
  ["8. Cash register control and closing", [
    "Opening the register: allow opening the register with an initial balance.",
    "Cash supply: allow recording additional cash added to the register.",
    "Cash withdrawal: allow recording cash taken out of the register.",
    "Cash sales integration: include cash sales in the register history.",
    "Split payment integration: count only the net cash part of split-payment sales.",
    "Excluding amounts not received: don't count store credit or change given back as register income.",
    "Expected balance: calculate the expected register balance from the initial balance, supplies, withdrawals and net income.",
    "Closing with a physical count: allow entering the physical count of available cash.",
    "Closing difference: show the difference between the expected balance and the counted amount.",
    "Closing history: keep the records of previous closings, including automatic ones.",
    "Automatic closing: record the automatic closing of the register when the day changes.",
    "Register movements: allow looking up recorded movements, with date and amounts."
  ]],
  ["9. Testers", [
    "Tester quantity: allow setting the number of testers linked to a product.",
    "Tester generation: generate the tester records for the defined quantity.",
    "Tester status: allow controlling the ACTIVE, RAN OUT and MISSING statuses.",
    "Event history: record the history of tester status changes.",
    "Tester notes: allow recording notes about testers.",
    "Operator identification: keep the operator's identification in the relevant tester events.",
    "Automatic deactivation: deactivate the linked testers when the matching product is deactivated.",
    "Protecting inactive testers: prevent status changes on inactive testers.",
    "Problem testers lookup: show the total of testers marked RAN OUT or MISSING, counting only active records."
  ]],
  ["10. Reports and current status", [
    "Period filters: allow daily, weekly, monthly, yearly and custom-period reports.",
    "Operator filter: allow filtering reports by all operators or a specific one.",
    "Automatic refresh: refresh the reports when the filters change.",
    "Date navigation: allow moving between dates and periods with forward and back controls.",
    "Custom period: allow entering start and end dates for the lookup.",
    "Receivables card: show pending card and installment receivables, without mixing them with store credit.",
    "Receivables by due date: allow looking up receivables grouped by due date.",
    "Store credit card: show the total of open credit debts.",
    "Store credit lookup: list open debts from oldest to newest and allow searching the records.",
    "Payment from the report: allow opening a debt's payment flow from the report.",
    "Receipt in a dialog: allow opening a sale's receipt from the records shown in the reports.",
    "Expiry card: allow looking up the details of products and batches flagged for expiry.",
    "Minimum stock card: allow looking up products below the minimum stock.",
    "Testers card: allow opening the details of problem testers.",
    "Sales by payment method: show the breakdown of sales by payment method, with store credit as a separate category.",
    "Amounts actually received: keep cash reports consistent with the net amounts actually received, without treating store credit or change as cash income."
  ]],
  ["11. Indicators and profit analysis", [
    "Unit profit on registration: automatically calculate unit profit when registering and editing products.",
    "Manager-only indicators: restrict the display of cost, profit, margin and markup on product cards to the manager profile.",
    "Profit card: show a profit card in the current status area of the reports.",
    "Profit filter: calculate the profit report indicators for the selected period and operator.",
    "Profit vs. cash: don't treat profit as cash entering the register.",
    "Profit on credit sales: count a credit sale on the date the sale happens.",
    "Later payment: don't count the sale's profit again when a credit debt is paid.",
    "Cancellation and profit: exclude canceled sales from the profit calculation.",
    "Discounts in the calculation: account for the discounts given when calculating item results.",
    "Profit report indicators: show profit, amount sold, cost, margin and loss indicators.",
    "View by sale: allow looking up the financial result grouped by sale.",
    "View by item: allow looking up the result per item sold.",
    "Product ranking: show a ranking of products by profit.",
    "Result filters: allow filtering results by all, profit or loss.",
    "Highlighting results: visually distinguish positive, negative and neutral results.",
    "Receipt from the profit report: allow opening the sale's stored receipt from the profit report.",
    "Loss indicator: show the number of sales at a loss and the biggest loss in the period."
  ]],
  ["12. Charts", [
    "Charts panel: provide a dedicated screen for viewing the system's indicators as charts.",
    "Sales indicators: allow viewing metrics such as total sales, revenue, items sold and cancellations.",
    "Time grouping: show the data grouped by day, week, month or year, depending on the selected mode.",
    "Period navigation: allow moving between time windows in the charts.",
    "Chart refresh: update the view when the period or lookup mode changes."
  ]],
  ["13. Export, printing and backup", [
    "Excel export: allow exporting the data provided by the system to an Excel file.",
    "Receipt printing: allow printing the sale receipt.",
    "Manual backup: allow creating a copy of the database in a location chosen by the user.",
    "Backup naming: allow saving the copy with a name different from the database in use.",
    "Receipt preservation: allow looking up or reprinting the stored receipt without rebuilding it from the current product data."
  ]]
];

const requirementLabels = {
  pt: { count: (n) => `${n} requisitos` },
  en: { count: (n) => `${n} requirements` }
};

const requirementsContainer = document.getElementById("requirements-list");

// Monta os capítulos no idioma atual, mantendo os que estavam abertos.
function renderRequirements(lang) {
  const openChapters = [...requirementsContainer.querySelectorAll(".group")]
    .map((group) => group.open);

  requirementsContainer.replaceChildren();

  requirementChapters.forEach((chapter, index) => {
    const english = lang === "en" ? requirementChaptersEn[index] : null;

    const details = document.createElement("details");
    details.className = "group";
    details.open = Boolean(openChapters[index]);

    const summary = document.createElement("summary");
    summary.innerHTML = `
<span class="group-number">${String(index + 1).padStart(2, "0")}</span>
<span class="group-title"></span>
<span class="count"></span>
<span class="chevron" aria-hidden="true">+</span>
    `;

    summary.querySelector(".group-title").textContent = english ? english[0] : chapter.title;
    summary.querySelector(".count").textContent =
      (requirementLabels[lang] || requirementLabels.pt).count(chapter.items.length);

    const panel = document.createElement("div");
    panel.className = "group-panel";

    const list = document.createElement("ol");
    list.className = "req-list";

    chapter.items.forEach((item, itemIndex) => {
      const li = document.createElement("li");
      li.className = "req-item";

      const id = document.createElement("span");
      id.className = "req-id";
      id.textContent = item.id;

      const text = document.createElement("span");
      text.className = "req-text";
      text.textContent = english ? english[1][itemIndex] : item.text;

      li.append(id, text);
      list.appendChild(li);
    });

    panel.appendChild(list);
    details.append(summary, panel);
    requirementsContainer.appendChild(details);
  });
}

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

// ==========================================
// TOUR DAS TELAS DO APP
// O bonequinho e a troca das telas ficam em js/screen-tour.js.
// Telas com vários prints ganham vidros no card: cada vidro
// quebrado pelo bonequinho troca para o próximo print.
// ==========================================

const SCREENS_PATH = "../assets/lotus/images/";

const tourScreens = [
  {
    name: { pt: "Produtos", en: "Products" },
    description: { pt: "Cadastro, lotes e indicadores", en: "Registration, batches and indicators" },
    images: [SCREENS_PATH + "products.png"],
    points: [
      { pt: "Lucro, margem e markup calculados no cadastro, visíveis só para o perfil gerente.", en: "Profit, margin and markup calculated on registration, visible only to the manager profile." },
      { pt: "Produtos por unidade ou por caixa, com o custo unitário calculado sozinho.", en: "Products by unit or by box, with the unit cost calculated automatically." },
      { pt: "Registro de perdas por lote, com motivo obrigatório.", en: "Loss records by batch, with a required reason." }
    ]
  },
  {
    name: { pt: "Histórico de vendas", en: "Sales history" },
    description: { pt: "Cupons e cancelamentos", en: "Receipts and cancellations" },
    images: [SCREENS_PATH + "sales-history.png"],
    points: [
      { pt: "Cada venda guarda o cupom como foi impresso, sem recalcular com preços novos.", en: "Each sale keeps the receipt as it was printed, without recalculating with new prices." },
      { pt: "Cancelar uma venda devolve os itens ao lote de origem.", en: "Canceling a sale returns the items to their original batch." },
      { pt: "O cancelamento fica registrado com a observação informada.", en: "The cancellation is recorded along with the note entered." }
    ]
  },
  {
    name: { pt: "Caixa", en: "Cash register" },
    description: { pt: "Abertura, sangria e fechamento", en: "Opening, withdrawals and closing" },
    images: [SCREENS_PATH + "cash-register-1.png", SCREENS_PATH + "cash-register-2.png"],
    points: [
      { pt: "O saldo esperado considera só o dinheiro que entrou, sem fiado e sem troco.", en: "The expected balance only counts the cash that came in, without store credit or change." },
      { pt: "Fechamento com contagem física e a diferença calculada na hora.", en: "Closing with a physical count and the difference calculated on the spot." },
      { pt: "Fecha sozinho na virada do dia, registrado como (AUTO).", en: "Closes on its own when the day changes, recorded as (AUTO)." }
    ]
  },
  {
    name: { pt: "Relatórios", en: "Reports" },
    description: { pt: "Fechamentos e situação atual", en: "Closings and current status" },
    images: [
      SCREENS_PATH + "reports-1.png",
      SCREENS_PATH + "reports-2.png",
      SCREENS_PATH + "reports-3.png"
    ],
    points: [
      { pt: "Filtros por dia, semana, mês, ano ou período, e por operador.", en: "Filters by day, week, month, year or period, and by operator." },
      { pt: "Recebíveis, fiado, lucro, estoque mínimo, validade e testers em cards.", en: "Receivables, store credit, profit, minimum stock, expiry and testers in cards." },
      { pt: "Exportação para Excel e backup do banco com um clique.", en: "Excel export and database backup with one click." }
    ]
  },
  {
    name: { pt: "Gráficos", en: "Charts" },
    description: { pt: "Evolução das vendas", en: "Sales over time" },
    images: [SCREENS_PATH + "charts-1.png", SCREENS_PATH + "charts-2.png"],
    points: [
      { pt: "Total de vendas, faturamento, cancelamentos e itens mais vendidos.", en: "Total sales, revenue, cancellations and best-selling items." },
      { pt: "Agrupamento diário, semanal, mensal ou anual.", en: "Daily, weekly, monthly or yearly grouping." },
      { pt: "Navegação entre períodos pelas setas do gráfico.", en: "Navigation between periods with the chart arrows." }
    ]
  }
];

// Textos do tour e da apresentação de vídeo em cada idioma.
const interfaceLabels = {
  pt: {
    tour: { zoom: "Ampliar imagem", enlarged: "Imagem ampliada", close: "Fechar", screen: "Tela de", part: "parte" },
    presentation: { moreLabel: "Ver mais", lessLabel: "Ver menos", highlightsLabel: "DESTAQUES DO VÍDEO", closeLabel: "Fechar apresentação" }
  },
  en: {
    tour: { zoom: "Enlarge image", enlarged: "Enlarged image", close: "Close", screen: "Screen:", part: "part" },
    presentation: { moreLabel: "See more", lessLabel: "See less", highlightsLabel: "VIDEO HIGHLIGHTS", closeLabel: "Close presentation" }
  }
};

// As telas com os textos do idioma atual.
function screensIn() {
  return tourScreens.map((screen) => ({
    name: I18n.pick(screen.name),
    description: I18n.pick(screen.description),
    images: screen.images,
    points: screen.points.map((point) => I18n.pick(point))
  }));
}

const tour = ScreenTour.create(document.getElementById("screen-tour"), screensIn(), {
  labels: interfaceLabels[I18n.lang].tour
});

// ==========================================
// TROCA DE IDIOMA
// O i18n.js traduz o HTML; aqui ficam os textos criados pelo JavaScript.
// ==========================================

I18n.onChange((lang) => {
  renderRequirements(lang);
  tour.update(screensIn(), interfaceLabels[lang].tour);
  VideoPresentation.setDefaults(interfaceLabels[lang].presentation);
});
