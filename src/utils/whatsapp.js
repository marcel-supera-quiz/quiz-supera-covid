export function shareOnWhatsApp(participant, results, rewardSelected) {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    let message = ''
    if (rewardSelected === 'evaluation') {
        message = `Olá! Acabei de completar a Avaliação Cognitiva Pós-Covid do Supera. Meu impacto cognitivo foi *${results.score_ig}%*. Gostaria de agendar minha Avaliação Gratuita com um especialista! 🧠`
    } else if (rewardSelected === 'squeeze') {
        message = `Olá! Acabei de completar a Avaliação Cognitiva Pós-Covid do Supera. Muito obrigado por participar! Meu impacto cognitivo foi *${results.score_ig}%*. Venho retirar meu Squeeze Exclusivo! 💧 (Endereço: https://www.google.com/maps/dir//M%C3%A9todo+Supera+Nova+Odessa,+R.+Quinze+de+Novembro,+563+-+Centro,+Nova+Odessa+-+SP,+13380-005/@-22.7889881,-47.2920331,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x94c8982f701573ad:0xbb0f23d8d0a7f6e!2m2!1d-47.29344!2d-22.781311?entry=ttu&g_ep=EgoyMDI2MDIxOC4wIKXMDSoASAFQAw%3D%3D)`
    }

    const encodedMsg = encodeURIComponent(message)
    const phone = '5519981760534'

    if (isMobile) {
        window.open(`whatsapp://send?phone=${phone}&text=${encodedMsg}`)
    } else {
        window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${encodedMsg}`, '_blank')
    }
}