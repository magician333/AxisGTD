"use client";

import { useState, useEffect, useLayoutEffect } from "react";
import {
  HomeIcon,
  PauseIcon,
  PlayIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { TodoItem } from "../../Interface";
import { useParams } from "next/navigation";
import localForage from "localforage";
import { levelColor } from "@/app/DeafultProps";

function Zen() {
  const router = useParams<{ index: string }>();
  const [countdownTime, setCountdownTime] = useState(1800000);
  const [isCountdownActive, setIsCountdownActive] = useState(true);
  const [todo, setTodo] = useState<TodoItem>();
  const [lang, setLang] = useState<any>({});
  useLayoutEffect(() => {
    const setLanguage = async () => {
      if (localStorage.getItem("language") === undefined) {
        localStorage.setItem("language", "en_US");
      }
      let localLang = localStorage.getItem("language") as string;
      localLang = localLang || "en_us";

      await import("../../../../public/locales/" + localLang + ".json").then(
        (langData) => {
          setLang(langData.default);
        }
      );
    };
    setLanguage();
  });

  useEffect(() => {
    localForage.config({
      driver: localForage.INDEXEDDB,
      storeName: "AxisGTD",
      version: 1,
      description: "database for AisGTD",
    });

    localForage
      .getItem("TODOList")
      .then((value) => {
        const todo = (value as TodoItem[]).find(
          (item: any) => item.index.toString() === router.index
        );
        setTodo(todo);
      })
      .then(() => {
        console.log("Can't find todo");
      });
  }, []);

  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    const startCountdown = () => {
      timerId = setInterval(() => {
        if (countdownTime > 0) {
          setCountdownTime((prevTime) => prevTime - 1000);
        } else {
          clearInterval(timerId!);
          timerId = null;
          new Notification(lang["zen_notification_title"], {
            body: lang["zen_notification_content"],
            icon: "/icons/icon-circle.png",
          });
        }
      }, 1000);
    };

    if (isCountdownActive) {
      startCountdown();
    }

    return () => {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
    };
  }, [countdownTime, isCountdownActive]);

  const minutes = Math.floor(countdownTime / 60000)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((countdownTime % 60000) / 1000)
    .toString()
    .padStart(2, "0");

  const resetCountdown = () => {
    setCountdownTime(1800000);
    setIsCountdownActive(true);
  };

  const toggleCountdown = () => {
    setIsCountdownActive(!isCountdownActive);
  };

  return (
    <div className="flex items-center pt-20 flex-col">
      <div className=" w-[20vw] justify-center flex flex-col items-center">
        <p className="font-black text-7xl opacity-70 text-nowrap tracking-wide mb-2">
          {lang["zen_title"]}
        </p>
        <div
          className={
            levelColor.get((todo?.level as number)?.toString()) + " w-full h-[1vh]"
          }
        ></div>
      </div>
      <div className="mt-28 flex space-x-32 w-[40vw]">
        <p className="w-full text-[15rem] font-extrabold flex justify-center">
          {minutes}:{seconds}
        </p>
      </div>
      <div className="flex space-x-32">
        <ReloadIcon
          className="size-5 opacity-25 hover:opacity-100"
          onClick={resetCountdown}
        />
        <div className="opacity-25 hover:opacity-100">
          {isCountdownActive ? (
            <PauseIcon className="size-5" onClick={toggleCountdown} />
          ) : (
            <PlayIcon className="size-5" onClick={toggleCountdown} />
          )}
        </div>
        <Link href="/">
          <HomeIcon className="size-5 opacity-25 hover:opacity-100" />
        </Link>
      </div>
      <div className="mt-32 flex justify-center items-center">
        <p className="w-[50vw] text-wrap flex justify-center underline underline-offset-8">
          {todo?.text}
        </p>
      </div>
    </div>
  );
}

export default Zen;
