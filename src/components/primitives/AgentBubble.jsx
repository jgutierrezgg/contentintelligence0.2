import styles from './AgentBubble.module.css'

export default function AgentBubble({ text, typing }) {
  return (
    <div className={styles.row}>
      <div className={styles.avatar}>AI</div>
      <div className={styles.bubble}>
        {typing ? <TypingDots /> : text}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <span className={styles.dots}>
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </span>
  )
}
