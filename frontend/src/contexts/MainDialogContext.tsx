import { createContext, ReactNode, useContext, useState } from "react";

interface MainDialogContextType {
  isOpen: boolean;
  title: string;
  content: string;
  openDialog: () => void;
  closeDialog: () => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
}

const MainDialogContext = createContext<MainDialogContextType>({
  isOpen: false,
  title: "",
  content: "",
  openDialog: () => {},
  closeDialog: () => {},
  setTitle: () => {},
  setContent: () => {},
});

export const MainDialogContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <MainDialogContext.Provider value={{ isOpen, title, content, openDialog, closeDialog, setTitle, setContent }}>
      {children}
    </MainDialogContext.Provider>
  );
};

export const useMainDialog = () => useContext(MainDialogContext);
