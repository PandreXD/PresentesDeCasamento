const BASE_URL = import.meta.env.VITE_API_URL || ""

async function safeJson(res) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return { raw: text }
  }
}

export async function createPixPayment(payload) {
  const res = await fetch(`${BASE_URL}/api/pix/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const data = await safeJson(res)
  if (!res.ok) {
    throw new Error(data?.error || data?.raw || "Erro ao criar pagamento")
  }

  return data
}

export async function getPixStatus(id) {
  const res = await fetch(`${BASE_URL}/api/pix/status/${id}`)
  const data = await safeJson(res)

  if (!res.ok) {
    throw new Error(data?.error || data?.raw || "Erro ao consultar status")
  }

  return data
}