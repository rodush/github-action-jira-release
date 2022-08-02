import got from 'got'
import JiraConfig from './config'

const jiraClient = got.extend({
  prefixUrl: JiraConfig.JiraDomain,
  options: { auth: JiraConfig.JiraAuthCredentials },
})

export default jiraClient
