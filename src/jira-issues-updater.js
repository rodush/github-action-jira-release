/**
 * Jira issues updater.
 *
 * Loops over all tickets in Jira and updates field "Fix Versions" with the current $jiraVersion value
 */

import getJiraTicketsFromCommits from './github-api-client'
import jiraClient from './jira-client'

async function updateJiraTickets(tickets, jiraVersion) {
  const promises = tickets.map((t) => {
    return jiraClient
      .put(`rest/api/3/issue/${t}`, {
        json: {
          update: {
            fixVersions: [
              {
                add: { name: jiraVersion },
              },
            ],
          },
        },
      })
      .json()
  })

  return await Promise.all(promises)
}

async function setFixVersion(jiraVersion) {
  return getJiraTicketsFromCommits()
    .then((t) => updateJiraTickets(t, jiraVersion))
    .catch((e) => console.error(e))
    .then(() => console.info('Done!'))
}

export default setFixVersion
