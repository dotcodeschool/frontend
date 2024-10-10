import { Stack } from "@chakra-ui/react";

import { Feature } from "./Feature";

const FeaturesList = () => (
  <Stack spacing={8}>
    <Feature
      alt="Interactive Learning"
      description={
        <>
          The most respected engineers don&apos;t just read about technology —
          they build it.
          <br />
          <br />
          Improve the depth of your understanding by building real projects with
          in-browser step-by-step interactive lessons.
        </>
      }
      image="/static/images/interface.png"
      title={
        <>
          Ditch the Docs.
          <br />
          Code the Blocks.
        </>
      }
    />
    <Feature
      alt="Expert Instructors"
      description="Our courses are created by industry experts who have 
      first-hand experience building web3 applications and
      working in the blockchain industry."
      image="/static/images/experts.png"
      isImageFirst
      title="Learn directly from experts"
    />
  </Stack>
);

export { FeaturesList };
