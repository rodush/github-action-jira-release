const JiraAuthCredentials = {
  username: process.env.JIRA_API_USER,
  password: process.env.JIRA_API_TOKEN,
}

const JiraConfig = {
  JiraAuthCredentials,
  JiraDomain: process.env.ATLASSIAN_CLOUD_DOMAIN,
}

export default JiraConfig
