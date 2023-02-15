import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities.js';
import type { Revision, Stage } from './index.js'

const {deployRevision, applyRelease, waitForDelay, waitForApproval, commitRelease} = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 minutes',
});

// Release workflow
export async function release(rollbackRevision: Revision, nextRevision: Revision, stages: Array<Stage>) {
  await deployRevision(nextRevision)

  console.log('stages', stages)
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
