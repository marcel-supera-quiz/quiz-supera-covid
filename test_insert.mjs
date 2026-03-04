import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function testInsert() {
    console.log("Testing participants insert...")
    const { data: partResult, error: partError } = await supabase
        .from('participants')
        .insert([{
            nome: "Test Node",
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

    console.log("Participant Insert Success! ID:", partResult.id)

    console.log("Testing quiz_responses insert...")
    const finalData = {
        p1_frequencia: 1,
        p2_foco: 2,
        p3_energia: 1,
        p4_velocidade: 2,
        p5_localizacao: 1,
        p6_causalidade: 2,
        p7_sintomas: ["Fadiga"],
        score_ig: 80,
        segmentacao: "baixo",
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
        console.error("Quiz Responses Insert Error:", respError)
    } else {
        console.log("Quiz Responses Insert Success!")
    }
}

testInsert()
