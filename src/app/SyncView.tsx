import { useEffect, useState } from "react";
import { historyProps, SyncViewProps, TodoItem } from "./Interface";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import TodoOverview from "./TodoOverView";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

export default function SyncView({
  TodoList,
  updateStorage,
  syncUrl,
  setSyncUrl,
  pushData,
  pullData,
  lang,
  syncID,
  setSyncID,
}: SyncViewProps) {
  const [pullTodoList, setPullTodoList] = useState<TodoItem[]>([]);
  const [pullDataTime, setPullDataTime] = useState<number>(0);
  const [dataType, setDataType] = useState<string>("import");
  const [dataImportInfo, setDataImportInfo] = useState<string>("");
  const [history, setHistory] = useState<historyProps[]>();

  const isPullData = async (type: string) => {
    if (type === "original") {
      return;
    } else {
      const rawresponse = await fetch(`${syncUrl}\\sync\\${syncID}`);
      console.log(rawresponse.ok);
      if (!rawresponse.ok) {
        toast(lang["sync_pull_fail_title"], {
          description: lang["sync_pull_fail_des"],
        });
      }
      const response = JSON.parse(await rawresponse.json());
      try {
        const todolistData = JSON.parse(response["todolist"]);
        const configData = JSON.parse(response["config"]);
        pullData(todolistData, configData, response.time);
      } catch {
        toast(lang["sync_pull_fail_title"], {
          description: lang["sync_pull_fail_des"],
        });
      }
    }
    setPullTodoList([]);
  };

  const handlePull = async () => {
    try {
      const rawresponse = await fetch(`${syncUrl}\\sync\\${syncID}`);
      if (!rawresponse.ok) {
        toast(lang["sync_pull_fail_title"], {
          description: lang["sync_pull_fail_des"],
        });
      }
      const response = JSON.parse(await rawresponse.json());
      const todolistData = JSON.parse(response.todolist);
      const time = response.time;
      setPullTodoList(todolistData);
      setPullDataTime(time);
    } catch {
      toast(lang["sync_pull_fail_title"], {
        description: lang["sync_pull_fail_des"],
      });
    }
  };

  const handlePullHistory = async () => {
    try {
      const rawresponse = await fetch(`${syncUrl}\\id\\${syncID}`);
      if (!rawresponse.ok) {
        throw new Error("Network response was not ok");
      }
      const response = JSON.parse(await rawresponse.json());
      setHistory(response);
    } catch {
      console.log("get history error");
    }
  };

  useEffect(() => {
    const syncurl = (localStorage.getItem("syncUrl") as string) || "";
    const syncid = (localStorage.getItem("syncID") as string) || "";
    setSyncUrl(syncurl);
    setSyncID(syncid);
  }, []);

  return (
    <>
      <div className="space-y-3">
        <div className="space-x-2 flex">
          <Input
            className="w-72"
            placeholder={lang["sync_urlinput"]}
            value={syncUrl}
            type="url"
            onChange={(e) => setSyncUrl(e.target.value)}
          />

          <Input
            placeholder="ID"
            className="w-24"
            value={syncID}
            onChange={(e) => setSyncID(e.target.value)}
          />

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                localStorage.setItem("syncUrl", syncUrl);
                localStorage.setItem("syncID", syncID);
                pushData();
              }}
            >
              {lang["sync_push"]}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.setItem("syncUrl", syncUrl);
                    localStorage.setItem("syncID", syncID);
                    handlePull();
                  }}
                >
                  {lang["sync_pull"]}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>{lang["sync_dialog_title"]}</DialogHeader>
                <DialogDescription>{lang["sync_dialog_des"]}</DialogDescription>
                <div className="flex flex-col w-full">
                  <p className="text-sm font-semibold text-zinc-400">
                    {lang["sync_dialog_time"]}
                    {new Date(pullDataTime).toLocaleDateString() +
                      " " +
                      new Date(pullDataTime).toLocaleTimeString()}
                  </p>
                  <Tabs
                    onValueChange={(e) => setDataType(e)}
                    defaultValue="original"
                    className="w-full pt-2"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="original">
                        {lang["sync_dialog_tab_original"]}
                      </TabsTrigger>
                      <TabsTrigger value="import">
                        {lang["sync_dialog_tab_pull"]}
                      </TabsTrigger>
                    </TabsList>

                    <p className="font-light text-sm">{dataImportInfo}</p>
                    <TabsContent value="original" className="w-full">
                      <ScrollArea className="h-[30vh] w-full">
                        {TodoList.map((item: TodoItem, index) => {
                          return (
                            <div key={index} className="w-[24vw]">
                              <TodoOverview item={item} lang={lang} />
                            </div>
                          );
                        })}
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="import" className="w-full">
                      <ScrollArea className="h-[30vh] w-full">
                        {pullTodoList.map((item: TodoItem, index) => {
                          return (
                            <div key={index} className="w-[24vw]">
                              <TodoOverview item={item} lang={lang} />
                            </div>
                          );
                        })}
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </div>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    onClick={() => {
                      isPullData(dataType);
                    }}
                  >
                    {lang["sync_dialog_button"]}
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Separator />
        <div className="">
          <Button variant="outline" onClick={handlePullHistory}>
            {lang["sync_history_button"]}
          </Button>
          <ScrollArea className="h-64 mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">
                    {lang["sync_history_table_time"]}
                  </TableHead>
                  <TableHead className="text-center">
                    {lang["sync_history_table_todolist"]}
                  </TableHead>
                  <TableHead className="text-center">
                    {lang["sync_history_table_config"]}
                  </TableHead>
                  <TableHead className="text-center">
                    {lang["sync_history_table_use"]}
                  </TableHead>
                  <TableHead className="text-center">
                    {lang["sync_history_table_delete"]}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history?.map((his, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <p className="text-sm font-semibold">
                          {new Date(his.time).toLocaleDateString() +
                            "\t" +
                            new Date(his.time).toLocaleTimeString()}
                        </p>
                      </TableCell>
                      <TableCell align="center">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="border-none shadow-none"
                            >
                              {JSON.parse(his.todolist).length}{" "}
                              {lang["sync_history_table_pieces"]}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[30vw]">
                            <ScrollArea className="h-[50vh] w-[28vw]">
                              {(JSON.parse(his.todolist) as TodoItem[]).map(
                                (item, index) => {
                                  return (
                                    <div key={index} className="w-[28vw]">
                                      <TodoOverview item={item} lang={lang} />
                                    </div>
                                  );
                                }
                              )}
                            </ScrollArea>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="border-none shadow-none"
                            >
                              {lang["sync_history_table_viewconfig"]}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-fit">
                            <div className="text-wrap">{his.config}</div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-none shadow-none"
                          onClick={(e) => {
                            pullData(
                              JSON.parse(his.todolist),
                              JSON.parse(his.config),
                              his.time
                            );
                          }}
                        >
                          <CheckCircledIcon />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-none shadow-none"
                          onClick={(e) =>
                            toast("Comming Soon", {
                              description:
                                "This feature will be implemented in the next version",
                            })
                          }
                        >
                          <CrossCircledIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>

          <div className="w-full flex justify-center mt-1">
            <p className=" text-zinc-500 text-sm">{lang["sync_history_des"]}</p>
          </div>
        </div>
      </div>
    </>
  );
}
