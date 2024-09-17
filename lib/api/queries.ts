const QUERY_COURSE_CATALOG = `query {
  courseModuleCollection {
    items {
      slug
      title
      description
      level
      language
    }
  }
}`;

const QUERY_COURSE_GRAPHQL_FIELDS = `{
  slug
  title
  author {
    name
    url
  }
  description
  level
  language
  sectionsCollection {
    items {
      title
      description
    }
  }
  githubUrl
  format
  formatData {
    gitRepoTemplate
  }
}`;

export { QUERY_COURSE_CATALOG, QUERY_COURSE_GRAPHQL_FIELDS };
