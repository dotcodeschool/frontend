const QUERY_COURSE_OVERVIEW_METADATA_FIELDS = `{
  title
  description
}`;

const QUERY_COURSE_OVERVIEW_FIELDS = `{
  title
  description
  author {
    name
    url
  }
  level
  language
  format
  sectionsCollection {
    items {
      sys {
        id
      }
      title
      description
    }
  }
  slug
}`;

const QUERY_LESSONS_COLLECTION_ID_AND_TOTAL = `{
  lessonsCollection {
    items {
      sys {
        id
      }
    }
    total
  }
}`;

export {
  QUERY_COURSE_OVERVIEW_FIELDS,
  QUERY_COURSE_OVERVIEW_METADATA_FIELDS,
  QUERY_LESSONS_COLLECTION_ID_AND_TOTAL,
};
