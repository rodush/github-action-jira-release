import { context } from '@actions/github'
import * as core from '@actions/core'

import setFixVersion from './jira-issues-updater'
import jiraClient from './jira-client'

async function run() {
  try {
    const { tag_name, name } = context.payload.release

    let jiraVersionName = `${context.repo.repo}-${tag_name.replace(/^v/, '')}`
    const data = await jiraClient
      .post('rest/api/3/version', {
        json: {
          name: jiraVersionName,
          projectId: core.getInput('project_id'),
          description: name,
          released: core.getInput('released'),
        },
      })
      .json()

    console.log('Jira Release created with body: ', data)
    console.info(
      data
        ? 'Release URL: https://' +
            process.env.ATLASSIAN_CLOUD_DOMAIN +
            '.atlassian.net/projects/' +
            data.project +
            '/versions/' +
            data.id +
            '/tab/release-report-all-issues'
        : 'Error Occurred'
    )

    core.setOutput('jira_release_id', data ? data.id : '???')
    core.setOutput('jira_release_name', data ? data.name : '???')

    await setFixVersion(data.name)
  } catch (e) {
    console.error('Error', e)
    core.setFailed(e.toString())
  }
}

run()
