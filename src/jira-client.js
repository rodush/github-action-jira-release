import got from 'got'
import JiraConfig from './config'

const jiraClient = got.extend({
  prefixUrl: JiraConfig.JiraDomain,
  auth: JiraConfig.JiraAuthCredentials,
})

export default jiraClient
