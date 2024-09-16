import spaceImport from "contentful-import";

import exportFile from "@/lib/db/data/export.json";

const {
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_MANAGEMENT_TOKEN,
  CONTENTFUL_ENVIRONMENT,
} = process.env;

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_MANAGEMENT_TOKEN) {
  throw new Error(
    [
      "Parameters missing...",
      "Please run the setup command as follows",
      `CONTENTFUL_SPACE_ID=XXX CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-XXX pnpm run setup`,
    ].join("\n"),
  );
}

spaceImport({
  spaceId: CONTENTFUL_SPACE_ID,
  environmentId: CONTENTFUL_ENVIRONMENT,
  managementToken: CONTENTFUL_MANAGEMENT_TOKEN,
  content: exportFile,
})
  .then(() => console.info("The content model of your space is set up!"))
  .catch((e) => console.error(e));
