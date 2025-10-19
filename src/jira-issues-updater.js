/**
 * Jira issues updater.
 *
 * Loops over all tickets in Jira and updates field "Fix Versions" with the current $jiraVersion value
 */

import getJiraTicketsFromCommits from './github-api-client'
import jiraClient from './jira-client'

async function updateJiraTickets(tickets, jiraVersion) {
  console.info(
    'Tickets are: ' + tickets + ' and jira version is: ' + jiraVersion
  )
  const promises = tickets.map(async (t) => {
    try {
      const response = await jiraClient
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

      console.debug('Ticket: ' + t + ' was added to the release')

      return response
    } catch (error) {
      console.error(
        `Failed to update issue ${t}:`,
        error.response?.body || error
      )
      throw error
    }
  })

  return await Promise.all(promises)
}

async function setFixVersion(jiraVersion) {
  return getJiraTicketsFromCommits()
    .then((t) => updateJiraTickets(t, jiraVersion))
    .catch((e) => console.error(e))
    .then(() => {
      console.info('Done creating the version and updating tickets!')
    })
}

export default setFixVersion
