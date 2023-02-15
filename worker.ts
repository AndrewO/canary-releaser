import { Worker } from '@temporalio/worker';
import * as activities from './activities.js';

async function run() {
  const worker = await Worker.create({
    workflowsPath: './workflow.ts',
    activities,
    taskQueue: 'canary-releaser',
  });
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});