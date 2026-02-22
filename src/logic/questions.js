export const questions = [
    {
        id: 1,
        type: 'scale',
        text: 'Após ter Covid-19, com que frequência você se sente mentalmente cansado, mesmo após uma boa noite de sono?',
        subtitle: 'Avalie numa escala de 1 a 5, sendo 1 nunca e 5 sempre.',
        key: 'p1_frequencia'
    },
    {
        id: 2,
        type: 'scale',
        text: 'Sua dificuldade de concentração aumentou após a infecção pela Covid-19?',
        subtitle: 'Selecione a intensidade: 1 (não aumentou) a 5 (aumentou muito).',
        key: 'p2_foco'
    },
    {
        id: 3,
        type: 'scale',
        text: 'Com que frequência você esquece fatos recentes ou onde guardou objetos de uso diário (chaves, óculos)?',
        subtitle: 'Avalie sua rotina atual (1: nunca até 5: rotineiramente).',
        key: 'p3_energia'
    },
    {
        id: 4,
        type: 'scale',
        text: 'Você sente que o seu raciocínio está mais lento para executar tarefas que antes eram simples?',
        subtitle: 'Escala de 1 a 5, onde 1 é igual a antes e 5 é muito mais lento.',
        key: 'p4_velocidade'
    },
    {
        id: 5,
        type: 'scale',
        text: 'Qual seu grau de dificuldade perceptível em encontrar as palavras certas durante uma conversa?',
        subtitle: 'Indique de 1 (nenhuma) até 5 (muita dificuldade).',
        key: 'p5_localizacao'
    },
    {
        id: 6,
        type: 'scale',
        text: 'O quanto você acredita que a Covid-19 é a principal causa dessas mudanças na sua memória e foco?',
        subtitle: 'De 1 (pouco provável) até 5 (aumento da certeza).',
        key: 'p6_causalidade'
    },
    {
        id: 7,
        type: 'multi',
        text: 'Quais destes sintomas persistiram por mais de 3 meses após a fase aguda da Covid-19?',
        subtitle: 'Selecione todas as opções que se aplicam.',
        options: [
            'Dificuldade de Foco',
            'Fadiga Mental',
            'Perda de Olfato',
            'Perda de Paladar',
            'Alterações no Sono',
            'Nenhum dos anteriores'
        ],
        key: 'p7_sintomas'
    },
    {
        id: 8,
        type: 'yesno',
        text: 'Você precisou de internação hospitalar durante a infecção pela Covid-19?',
        subtitle: 'Resposta simples de sim ou não.',
        key: 'p8_internacao'
    },
    {
        id: 9,
        type: 'select',
        text: 'Quantas pessoas mais ou menos você conhece que tiveram Covid-19?',
        subtitle: 'Isso nos ajuda a entender o alcance da sua rede social.',
        options: [
            { label: 'Menos de 10 pessoas', value: 'Menos de 10' },
            { label: 'Menos de 20 pessoas', value: 'Menos de 20' },
            { label: 'Mais de 20 pessoas', value: 'Mais de 20' }
        ],
        key: 'p9_escalabilidade'
    },
    {
        id: 10,
        type: 'text',
        text: 'Há mais alguma mudança na sua qualidade de vida ou produtividade no trabalho pós-Covid que gostaria de relatar?',
        subtitle: 'Descreva livremente.',
        key: 'p10_relato'
    }
];