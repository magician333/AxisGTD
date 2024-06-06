'use client';

import { useEffect, useState } from "react";
import { FooterProps } from "./Interface";

function Footer({ lang }: FooterProps) {
  const [motto, setMotto] = useState<string>("")

  useEffect(() => {
    const mottos = lang["motto"]
    // console.log(mottos)
    //
    try {
      const randomIndex = Math.floor(Math.random() * mottos.length)
      setMotto(mottos[randomIndex])
    } catch {
      console.log("Get mottos")
    }
  }, [lang])
  return (
    <div className="flex items-center w-screen justify-center pt-1 pb-1 ">{
      <p className="text-gray-400 text-sm">{motto}</p>
    }
    </div>
  )
}

export default Footer
