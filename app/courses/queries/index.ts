const QUERY_COURSE_CATALOG = `query {
  courseModuleCollection {
    items {
      slug
      title
      description
      level
      language
      format
    }
  }
}`;

export { QUERY_COURSE_CATALOG };
