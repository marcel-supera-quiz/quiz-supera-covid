/**
 * Convert an array of objects to CSV string.
 * @param {object[]} data - Array of row objects
 * @param {string[]} [columns] - Optional ordered column keys. If omitted, derived from data.
 * @param {object} [labels] - Optional mapping of column key → friendly header label
 * @returns {string} CSV content
 */
function toCSV(data, columns, labels) {
    if (!data || data.length === 0) return ''

    const cols = columns || Object.keys(data[0])
    const header = cols.map(c => labels?.[c] || c)

    const rows = data.map(row =>
        cols.map(c => {
            let val = row[c]
            if (val === null || val === undefined) val = ''
            if (Array.isArray(val)) val = val.join('; ')
            val = String(val).replace(/"/g, '""')
            return `"${val}"`
        }).join(',')
    )

    return [header.join(','), ...rows].join('\n')
}

/**
 * Trigger a CSV file download in the browser.
 * @param {string} csvContent
 * @param {string} filename
 */
function downloadCSV(csvContent, filename) {
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

/**
 * Column configuration for the dashboard table export.
 */
const TABLE_COLUMNS = [
    'nome', 'idade', 'cidade_uf', 'whatsapp',
    'score_ig', 'segmentacao', 'fator_neuro_covid', 'created_at'
]

const TABLE_LABELS = {
    nome: 'Nome',
    idade: 'Idade',
    cidade_uf: 'Cidade/UF',
    whatsapp: 'WhatsApp',
    score_ig: 'Score IG (%)',
    segmentacao: 'Segmentação',
    fator_neuro_covid: 'Fator Neuro-Covid',
    created_at: 'Data'
}

/**
 * Export filtered table data to CSV.
 * @param {object[]} data - Merged participant + response rows
 * @param {string} [filename]
 */
export function exportTableToCSV(data, filename = 'resultados_pesquisa.csv') {
    const csv = toCSV(data, TABLE_COLUMNS, TABLE_LABELS)
    if (!csv) return alert('Nenhum dado para exportar.')
    downloadCSV(csv, filename)
}

/**
 * Column configuration for individual record export.
 */
const DETAIL_COLUMNS = [
    'nome', 'idade', 'cidade_uf', 'whatsapp',
    'p1_frequencia', 'p2_foco', 'p3_energia', 'p4_velocidade',
    'p5_localizacao', 'p6_causalidade', 'p7_sintomas', 'p8_internacao',
    'p9_escalabilidade', 'p10_relato',
    'score_ig', 'segmentacao', 'fator_neuro_covid', 'created_at'
]

const DETAIL_LABELS = {
    nome: 'Nome',
    idade: 'Idade',
    cidade_uf: 'Cidade/UF',
    whatsapp: 'WhatsApp',
    p1_frequencia: 'P1 - Cansaço Mental',
    p2_foco: 'P2 - Dificuldade de Concentração',
    p3_energia: 'P3 - Esquecimento',
    p4_velocidade: 'P4 - Raciocínio Lento',
    p5_localizacao: 'P5 - Dificuldade com Palavras',
    p6_causalidade: 'P6 - Causalidade Covid',
    p7_sintomas: 'P7 - Sintomas Persistentes',
    p8_internacao: 'P8 - Internação',
    p9_escalabilidade: 'P9 - Pessoas Conhecidas com Covid',
    p10_relato: 'P10 - Relato Livre',
    score_ig: 'Score IG (%)',
    segmentacao: 'Segmentação',
    fator_neuro_covid: 'Fator Neuro-Covid',
    created_at: 'Data'
}

/**
 * Export a single participant's full record to CSV.
 * @param {object} record - Merged participant + quiz_response object
 */
export function exportSingleRecordToCSV(record) {
    const nome = (record.nome || 'participante').replace(/\s+/g, '_').toLowerCase()
    const csv = toCSV([record], DETAIL_COLUMNS, DETAIL_LABELS)
    if (!csv) return alert('Nenhum dado para exportar.')
    downloadCSV(csv, `ficha_${nome}.csv`)
}
