import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ReactElement, useEffect, useState } from "react";
import "./QuestionDialog.scss";
import { QuestionComplexity } from "../../models/question.model";
import { stringifyCategories } from "../../util/category.helper";

const QuestionDialog = (props: {
  isAddNew: boolean;
  isOpen: boolean;
  id: string;
  title: string;
  description: string;
  categories: string[];
  complexity: QuestionComplexity;
  link: string;
  setIsOpen: (isOpen: boolean) => void;
  setId: (id: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setCategories: (categories: string[]) => void;
  setComplexity: (complexity: QuestionComplexity) => void;
  setLink: (link: string) => void;
}): ReactElement => {
  const {
    isAddNew,
    isOpen,
    id,
    title,
    description,
    categories,
    complexity,
    link,
    setIsOpen,
    setId,
    setTitle,
    setDescription,
    setComplexity,
    setLink,
  } = props;

  const [categoriesString, setCategoriesString] = useState<string>("");

  useEffect(() => {
    setCategoriesString(stringifyCategories(categories));
  }, [categories]);

  const closeDialog = () => {
    setIsOpen(false);
  };

  const handleSubmit = () => {};

  return (
    <Dialog className="QuestionDialog" open={isOpen}>
      <DialogTitle>
        <Typography className="QuestionDialog-title">{isAddNew ? "Add" : "Edit"} Question</Typography>
      </DialogTitle>

      <DialogContent className="QuestionDialog-content">
        <Box className="QuestionDialog-line">
          <TextField
            className="QuestionDialog-input QuestionDialog-input-id"
            slotProps={{
              htmlInput: { className: "QuestionDialog-input-text" },
              inputLabel: { className: "QuestionDialog-input-label" },
            }}
            disabled={!isAddNew}
            margin="dense"
            label="ID"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <TextField
            className="QuestionDialog-input QuestionDialog-input-title"
            slotProps={{
              htmlInput: { className: "QuestionDialog-input-text" },
              inputLabel: { className: "QuestionDialog-input-label" },
            }}
            margin="dense"
            label="Title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>

        <Box className="QuestionDialog-line">
          <FormControl className="QuestionDialog-input QuestionDialog-input-complexity" margin="dense">
            <InputLabel className="QuestionDialog-input-label">Complexity</InputLabel>
            <Select
              className="QuestionDialog-input-text"
              value={complexity}
              onChange={(e) => setComplexity(e.target.value as QuestionComplexity)}
              label="Complexity"
            >
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </Select>
          </FormControl>
          <TextField
            className="QuestionDialog-input QuestionDialog-input-categories"
            slotProps={{
              htmlInput: { className: "QuestionDialog-input-text" },
              inputLabel: { className: "QuestionDialog-input-label" },
            }}
            margin="dense"
            label="Categories (separated by semicolon)"
            type="text"
            value={categoriesString}
            onChange={(e) => setCategoriesString(e.target.value)}
          />
        </Box>

        <TextField
          className="QuestionDialog-input"
          slotProps={{
            htmlInput: { className: "QuestionDialog-input-text" },
            inputLabel: { className: "QuestionDialog-input-label" },
          }}
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          className="QuestionDialog-input"
          slotProps={{
            htmlInput: { className: "QuestionDialog-input-text" },
            inputLabel: { className: "QuestionDialog-input-label" },
          }}
          margin="dense"
          label="Link"
          type="text"
          fullWidth
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={closeDialog} color="secondary" variant="contained">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionDialog;
