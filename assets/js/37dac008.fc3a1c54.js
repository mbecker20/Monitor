"use strict";(self.webpackChunkdocsite=self.webpackChunkdocsite||[]).push([[205],{3905:(e,t,n)=>{n.d(t,{Zo:()=>m,kt:()=>k});var a=n(7294);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function r(e,t){if(null==e)return{};var n,a,l=function(e,t){if(null==e)return{};var n,a,l={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var d=a.createContext({}),i=function(e){var t=a.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},m=function(e){var t=i(e.components);return a.createElement(d.Provider,{value:t},e.children)},s="mdxType",y={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,l=e.mdxType,o=e.originalType,d=e.parentName,m=r(e,["components","mdxType","originalType","parentName"]),s=i(n),u=l,k=s["".concat(d,".").concat(u)]||s[u]||y[u]||o;return n?a.createElement(k,p(p({ref:t},m),{},{components:n})):a.createElement(k,p({ref:t},m))}));function k(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var o=n.length,p=new Array(o);p[0]=u;var r={};for(var d in t)hasOwnProperty.call(t,d)&&(r[d]=t[d]);r.originalType=e,r[s]="string"==typeof e?e:l,p[1]=r;for(var i=2;i<o;i++)p[i]=n[i];return a.createElement.apply(null,p)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},4032:(e,t,n)=>{n.d(t,{Z:()=>l});var a=n(7294);function l(){return a.createElement("div",{style:{opacity:.7,backgroundColor:"rgb(175, 175, 175)",height:"3px",width:"100%",margin:"75px 0px"}})}},6555:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>i,contentTitle:()=>r,default:()=>u,frontMatter:()=>p,metadata:()=>d,toc:()=>m});var a=n(7462),l=(n(7294),n(3905)),o=n(4032);const p={},r="deployment",d={unversionedId:"api/deployment",id:"api/deployment",title:"deployment",description:"these routes relate to interacting with monitor deployments",source:"@site/docs/api/deployment.mdx",sourceDirName:"api",slug:"/api/deployment",permalink:"/monitor/api/deployment",draft:!1,editUrl:"https://github.com/mbecker20/monitor/tree/main/docsite/docs/api/deployment.mdx",tags:[],version:"current",frontMatter:{},sidebar:"docs",previous:{title:"build",permalink:"/monitor/api/build"},next:{title:"server",permalink:"/monitor/api/server"}},i={},m=[{value:"list deployments",id:"list-deployments",level:2},{value:"response body",id:"response-body",level:3},{value:"get deployment",id:"get-deployment",level:2},{value:"response body",id:"response-body-1",level:3},{value:"get deployment action state",id:"get-deployment-action-state",level:2},{value:"response body",id:"response-body-2",level:3},{value:"get deployment container log",id:"get-deployment-container-log",level:2},{value:"query params",id:"query-params",level:3},{value:"response body",id:"response-body-3",level:3},{value:"get deployment container stats",id:"get-deployment-container-stats",level:2},{value:"response body",id:"response-body-4",level:3},{value:"get deployment deployed version",id:"get-deployment-deployed-version",level:2},{value:"response body",id:"response-body-5",level:3},{value:"create deployment",id:"create-deployment",level:2},{value:"request body",id:"request-body",level:3},{value:"response body",id:"response-body-6",level:3},{value:"create full deployment",id:"create-full-deployment",level:2},{value:"request body",id:"request-body-1",level:3},{value:"response body",id:"response-body-7",level:3},{value:"copy deployment",id:"copy-deployment",level:2},{value:"request body",id:"request-body-2",level:3},{value:"response body",id:"response-body-8",level:3},{value:"delete deployment",id:"delete-deployment",level:2},{value:"response body",id:"response-body-9",level:3},{value:"update deployment",id:"update-deployment",level:2},{value:"request body",id:"request-body-3",level:3},{value:"response body",id:"response-body-10",level:3},{value:"rename deployment",id:"rename-deployment",level:2},{value:"request body",id:"request-body-4",level:3},{value:"reclone deployment",id:"reclone-deployment",level:2},{value:"response body",id:"response-body-11",level:3},{value:"pull deployment",id:"pull-deployment",level:2},{value:"response body",id:"response-body-12",level:3},{value:"deploy container",id:"deploy-container",level:2},{value:"response body",id:"response-body-13",level:3},{value:"start container",id:"start-container",level:2},{value:"response body",id:"response-body-14",level:3},{value:"stop container",id:"stop-container",level:2},{value:"response body",id:"response-body-15",level:3},{value:"remove container",id:"remove-container",level:2},{value:"response body",id:"response-body-16",level:3}],s={toc:m},y="wrapper";function u(e){let{components:t,...n}=e;return(0,l.kt)(y,(0,a.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"deployment"},"deployment"),(0,l.kt)("p",null,"these routes relate to interacting with monitor ",(0,l.kt)("inlineCode",{parentName:"p"},"deployments")),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"name"),(0,l.kt)("th",{parentName:"tr",align:null},"route"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/api/deployment#list-deployments"},"list deployments")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"GET /api/deployment/list"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/api/deployment#get-deployment"},"get deployment")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"GET /api/deployment/<deployment_id>"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/api/deployment#get-deployment-action-state"},"get deployment action state")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"GET /api/deployment/<deployment_id>/action_state"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/api/deployment#get-deployment-container-log"},"get deployment container log")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"GET /api/deployment/<deployment_id>/log"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/api/deployment#get-deployment-container-stats"},"get deployment container stats")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"GET /api/deployment/<deployment_id>/stats"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/api/deployment#get-deployment-deployed-version"},"get deployment deployed version")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"GET /api/deployment/<deployment_id>/deployed_version"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/api/deployment#create-deployment"},"create deployment")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"POST /api/deployment/create"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/api/deployment#create-full-deployment"},"create full deployment")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"POST /api/deployment/create_full"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/api/deployment#copy-deployment"},"copy deployment")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"POST /api/deployment/<deployment_id>/copy"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/api/deployment#delete-deployment"},"delete deployment")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"DELETE /api/deployment/<deployment_id>/delete"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/api/deployment#update-deployment"},"update deployment")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"PATCH /api/deployment/update"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/api/deployment#rename-deployment"},"rename deployment")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"PATCH /api/deployment/<deployment_id>/rename"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/api/deployment#reclone-deployment"},"reclone deployment")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"POST /api/deployment/<deployment_id>/reclone"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/api/deployment#pull-deployment"},"pull deployment")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"POST /api/deployment/<deployment_id>/pull"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/api/deployment#deploy-container"},"deploy container")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"POST /api/deployment/<deployment_id>/deploy"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/api/deployment#start-container"},"start container")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"POST /api/deployment/<deployment_id>/start_container"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/api/deployment#stop-container"},"stop container")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"POST /api/deployment/<deployment_id>/stop_container"))),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("a",{parentName:"td",href:"/api/deployment#remove-container"},"remove container")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"POST /api/deployment/<deployment_id>/remove_container"))))),(0,l.kt)(o.Z,{mdxType:"Divider"}),(0,l.kt)("h2",{id:"list-deployments"},"list deployments"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"GET /api/deployment/list")),(0,l.kt)("p",null,"this method will return an array of deployments with container state that the requesting user has a minimum of ",(0,l.kt)("inlineCode",{parentName:"p"},"Read")," permissions on."),(0,l.kt)("h3",{id:"response-body"},"response body"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},"[\n    {\n        deployment: Deployment,\n        state: DockerContainerState,\n        container?: {\n            name: string,\n            id: string,\n            image: string,\n            state: DockerContainerState,\n            status?: string,\n        }\n    },\n    ...\n]\n")),(0,l.kt)(o.Z,{mdxType:"Divider"}),(0,l.kt)("h2",{id:"get-deployment"},"get deployment"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"GET /api/deployment/<deployment_id>")),(0,l.kt)("p",null,"this method will return the deployment with container state that\nthe requesting user has a minimum of ",(0,l.kt)("inlineCode",{parentName:"p"},"Read")," permissions on.\nit will return ",(0,l.kt)("inlineCode",{parentName:"p"},"500: Internal Server Error")," if the user does not have the required permissions."),(0,l.kt)("h3",{id:"response-body-1"},"response body"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},"{\n    deployment: Deployment,\n    state: DockerContainerState,\n    container?: {\n        name: string,\n        id: string,\n        image: string,\n        state: DockerContainerState,\n        status?: string,\n    }\n}\n")),(0,l.kt)(o.Z,{mdxType:"Divider"}),(0,l.kt)("h2",{id:"get-deployment-action-state"},"get deployment action state"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"GET /api/deployment/<deployment_id>/action_state")),(0,l.kt)("p",null,"this method returns the action state for the deployment, eg. whether the deployment is currently ",(0,l.kt)("inlineCode",{parentName:"p"},"deploying"),"."),(0,l.kt)("h3",{id:"response-body-2"},"response body"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},"{\n    deploying: boolean,\n    stopping: boolean,\n    starting: boolean,\n    removing: boolean,\n    pulling: boolean,\n    recloning: boolean,\n    updating: boolean,\n    renaming: boolean,\n}\n")),(0,l.kt)(o.Z,{mdxType:"Divider"}),(0,l.kt)("h2",{id:"get-deployment-container-log"},"get deployment container log"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"GET /api/deployment/<deployment_id>/log")),(0,l.kt)("p",null,"this method is used to get the container's log associated with the deployment."),(0,l.kt)("h3",{id:"query-params"},"query params"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},"{\n    tail: number // number of log lines to fetch. this is passed to the --tail flag of docker logs command\n}\n")),(0,l.kt)("h3",{id:"response-body-3"},"response body"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},"{\n    stdout: string,\n    stderr: string,\n}\n")),(0,l.kt)(o.Z,{mdxType:"Divider"}),(0,l.kt)("h2",{id:"get-deployment-container-stats"},"get deployment container stats"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"GET /api/deployment/<deployment_id>/stats")),(0,l.kt)("p",null,"this method returns the results of running ",(0,l.kt)("inlineCode",{parentName:"p"},"docker stats <container_name>"),"\nfor the container associated with the deployment."),(0,l.kt)("h3",{id:"response-body-4"},"response body"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},"{\n    name: string,\n    cpu_perc: string,\n    mem_perc: string,\n    mem_usage: string,\n    net_io: string,\n    block_io: string,\n    pids: string,\n}\n")),(0,l.kt)(o.Z,{mdxType:"Divider"}),(0,l.kt)("h2",{id:"get-deployment-deployed-version"},"get deployment deployed version"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"GET /api/deployment/<deployment_id>/deployed_version")),(0,l.kt)("p",null,"this method is used to get the image version of the container associated with the deployment, if it exists.\notherwise, it will return the version specified in the deployment config."),(0,l.kt)("h3",{id:"response-body-5"},"response body"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},"string // the deployed version like '0.2.4'\n")),(0,l.kt)(o.Z,{mdxType:"Divider"}),(0,l.kt)("h2",{id:"create-deployment"},"create deployment"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"POST /api/deployment/create")),(0,l.kt)("p",null,"this method is used to create a new deployment on a particular server.\nit will return the created deployment."),(0,l.kt)("admonition",{type:"note"},(0,l.kt)("p",{parentName:"admonition"},"users must be ",(0,l.kt)("strong",{parentName:"p"},"admin")," or have ",(0,l.kt)("inlineCode",{parentName:"p"},"update")," permissions on the server specified by the ",(0,l.kt)("inlineCode",{parentName:"p"},"server_id"),"\nin the request body in order for this request to succeed.")),(0,l.kt)("h3",{id:"request-body"},"request body"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},"{\n    name: string,\n    server_id: string,\n}\n")),(0,l.kt)("h3",{id:"response-body-6"},"response body"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/api/types#deployment"},"Deployment")),(0,l.kt)(o.Z,{mdxType:"Divider"}),(0,l.kt)("h2",{id:"create-full-deployment"},"create full deployment"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"POST /api/deployment/create_full")),(0,l.kt)("p",null,"this method is used to create a new deployment on a particular server, already initialized with config.\nit will return the created deployment"),(0,l.kt)("h3",{id:"request-body-1"},"request body"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/api/types#deployment"},"Deployment")),(0,l.kt)("h3",{id:"response-body-7"},"response body"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/api/types#deployment"},"Deployment")),(0,l.kt)(o.Z,{mdxType:"Divider"}),(0,l.kt)("h2",{id:"copy-deployment"},"copy deployment"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"POST /api/deployment/<deployment_id>/copy")),(0,l.kt)("p",null,"this method will create a copy of the deployment with a new _id and name,\nwith all the same configuration as the target deployment.\nit can be used to move the deployment to another server."),(0,l.kt)("h3",{id:"request-body-2"},"request body"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},"{\n    name: string,\n    server_id: string,\n}\n")),(0,l.kt)("h3",{id:"response-body-8"},"response body"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/api/types#deployment"},"Deployment")),(0,l.kt)(o.Z,{mdxType:"Divider"}),(0,l.kt)("h2",{id:"delete-deployment"},"delete deployment"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"DELETE /api/deployment/<deployment_id>/delete")),(0,l.kt)("p",null,"this method will delete the deployment. if a container is associated with the deployment, it will be destroyed."),(0,l.kt)("h3",{id:"response-body-9"},"response body"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/api/types#deployment"},"Deployment")),(0,l.kt)(o.Z,{mdxType:"Divider"}),(0,l.kt)("h2",{id:"update-deployment"},"update deployment"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"PATCH /api/deployment/update")),(0,l.kt)("h3",{id:"request-body-3"},"request body"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/api/types#deployment"},"Deployment")),(0,l.kt)("h3",{id:"response-body-10"},"response body"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/api/types#deployment"},"Deployment")),(0,l.kt)(o.Z,{mdxType:"Divider"}),(0,l.kt)("h2",{id:"rename-deployment"},"rename deployment"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"PATCH /api/deployment/<deployment_id>/rename")),(0,l.kt)("h3",{id:"request-body-4"},"request body"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json"},"{\n    new_name: string,\n}\n")),(0,l.kt)(o.Z,{mdxType:"Divider"}),(0,l.kt)("h2",{id:"reclone-deployment"},"reclone deployment"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"POST /api/deployment/<deployment_id>/reclone")),(0,l.kt)("p",null,"if the deployment has a repo attached, this will reclone the repo,\nincluding the on-clone and on-pull actions."),(0,l.kt)("h3",{id:"response-body-11"},"response body"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/api/types#update"},"Update")),(0,l.kt)(o.Z,{mdxType:"Divider"}),(0,l.kt)("h2",{id:"pull-deployment"},"pull deployment"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"POST /api/deployment/<deployment_id>/pull")),(0,l.kt)("p",null,"if the deployment has a repo attached, this will ",(0,l.kt)("inlineCode",{parentName:"p"},"git pull")," in the repo,\nincluding the on-pull action."),(0,l.kt)("h3",{id:"response-body-12"},"response body"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/api/types#update"},"Update")),(0,l.kt)(o.Z,{mdxType:"Divider"}),(0,l.kt)("h2",{id:"deploy-container"},"deploy container"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"POST /api/deployment/<deployment_id>/deploy")),(0,l.kt)("p",null,"this will deploy the container corresponding to the deployments configuration.\nif the container already exists, it will destroy it first."),(0,l.kt)("h3",{id:"response-body-13"},"response body"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/api/types#update"},"Update")),(0,l.kt)(o.Z,{mdxType:"Divider"}),(0,l.kt)("h2",{id:"start-container"},"start container"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"POST /api/deployment/<deployment_id>/start_container")),(0,l.kt)("p",null,"this will run ",(0,l.kt)("inlineCode",{parentName:"p"},"docker start <container_name>")," for the container\ncorresponding to the deployment"),(0,l.kt)("h3",{id:"response-body-14"},"response body"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/api/types#update"},"Update")),(0,l.kt)(o.Z,{mdxType:"Divider"}),(0,l.kt)("h2",{id:"stop-container"},"stop container"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"POST /api/deployment/<deployment_id>/stop_container")),(0,l.kt)("p",null,"this will run ",(0,l.kt)("inlineCode",{parentName:"p"},"docker stop <container_name>")," for the container\ncorresponding to the deployment"),(0,l.kt)("h3",{id:"response-body-15"},"response body"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/api/types#update"},"Update")),(0,l.kt)(o.Z,{mdxType:"Divider"}),(0,l.kt)("h2",{id:"remove-container"},"remove container"),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"POST /api/deployment/<deployment_id>/remove_container")),(0,l.kt)("p",null,"this will run ",(0,l.kt)("inlineCode",{parentName:"p"},"docker stop <container_name> && docker container rm <container_name>"),"\nfor the container corresponding to the deployment"),(0,l.kt)("h3",{id:"response-body-16"},"response body"),(0,l.kt)("p",null,(0,l.kt)("a",{parentName:"p",href:"/api/types#update"},"Update")))}u.isMDXComponent=!0}}]);