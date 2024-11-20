"use client";

import { Box, Text, VStack } from "@chakra-ui/react";
import Lottie from "lottie-react";
import React, { useEffect, useState } from "react";

import { Navbar } from "@/components/navbar";
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

  const lottieContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [textOpacity, setTextOpacity] = useState(0);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (lottieContainerRef.current) {
      lottieContainerRef.current.style.opacity = "1";
    }

    if (!isMobile) {
      const audio = new Audio("/static/successSound.mp3");
      audio.oncanplaythrough = () => {
        void audio.play().catch(() => {
          // Ignore audio playback errors
        });
      };
    }

    const timer = setTimeout(
      () => {
        setTextOpacity(1);
      },
      isMobile ? 0 : 1500,
    );

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box pb={24} px={[6, 12]} textAlign="center">
      <Navbar cta={false} />
      <VStack maxW="4xl" mt={[-10, 12]} mx="auto">
        <Box opacity={0} ref={lottieContainerRef} transition="opacity 6s">
          <Lottie
            animationData={successAnimation}
            style={{ cursor: "default", height: 400 }}
          />
        </Box>
        <Text
          fontFamily="fantasy"
          fontSize="2xl"
          fontWeight="900"
          mt={-8}
          opacity={textOpacity}
          transition="opacity 2s"
        >
          Achievement Unlocked!
        </Text>
        <Text
          fontSize="lg"
          maxW="lg"
          opacity={textOpacity}
          transition="opacity 1s"
          transitionDelay="0.5s"
        >
          Congratulations! You have successfully completed the {courseTitle}{" "}
          course. You&apos;re officially one step closer to building your own
          blockchain on Polkadot.
        </Text>
        <SocialButtons tweetText={tweetText} />
      </VStack>
    </Box>
  );
};

export default SuccessPage;
