import { sleep, question } from 'zx' // ZX has a lot of wonderful conveniences for writing shell scripts with Node

import type { Revision } from './index.js'

// Activities
export async function deployRevision(revision: Revision) {
  console.log(`Deploying ${revision}`)
  // Fetch an artifact, push it to wokers, etc...
  return Promise.resolve()
}

export async function applyRelease(revision: Revision, selector?: any) {
  console.log(`Applying release ${revision} to ${selector}`)
  // Configure a router to start routing requests matching selector to the new revision
  return Promise.resolve()

}

export async function waitForDelay(delay: number) {
  console.log(`Sleeping for ${delay}`)
  await sleep(delay * 1000)
  return Promise.resolve()
}

export async function waitForApproval() {
  const answer = await question(`Continue with release? [y/N] `)
  if(answer.toLocaleLowerCase() !== "y") {
    throw "Approval denied. Release cancelled."
  }
}

export async function commitRelease(revision: Revision) {
  console.log(`Committing release ${revision}`)
  return Promise.resolve()
}

