import { ReactElement, useState } from "react";
import "./Interview.scss";
import { Box, Button, FormControlLabel, MenuItem, Radio, RadioGroup, Select, Typography } from "@mui/material";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { Categories, QuestionComplexity } from "../../models/question.model";

const MAX_TOPIC_COUNT = 5;
const MIN_TOPIC_COUNT = 1;

const Interview = (): ReactElement => {
  const [topics, setTopics] = useState<[Categories]>([Categories.ALGORITHMS]);
  const [difficulty, setDifficulty] = useState<QuestionComplexity>("Easy");

  const submitForm = () => {
    console.log("Topics: ", topics);
    console.log("Difficulty: ", difficulty);
  };

  return (
    <Box className="Interview">
      <Navbar />
      <Box className="Interview-form">
        <Typography className="Interview-form-title">Select Topic & Difficulty</Typography>
        <Typography className="Interview-form-description" textAlign="center">
          Choose at least 1, at most {MAX_TOPIC_COUNT} topics to get started. Choosing more than one topic increases the
          chances of matching and reduces the waiting time.
        </Typography>
        <Typography className="Interview-form-label">Topic</Typography>
        <Select
          className="Interview-form-topic-select"
          value={topics}
          multiple
          placeholder="Select categories"
          onChange={(e) => setTopics(e.target.value as [Categories])}
          inputProps={{
            classes: {
              icon: "AccountSettings-select-icon",
            },
          }}
          MenuProps={{
            sx: {
              "&& .Mui-selected": {
                background: "#d4ff50",
              },
            },
          }}
        >
          {Object.values(Categories).map((category) => {
            return (
              <MenuItem
                key={category}
                value={category}
                disabled={
                  (topics.length >= MAX_TOPIC_COUNT && !topics.includes(category)) ||
                  (topics.length <= MIN_TOPIC_COUNT && topics.includes(category))
                }
              >
                {category}
              </MenuItem>
            );
          })}
        </Select>
        <Typography className="Interview-form-label">Difficulty</Typography>

        <RadioGroup
          className="Interview-form-difficulty-select"
          defaultValue="Easy"
          onChange={(e) => {
            setDifficulty(e.target.value as QuestionComplexity);
          }}
          row
        >
          <FormControlLabel
            value="Easy"
            control={<Radio className="Interview-form-difficulty-select-radio" />}
            label="Easy"
          />
          <FormControlLabel
            value="Medium"
            control={<Radio className="Interview-form-difficulty-select-radio" />}
            label="Medium"
          />
          <FormControlLabel
            value="Hard"
            control={<Radio className="Interview-form-difficulty-select-radio" />}
            label="Hard"
          />
        </RadioGroup>
      </Box>

      <Button className="Interview-form-button-submit" color="primary" variant="contained" onClick={submitForm}>
        Proceed
      </Button>

      <Footer />
    </Box>
  );
};

export default Interview;
