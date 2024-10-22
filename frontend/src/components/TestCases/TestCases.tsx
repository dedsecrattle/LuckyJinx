import React from "react";
import { Typography, Button, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./TestCases.scss";

interface TestCase {
  number: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  isSubmitted?: boolean;
}

interface TestCasesProps {
  defaultTestCases: TestCase[];
  userTestCases: TestCase[];
  addTestCase: () => void;
  updateTestCase: (
    index: number,
    field: "input" | "expectedOutput",
    value: string
  ) => void;
  submitTestCase: (index: number) => void;
  deleteTestCase: (index: number) => void;
}

const TestCases: React.FC<TestCasesProps> = ({
  defaultTestCases,
  userTestCases,
  addTestCase,
  updateTestCase,
  submitTestCase,
  deleteTestCase,
}) => {
  return (
    <div className="test-cases-box">
      <div className="test-cases-header">
        <Typography variant="h6" className="test-cases-title">
          Test Cases
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={addTestCase}
          disabled={userTestCases.length >= 5}
        >
          Add Test Case
        </Button>
      </div>
      <div className="test-cases-list">
        {[...defaultTestCases, ...userTestCases].map((testCase, index) => {
          const isUserTestCase = index >= defaultTestCases.length;
          const userTestCaseIndex = index - defaultTestCases.length;

          return (
            <div key={testCase.number} className="test-case">
              {/* Delete button */}
              {isUserTestCase && (
                <IconButton
                  className="delete-test-case-button"
                  onClick={() => deleteTestCase(userTestCaseIndex)}
                >
                  <CloseIcon style={{ color: "#fff" }} />
                </IconButton>
              )}
              <div className="test-case-header">
                <Typography variant="subtitle1" className="test-case-number">
                  Test Case {testCase.number}
                </Typography>
              </div>
              <div className="test-case-content">
                {isUserTestCase && !testCase.isSubmitted ? (
                  <>
                    <TextField
                      label="Input"
                      multiline
                      rows={2}
                      variant="outlined"
                      fullWidth
                      value={testCase.input}
                      onChange={(e) =>
                        updateTestCase(
                          userTestCaseIndex,
                          "input",
                          e.target.value
                        )
                      }
                      className="test-case-textfield"
                    />
                    <TextField
                      label="Expected Output"
                      multiline
                      rows={1}
                      variant="outlined"
                      fullWidth
                      value={testCase.expectedOutput}
                      onChange={(e) =>
                        updateTestCase(
                          userTestCaseIndex,
                          "expectedOutput",
                          e.target.value
                        )
                      }
                      className="test-case-textfield"
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => submitTestCase(userTestCaseIndex)}
                      className="submit-test-case-button"
                    >
                      Add Test Case
                    </Button>
                  </>
                ) : (
                  // Display test case
                  <>
                    <div className="test-case-field">
                      <span className="field-label">Input:</span>
                      <span className="field-value">{testCase.input}</span>
                    </div>
                    <div className="test-case-field">
                      <span className="field-label">Expected Output:</span>
                      <span className="field-value">
                        {testCase.expectedOutput}
                      </span>
                    </div>
                    <div className="test-case-field">
                      <span className="field-label">Actual Output:</span>
                      <span className="field-value">{testCase.actualOutput}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestCases;
