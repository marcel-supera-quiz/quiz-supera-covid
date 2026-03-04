import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://exvqmolcyernvcsreaor.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4dnFtb2xjeWVybnZjc3JlYW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MTc1NTksImV4cCI6MjA4NzE5MzU1OX0.y61G_8bhMFJ-QDb46Zb6TTMlbW8dPfY7MZE4XBQPorI'
const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
    const { data: partResult, error: partError } = await supabase
        .from('participants')
        .insert([{
            nome: "Test Real Payload",
            idade: 30,
            cidade_uf: "São Paulo",
            whatsapp: "11999999999"
        }])
        .select('id')
        .single()

    if (partError) {
        console.error("Participant Insert Error:", partError)
        return
    }

    const finalData = {
        p1_frequencia: 3,
        p2_foco: 3,
        p3_energia: 3,
        p4_velocidade: 3,
        p5_localizacao: 3,
        p6_causalidade: 3,
        p7_sintomas: ["Fadiga Mental"],
        p8_internacao: true,
        p9_escalabilidade: 'Menos de 10',
        p10_relato: 'Teste',
        score_ig: 60,
        segmentacao: "medio",
        fator_neuro_covid: false
    }

    const respPayload = {
        participant_id: partResult.id,
        ...finalData
    }

    const { error: respError } = await supabase
        .from('quiz_responses')
        .insert([respPayload])

    if (respError) {
        console.error("Quiz Responses Insert Error:\n", JSON.stringify(respError, null, 2))
    } else {
        console.log("Quiz Responses Insert Success!")
    }
}

testInsert()
