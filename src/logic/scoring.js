// Calcula índice GERAL (apenas respostas de 1 a 6)
export function calculateIG(p1, p2, p3, p4, p5, p6) {
    const sum = p1 + p2 + p3 + p4 + p5 + p6;
    return Math.round((sum / 30) * 100);
}

// Segmentation logic baseado no score IG
export function getSegmentation(score) {
    if (score <= 30) return 'baixo';
    if (score <= 70) return 'medio';
    return 'alto';
}

// Neuro-covid factor detection
export function hasNeuroCovid(p6, p7symptoms) {
    const hasP6 = p6 > 3;
    // Validates if array of selected symptoms has the specified trigger ones. 
    // Expects p7symptoms to be an array of strings.
    const hasKeySymptoms = p7symptoms.includes('Fadiga Mental')
        && (p7symptoms.includes('Perda de Olfato') || p7symptoms.includes('Perda de Paladar'));

    return {
        highlighted: hasP6,
        severeViral: hasKeySymptoms,
        // combined flag to store in DB
        isNeuroCovid: hasP6 && hasKeySymptoms
    };
}