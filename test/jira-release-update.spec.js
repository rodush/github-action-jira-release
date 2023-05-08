import {
  fetchJiraVersions,
  findUnreleasedVersions,
  getVersionNumberFromTag,
  markVersionAsReleased
} from '../src/jira-release-updater.js'
import { jest } from '@jest/globals'

describe("Jira Release Updater", () => {
  it("finds unreleased versions", () => {
    const versionsList = fetchJiraVersions()
    const result = findUnreleasedVersions(versionsList)
    const expectedResult = [
      {
        id: '10010',
        name: 'checkout-v1.2.3',
        released: false,
      },
      {
        id: '10020',
        name: 'checkout-v1.2.4',
        released: false,
      },
    ]
    expect(JSON.stringify(result)).toMatch(JSON.stringify(expectedResult))
  })
  
  it("gets version as a number from the tag", () => {
    const tag = "v1.2.4"
    expect(getVersionNumberFromTag(tag)).toEqual(124)
  })
  
  it("sends payload to mark Jira version as released", async () => {
    const jiraClient = {
      post: jest.fn().mockResolvedValue(true)
    }
    const versionId = 10000;
    await markVersionAsReleased(jiraClient, versionId)
    
    const now = new Date()
    const month = `0${now.getMonth() + 1}`.substring(-2)
    const day = `0${now.getDate()}`.substring(-2)
    
    const expectedPayload = {
      id: versionId,
      released: true,
      releaseDate: `${now.getFullYear()}-${month}-${day}`
    }
    expect(jiraClient.post).toHaveBeenCalledWith(expectedPayload)
  })
  
  it("handles exception while marking Jira version as released", async () => {
    const apiCallError = new Error('API call failure')
    const jiraClient = {
      post: jest.fn().mockRejectedValue(apiCallError),
    }
    const versionId = 10000;
    console.error = jest.fn()
    
    await markVersionAsReleased(jiraClient, versionId)
    expect(console.error).toHaveBeenCalledTimes(1)
    expect(console.error).toHaveBeenCalledWith(
      "Failed to mark version in Jira as 'Released'",
      apiCallError
    )
  })
})