#!/usr/bin/env ts-node-esm
import { argv } from 'zx' // ZX has a lot of wonderful conveniences for writing shell scripts with Node
import { Connection, Client } from '@temporalio/client';

import { release } from './workflow.js';

export type Revision = string // Could be tag, file path, URL, version...

export type Stage = { command: 'release', selector: any} |
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
  // Connect to Temporal
  const connection = await Connection.connect();
  const client = new Client({
    connection,
  });

  // Call release
  const handle = await client.workflow.start(release, {
    args: [rollbackRevision, nextRevision, stages],
    taskQueue: 'canary-releaser',
    workflowId: `release-${nextRevision}-${new Date().toISOString()}`,
  });
  console.log(`Started workflow ${handle.workflowId}`);
}
