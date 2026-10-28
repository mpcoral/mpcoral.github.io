document.addEventListener("DOMContentLoaded", () => {

    const elementCards = document.querySelectorAll(".element-card");

    const detailSection = document.getElementById("element-detail");
    const detailTitle = document.getElementById("element-detail-title");
    const detailDescription = document.getElementById("element-detail-description");
    const detailIndex = document.getElementById("element-detail-index");
    const detailMedia = document.getElementById("element-detail-media");

    if (
        !elementCards.length ||
        !detailSection ||
        !detailTitle ||
        !detailDescription ||
        !detailIndex ||
        !detailMedia
    ) {
        return;
    }

    // ==========================================
    // SISTEMAS COM VÍDEOS
    // Cada chave corresponde ao data-system de um card no pirate.html.
    // O título e a descrição do card ficam no próprio HTML.
    //
    // Em cada vídeo:
    //   summary     Resumo curto exibido na apresentação.
    //   highlights  Funções ou momentos do vídeo, exibidos no "Ver mais".
    //               O name aparece no botão e o text ao clicar nele.
    // ==========================================

    const systems = {
        "wave-system": {
            context: "WAVE SYSTEM / PRESENTATION",

            videos: [
                {
                    file: "gm-core-2x.mp4",
                    number: "01",
                    title: "GM Core",
                    description:
                        "A lógica central do sistema de ondas, incluindo o fluxo " +
                        "de execução e a organização das etapas.",
                    label: "GAME MODE · WAVE LOGIC",

                    summary:
                        "O GM_Core é o Game Mode que comanda as ondas: ele encontra os " +
                        "spawners do mapa, divide os inimigos de cada onda entre eles " +
                        "e decide quando a próxima começa.",

                    highlights: [
                        {
                            name: "NextWave",
                            text:
                                "Evento que inicia cada onda. Ele chama o Split Enemies " +
                                "para preparar os inimigos e depois dispara o Event " +
                                "Dispatcher StartGameMsg, que avisa todos os spawners " +
                                "ao mesmo tempo. No início da partida, um som marca a " +
                                "chegada da primeira onda."
                        },
                        {
                            name: "Split Enemies",
                            text:
                                "Pega a onda atual no array Waves e divide a quantidade " +
                                "de cada inimigo pelo número de spawners, com o Division " +
                                "(Whole and Remainder). A parte inteira vai para todos, e " +
                                "o resto é distribuído um a um, para nenhum inimigo se " +
                                "perder na divisão."
                        },
                        {
                            name: "Clear Spawns",
                            text:
                                "Antes de distribuir uma nova onda, percorre os spawners " +
                                "e limpa a lista To Spawn de cada um, para que nada da " +
                                "onda anterior fique para trás."
                        },
                        {
                            name: "CheckingSpawners",
                            text:
                                "Um Timer em loop pergunta a cada 2 segundos se todos os " +
                                "spawners já criaram seus inimigos. Quando terminam, esse " +
                                "Timer é cancelado e outro passa a vigiar o fim da onda."
                        },
                        {
                            name: "WaveIsDone?",
                            text:
                                "Função Pure usada pelo evento CheckingWave para saber se " +
                                "ainda há inimigos vivos. Com a onda vencida, o CurrentWave " +
                                "é comparado ao total de ondas: se houver outra, o contador " +
                                "sobe e o NextWave é chamado; se não, aparece a tela de vitória."
                        }
                    ]
                },
                {
                    file: "enemy-spawn-2x.mp4",
                    number: "02",
                    title: "Enemy Spawn",
                    description:
                        "A configuração dos spawners e a lógica utilizada " +
                        "para definir a quantidade e a seleção dos inimigos.",
                    label: "BLUEPRINTS · ENEMY SPAWN",

                    summary:
                        "Cada BP_EnemySpawn recebe a sua parte da onda e cria os " +
                        "inimigos aos poucos, em intervalos aleatórios, escolhendo " +
                        "o tipo de cada um.",

                    highlights: [
                        {
                            name: "StartGameMsg",
                            text:
                                "No início, o spawner encontra o GM_Core e se inscreve no " +
                                "Event Dispatcher StartGameMsg com um Bind Event. Assim, o " +
                                "Game Mode avisa todos os spawners de uma vez, sem precisar " +
                                "conhecer cada um."
                        },
                        {
                            name: "StartingSpawn",
                            text:
                                "Cria um Timer em loop, com intervalo aleatório entre 3 e 6 " +
                                "segundos, que dispara o evento Spawn. O handle do Timer fica " +
                                "guardado para ele poder ser cancelado depois."
                        },
                        {
                            name: "Enemies Amount",
                            text:
                                "Função Pure que soma quantos inimigos ainda faltam criar. " +
                                "O evento Spawn confere esse número a cada disparo e, quando " +
                                "ele chega a zero, cancela o próprio Timer."
                        },
                        {
                            name: "Select Enemy",
                            text:
                                "Escolhe qual inimigo criar com um sorteio por peso: o tipo " +
                                "com mais unidades restantes tem mais chance de sair. Depois, " +
                                "desconta uma unidade dele e devolve a classe escolhida."
                        },
                        {
                            name: "SpawnActor",
                            text:
                                "Cria o inimigo sorteado na posição do spawner, com a colisão " +
                                "configurada para ajustar o local e sempre nascer, mesmo se o " +
                                "espaço estiver ocupado."
                        }
                    ]
                },
                {
                    file: "spawning-2x.mp4",
                    number: "03",
                    title: "Sistema em execução",
                    description:
                        "Demonstração prática do nascimento dos inimigos " +
                        "e da distribuição das ondas durante o gameplay.",
                    label: "GAMEPLAY · WAVE SYSTEM",

                    summary:
                        "Os spawners são colocados no mapa, as ondas são configuradas " +
                        "no GM_Core e o resultado aparece no jogo, com inimigos surgindo " +
                        "em pontos diferentes da ilha.",

                    highlights: [
                        {
                            name: "Spawners no mapa",
                            text:
                                "Os BP_EnemySpawn são atores colocados direto na cena. Para " +
                                "criar um novo ponto de surgimento, basta arrastar outro para " +
                                "o mapa: o GM_Core encontra todos sozinho."
                        },
                        {
                            name: "Array Waves",
                            text:
                                "As ondas ficam em um array da struct ST Waves, editado nos " +
                                "detalhes do GM_Core. Cada onda lista os tipos de inimigo e a " +
                                "quantidade de cada um, então mudar a dificuldade não exige " +
                                "mexer na lógica."
                        },
                        {
                            name: "Inimigos em jogo",
                            text:
                                "Na partida, os inimigos saem de vários spawners em intervalos " +
                                "diferentes, o que evita que a onda inteira apareça de uma vez " +
                                "no mesmo lugar."
                        }
                    ]
                }
            ]
        },

        "enemy-ai": {
            context: "ENEMY AI / PRESENTATION",

            videos: [
                {
                    file: "enemy-target-spots.mp4",
                    number: "01",
                    title: "Escolha do alvo",
                    description:
                        "O AI Controller encontra os Target Spots ao redor do navio, " +
                        "reserva um ponto livre e usa o jogador como alvo quando não há espaço.",
                    label: "AI CONTROLLER · TARGET SPOTS",

                    summary:
                        "O AI Controller espalha os inimigos ao redor do navio: cada um " +
                        "reserva um ponto livre para atacar e, se não houver espaço, " +
                        "vai atrás do jogador.",

                    highlights: [
                        {
                            name: "BP_TargetSpot",
                            text:
                                "Ator simples posicionado em volta do navio. A seta indica " +
                                "para onde o inimigo deve virar ao chegar, e a variável " +
                                "Filled? diz se o ponto já tem dono."
                        },
                        {
                            name: "On Possess",
                            text:
                                "Quando o AI Controller assume o inimigo, guarda a referência " +
                                "a ele, busca todos os Target Spots do mapa e se inscreve no " +
                                "aviso de morte do inimigo antes de procurar um alvo."
                        },
                        {
                            name: "Try To Catch A Target",
                            text:
                                "Percorre os Target Spots com um For Each Loop with Break e " +
                                "reserva o primeiro livre, marcando Filled?. Se todos estiverem " +
                                "ocupados, o alvo passa a ser o jogador."
                        },
                        {
                            name: "Go to Target",
                            text:
                                "Usa o AI MoveTo para levar o inimigo até o alvo. Ao chegar, " +
                                "ele vira na direção da seta do Spot com o Turn Forward e " +
                                "ataca; se o caminho falhar, espera um pouco e tenta de novo."
                        },
                        {
                            name: "IsDead",
                            text:
                                "Quando o inimigo morre, o Target Spot que ele ocupava é " +
                                "liberado, abrindo espaço para o próximo inimigo da onda."
                        }
                    ]
                },
                {
                    file: "enemy-attack-trace.mp4",
                    number: "02",
                    title: "Ataque ao navio",
                    description:
                        "O golpe do inimigo usa um Line Trace e aplica dano " +
                        "quando atinge o jogador ou o navio.",
                    label: "BLUEPRINTS · ENEMY ATTACK",

                    summary:
                        "O golpe do inimigo é detectado ao longo da espada e só causa " +
                        "dano quando a lâmina encosta no jogador ou no navio.",

                    highlights: [
                        {
                            name: "Attack",
                            text:
                                "Inicia um Timer em loop bem curto, de 0,01 segundo, que chama " +
                                "o StartTrace várias vezes durante a animação, acompanhando a " +
                                "espada quadro a quadro."
                        },
                        {
                            name: "StartTrace",
                            text:
                                "Faz um Line Trace By Channel entre dois sockets da espada, da " +
                                "base até a ponta, ignorando o próprio inimigo. Assim, o dano " +
                                "depende de a lâmina realmente acertar."
                        },
                        {
                            name: "Jogador ou navio",
                            text:
                                "O Break Hit Result entrega o ator atingido, e um OR compara a " +
                                "classe dele com BP_Player e BP_Ship. Incluir o navio foi um " +
                                "acréscimo meu, fora do curso, para ele também receber dano."
                        },
                        {
                            name: "Apply Damage",
                            text:
                                "Aplica 20 de dano ao ator atingido. No navio, o dano vai " +
                                "descontando a vida dele, e quando ela chega a zero a partida " +
                                "termina em derrota."
                        }
                    ]
                },
                {
                    file: "ship-defense-gameplay.mp4",
                    number: "03",
                    title: "Defesa em ação",
                    description:
                        "Os inimigos surgem, cercam o navio e atacam " +
                        "enquanto o jogador defende a posição.",
                    label: "GAMEPLAY · SHIP DEFENSE",

                    summary:
                        "Com tudo ligado, os inimigos surgem perto do píer, cercam o " +
                        "navio e atacam enquanto o jogador tenta defendê-lo.",

                    highlights: [
                        {
                            name: "Spawner no píer",
                            text:
                                "Um BP_EnemySpawn foi posicionado perto do píer para os " +
                                "inimigos chegarem rápido ao navio e pressionarem o jogador " +
                                "desde o início."
                        },
                        {
                            name: "Cerco ao navio",
                            text:
                                "Cada inimigo ocupa um Target Spot diferente, então eles se " +
                                "espalham pelo navio em vez de atacarem todos no mesmo ponto."
                        },
                        {
                            name: "Defesa",
                            text:
                                "O jogador precisa eliminar os inimigos antes que eles " +
                                "destruam o navio, já que perder o navio leva à tela de derrota."
                        }
                    ]
                }
            ]
        },

        "store": {
            context: "STORE / PRESENTATION",

            videos: [
                {
                    file: "store.mp4",
                    number: "01",
                    title: "Loja em ação",
                    description:
                        "O jogador abre a loja e compra vida, munição e barril explosivo, " +
                        "com as moedas sendo descontadas a cada compra.",
                    label: "GAMEPLAY · STORE",

                    summary:
                        "O jogador junta moedas eliminando inimigos e gasta no Merchant " +
                        "com vida, munição e barris explosivos, sem sair da partida.",

                    highlights: [
                        {
                            name: "Moedas",
                            text:
                                "Cada inimigo eliminado rende moedas, mostradas no canto da " +
                                "tela ao lado da caveira. No vídeo, o saldo sobe de 25 para " +
                                "32 antes das compras."
                        },
                        {
                            name: "Merchant",
                            text:
                                "A loja abre sobre o jogo, com os produtos lidos de uma Data " +
                                "Table: descrição, preço e quantidade. Mudar um preço é só " +
                                "editar a tabela. Com a loja aberta, o jogador não ataca."
                        },
                        {
                            name: "CanBuy",
                            text:
                                "Ao clicar em um produto, a função CanBuy confere se há moedas " +
                                "suficientes. Se houver, o preço é descontado e o item é " +
                                "entregue; se não, a compra não acontece."
                        },
                        {
                            name: "Entrega do item",
                            text:
                                "A bebida recupera 25 de vida, enviada ao personagem por uma " +
                                "Blueprint Interface, sem Cast. A munição soma 10 balas, e o " +
                                "barril entra no contador do HUD, pronto para ser usado."
                        }
                    ]
                }
            ]
        },

        "interaction": {
            context: "INTERACTION SYSTEM / PRESENTATION",

            videos: [
                {
                    file: "interaction-detection.mp4",
                    number: "01",
                    title: "Detectar e mirar",
                    description:
                        "O InteractionComponent registra os objetos próximos e usa um " +
                        "Sphere Trace da câmera para mostrar o botão só no objeto em foco.",
                    label: "ACTOR COMPONENT · INTERACTION",

                    summary:
                        "O InteractionComponent descobre quais objetos estão perto do " +
                        "jogador e mostra o botão de interação só naquele que está na mira.",

                    highlights: [
                        {
                            name: "InteractionComponent",
                            text:
                                "Toda a interação fica em um Actor Component adicionado ao " +
                                "BP_Player. A lógica fica separada do personagem e pode ser " +
                                "reaproveitada em outro ator."
                        },
                        {
                            name: "Begin Overlap",
                            text:
                                "O componente se liga ao overlap do jogador e guarda em uma " +
                                "lista os objetos interagíveis que entram no alcance."
                        },
                        {
                            name: "Actor Is In Sight",
                            text:
                                "Lança um Sphere Trace a partir da câmera e confere se o objeto " +
                                "atingido é o mesmo da lista. Assim, o botão não aparece em um " +
                                "objeto que está perto, mas fora da mira."
                        },
                        {
                            name: "Get Interactable Actor",
                            text:
                                "Função Pure que devolve o objeto em foco, já validado com Is " +
                                "Valid, para o resto do componente usar sem repetir a verificação."
                        },
                        {
                            name: "Render Interactable Widget",
                            text:
                                "Posiciona o widget do botão sobre o objeto em foco, ajusta o " +
                                "tamanho com Set Draw Size e o esconde quando não há nada " +
                                "para interagir."
                        }
                    ]
                },
                {
                    file: "interaction-types.mp4",
                    number: "02",
                    title: "Tipos de interação",
                    description:
                        "Uma Blueprint Interface e um Enum definem se o objeto é usado " +
                        "com um toque ou segurando o botão, como a bebida e o baú.",
                    label: "INTERFACE · PRESS & HOLD",

                    summary:
                        "Cada objeto interagível diz como quer ser usado: com um toque " +
                        "ou segurando o botão. A bebida e o baú mostram os dois casos.",

                    highlights: [
                        {
                            name: "BPI_Interactable",
                            text:
                                "Blueprint Interface com as funções Interact, Can Interact, " +
                                "Interact Type e Hold Duration. Qualquer objeto que a " +
                                "implemente funciona com o jogador, sem Cast."
                        },
                        {
                            name: "E_InteractionType",
                            text:
                                "Enum com os tipos Press, Hold e Tap. Um Switch no " +
                                "InteractionComponent escolhe o caminho certo para cada objeto."
                        },
                        {
                            name: "Hold Duration",
                            text:
                                "Define por quanto tempo o botão precisa ficar pressionado. " +
                                "No baú de ouro são 2 segundos, com uma barra de progresso " +
                                "enchendo na tela."
                        },
                        {
                            name: "Interact Event",
                            text:
                                "Quando a interação se completa, o componente chama o Interact " +
                                "do objeto. Na bebida, isso recupera a vida do jogador com o " +
                                "Add Health."
                        }
                    ]
                },
                {
                    file: "chest-to-ship.mp4",
                    number: "03",
                    title: "Do baú ao navio",
                    description:
                        "O jogador carrega o baú, com as ações limitadas, e o entrega " +
                        "ao navio para iniciar as ondas de inimigos.",
                    label: "GAMEPLAY · GOLD CHEST",

                    summary:
                        "O baú de ouro dá início à partida: o jogador o carrega até o " +
                        "navio e, ao entregá-lo, as ondas de inimigos começam.",

                    highlights: [
                        {
                            name: "Pegar o baú",
                            text:
                                "Ao interagir, o BP_GoldChest se prende a um socket do " +
                                "personagem, e o jogador passa a carregar o baú."
                        },
                        {
                            name: "Is Carrying",
                            text:
                                "Enquanto carrega o baú, o jogador não pode atacar nem trocar " +
                                "de arma: essas ações conferem o Is Carrying antes de executar."
                        },
                        {
                            name: "Can Interact",
                            text:
                                "O navio também é interagível, mas o Can Interact dele só " +
                                "libera a interação quando o jogador está com o baú."
                        },
                        {
                            name: "Start Game",
                            text:
                                "Na entrega, o Is Carrying volta a falso e o GM_Core recebe o " +
                                "Start Game, que mostra a barra da onda e inicia a primeira Wave."
                        }
                    ]
                }
            ]
        },

        "explosive-barrel": {
            context: "EXPLOSIVE BARREL / PRESENTATION",

            videos: [
                {
                    file: "barrel-placement.mp4",
                    number: "01",
                    title: "Posicionamento",
                    description:
                        "O modo de posicionamento usa um trace da câmera para mover um barril " +
                        "provisório e confirma a colocação com o ataque.",
                    label: "INTERACTION COMPONENT · SETTING",

                    summary:
                        "O jogador escolhe onde colocar os barris comprados na loja: um " +
                        "barril provisório segue a mira até a posição ser confirmada.",

                    highlights: [
                        {
                            name: "Modo Setting",
                            text:
                                "Com a tecla 1, o InteractionComponent entra no modo de " +
                                "posicionamento e cria um barril provisório. Apertando de " +
                                "novo, o evento CloseSetting encerra o modo."
                        },
                        {
                            name: "Get Barrel Value",
                            text:
                                "Antes de entrar no modo, a quantidade de barris é consultada " +
                                "pela Blueprint Interface do HUD. Sem barris, um som de erro " +
                                "avisa o jogador."
                        },
                        {
                            name: "Setting Location",
                            text:
                                "Um trace a partir da câmera calcula o ponto do chão para onde " +
                                "o jogador olha, e o barril provisório acompanha esse ponto."
                        },
                        {
                            name: "IA_Attack",
                            text:
                                "No modo de posicionamento, o ataque passa a confirmar a " +
                                "posição: o barril real é criado no ponto escolhido e um " +
                                "barril sai do contador."
                        }
                    ]
                },
                {
                    file: "barrel-explosion.mp4",
                    number: "02",
                    title: "Explosão",
                    description:
                        "O barril aplica dano em área e força radial, lançando os " +
                        "inimigos atingidos pela explosão.",
                    label: "BLUEPRINTS · RADIAL DAMAGE",

                    summary:
                        "Ao levar dano, o barril explode: causa dano em área e empurra " +
                        "os inimigos próximos, que são lançados pela explosão.",

                    highlights: [
                        {
                            name: "Any Damage",
                            text:
                                "O barril reage a qualquer dano recebido, seja um tiro ou um " +
                                "golpe. Um Delay curto antecede a explosão."
                        },
                        {
                            name: "Apply Radial Damage",
                            text:
                                "Aplica 200 de dano a tudo dentro do raio da explosão, a partir " +
                                "da posição do barril."
                        },
                        {
                            name: "Radial Force",
                            text:
                                "Um Radial Force Component dispara um impulso no mesmo momento, " +
                                "empurrando os corpos em ragdoll. A colisão do ragdoll dos " +
                                "inimigos foi ajustada para que eles sejam lançados de verdade."
                        },
                        {
                            name: "Spawn Emitter",
                            text:
                                "O efeito visual da explosão é criado com o Spawn Emitter at " +
                                "Location, na posição do barril."
                        }
                    ]
                }
            ]
        },

        "menus": {
            context: "GAME MENUS / PRESENTATION",

            videos: [
                {
                    file: "menu-flow.mp4",
                    number: "01",
                    title: "Fluxo das telas",
                    description:
                        "Menu principal, configurações gráficas, loading, pausa e " +
                        "telas de vitória e derrota, todos conectados.",
                    label: "UI · GAME FLOW",

                    summary:
                        "O caminho do jogador pelas telas do jogo: do menu principal à " +
                        "partida, passando pelas configurações, pela pausa e pelo fim de jogo.",

                    highlights: [
                        {
                            name: "Menu principal",
                            text:
                                "Fica em um mapa próprio, com Game Mode e HUD exclusivos, sem " +
                                "criar o personagem jogável."
                        },
                        {
                            name: "Configurações",
                            text:
                                "Ajustam a qualidade geral, das sombras e da iluminação, " +
                                "aplicadas com o botão Apply Settings."
                        },
                        {
                            name: "Pausa",
                            text:
                                "Controlada pelo PlayerController: pausa o jogo e permite " +
                                "voltar, abrir as configurações, ir ao menu ou sair."
                        },
                        {
                            name: "Vitória e derrota",
                            text:
                                "A derrota aparece quando o jogador ou o navio é destruído, " +
                                "com opção de reiniciar. A vitória é disparada por um Event " +
                                "Dispatcher quando a última onda termina."
                        },
                        {
                            name: "Loading",
                            text:
                                "Entre os mapas, uma tela de loading assíncrona mantém o jogo " +
                                "respondendo enquanto o próximo mapa carrega."
                        }
                    ]
                }
            ]
        }
    };

    // ==========================================
    // VERSÃO EM INGLÊS DOS VÍDEOS
    // Cada chave é o arquivo do vídeo. Os destaques seguem a mesma
    // ordem dos destaques em português: [nome, texto].
    // ==========================================

    const english = {
        "gm-core-2x.mp4": {
            title: "GM Core",
            description: "The core logic of the wave system, including the execution flow and how the steps are organized.",
            summary: "GM_Core is the Game Mode that runs the waves: it finds the spawners on the map, splits each wave's enemies among them and decides when the next wave starts.",
            highlights: [
                ["NextWave", "Event that starts each wave. It calls Split Enemies to prepare the enemies and then fires the StartGameMsg Event Dispatcher, which notifies every spawner at once. At the start of the match, a sound marks the arrival of the first wave."],
                ["Split Enemies", "Takes the current wave from the Waves array and divides each enemy amount by the number of spawners using Division (Whole and Remainder). The whole part goes to every spawner and the remainder is handed out one by one, so no enemy is lost in the split."],
                ["Clear Spawns", "Before distributing a new wave, it loops through the spawners and clears each one's To Spawn list, so nothing from the previous wave is left behind."],
                ["CheckingSpawners", "A looping Timer checks every 2 seconds whether all spawners have created their enemies. When they finish, this Timer is cleared and another one starts watching for the end of the wave."],
                ["WaveIsDone?", "Pure function used by the CheckingWave event to know whether any enemies are still alive. Once the wave is cleared, CurrentWave is compared to the total number of waves: if there's another, the counter goes up and NextWave is called; if not, the victory screen appears."]
            ]
        },
        "enemy-spawn-2x.mp4": {
            title: "Enemy Spawn",
            description: "The spawner setup and the logic used to define the amount and selection of enemies.",
            summary: "Each BP_EnemySpawn receives its share of the wave and creates the enemies gradually, at random intervals, choosing the type of each one.",
            highlights: [
                ["StartGameMsg", "At the start, the spawner finds GM_Core and subscribes to the StartGameMsg Event Dispatcher with a Bind Event. This way the Game Mode notifies all spawners at once, without needing to know each one."],
                ["StartingSpawn", "Creates a looping Timer with a random interval between 3 and 6 seconds that fires the Spawn event. The Timer handle is stored so it can be cleared later."],
                ["Enemies Amount", "Pure function that adds up how many enemies are still left to create. The Spawn event checks this number on every tick and, when it reaches zero, clears its own Timer."],
                ["Select Enemy", "Picks which enemy to create with a weighted draw: the type with more units left has a higher chance. It then subtracts one unit from it and returns the chosen class."],
                ["SpawnActor", "Creates the drawn enemy at the spawner's position, with collision set to adjust the location and always spawn, even if the space is occupied."]
            ]
        },
        "spawning-2x.mp4": {
            title: "System running",
            description: "A hands-on demo of enemies spawning and the waves being distributed during gameplay.",
            summary: "The spawners are placed on the map, the waves are set up in GM_Core and the result shows up in the game, with enemies appearing at different points on the island.",
            highlights: [
                ["Spawners on the map", "The BP_EnemySpawn actors are placed straight into the scene. To create a new spawn point, just drag another one onto the map: GM_Core finds them all on its own."],
                ["Waves array", "The waves live in an array of the ST Waves struct, edited in the GM_Core details. Each wave lists the enemy types and the amount of each, so changing the difficulty doesn't require touching the logic."],
                ["Enemies in game", "During the match, enemies come out of several spawners at different intervals, which keeps the whole wave from appearing in the same place at once."]
            ]
        },
        "enemy-target-spots.mp4": {
            title: "Choosing a target",
            description: "The AI Controller finds the Target Spots around the ship, reserves a free spot and targets the player when there's no room.",
            summary: "The AI Controller spreads the enemies around the ship: each one reserves a free spot to attack from and, if there's no room, goes after the player.",
            highlights: [
                ["BP_TargetSpot", "A simple actor placed around the ship. The arrow shows which way the enemy should face when it arrives, and the Filled? variable tells whether the spot is already taken."],
                ["On Possess", "When the AI Controller possesses the enemy, it stores a reference to it, finds every Target Spot on the map and subscribes to the enemy's death notice before looking for a target."],
                ["Try To Catch A Target", "Loops through the Target Spots with a For Each Loop with Break and reserves the first free one, marking Filled?. If they're all taken, the target becomes the player."],
                ["Go to Target", "Uses AI MoveTo to take the enemy to its target. On arrival, it turns toward the Spot's arrow with Turn Forward and attacks; if the path fails, it waits a bit and tries again."],
                ["IsDead", "When the enemy dies, the Target Spot it was using is released, making room for the next enemy in the wave."]
            ]
        },
        "enemy-attack-trace.mp4": {
            title: "Attacking the ship",
            description: "The enemy's strike uses a Line Trace and deals damage when it hits the player or the ship.",
            summary: "The enemy's strike is detected along the sword and only deals damage when the blade touches the player or the ship.",
            highlights: [
                ["Attack", "Starts a very short looping Timer, 0.01 seconds, that calls StartTrace many times during the animation, following the sword frame by frame."],
                ["StartTrace", "Runs a Line Trace By Channel between two sockets on the sword, from the base to the tip, ignoring the enemy itself. That way, damage depends on the blade actually landing."],
                ["Player or ship", "Break Hit Result returns the actor that was hit, and an OR compares its class with BP_Player and BP_Ship. Including the ship was my own addition, outside the course, so it also takes damage."],
                ["Apply Damage", "Deals 20 damage to the actor that was hit. On the ship, the damage wears down its health, and when it reaches zero the match ends in defeat."]
            ]
        },
        "ship-defense-gameplay.mp4": {
            title: "Defense in action",
            description: "Enemies spawn, surround the ship and attack while the player defends the position.",
            summary: "With everything connected, enemies spawn near the pier, surround the ship and attack while the player tries to defend it.",
            highlights: [
                ["Spawner on the pier", "A BP_EnemySpawn was placed near the pier so enemies reach the ship quickly and pressure the player from the start."],
                ["Surrounding the ship", "Each enemy takes a different Target Spot, so they spread around the ship instead of all attacking the same point."],
                ["Defense", "The player has to take out the enemies before they destroy the ship, since losing the ship leads to the defeat screen."]
            ]
        },
        "store.mp4": {
            title: "Store in action",
            description: "The player opens the store and buys health, ammo and an explosive barrel, with coins deducted on each purchase.",
            summary: "The player earns coins by taking out enemies and spends them at the Merchant on health, ammo and explosive barrels, without leaving the match.",
            highlights: [
                ["Coins", "Each enemy taken out gives coins, shown in the corner of the screen next to the skull. In the video, the balance goes from 25 to 32 before the purchases."],
                ["Merchant", "The store opens over the game, with the products read from a Data Table: description, price and quantity. Changing a price is just a matter of editing the table. While the store is open, the player can't attack."],
                ["CanBuy", "When a product is clicked, the CanBuy function checks whether there are enough coins. If so, the price is deducted and the item delivered; if not, the purchase doesn't happen."],
                ["Item delivery", "The drink restores 25 health, sent to the character through a Blueprint Interface, without a Cast. Ammo adds 10 bullets, and the barrel goes to the HUD counter, ready to use."]
            ]
        },
        "interaction-detection.mp4": {
            title: "Detect and aim",
            description: "The InteractionComponent registers nearby objects and uses a Sphere Trace from the camera to show the button only on the object in focus.",
            summary: "The InteractionComponent finds which objects are near the player and shows the interaction button only on the one being aimed at.",
            highlights: [
                ["InteractionComponent", "All interaction lives in an Actor Component added to BP_Player. The logic stays separate from the character and can be reused on another actor."],
                ["Begin Overlap", "The component hooks into the player's overlap and keeps a list of the interactable objects that come within reach."],
                ["Actor Is In Sight", "Casts a Sphere Trace from the camera and checks whether the hit object is the same one in the list. That way, the button doesn't show on an object that's nearby but out of aim."],
                ["Get Interactable Actor", "Pure function that returns the object in focus, already validated with Is Valid, so the rest of the component can use it without repeating the check."],
                ["Render Interactable Widget", "Places the button widget over the object in focus, adjusts its size with Set Draw Size and hides it when there's nothing to interact with."]
            ]
        },
        "interaction-types.mp4": {
            title: "Interaction types",
            description: "A Blueprint Interface and an Enum define whether an object is used with a tap or by holding the button, like the drink and the chest.",
            summary: "Each interactable object says how it wants to be used: with a tap or by holding the button. The drink and the chest show both cases.",
            highlights: [
                ["BPI_Interactable", "Blueprint Interface with the Interact, Can Interact, Interact Type and Hold Duration functions. Any object that implements it works with the player, without a Cast."],
                ["E_InteractionType", "Enum with the Press, Hold and Tap types. A Switch in the InteractionComponent picks the right path for each object."],
                ["Hold Duration", "Defines how long the button must be held. On the gold chest it's 2 seconds, with a progress bar filling up on screen."],
                ["Interact Event", "When the interaction completes, the component calls the object's Interact. On the drink, this restores the player's health with Add Health."]
            ]
        },
        "chest-to-ship.mp4": {
            title: "From chest to ship",
            description: "The player carries the chest, with limited actions, and delivers it to the ship to start the enemy waves.",
            summary: "The gold chest kicks off the match: the player carries it to the ship and, on delivery, the enemy waves begin.",
            highlights: [
                ["Picking up the chest", "On interaction, BP_GoldChest attaches to a socket on the character, and the player starts carrying the chest."],
                ["Is Carrying", "While carrying the chest, the player can't attack or switch weapons: those actions check Is Carrying before running."],
                ["Can Interact", "The ship is also interactable, but its Can Interact only allows the interaction when the player has the chest."],
                ["Start Game", "On delivery, Is Carrying goes back to false and GM_Core receives Start Game, which shows the wave bar and starts the first Wave."]
            ]
        },
        "barrel-placement.mp4": {
            title: "Placement",
            description: "The placement mode uses a trace from the camera to move a preview barrel and confirms the placement with the attack.",
            summary: "The player chooses where to place the barrels bought in the store: a preview barrel follows the aim until the position is confirmed.",
            highlights: [
                ["Setting mode", "With the 1 key, the InteractionComponent enters placement mode and creates a preview barrel. Pressing it again, the CloseSetting event ends the mode."],
                ["Get Barrel Value", "Before entering the mode, the barrel count is checked through the HUD's Blueprint Interface. With no barrels, an error sound lets the player know."],
                ["Setting Location", "A trace from the camera finds the point on the ground the player is looking at, and the preview barrel follows that point."],
                ["IA_Attack", "In placement mode, the attack confirms the position instead: the real barrel is created at the chosen point and one barrel comes off the counter."]
            ]
        },
        "barrel-explosion.mp4": {
            title: "Explosion",
            description: "The barrel deals area damage and radial force, launching the enemies caught in the explosion.",
            summary: "When damaged, the barrel explodes: it deals area damage and pushes nearby enemies, who get launched by the blast.",
            highlights: [
                ["Any Damage", "The barrel reacts to any damage it takes, whether a shot or a strike. A short Delay comes before the explosion."],
                ["Apply Radial Damage", "Deals 200 damage to everything within the explosion radius, from the barrel's position."],
                ["Radial Force", "A Radial Force Component fires an impulse at the same moment, pushing the ragdoll bodies. The enemies' ragdoll collision was adjusted so they really get launched."],
                ["Spawn Emitter", "The explosion visual effect is created with Spawn Emitter at Location, at the barrel's position."]
            ]
        },
        "menu-flow.mp4": {
            title: "Screen flow",
            description: "Main menu, graphics settings, loading, pause and victory and defeat screens, all connected.",
            summary: "The player's path through the game's screens: from the main menu to the match, through settings, pause and the end of the game.",
            highlights: [
                ["Main menu", "It lives on its own map, with its own Game Mode and HUD, without spawning the playable character."],
                ["Settings", "They adjust the overall, shadow and lighting quality, applied with the Apply Settings button."],
                ["Pause", "Controlled by the PlayerController: it pauses the game and lets the player resume, open the settings, go to the menu or quit."],
                ["Victory and defeat", "Defeat appears when the player or the ship is destroyed, with an option to restart. Victory is triggered by an Event Dispatcher when the last wave ends."],
                ["Loading", "Between maps, an asynchronous loading screen keeps the game responsive while the next map loads."]
            ]
        }
    };

    // Textos fixos da página que o JavaScript cria.
    const labels = {
        pt: {
            eyebrow: "DETALHES DO VÍDEO",
            openVideo: "Abrir apresentação ampliada",
            noVideo: "Seu navegador não suporta a reprodução de vídeo.",
            placeholder: "ANIMAÇÃO / GIF EM BREVE",
            elementFallback: "Elemento do jogo",
            descriptionFallback: "Descrição em breve.",
            presentation: {
                moreLabel: "Ver mais",
                lessLabel: "Ver menos",
                highlightsLabel: "DESTAQUES DO VÍDEO",
                closeLabel: "Fechar apresentação"
            }
        },
        en: {
            eyebrow: "VIDEO DETAILS",
            openVideo: "Open expanded presentation",
            noVideo: "Your browser does not support video playback.",
            placeholder: "ANIMATION / GIF COMING SOON",
            elementFallback: "Game element",
            descriptionFallback: "Description coming soon.",
            presentation: {
                moreLabel: "See more",
                lessLabel: "See less",
                highlightsLabel: "VIDEO HIGHLIGHTS",
                closeLabel: "Close presentation"
            }
        }
    };

    function text() {
        return labels[I18n.lang] || labels.pt;
    }

    // Devolve o vídeo com os textos do idioma atual.
    function localize(item) {
        const translation = english[item.file];

        if (I18n.lang !== "en" || !translation) {
            return item;
        }

        return {
            ...item,
            title: translation.title,
            description: translation.description,
            summary: translation.summary,
            highlights: translation.highlights.map(([name, highlightText]) => ({
                name,
                text: highlightText
            }))
        };
    }

    // ==========================================
    // CRIA OS CARDS DOS VÍDEOS DE UM SISTEMA
    // ==========================================

    function renderSystemVideos(system, systemTitle) {
        detailMedia.replaceChildren();
        detailMedia.classList.add("system-videos");

        system.videos.forEach((original) => {
            const item = localize(original);

            const card = document.createElement("article");
            card.className = "system-video-card";

            // CABEÇALHO DO CARD

            const heading = document.createElement("div");
            heading.className = "system-video-heading";

            const number = document.createElement("span");
            number.className = "system-video-number mono";
            number.textContent = item.number;

            const textContainer = document.createElement("div");

            const title = document.createElement("h4");
            title.className = "system-video-title";
            title.textContent = item.title;

            const description = document.createElement("p");
            description.className = "system-video-description";
            description.textContent = item.description;

            textContainer.append(title, description);
            heading.append(number, textContainer);

            // PLAYER DO VÍDEO

            const video = document.createElement("video");

            video.className = "system-video-player";
            video.controls = true;
            video.preload = "metadata";
            video.playsInline = true;

            video.setAttribute(
                "aria-label",
                `${text().openVideo}: ${item.title}`
            );

            // O clique abre a apresentação ampliada
            // (ver js/video-presentation.js).
            Object.assign(video.dataset, {
                presentation: "",
                title: item.title,
                summary: item.summary || "",
                highlights: JSON.stringify(item.highlights || []),
                eyebrow: text().eyebrow,
                context: system.context || `${systemTitle.toUpperCase()} / PRESENTATION`,
                label: item.label,
                number: item.number,
                total: String(system.videos.length),
                footer: "MIGUEL CORAL · UNREAL ENGINE 5"
            });

            const source = document.createElement("source");

            source.src = `../assets/pirate/videos/${item.file}`;
            source.type = "video/mp4";

            video.appendChild(source);

            video.appendChild(
                document.createTextNode(
                    text().noVideo
                )
            );

            // RODAPÉ DO CARD

            const footer = document.createElement("div");
            footer.className = "system-video-footer mono";
            footer.textContent = item.label;

            // MONTA O CARD

            card.append(heading, video, footer);
            detailMedia.appendChild(card);
        });
    }

    // ==========================================
    // ESPAÇO RESERVADO PARA CARDS SEM VÍDEOS
    // ==========================================

    function renderPlaceholder() {
        detailMedia.classList.remove("system-videos");
        detailMedia.replaceChildren();

        const placeholder = document.createElement("span");

        placeholder.className = "mono";
        placeholder.textContent = text().placeholder;

        detailMedia.appendChild(placeholder);
    }

    // ==========================================
    // SELEÇÃO DOS ELEMENTOS DO JOGO
    // ==========================================

    function selectElement(card, index, shouldScroll = true) {
        elementCards.forEach((item) => {
            item.classList.remove("is-active");
        });

        card.classList.add("is-active");

        detailTitle.textContent =
            card.dataset.title || text().elementFallback;

        detailDescription.textContent =
            card.dataset.description || text().descriptionFallback;

        detailIndex.textContent =
            `${String(index + 1).padStart(2, "0")} / ` +
            `${String(elementCards.length).padStart(2, "0")}`;

        const system = systems[card.dataset.system];

        if (system) {
            renderSystemVideos(system, detailTitle.textContent);
        } else {
            renderPlaceholder();
        }

        if (shouldScroll) {
            detailSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }

    // ==========================================
    // EVENTOS DOS CARDS
    // ==========================================

    elementCards.forEach((card, index) => {
        card.addEventListener("click", () => {
            selectElement(card, index);
        });
    });

    // ==========================================
    // ESTADO INICIAL
    // ==========================================

    // Na troca de idioma, o i18n.js já traduziu os cards; aqui
    // refazemos os vídeos do card ativo e os textos da apresentação.
    I18n.onChange((lang) => {
        VideoPresentation.setDefaults(labels[lang].presentation);

        const active = document.querySelector(".element-card.is-active") || elementCards[0];

        selectElement(active, [...elementCards].indexOf(active), false);
    });
});
