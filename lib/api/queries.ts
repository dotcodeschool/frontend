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

export { QUERY_COURSE_GRAPHQL_FIELDS };
