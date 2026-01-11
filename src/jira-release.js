import { context } from '@actions/github'
import { getInput, setFailed, setOutput} from '@actions/core'

import setFixVersion from './jira-issues-updater'
import jiraClient from './jira-client'

async function run() {
  try {
    const { tag_name, name, body } = context.payload.release

    let jiraVersionName = `${context.repo.repo}-${tag_name.replace(/^v/, '')}`

    const data = await jiraClient
      .post('rest/api/3/version', {
        json: {
          name: jiraVersionName,
          projectId: getInput('project_id'),
          description: body ?? name,
        },
      })
      .json()

    setOutput('jira_release_id', data ? data.id : 'N/A')
    setOutput('jira_release_name', data ? data.name : 'N/A')

    await setFixVersion(data.name)
  } catch (e) {
    console.error('Error', e)
    setFailed(e.toString())
  }
}

run()
