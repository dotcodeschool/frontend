"use client";

import { Box, Container, Heading, Text } from "@chakra-ui/react";
import Lottie from "lottie-react";
import { useEffect, useRef } from "react";

import { slugToTitle } from "@/lib/utils";
import successAnimation from "@/public/static/successAnimation.json";

import { SocialButtons } from "./components/SocialButtons";

const SuccessPage = ({
  params: { course },
}: {
  params: { course: string };
}) => {
  const courseTitle = slugToTitle(course);
  const tweetText = encodeURIComponent(
    `I just completed the ${courseTitle} course on @dotcodeschool.\n\nNow, I am one step closer to building my own blockchain on @Polkadot.`,
  );

  const lottieContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isMobile: boolean = window.matchMedia("(max-width: 768px)").matches;

    if (lottieContainerRef.current) {
      lottieContainerRef.current.style.opacity = "1";
      lottieContainerRef.current.style.transform = isMobile
        ? "scale(0.8)"
        : "scale(1)";
    }
  }, []);

  return (
    <Container maxW="container.lg" py={16}>
      <Box
        opacity={0}
        ref={lottieContainerRef}
        transition="all 0.5s ease-in-out"
      >
        <Lottie animationData={successAnimation} loop={false} />
      </Box>
      <Box textAlign="center">
        <Heading as="h1" mb={4}>
          Congratulations!
        </Heading>
        <Text fontSize="lg" mb={8}>
          You&apos;ve completed this course. Share your achievement with your
          network!
        </Text>
        <SocialButtons tweetText={tweetText} />
      </Box>
    </Container>
  );
};

export default SuccessPage;
