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

const QUERY_ALL_SECTIONS = `
  query GetAllSections($courseSlug: String!) {
    courseModuleCollection(where: { slug: $courseSlug }, limit: 1) {
      items {
        sectionsCollection {
          items {
            title
            description
            lessonsCollection {
              items {
                title
                slug
              }
              total
            }
          }
        }
      }
    }
  }
`;

const QUERY_COURSE_INFORMATION = `
  query GetCourseInformation($courseSlug: String!) {
    courseModuleCollection(where: { slug: $courseSlug }, limit: 1) {
      items {
        title
        slug
        githubUrl
        format
        formatData {
          gitRepoTemplate
        }
        sectionsCollection {
          total
        }
      }
    }
  }
  `;

const QUERY_SECTION_INFORMATION = `
  query GetSectionInformation($courseSlug: String!, $sectionIndex: Int!) {
    courseModuleCollection(where: { slug: $courseSlug }, limit: 1) {
      items {
        sectionsCollection(limit: 1, skip: $sectionIndex) {
          items {
            title
            description
            lessonsCollection {
              total
            }
          }
        }
      }
    }
  }
  `;

const QUERY_LESSON_INFORMATION = `
  query GetLessonInformation($courseSlug: String!, $sectionIndex: Int!, $lessonIndex: Int!) {
    courseModuleCollection(where: { slug: $courseSlug }, limit: 1) {
      items {
        sectionsCollection(limit: 1, skip: $sectionIndex) {
          items {
            lessonsCollection(limit: 1, skip: $lessonIndex) {
              items {
                title
                slug
                content
                files {
                  sourceCollection {
                    items {
                      url
                      fileName
                      title
                      contentType
                    }
                  }
                  templateCollection {
                    items {
                      url
                      fileName
                      contentType
                    }
                  }
                  solutionCollection {
                    items {
                      url
                      fileName
                      contentType
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }`;

export {
  QUERY_ALL_SECTIONS,
  QUERY_COURSE_INFORMATION,
  QUERY_COURSE_OVERVIEW_FIELDS,
  QUERY_COURSE_OVERVIEW_METADATA_FIELDS,
  QUERY_LESSON_INFORMATION,
  QUERY_LESSONS_COLLECTION_ID_AND_TOTAL,
  QUERY_SECTION_INFORMATION,
};
