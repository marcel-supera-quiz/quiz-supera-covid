import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import logoImg from '../assets/logo.png';

export async function generateCertificate(resultData, participantName) {
    // Create a hidden DOM element with 1080x1920 resolution for WhatsApp Status
    const container = document.createElement('div')
    container.style.width = '1080px'
    container.style.height = '1920px'
    container.style.position = 'fixed'
    container.style.top = '-9999px' // Hide off-screen
    container.style.left = '-9999px'
    container.style.backgroundColor = '#FFFBF7' // Base bg-background-light

    // Assemble inner HTML using inline styles for reliability with html2canvas where possible
    const segmentColor = resultData.segmentacao === 'baixo' ? '#4CAF50' : (resultData.segmentacao === 'medio' ? '#FFC107' : '#F44336')
    const segmentText = resultData.segmentacao === 'baixo' ? 'Excelente' : (resultData.segmentacao === 'medio' ? 'Atenção Moderada' : 'Atenção Elevada')

    // Generate QR Code for Nova Odessa WhatsApp
    const qrCodeUrl = await QRCode.toDataURL('https://wa.me/5519981760534', { errorCorrectionLevel: 'M', margin: 1, width: 250 });

    container.innerHTML = `
        <div style="width:100%; height:100%; display:flex; flex-direction:column; align-items:center; padding: 100px; box-sizing:border-box; font-family:'Helvetica Neue', sans-serif;">
           <!-- Header -->
           <div style="margin-bottom: 50px;">
               <img src="${logoImg}" style="width: 600px; height: auto; object-contain;" />
           </div>
           
           <!-- Title -->
           <div style="font-size: 80px; color: #591C0B; font-weight: bold; text-align: center; margin-bottom: 40px; line-height: 1.1;">
               Avaliação<br/> Cognitiva Concluída
           </div>
           
           <!-- Participant -->
           <div style="font-size: 50px; color: #8C4F3E; text-align: center; margin-bottom: 100px;">
               ${participantName || 'Participante'}
           </div>
    
           <!-- Score Box -->
           <div style="width: 800px; padding: 60px 80px; border-radius: 40px; background-color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.1); display:flex; flex-direction:column; align-items:center; justify-content: center;">
               <div style="font-size: 40px; color: #8C4F3E; font-weight: bold; text-transform: uppercase;">Grau de Impacto</div>
               <div style="font-size: 200px; color: ${segmentColor}; font-weight: bold; line-height: 1; margin: 60px 0 80px 0;">
                   ${resultData.score_ig || 0}%
               </div>
               <div style="font-size: 50px; font-weight: bold; background-color: ${segmentColor}; color: white; padding: 15px 40px 10px 40px; border-radius: 100px; box-sizing: border-box; text-align: center; display: flex; align-items: center; justify-content: center;">
                   ${segmentText}
               </div>
           </div>

           <!-- Action CTA & QR Code -->
           <div style="margin-top: 80px; display:flex; flex-direction:column; align-items:center; text-align: center;">
             <div style="font-size: 42px; font-weight: 900; color: #D32F2F; max-width: 800px; line-height: 1.2; text-transform: uppercase;">
                 Agende urgente uma avaliação presencial gratuita
             </div>
             <div style="font-size: 60px; font-weight: bold; color: #EA5B0C; margin-top: 20px; margin-bottom: 30px;">
                 19 98176-0534
             </div>
             <img src="${qrCodeUrl}" style="width: 250px; height: 250px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" />
           </div>

       <!-- Footer -->
       <div style="margin-top: auto; font-size: 40px; color: #8C4F3E; text-align: center;">
           Faça sua avaliação também.
       </div>
    </div>
  `

    document.body.appendChild(container)

    try {
        const canvas = await html2canvas(container, {
            scale: 1, // Already set to 1080x1920
            useCORS: true,
            logging: false
        })

        // Download flow
        const link = document.createElement('a')
        link.download = `Certificado_Supera_${participantName}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    } catch (e) {
        console.error("Failed to generate certificate", e)
        alert("Houve um erro ao gerar seu certificado.")
    } finally {
        document.body.removeChild(container)
    }
}