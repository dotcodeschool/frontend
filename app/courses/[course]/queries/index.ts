const QUERY_COURSE_OVERVIEW_METADATA_FIELDS = `{
  title
  description
}`;

const QUERY_COURSE_OVERVIEW_FIELDS = `{
  ${QUERY_COURSE_OVERVIEW_METADATA_FIELDS}
  sectionsCollection {
    items {
      title
      description
    }
  }
  slug
}`;

export { QUERY_COURSE_OVERVIEW_FIELDS, QUERY_COURSE_OVERVIEW_METADATA_FIELDS };
