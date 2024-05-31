'use client';

import { useEffect, useState } from "react";

function Footer() {
  const [motto, setMotto] = useState<string>("")

  useEffect(() => {
    const timePlanningProverbs = [
      "Time is the coin of your life. It is the only coin you have, and only you can determine how it will be spent.",
      "The best time to plant a tree was 20 years ago. The second best time is now.",
      "Don't count the days, make the days count.",
      "Time management is really a misnomer - the time is going to go by regardless of whether you manage it or not. It's more about self-management.",
      "Plan your work for today and work your plan today.",
      "To choose time is to save time.",
      "Failing to plan is planning to fail.",
      "Wise use of time is the fundamental principle of productivity.",
      "Remember that time is money. If you can't measure it, you can't manage it.",
      "Time is what we want most, but what we use worst.",
      "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack in will.",
      "Effective time management is about being more selective with how you spend your time, and being willing to say no to things that aren't a priority.",
      "Time is a versatile performer. It flies, marches on, heals all wounds, runs around, and will tell.",
      "Yesterday is history, tomorrow is a mystery, today is a gift. That's why we call it the present.",
      "The time you enjoy wasting is not wasted time.",
      "It's not about the length of time you have — it's about what you do with it.",
      "Life is 10% what happens to you and 90% how you react to it.",
      "Time is at the same time the most valuable and the most perishable thing in the world.",
      "Do not squander time, for that is the stuff life is made of.",
      "Manage your time well if you wish to make every moment of your life worthwhile and productive.",
      "The clock tells you what time it is and that's your business.",
      "Time is the most valuable asset of life; it is precious, irrecoverable, and irreplaceable.",
      "Plan for the future because that is where you are going to spend the rest of your life."
    ];
    const randomIndex = Math.floor(Math.random() * timePlanningProverbs.length + 1)
    const randomProverbs = timePlanningProverbs[randomIndex]
    setMotto(randomProverbs)
  }, [])
  return (
    <div className="flex items-center w-screen justify-center pt-1 pb-2 ">
      <p className="text-gray-400 text-sm">{motto}</p>
    </div>
  )
}

export default Footer
