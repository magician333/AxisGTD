'use client';

import { useEffect, useState } from "react";
import { FooterProps } from "./Interface";

function Footer({ lang }: FooterProps) {
  const [motto, setMotto] = useState<string>("")
  const [randomIndex, setRandomIndex] = useState<number>(0);

  const timePlanningProverbs = {
    "en_US": [
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
    ],
    "zh_CN": [
      "时间就像海绵里的水，只要愿挤，总还是有的。 —— 鲁迅",
      "你若要喜爱你自己的价值，你就得给世界创造价值。 —— 歌德",
      "不要等待，时机永远不会恰到好处。 —— 拿破仑·希尔",
      "人生苦短，应该辉煌的活着，而不应虚度光阴。 —— 奥普拉·温弗瑞",
      "成功的人是跟别人学习经验，失败的人只跟自己学习经验。 —— 约瑟夫·阿迪生",
      "不要浪费时间，因为时间是构成生命的材料。 —— 本杰明·富兰克林",
      "勤奋是你生命的密码，能译出你一部壮丽的史诗。 —— 泰戈尔",
      "时间是最公平的，它给每个人都是24小时；时间也是最不公平的，它给每个人都不是24小时。 —— 汤姆斯·富勒",
      "效率是做好工作的灵魂。 —— 切斯特菲尔德",
      "不浪费时间，每时每刻都做些有用的事，戒掉一切不必要的行动。 —— 本杰明·富兰克林",
      "时间是由分秒累积成的，善于利用零星时间的人，才会做出更大的成绩来。 —— 华罗庚",
      "世界上那些最容易的事情中，拖延时间最不费力。 —— 罗伯特·沃波尔",
      "人生有一道难题，那就是如何使一寸光阴等于一寸生命。 —— 罗斯福",
      "效率不是孤立的，就像在公路上开车不遇到红灯一样，不是速度最快的就是效率最高的。 —— 彼得·德鲁克",
      "时间是伟大的导师。 —— 伯克",
      "今日能做的事，勿宕到明日。 —— 贝多芬",
      "没有任何东西比时间更宝贵，同时没有任何东西比时间更容易被浪费。 —— 本杰明·富兰克林",
      "工作是使生活得到快乐的最好方法。 —— 康德",
      "效率是做好工作的灵魂，正如时间是衡量生命的尺度。 —— 拉斯金",
      "时间乃是最大的革新家。 —— 培根",
      "时间是一切财富中最宝贵的财富。 —— 德奥弗拉斯特·萨伊"
    ]
  };
  useEffect(() => {
    setRandomIndex(Math.floor(Math.random() * 21))
    const randomProverbs = timePlanningProverbs.zh_CN[randomIndex]
    setMotto(randomProverbs)
  }, [])
  return (
    <div className="flex items-center w-screen justify-center pt-1 pb-2 ">
      <p className="text-gray-400 text-sm">{timePlanningProverbs["en_US"][randomIndex]}</p>

    </div>
  )
}

export default Footer
