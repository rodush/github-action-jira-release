// Jira API: version
// Version <--> Release (subj / verb)

// 1. Get all Jira releases from the Rest API
// "checkout-v1.2.3"
// 2. Find current Jira version (matching tag with the Jira version name)
// 3. Find all previous releases
// 4. Filter (keep) all unreleased
// 5. Update previous unreleased versions in Jira with the "released: true" and "releaseDate: now/today"

function findUnreleasedVersions(releases) {
  const result = releases.filter(r => !r.released)
  
  return transformResponse(result)
}

function getVersionNumberFromTag(tag) {
  return parseInt(tag.replace("v", "").replaceAll('.', ''), 10)
}

async function markVersionAsReleased(jiraClient, versionId) {
  const releaseDate = (new Date().toISOString()).split('T')[0]
  const payload = {
    id: versionId,
    released: true,
    releaseDate
  }
  
  return jiraClient.post(payload).catch(e => {
    console.error("Failed to mark version in Jira as 'Released'", e)
  })
}

/**
 * Pick id, name, released from each object
 */
function transformResponse(response) {
  return response.map(r => {
    const { id, name, released } = r
    return {
      id,
      name,
      released,
    }
  })
}

function fetchJiraVersions() {
  return [
    {
      self: 'https://your-domain.atlassian.net/rest/api/3/version/10000',
      id: '10000',
      description: 'An excellent version',
      name: 'checkout-v1.2.2',
      archived: false,
      released: true,
      releaseDate: '2010-07-06',
      overdue: true,
      userReleaseDate: '6/Jul/2010',
      projectId: 10000,
    },
    {
      self: 'https://your-domain.atlassian.net/rest/api/3/version/10010',
      id: '10010',
      description: 'Minor Bugfix version',
      name: 'checkout-v1.2.3', // <-- Should also be updated as it also is going to be released
      archived: false,
      released: false,
      overdue: false,
      projectId: 10000,
      issuesStatusForFixVersion: {
        unmapped: 0,
        toDo: 10,
        inProgress: 20,
        done: 100,
      },
    },
    {
      self: 'https://your-domain.atlassian.net/rest/api/3/version/10010',
      id: '10020',
      description: 'Minor Bugfix version',
      name: 'checkout-v1.2.4', // <-- Currently being released in Github Action
      archived: false,
      released: false,
      overdue: false,
      projectId: 10000,
      issuesStatusForFixVersion: {
        unmapped: 0,
        toDo: 10,
        inProgress: 20,
        done: 100,
      },
    },
  ]
}

export {
  fetchJiraVersions,
  getVersionNumberFromTag,
  findUnreleasedVersions,
  markVersionAsReleased,
}