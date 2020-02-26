import React from "react";
import { Progress } from "semantic-ui-react";

const ProgressBar = ({ uploadState, percents }) =>
  uploadState === 'uploading' && (
    <Progress
      className="progress_bar"
      percent={percents}
      progress
      indicating
      size="medium"
      inverted
    />
  );

export default ProgressBar;
