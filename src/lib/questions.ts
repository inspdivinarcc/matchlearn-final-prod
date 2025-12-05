export const QUESTION_BANK = [
    {
        id: 'q1',
        text: 'Qual é o principal benefício de usar "Server Actions" no Next.js?',
        options: [
            { id: 'a', text: 'Melhorar o SEO automaticamente' },
            { id: 'b', text: 'Executar código no servidor diretamente de componentes' },
            { id: 'c', text: 'Criar animações CSS complexas' },
            { id: 'd', text: 'Substituir o React Context' },
        ],
        correctId: 'b',
    },
    {
        id: 'q2',
        text: 'O que o Prisma ORM facilita no desenvolvimento?',
        options: [
            { id: 'a', text: 'Renderização de componentes 3D' },
            { id: 'b', text: 'Interação type-safe com o banco de dados' },
            { id: 'c', text: 'Minificação de arquivos CSS' },
            { id: 'd', text: 'Gerenciamento de estado global no cliente' },
        ],
        correctId: 'b',
    },
    {
        id: 'q3',
        text: 'Para que serve o "use client" no Next.js App Router?',
        options: [
            { id: 'a', text: 'Para marcar um componente como Client Component' },
            { id: 'b', text: 'Para importar bibliotecas do cliente' },
            { id: 'c', text: 'Para usar hooks do React no servidor' },
            { id: 'd', text: 'Para otimizar imagens' },
        ],
        correctId: 'a',
    },
    {
        id: 'q4',
        text: 'Qual hook é usado para gerenciar estado local no React?',
        options: [
            { id: 'a', text: 'useEffect' },
            { id: 'b', text: 'useState' },
            { id: 'c', text: 'useContext' },
            { id: 'd', text: 'useReducer' },
        ],
        correctId: 'b',
    },
    {
        id: 'q5',
        text: 'O que é "Hydration" no contexto de SSR?',
        options: [
            { id: 'a', text: 'O processo de carregar CSS' },
            { id: 'b', text: 'Anexar event listeners ao HTML estático' },
            { id: 'c', text: 'Fazer download de imagens' },
            { id: 'd', text: 'Conectar ao banco de dados' },
        ],
        correctId: 'b',
    },
];

export function getRandomQuestion() {
    return QUESTION_BANK[Math.floor(Math.random() * QUESTION_BANK.length)];
}

export function getQuestionById(id: string) {
    return QUESTION_BANK.find(q => q.id === id);
}
