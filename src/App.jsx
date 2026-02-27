import { useState } from "react"
import "./global.scss"

import Gifts from "./components/Gifts/Gifts"
import Main from "./components/Main/Main"
import Pix from "./components/Pix/Pix"
import Countdown from "./components/Countdown/Countdown"

export default function App() {
  const [selectedGift, setSelectedGift] = useState(null)

  return (
    <>
      <Main />
      <Countdown />
      <Gifts onSelectGift={setSelectedGift} />
      <Pix
        gift={selectedGift}
        open={!!selectedGift}
        onClose={() => setSelectedGift(null)}
      />
    </>
  )
}