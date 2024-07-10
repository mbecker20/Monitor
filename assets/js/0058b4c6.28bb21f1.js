"use strict";(self.webpackChunkdocsite=self.webpackChunkdocsite||[]).push([[849],{6164:e=>{e.exports=JSON.parse('{"version":{"pluginId":"default","version":"current","label":"Next","banner":null,"badge":false,"noIndex":false,"className":"docs-version-current","isLast":true,"docsSidebars":{"docs":[{"type":"link","label":"What is Monitor?","href":"/docs/intro","docId":"intro","unlisted":false},{"type":"link","label":"Resources","href":"/docs/resources","docId":"resources","unlisted":false},{"type":"link","label":"Core Setup","href":"/docs/core-setup","docId":"core-setup","unlisted":false},{"type":"category","label":"Connecting Servers","items":[{"type":"link","label":"Setup Monitor Periphery","href":"/docs/connecting-servers/setup-periphery","docId":"connecting-servers/setup-periphery","unlisted":false},{"type":"link","label":"Adding Servers to Monitor","href":"/docs/connecting-servers/add-server","docId":"connecting-servers/add-server","unlisted":false}],"collapsed":true,"collapsible":true,"href":"/docs/connecting-servers"},{"type":"category","label":"Build Images","items":[{"type":"link","label":"Configuration","href":"/docs/build-images/configuration","docId":"build-images/configuration","unlisted":false},{"type":"link","label":"Pre-build command","href":"/docs/build-images/pre-build","docId":"build-images/pre-build","unlisted":false},{"type":"link","label":"Builders","href":"/docs/build-images/builders","docId":"build-images/builders","unlisted":false},{"type":"link","label":"Versioning","href":"/docs/build-images/versioning","docId":"build-images/versioning","unlisted":false}],"collapsed":true,"collapsible":true,"href":"/docs/build-images"},{"type":"category","label":"Deploy Containers","items":[{"type":"link","label":"Configuration","href":"/docs/deploy-containers/configuration","docId":"deploy-containers/configuration","unlisted":false},{"type":"link","label":"Container Management","href":"/docs/deploy-containers/lifetime-management","docId":"deploy-containers/lifetime-management","unlisted":false}],"collapsed":true,"collapsible":true,"href":"/docs/deploy-containers/"},{"type":"link","label":"Sync Resources","href":"/docs/sync-resources","docId":"sync-resources","unlisted":false},{"type":"link","label":"Permissioning Resources","href":"/docs/permissioning","docId":"permissioning","unlisted":false},{"type":"link","label":"API","href":"/docs/api","docId":"api","unlisted":false}]},"docs":{"api":{"id":"api","title":"API","description":"Monitor Core exposes an http API to read data, write configuration, and execute actions. The API documentation is generated from the code and is available here.","sidebar":"docs"},"build-images/builders":{"id":"build-images/builders","title":"Builders","description":"A builder is a machine running monitor periphery and docker, which is able to handle a RunBuild command from monitor core. Any server connected to monitor can be chosen as the builder for a build.","sidebar":"docs"},"build-images/configuration":{"id":"build-images/configuration","title":"Configuration","description":"Monitor just needs a bit of information in order to build your image.","sidebar":"docs"},"build-images/index":{"id":"build-images/index","title":"Building Images","description":"Monitor builds docker images by cloning the source repository from Github, running docker build,","sidebar":"docs"},"build-images/pre-build":{"id":"build-images/pre-build","title":"Pre-build command","description":"Sometimes a command needs to be run before running `docker build`, you can configure this in the pre build section.","sidebar":"docs"},"build-images/versioning":{"id":"build-images/versioning","title":"Versioning","description":"Monitor uses a major.minor.patch versioning scheme. Every build will auto increment the patch number, and push the image to docker hub with the version tag as well as the `latest` tag.","sidebar":"docs"},"connecting-servers/add-server":{"id":"connecting-servers/add-server","title":"Adding Servers to Monitor","description":"The easiest way to add servers is with the GUI.","sidebar":"docs"},"connecting-servers/index":{"id":"connecting-servers/index","title":"Connecting Servers","description":"Integrating a device into the monitor system has 2 steps:","sidebar":"docs"},"connecting-servers/setup-periphery":{"id":"connecting-servers/setup-periphery","title":"Setup Monitor Periphery","description":"The easiest way to setup periphery is to use the setup script (as root user):","sidebar":"docs"},"connecting-servers/templates":{"id":"connecting-servers/templates","title":"Cloud Templates","description":""},"core-setup":{"id":"core-setup","title":"Core Setup","description":"To run Monitor Core, you will need:","sidebar":"docs"},"deploy-containers/configuration":{"id":"deploy-containers/configuration","title":"Configuration","description":"Choose the docker image","sidebar":"docs"},"deploy-containers/index":{"id":"deploy-containers/index","title":"Deploy Containers","description":"Monitor can deploy any docker images that it can access with the configured docker accounts.","sidebar":"docs"},"deploy-containers/lifetime-management":{"id":"deploy-containers/lifetime-management","title":"Container Management","description":"The lifetime of a docker container is more like a virtual machine. They can be created, started, stopped, and destroyed. Monitor will display the state of the container and provides an API to manage all your container\'s lifetimes.","sidebar":"docs"},"file-paths":{"id":"file-paths","title":"File Paths","description":"When working with monitor, you might have to configure file or directory paths."},"intro":{"id":"intro","title":"What is Monitor?","description":"Monitor is a web app to provide structure for managing your servers, builds, deployments, and automated procedures.","sidebar":"docs"},"permissioning":{"id":"permissioning","title":"Permissioning Resources","description":"All monitor resources (servers, builds, deployment) have independant permission tables to allow for users to have granular access to these resources. By default, users do not see any resources until they are given at least read permissions.","sidebar":"docs"},"procedures":{"id":"procedures","title":"procedures","description":""},"resources":{"id":"resources","title":"Resources","description":"Entities like Server, Deployment, and Build all fall under the Resource abstraction. A server is a type of resource, a build is a type of resource, and so on.","sidebar":"docs"},"sync-resources":{"id":"sync-resources","title":"Sync Resources","description":"Monitor is able to sync resources declared in TOML files by diffing them against the existing resources,","sidebar":"docs"}}}}')}}]);