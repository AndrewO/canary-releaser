import { proxyActivities, sleep, setHandler, condition, defineSignal, SignalDefinition, CancellationScope, Trigger, ApplicationFailure, proxySinks, LoggerSinks } from '@temporalio/workflow';
import type * as activities from './activities.js';
import type { Revision, Stage } from './index.js'

const {deployRevision, applyRelease, commitRelease} = proxyActivities<typeof activities>({
  startToCloseTimeout: '10 minutes',
});

const { defaultWorkerLogger: console } = proxySinks<LoggerSinks>();


// Release workflow
export async function release(rollbackRevision: Revision, nextRevision: Revision, stages: Array<Stage>) {
  await 
  await deployRevision(nextRevision)

  console.debug('stages', { stages })
  try {
    for(const stage of stages) {
      if (stage.command === 'release') {
        await applyRelease(nextRevision, stage.selector)
      } else if (stage.command === 'delay') {
        await waitForDelay(stage.seconds)  
      } else if (stage.command === 'waitForApproval') {
        await waitForApproval() 
      } else {
        console.error(`Unknown stage command:`, stage)
      }
    }  
  } catch(e) {
    console.info("Error caught. Rolling back", { error: e, rollbackRevision })
    commitRelease(rollbackRevision)
    throw e
  }
  console.info("Committing release", { nextRevision})
  await commitRelease(nextRevision)
}

async function waitForDelay(delay: number) {
  console.info(`Sleeping for `, { delay })
  return sleep(delay * 1000)
}

const approval = new Trigger<boolean>()
const approvalSignal = defineSignal<[boolean]>('approval')
async function waitForApproval() {
  console.info("Waiting for approval.", {})
  setHandler(approvalSignal, (answer) => answer ? approval.resolve(true) : approval.reject(ApplicationFailure.nonRetryable("Approval denied. Release cancelled.")))
  return Promise.race([
    approval,
    sleep('5 minutes')
  ])
}
