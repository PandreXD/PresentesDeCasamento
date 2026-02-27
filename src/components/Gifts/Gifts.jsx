import styles from "./Gifts.module.scss"
import { gifts } from "../../data/gifts"

export default function Gifts({ onSelectGift }) {
  return (
    <section className={styles.wrap}>
      <div className={styles.container}>
        {gifts.map((gift) => (
          <article key={gift.id} className={styles.card}>
            <h3 className={styles.title}>Vale Presente</h3>

            <div className={styles.middle}>
              <span className={styles.icon}>🎁</span>
              <strong className={styles.value}>R$ {gift.amount}</strong>
            </div>

            <button className={styles.btn} onClick={() => onSelectGift(gift)}>
              Presentear
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}