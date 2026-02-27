import styles from "./Main.module.scss"

export default function Main() {
  return (
    <header className={styles.header}>
      <h1>Lista de Presentes</h1>
      <p>Escolha um presente e pague via Pix.</p>
    </header>
  )
}