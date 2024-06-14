import { TodoOverviewProps } from "./Interface";
import { BellIcon, CheckCircledIcon, CrossCircledIcon, TokensIcon } from "@radix-ui/react-icons";
import { levelColor } from "./DeafultProps";
import { Badge } from "@/components/ui/badge";

export default function TodoOverview({ item, lang }: TodoOverviewProps) {

  return (
    <div className="shadow ml-2 mr-2 dark:border w-full">
      <div className={"h-1 w-full rounded-t " + levelColor.get((item.level).toString())}></div>
      <div className="flex space-y-2 flex-col items-baseline p-2 mt-2 mb-3 ml-2 mr-2">
        <div className="flex items-center ml-2">
          <p className="w-96 text-nowrap truncate">{item.text}</p>
        </div>
        <div className="flex space-x-1 overflow-x-hidden w-full break-normal">
          {item.tags.map((tag, index) => {
            return (<Badge variant="outline" key={index} className="mr-1">{tag}</Badge>)
          })}
        </div>
        <div className="flex items-center justify-between space-x-2 ml-2 pr-4 w-full">
          <div className="flex items-center space-x-1">
            {item.completed ? <CheckCircledIcon /> : <CrossCircledIcon />}
            <p className="font-semibold text-xs">{item.completed ? lang["todooverview_completed"] : lang["todooverview_uncompleted"]}</p>
          </div>
          <div className="flex items-center space-x-1">
            <BellIcon />{" "}
            <p className="font-semibold text-xs">{item.deadline === "" ? lang["todooverview_deadline"] : item.deadline}</p>
          </div>
          <div className="flex items-center space-x-1">
            <TokensIcon />
            <p className="font-semibold text-xs">{item.sub.length}{lang["todooverview_subtodo"]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
