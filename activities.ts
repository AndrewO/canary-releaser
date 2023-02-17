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

export async function commitRelease(revision: Revision) {
  console.log(`Committing release ${revision}`)
  // Remove any selectors and just route all traffic to the specified revision
  return Promise.resolve()
}

