import { useEffect, useState } from "react"
import styles from "./Countdown.module.scss"

function pad2(n) {
  return String(n).padStart(2, "0")
}

export default function Countdown() {
  // 18 de abril de 2026 às 19:00 (horário local)
  const target = new Date(2026, 3, 18, 15, 0, 0) // mês 3 = abril

  const [time, setTime] = useState(() => getDiff(target))

  useEffect(() => {
    const t = setInterval(() => {
      setTime(getDiff(target))
    }, 1000)

    return () => clearInterval(t)
  }, [])

  const ended = time.totalMs <= 0

  return (
    <section className={styles.wrap}>
      <h2 className={styles.title}>{ended ? "Chegou o grande dia! 🎉" : "Faltam apenas..."}</h2>

      {!ended && (
        <div className={styles.boxes}>
          <div className={styles.box}>
            <span className={styles.num}>{time.days}</span>
            <span className={styles.label}>Dias</span>
          </div>

          <div className={styles.box}>
            <span className={styles.num}>{pad2(time.hours)}</span>
            <span className={styles.label}>Horas</span>
          </div>

          <div className={styles.box}>
            <span className={styles.num}>{pad2(time.minutes)}</span>
            <span className={styles.label}>Min</span>
          </div>

          <div className={styles.box}>
            <span className={styles.num}>{pad2(time.seconds)}</span>
            <span className={styles.label}>Seg</span>
          </div>
        </div>
      )}
    </section>
  )
}

function getDiff(targetDate) {
  const now = new Date()
  const totalMs = targetDate - now

  if (totalMs <= 0) {
    return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const totalSeconds = Math.floor(totalMs / 1000)

  const days = Math.floor(totalSeconds / (3600 * 24))
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { totalMs, days, hours, minutes, seconds }
}