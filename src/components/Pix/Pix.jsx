import { useEffect, useRef, useState } from "react"
import styles from "./Pix.module.scss"
import { createPixPayment, getPixStatus } from "../../services/api"

export default function Pix({ gift, open, onClose }) {
  const [payer, setPayer] = useState({ name: "", email: "" })
  const [pix, setPix] = useState(null)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const timerRef = useRef(null)

  const approved = status?.status === "approved"

  useEffect(() => {
    if (!open) return

    setPayer({ name: "", email: "" })
    setPix(null)
    setStatus(null)
    setLoading(false)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [open])

  async function handleCreatePix() {
    if (!payer.name || !payer.email) return

    setLoading(true)

    try {
      const data = await createPixPayment({
        amount: gift.amount,
        description: gift.description,
        name: payer.name,
        email: payer.email,
      })

      setPix(data)
      setStatus({ status: data.status })

      timerRef.current = setInterval(async () => {
        const s = await getPixStatus(data.id)
        setStatus(s)

        if (s.status === "approved") {
          clearInterval(timerRef.current)
        }
      }, 3000)

    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Pagamento via Pix</h2>

        {!pix ? (
          <>
            <input
              placeholder="Seu nome"
              value={payer.name}
              onChange={(e) => setPayer({ ...payer, name: e.target.value })}
            />
            <input
              placeholder="Seu email"
              value={payer.email}
              onChange={(e) => setPayer({ ...payer, email: e.target.value })}
            />

            <button onClick={handleCreatePix} disabled={loading}>
              {loading ? "Gerando..." : "Gerar Pix"}
            </button>
          </>
        ) : (
          <>
            <img
              src={`data:image/png;base64,${pix.qr_code_base64}`}
              alt="QR Code"
            />

            <button onClick={() => navigator.clipboard.writeText(pix.qr_code)}>
              Copiar código Pix
            </button>

            <div className={styles.status}>
              {approved ? "✅ Pix confirmado" : "⏳ Aguardando pagamento"}
            </div>
          </>
        )}
      </div>
    </div>
  )
}