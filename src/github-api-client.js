/**
 * Fetches all commits which are in the latest release (compares last and second-to-last releases)
 * Picks Jira issue key from the commit message
 */

import { context, getOctokit } from '@actions/github'
import * as core from '@actions/core'

const defaultApiParams = { owner: context.repo.owner, repo: context.repo.repo }
const jiraTicketRegex = new RegExp(
  `^.*(${core.getInput('project_key')}-\\d+).*`,
  'i'
)

const token = process.env.GITHUB_TOKEN
if (!token) throw new Error('GITHUB_TOKEN is not set')
const github = getOctokit(token)

async function getJiraTicketsFromCommits() {
  console.log('Getting Jira Tickets From Commits')

  const { data: tags } = await github.rest.repos.listTags({
    ...defaultApiParams,
    per_page: 2,
  })

  console.log('Retrieved List of tags: ' + tags.toString())

  const [latestTag, previousTag] = tags

  const [latestCommit, previousCommit] = await Promise.all([
    github.rest.repos.getCommit({
      ...defaultApiParams,
      ref: latestTag.commit.sha,
    }),
    github.rest.repos.getCommit({
      ...defaultApiParams,
      ref: previousTag.commit.sha,
    }),
  ])

  console.log(
    'List of latest commits are: ' +
      latestCommit.toString() +
      ' And Previous Commits are: ' +
      previousCommit.toString()
  )

  // We are shifting the last commit's date one second, so to not include the commit from the previous tag
  const since = new Date(
    new Date(previousCommit.data.commit.committer.date).valueOf() + 1000
  ).toISOString()

  const commits = await github.rest.repos.listCommits({
    ...defaultApiParams,
    since,
    until: latestCommit.data.commit.committer.date,
  })

  console.log('Commits for this release are: ' + commits.toString())

  const jiraTickets = commits.data
    .map((c) => {
      const regexMatches = jiraTicketRegex.exec(c.commit.message) || []
      return regexMatches[1]
    })
    .filter((el) => el)

  console.log(
    'Commits for this tag that matches Jira ticket are: ' +
      jiraTickets.toString()
  )

  return Array.from(new Set(jiraTickets)) // use Set to eliminate duplicate entries
}

export default getJiraTicketsFromCommits
