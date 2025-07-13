"use client";

import { useEffect, useState } from "react";
import { FormatToggle } from "./FormatToggle";

type FormatToggleWrapperProps = {
  slug: string;
  format: string;
  title?: string;
};

const FormatToggleWrapper = ({
  slug,
  format,
  title = "this course",
}: FormatToggleWrapperProps) => {
  const [formatData, setFormatData] = useState({
    hasInBrowser: false,
    hasOnMachine: false,
    currentFormat: format || "inBrowserCourse",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFormats = async () => {
      try {
        // Determine if this is an in-browser or on-machine course based on the slug
        const isInBrowser = slug.startsWith("in-browser-");
        const baseSlug = isInBrowser ? slug.replace("in-browser-", "") : slug;
        const alternateSlug = isInBrowser ? baseSlug : `in-browser-${baseSlug}`;

        // Check if the alternate format exists in the local content/courses directory
        const response = await fetch(
          `/api/check-course-exists?slug=${alternateSlug}&checkLocal=true`,
        );
        const { exists } = await response.json();

        console.log(
          "FormatToggleWrapper - Alternate exists:",
          exists,
          "for slug:",
          slug,
          "alternate slug:",
          alternateSlug,
        );

        setFormatData({
          hasInBrowser: isInBrowser ? true : exists,
          hasOnMachine: isInBrowser ? exists : true,
          currentFormat: isInBrowser ? "inBrowserCourse" : "onMachineCourse",
        });
      } catch (error) {
        console.error("Error checking course formats:", error);
        // Default to showing only the current format
        setFormatData({
          hasInBrowser: format === "inBrowserCourse",
          hasOnMachine: format === "onMachineCourse",
          currentFormat: format || "inBrowserCourse",
        });
      } finally {
        setLoading(false);
      }
    };

    checkFormats();
  }, [slug, format]);

  if (loading) {
    return null; // Don't show anything while loading
  }

  return (
    <FormatToggle
      slug={slug}
      hasInBrowser={formatData.hasInBrowser}
      hasOnMachine={formatData.hasOnMachine}
      currentFormat={formatData.currentFormat}
      title={title}
    />
  );
};

export { FormatToggleWrapper };
