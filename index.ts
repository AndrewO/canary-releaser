#!/usr/bin/env node
import {$, argv, sleep, question} from 'zx' // ZX has a lot of wonderful conveniences for writing shell scripts with Node

type Revision = string // Could be tag, file path, URL, version...

type Stage = { command: 'release', selector: any} |
  {command: 'delay', seconds: number} |
  {command: 'waitForApproval'}

// Client

function usage() {
  console.log(`release <rollback-revision> <next-revision> [[r:<selector] [d:<seconds>] [w]]`)
  process.exit(2)
}

const rollbackRevision = argv._.shift()
const nextRevision = argv._.shift()

if(!!argv.h || !rollbackRevision || !nextRevision) {
  usage()
} else {
  // Install rollback handler
  [
    'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGTRAP', 'SIGABRT',
    'SIGBUS', 'SIGFPE', 'SIGSEGV', 'SIGUSR1', 'SIGUSR2', 'SIGTERM',
    'uncaughtException', 'unhandledRejection'
  ].forEach(signal => process.on(signal, async () => {
    // There are ways this could be made more robust, but let's move along to the next example...
    await rollback(rollbackRevision)
    process.exit(1)
  }))

  // build stage commands
  let stages: Array<Stage> = []
  for(const s of argv._) {
    const [command, arg] = s.split(':', 2)
    if(command === "r") {
      stages.push({command: "release", selector: arg})
    } else if (command === "d") {
      stages.push({command: "delay", seconds: parseFloat(arg)})
    } else if (command === "w") {
      stages.push({command: "waitForApproval"})
    }
  }
  // Call release
  await release(nextRevision, stages)   
}


// Release workflow
async function release(nextRevision: Revision, stages: Array<Stage>) {
  await deployRevision(nextRevision)

  for(const stage of stages) {
    if (stage.command === 'release') {
      await applyRelease(nextRevision, stage.selector)
    } else if (stage.command === 'delay') {
      await waitForDelay(stage.seconds)  
    } else if (stage.command === 'waitForApproval') {
      await waitForApproval()
    } else {
      console.error(`Unknown stage command: ${stage}`)
    }
  }
  await commitRelease(nextRevision)
}

async function rollback(rollbackRevision: Revision) {
  await commitRelease(rollbackRevision)
}

// Activities
async function deployRevision(revision: Revision) {
  console.log(`Deploying ${revision}`)
  // Fetch an artifact, push it to wokers, etc...
  return Promise.resolve()
}

async function applyRelease(revision: Revision, selector?: any) {
  console.log(`Applying release ${revision} to ${selector}`)
  // Configure a router to start routing requests matching selector to the new revision
  return Promise.resolve()

}

async function waitForDelay(delay: number) {
  console.log(`Sleeping for ${delay}`)
  await sleep(delay * 1000)
  return Promise.resolve()
}

async function waitForApproval() {
  const answer = await question(`Continue with release? [y/N] `)
  if(answer.toLocaleLowerCase() !== "y") {
    throw "Approval denied. Release cancelled."
  }
}

async function commitRelease(revision: Revision) {
  console.log(`Committing release ${revision}`)
  return Promise.resolve()
}

