import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  EnvelopeClosedIcon,
  FileTextIcon,
  GitHubLogoIcon,
  HeartIcon,
} from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { SidebarProps, TodoItem } from "./Interface";
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
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import localForage from "localforage";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TodoOverview from "./TodoOverView";
import Image from "next/image";

export default function Sidebar({
  lang,
  TodoList,
  displayLang,
  layoutType,
  displayCompleted,
  updateStorage,
  setLayoutType,
  setTODOList,
  setDisplayLang,
  setDisplayCompleted,
  syncUrl,
  setSyncUrl,
  pushData,
  pullData,
}: SidebarProps) {
  const [fileContent, setFileContent] = useState<string>("");
  const [dataType, setDataType] = useState<string>("import");
  const [dataImportInfo, setDataImportInfo] = useState<string>("");
  const [secTodoList, setSecTodoList] = useState<TodoItem[]>([]);
  const [pullTodoList, setPullTodoList] = useState<TodoItem[]>([]);
  const [pullDataTime, setPullDataTime] = useState<number>(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.target.files;
    if (files) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setFileContent(e.target?.result as string);
        } else {
          console.error("Failed to read file content.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileupload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSecTodoList(JSON.parse(fileContent) as TodoItem[]);
      if (TodoList !== secTodoList) {
        setDataImportInfo(lang["setting_importdata_dialog_info"]);
      }
    } catch {
      toast(lang["toast_nouploadfile_title"], {
        description: lang["toast_nouploadfile_content"],
      });
    }
  };

  const reIndexTodo = (Data: TodoItem[]) => {
    let index = 1;
    for (const item in Data) {
      Data[item].index = index;
      index += 1;
    }
    return Data;
  };

  const ImportData = (
    type: string,
    originalTodolist: TodoItem[],
    newTodoList: TodoItem[]
  ) => {
    if (type === "original") {
      updateStorage([]);
      updateStorage(reIndexTodo(originalTodolist));
    } else {
      updateStorage([]);
      updateStorage(reIndexTodo(newTodoList));
    }
    setFileContent("");
    setSecTodoList([]);
  };

  const isPullData = (type: string) => {
    if (type === "original") {
      return;
    } else {
      pullData();
    }
    setPullTodoList([]);
  };

  const handlePull = async () => {
    await fetch(syncUrl)
      .then(async (rawresponse) => {
        await rawresponse.json().then((response) => {
          try {
            const todolistData = JSON.parse(response["Todolist"]) as TodoItem[];

            setPullTodoList(todolistData);
            setPullDataTime(JSON.parse(response["Time"]));
          } catch {
            console.log("error");
          }
        });
      })
      .catch((err) => {
        toast("Pull Failed", { description: err });
        return;
      });
  };

  useEffect(() => {
    const syncurl = (localStorage.getItem("syncUrl") as string) || "";
    setSyncUrl(syncurl);
  }, []);

  return (
    <>
      <ScrollArea className="h-[90vh] overflow-y-hidden">
        <div className="mt-5 space-y-5 flex flex-col items-baseline ml-4 mr-4">
          <div>
            <p className="text-l font-semibold">
              {lang["setting_setlayout_label"]}
            </p>
            <p className="text-xs font-thin mb-2">
              {lang["setting_setlayout_des"]}
            </p>
            <Select
              defaultValue="axis"
              value={layoutType}
              onValueChange={(e) => {
                setLayoutType(e);
                localStorage.setItem("layout", e);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Set layout"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="axis">
                  {lang["setting_setlayout_name_1"]}
                </SelectItem>
                <SelectItem value="kanban">
                  {lang["setting_setlayout_name_2"]}
                </SelectItem>
                <SelectItem value="board">
                  {lang["setting_setlayout_name_3"]}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-l font-semibold">
              {lang["setting_setlanguage_label"]}
            </p>
            <p className="text-xs font-thin mb-2">
              {lang["setting_setlanguage_des"]}
            </p>
            <Select
              defaultValue="en_US"
              value={displayLang}
              onValueChange={(e) => {
                setDisplayLang(e);
                localStorage.setItem("language", e);
              }}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={lang["setting_setlanguage_label"]}
                ></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en_US">English</SelectItem>
                <SelectItem value="zh_CN">简体中文</SelectItem>
                <SelectItem value="de_DE">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-l font-semibold">
              {lang["setting_notification_label"]}
            </p>
            <p className="text-xs font-thin mb-2">
              {lang["setting_notification_des"]}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                Notification.requestPermission().then((result) => {
                  if (result === "granted") {
                    toast(
                      lang["toast_notification_premission_available_title"],
                      {
                        description:
                          lang[
                            "toast_notification_premission_available_content"
                          ],
                      }
                    );
                  } else if (result === "denied") {
                    toast(lang["toast_notification_premission_denied_title"], {
                      description:
                        lang["toast_notification_premission_denied_content"],
                    });
                  }
                });
              }}
            >
              {lang["setting_notification_button"]}
            </Button>
          </div>

          <div>
            <p className="text-l font-semibold">
              {lang["setting_displaycompleted_label"]}
            </p>
            <p className="text-xs font-thin mb-2">
              {lang["setting_displaycompleted_des"]}
            </p>

            <Switch
              checked={displayCompleted}
              onCheckedChange={(e) => {
                setDisplayCompleted(e);
                localStorage.setItem(
                  "displayCompleted",
                  (!displayCompleted).toString()
                );
              }}
            />
          </div>

          <div>
            <p className="text-l font-semibold">{lang["setting_sync_label"]}</p>
            <p className="text-xs font-thin mb-2">{lang["setting_sync_des"]}</p>
            <div className="space-y-2">
              <Input
                className="w-72"
                placeholder={lang["setting_sync_urlinput"]}
                value={syncUrl}
                type="url"
                onChange={(e) => setSyncUrl(e.target.value)}
              />

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.setItem("syncUrl", syncUrl);
                    pushData();
                  }}
                >
                  {lang["setting_sync_push"]}
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        localStorage.setItem("syncUrl", syncUrl);
                        handlePull();
                      }}
                    >
                      {lang["setting_sync_pull"]}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      {lang["setting_sync_dialog_title"]}
                    </DialogHeader>
                    <DialogDescription>
                      {lang["setting_sync_dialog_des"]}
                    </DialogDescription>
                    <div className="flex flex-col w-full">
                      <p className="text-sm font-semibold text-zinc-400">
                        {lang["setting_sync_dialog_time"]}
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
                            {lang["setting_sync_dialog_tab_original"]}
                          </TabsTrigger>
                          <TabsTrigger value="import">
                            {lang["setting_sync_dialog_tab_pull"]} -
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
                        {lang["setting_sync_dialog_button"]}
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div>
            <p className="text-l font-semibold">
              {lang["setting_exportdata_label"]}
            </p>
            <p className="text-xs font-thin mb-2">
              {lang["setting_exportdata_des"]}
            </p>

            <Button
              variant="outline"
              onClick={() => {
                const date = Date.now().toString();
                const blob = new Blob([JSON.stringify(TodoList)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "AxisGTD-" + date + ".json";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
            >
              {lang["setting_exportdata_button"]}
            </Button>
          </div>

          <div>
            <p className="text-l font-semibold">
              {lang["setting_importdata_label"]}
            </p>
            <p className="text-xs font-thin mb-2">
              {lang["setting_importdata_des"]}
            </p>
            <div>
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDataType("original");
                        setSecTodoList([]);
                      }}
                    >
                      {lang["setting_importdata_button"]}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      {lang["setting_importdata_dialog_title"]}
                    </DialogHeader>
                    <DialogDescription>
                      {lang["setting_importdata_dialog_des"]}
                    </DialogDescription>
                    <div className="flex flex-col w-full">
                      <form
                        onSubmit={handleFileupload}
                        className="flex space-x-2"
                      >
                        <Input
                          type="file"
                          accept=".json"
                          onChange={handleFileChange}
                        />
                        <Button
                          variant="outline"
                          type="submit"
                          onClick={() => {
                            handleFileupload;
                          }}
                        >
                          {lang["setting_importdata_dialog_upload_button"]}
                        </Button>
                      </form>
                      <Tabs
                        onValueChange={(e) => setDataType(e)}
                        defaultValue="original"
                        className="w-full pt-2"
                      >
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="original">
                            {lang["setting_importdata_dialog_tab_original"]}
                          </TabsTrigger>
                          <TabsTrigger value="import">
                            {lang["setting_importdata_dialog_tab_import"]}
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
                            {secTodoList.map((item: TodoItem, index) => {
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
                          ImportData(dataType, TodoList, secTodoList);
                        }}
                      >
                        {lang["setting_importdata_dialog_button"]}
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          <div>
            <p className="text-l font-semibold">
              {lang["setting_cleardata_label"]}
            </p>
            <p className="text-xs font-thin mb-2">
              {lang["setting_cleardata_des"]}
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  {lang["setting_cleardata_button"]}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  {lang["setting_cleardata_dialog_title"]}
                </DialogHeader>
                <DialogDescription>
                  {lang["setting_cleardata_dialog_des"]}
                </DialogDescription>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>
                      {lang["setting_cleardata_dialog_cancelbutton"]}
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTODOList([]);
                        localForage.setItem("TODOList", []);
                        toast(lang["toast_clean_title"], {
                          description: lang["toast_clean_content"],
                        });
                      }}
                    >
                      {lang["setting_cleardata_dialog_clearbutton"]}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div>
            <p className="text-l font-semibold mb-2">
              {lang["setting_about_label"]}
            </p>
            <p className="break-words font-light text-sm whitespace-pre-wrap">
              {lang["setting_about_des"]}
            </p>
            <br />
            <p>
              <b>{lang["setting_note_label"]}</b>
              <br />
              {lang["setting_note_des"]}
            </p>
          </div>
        </div>

        <div className="flex space-x-5 justify-between pl-2 pr-2 mb-2 mt-2">
          <Dialog>
            <DialogTrigger>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HeartIcon className="size-5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {lang["setting_donate_dialog_title"]}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{lang["setting_donate_dialog_title"]}</DialogTitle>
                <DialogDescription>
                  {lang["setting_donate_dialog_des"]}
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-5">
                <Image
                  src="/Donate_Paypal.png"
                  alt="Donate_Paypal"
                  width={200}
                  height={200}
                />

                <Image
                  src="/Donate_Wechat.png"
                  alt="Donate_Wechat"
                  width={200}
                  height={200}
                />
              </div>
              <DialogClose asChild>
                <Button variant="outline">
                  {lang["setting_donate_dialog_button"]}
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <FileTextIcon className="size-5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {lang["setting_privacypolicy_dialog_title"]}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {lang["setting_privacypolicy_dialog_title"]}
                </DialogTitle>
                <DialogDescription>
                  {lang["setting_privacypolicy_dialog_des"]}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-start justify-center space-y-5">
                <ScrollArea className="h-[30vh] p-2">
                  <p className="whitespace-pre-wrap">
                    {lang["setting_privacypolicy_dialog_content"]}
                  </p>
                </ScrollArea>
              </div>
              <DialogClose asChild>
                <Button variant="outline">
                  {lang["setting_privacypolicy_dialog_button"]}
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <EnvelopeClosedIcon />
                  </TooltipTrigger>
                  <TooltipContent>
                    {lang["setting_contact_dialog_title"]}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {lang["setting_contact_dialog_title"]}
                </DialogTitle>
                <DialogDescription>
                  {lang["setting_contact_dialog_des"]}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-start justify-center space-y-5">
                <Link
                  href="mailto:magician33333@gmail.com"
                  className="flex space-x-3 items-center"
                >
                  <EnvelopeClosedIcon className="size-5" />
                  <Label>
                    {lang["setting_contact_dialog_email"]} :
                    magician333333@gmail.com
                  </Label>
                </Link>
                <Link
                  href="https://github.com/magician333/AxisGTD"
                  target="_blank"
                  className="flex space-x-3 items-center"
                >
                  <GitHubLogoIcon className="size-5" />
                  <Label>Github : https://github.com/magician333/AxisGTD</Label>
                </Link>
              </div>
              <DialogClose asChild>
                <Button variant="outline">
                  {lang["setting_contact_dialog_button"]}
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      </ScrollArea>
    </>
  );
}
