import { Deployment } from "@monitor/types";
import { clone, execute, mergeCommandLogError, pull } from "@monitor/util";
import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { remove } from "fs-extra";
import { join } from "path";
import { CONTAINER_REPO_ROOT, SECRETS } from "../config";

const git = fp((app: FastifyInstance, _: {}, done: () => void) => {
  app.post("/repo/clone", { onRequest: [app.auth] }, async (req, res) => {
    const { deployment } = req.body as { deployment: Deployment };
    const {
      containerName,
      repo,
      subfolder,
      branch,
      githubAccount,
      onClone,
      onPull,
    } = deployment;
    console.log("cloning repo");
    const cloneCle = await clone(
      repo!,
      join(CONTAINER_REPO_ROOT, containerName!),
      subfolder,
      branch,
      githubAccount && SECRETS.GITHUB_ACCOUNTS[githubAccount]
    );
    console.log("repo cloned");
    const onCloneCle =
      onClone &&
      (await execute(
        `cd ${join(
          CONTAINER_REPO_ROOT,
          containerName!,
          onClone.path || ""
        )} && ${onClone.command}`
      ));
    console.log("on clone executed");
    const onPullCle =
      onPull &&
      (await execute(
        `cd ${join(
          CONTAINER_REPO_ROOT,
          containerName!,
          onPull.path || ""
        )} && ${onPull.command}`
      ));
    console.log("on pull executed");
    const log = mergeCommandLogError(
      { name: "clone", cle: cloneCle },
      { name: "on clone", cle: onCloneCle },
      { name: "on pull", cle: onPullCle }
    );
    res.send(log);
  });

  app.post("/repo/pull", { onRequest: [app.auth] }, async (req, res) => {
    const { deployment } = req.body as { deployment: Deployment };
    const pullCle = await pull(
      join(CONTAINER_REPO_ROOT, deployment.containerName!),
      deployment.branch
    );
    const onPullCle =
      deployment.onPull &&
      (await execute(
        `cd ${join(
          CONTAINER_REPO_ROOT,
          deployment.containerName!,
          deployment.onPull.path || ""
        )} && ${deployment.onPull.command}`
      ));
    res.send(
      mergeCommandLogError(
        { name: "pull", cle: pullCle },
        { name: "post", cle: onPullCle }
      )
    );
  });

  app.post("/repo/delete", { onRequest: [app.auth] }, async (req, res) => {
    const { deployment } = req.body as { deployment: Deployment };
    await remove(join(CONTAINER_REPO_ROOT, deployment.containerName!)).catch();
    res.send();
  });

  done();
});

export default git;
