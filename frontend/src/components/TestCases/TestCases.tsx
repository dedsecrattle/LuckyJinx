import React from "react";
import { Typography, Button, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./TestCases.scss";
import { EditNote } from "@mui/icons-material";

interface TestCase {
  id: string;
  number: number;
  input: string;
  expectedOutput: string;
  actualOutput?: {
    output: string | null;
    error: string | null;
    isCorrect: boolean | null;
  };
  isSubmitted?: boolean;
}

interface TestCasesProps {
  givenTestCases: TestCase[];
  customTestCases: TestCase[];
  addTestCase: () => void;
  updateTestCase: (id: string, field: "input" | "expectedOutput", value: string) => void;
  unsubmitTestCase: (id: string) => void;
  submitTestCase: (id: string) => void;
  deleteTestCase: (id: string) => void;
}

const TestCases: React.FC<TestCasesProps> = ({
  givenTestCases,
  customTestCases,
  addTestCase,
  updateTestCase,
  unsubmitTestCase,
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
          disabled={givenTestCases.length + customTestCases.length >= 8} // Adjust the limit as needed
        >
          Add One More Test Case
        </Button>
      </div>
      <div className="test-cases-list">
        {givenTestCases.map((testCase) => (
          <div key={testCase.id} className="test-case">
            <div className="test-case-header">
              <Typography variant="subtitle1" className="test-case-number">
                Test Case {testCase.number}
              </Typography>
            </div>
            <div className="test-case-content">
              <div className="test-case-field">
                <span className="field-label">Input:</span>
                <code className="field-value">{testCase.input}</code>
              </div>
              <div className="test-case-field">
                <span className="field-label">Expected Output:</span>
                <code className="field-value">{testCase.expectedOutput}</code>
              </div>
              <div className="test-case-field">
                <span className="field-label">Actual Output:</span>
                <code
                  className={`field-value ${
                    testCase.actualOutput
                      ? testCase.actualOutput.isCorrect === false
                        ? "incorrect"
                        : "correct"
                      : "not-executed"
                  }`}
                >
                  {testCase.actualOutput ? testCase.actualOutput.output : "Not executed yet"}
                </code>
              </div>
              {testCase.actualOutput?.error && (
                <div className="test-case-field">
                  <span className="field-label">Error:</span>
                  <code className="field-value error">{testCase.actualOutput.error}</code>
                </div>
              )}
            </div>
          </div>
        ))}
        {customTestCases.map((testCase) => (
          <div key={testCase.id} className="test-case">
            {/* Delete button */}
            <IconButton className="delete-test-case-button" onClick={() => deleteTestCase(testCase.id)} size="small">
              <CloseIcon style={{ color: "#fff" }} />
            </IconButton>
            <div className="test-case-header test-case-header-editable">
              <Typography variant="subtitle1" className="test-case-number">
                Test Case {testCase.number}
              </Typography>
              <IconButton onClick={() => unsubmitTestCase(testCase.id)}>
                <EditNote className="test-case-edit" />
              </IconButton>
            </div>
            <div className="test-case-content">
              {testCase.isSubmitted ? (
                // Display test case
                <>
                  <div className="test-case-field">
                    <span className="field-label">Input:</span>
                    <code className="field-value">{testCase.input}</code>
                  </div>
                  <div className="test-case-field">
                    <span className="field-label">Expected Output:</span>
                    <code className="field-value">{testCase.expectedOutput}</code>
                  </div>
                  <div className="test-case-field">
                    <span className="field-label">Actual Output:</span>
                    <code
                      className={`field-value ${
                        testCase.actualOutput
                          ? testCase.actualOutput.isCorrect === false
                            ? "incorrect"
                            : "correct"
                          : "not-executed"
                      }`}
                    >
                      {testCase.actualOutput ? testCase.actualOutput.output : "Not executed yet"}
                    </code>
                  </div>
                  {testCase.actualOutput?.error && (
                    <div className="test-case-field">
                      <span className="field-label">Error:</span>
                      <code className="field-value error">{testCase.actualOutput.error}</code>
                    </div>
                  )}
                </>
              ) : (
                // Editable test case fields
                <>
                  <TextField
                    label="Input"
                    multiline
                    rows={2}
                    variant="outlined"
                    fullWidth
                    value={testCase.input}
                    onChange={(e) => updateTestCase(testCase.id, "input", e.target.value)}
                    className="test-case-textfield"
                  />
                  <TextField
                    label="Expected Output"
                    multiline
                    rows={2}
                    variant="outlined"
                    fullWidth
                    value={testCase.expectedOutput}
                    onChange={(e) => updateTestCase(testCase.id, "expectedOutput", e.target.value)}
                    className="test-case-textfield"
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => submitTestCase(testCase.id)}
                    className="submit-test-case-button"
                  >
                    Save Test Case
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestCases;
