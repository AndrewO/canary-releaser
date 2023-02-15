# Canary Releaser

This is intended to demonstrate one of the most appealing parts of [Temporal](https://temporal.io) to me: the ability to easily migrate existing code into durable, replayable, observable, pausable workflows.

We start with a pretty simple commandline utility that's meant to control a canary deployment. First it ensures that a the new revision and a rollback revision are deployed. Then it starts the release by applying release selectors, delaying between stages, and waiting for manual approval depending on the arguments the release is invoked with.

In the real world, the deployment phase might involve pushing artifacts and starting services. The release phase might mean changing routing rules on a reverse proxy. These have been stubbed out here since they're not the most important part of this demonstration.