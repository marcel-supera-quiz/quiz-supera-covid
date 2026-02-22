export function shareOnWhatsApp(participant, results, rewardSelected) {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    let message = ''
    if (rewardSelected === 'evaluation') {
        message = `Olá! Acabei de completar a Avaliação Cognitiva Pós-Covid do Supera. Meu impacto cognitivo foi *${results.score_ig}%*. Gostaria de agendar minha Avaliação Gratuita com um especialista! 🧠`
    } else if (rewardSelected === 'squeeze') {
        message = `Olá! Acabei de completar a Avaliação Cognitiva Pós-Covid do Supera. Muito obrigado por participar! Meu impacto cognitivo foi *${results.score_ig}%*. Venho retirar meu Squeeze Exclusivo! 💧 (Endereço: https://share.google/UN4gpUJ486CGjt6DT)`
    }

    const encodedMsg = encodeURIComponent(message)
    const phone = '5519981760534'

    if (isMobile) {
        window.open(`whatsapp://send?phone=${phone}&text=${encodedMsg}`)
    } else {
        window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${encodedMsg}`, '_blank')
    }
}