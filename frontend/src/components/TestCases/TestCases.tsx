import React from "react";
import { Typography, Button, TextField, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "./TestCases.scss";

interface TestCase {
  id: string;
  number: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  isDefault: boolean;
  isSubmitted?: boolean;
}

interface TestCasesProps {
  testCases: TestCase[];
  addTestCase: () => void;
  updateTestCase: (id: string, field: "input" | "expectedOutput", value: string) => void;
  submitTestCase: (id: string) => void;
  deleteTestCase: (id: string) => void;
}

const TestCases: React.FC<TestCasesProps> = ({
  testCases,
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
          disabled={testCases.length >= 8} // Adjust the limit as needed
        >
          Add One More Test Case
        </Button>
      </div>
      <div className="test-cases-list">
        {testCases.map((testCase) => (
          <div key={testCase.id} className="test-case">
            {/* Delete button */}
            <IconButton className="delete-test-case-button" onClick={() => deleteTestCase(testCase.id)} size="small">
              <CloseIcon style={{ color: "#fff" }} />
            </IconButton>
            <div className="test-case-header">
              <Typography variant="subtitle1" className="test-case-number">
                Test Case {testCase.number}
              </Typography>
            </div>
            <div className="test-case-content">
              {testCase.isSubmitted ? (
                // Display test case
                <>
                  <div className="test-case-field">
                    <span className="field-label">Input:</span>
                    <span className="field-value">{testCase.input}</span>
                  </div>
                  <div className="test-case-field">
                    <span className="field-label">Expected Output:</span>
                    <span className="field-value">{testCase.expectedOutput}</span>
                  </div>
                  <div className="test-case-field">
                    <span className="field-label">Actual Output:</span>
                    <span
                      className={`field-value ${
                        testCase.actualOutput.trim() === testCase.expectedOutput.trim()
                          ? "correct"
                          : testCase.actualOutput.trim() === ""
                            ? "not-executed"
                            : "incorrect"
                      }`}
                    >
                      {testCase.actualOutput || "Not executed yet"}
                    </span>
                  </div>
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
                    rows={1}
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
                    Add Test Case
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
