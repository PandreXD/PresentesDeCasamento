export async function createPixPayment(payload) {
  const res = await fetch("/api/pix/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || "Erro ao criar pagamento")
  return data
}

export async function getPixStatus(id) {
  const res = await fetch(`/api/pix/status/${id}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error || "Erro ao consultar status")
  return data
}