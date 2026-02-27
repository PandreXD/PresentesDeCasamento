import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import crypto from "crypto"
import { MercadoPagoConfig, Payment } from "mercadopago"

dotenv.config()

const app = express()

app.use(express.json({ limit: "1mb" }))

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "*",
    methods: ["GET", "POST"],
  })
)

const PORT = process.env.PORT || 3000

// ============================
// Mercado Pago Setup
// ============================

if (!process.env.MP_ACCESS_TOKEN) {
  console.error("❌ MP_ACCESS_TOKEN não definido no .env")
}

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
  options: { timeout: 8000 },
})

const paymentApi = new Payment(client)

// ============================
// Health Check
// ============================

app.get("/health", (req, res) => {
  res.send("ok")
})

// ============================
// Criar Pix
// ============================

app.post("/api/pix/create", async (req, res) => {
  try {
    const { amount, description, name, email } = req.body || {}

    const transaction_amount = Number(amount)

    if (!transaction_amount || transaction_amount <= 0) {
      return res.status(400).json({ error: "amount inválido" })
    }

    if (!email || !String(email).includes("@")) {
      return res.status(400).json({ error: "email inválido" })
    }

    const payerName = String(name || "Cliente").trim()

    const first_name = payerName.split(" ")[0] || "Cliente"
    const last_name = payerName.split(" ").slice(1).join(" ") || "Pix"

    const idempotencyKey = crypto.randomUUID()

    const result = await paymentApi.create({
      body: {
        transaction_amount,
        description: description || "Vale Presente (Pix)",
        payment_method_id: "pix",
        payer: {
          email,
          first_name,
          last_name,
        },
      },
      requestOptions: {
        idempotencyKey,
      },
    })

    const qr_code =
      result?.point_of_interaction?.transaction_data?.qr_code || null

    const qr_code_base64 =
      result?.point_of_interaction?.transaction_data?.qr_code_base64 || null

    const ticket_url =
      result?.point_of_interaction?.transaction_data?.ticket_url || null

    if (!result?.id || !qr_code || !qr_code_base64) {
      return res.status(500).json({
        error: "Mercado Pago não retornou QR Code",
      })
    }

    return res.json({
      id: result.id,
      status: result.status,
      qr_code,
      qr_code_base64,
      ticket_url,
    })

  } catch (err) {
    console.error("Erro create pix:", err?.message || err)
    return res.status(500).json({
      error: "Erro ao criar pagamento Pix",
      details: err?.message || String(err),
    })
  }
})

// ============================
// Consultar Status
// ============================

app.get("/api/pix/status/:id", async (req, res) => {
  try {
    const { id } = req.params
    if (!id) return res.status(400).json({ error: "id ausente" })

    const mp = await paymentApi.get({ id })

    return res.json({
      id: mp.id,
      status: mp.status,
      status_detail: mp.status_detail,
      transaction_amount: mp.transaction_amount,
      date_created: mp.date_created,
      date_approved: mp.date_approved,
    })

  } catch (err) {
    console.error("Erro status:", err?.message || err)
    return res.status(500).json({
      error: "Erro ao consultar status",
      details: err?.message || String(err),
    })
  }
})

// ============================
// Start Server
// ============================

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`)
})