"use strict";(self.webpackChunkdocsite=self.webpackChunkdocsite||[]).push([[840],{3905:(e,r,t)=>{t.d(r,{Zo:()=>d,kt:()=>k});var n=t(7294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function s(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?s(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function o(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},s=Object.keys(e);for(n=0;n<s.length;n++)t=s[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)t=s[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=n.createContext({}),p=function(e){var r=n.useContext(l),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},d=function(e){var r=p(e.components);return n.createElement(l.Provider,{value:r},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},v=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,s=e.originalType,l=e.parentName,d=o(e,["components","mdxType","originalType","parentName"]),u=p(t),v=a,k=u["".concat(l,".").concat(v)]||u[v]||m[v]||s;return t?n.createElement(k,i(i({ref:r},d),{},{components:t})):n.createElement(k,i({ref:r},d))}));function k(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var s=t.length,i=new Array(s);i[0]=v;var o={};for(var l in r)hasOwnProperty.call(r,l)&&(o[l]=r[l]);o.originalType=e,o[u]="string"==typeof e?e:a,i[1]=o;for(var p=2;p<s;p++)i[p]=t[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}v.displayName="MDXCreateElement"},4032:(e,r,t)=>{t.d(r,{Z:()=>a});var n=t(7294);function a(){return n.createElement("div",{style:{opacity:.7,backgroundColor:"rgb(175, 175, 175)",height:"3px",width:"100%",margin:"75px 0px"}})}},9694:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>p,contentTitle:()=>o,default:()=>v,frontMatter:()=>i,metadata:()=>l,toc:()=>d});var n=t(7462),a=(t(7294),t(3905)),s=t(4032);const i={},o="server",l={unversionedId:"api/server",id:"api/server",title:"server",description:"these routes relate to interacting with monitor servers",source:"@site/docs/api/server.mdx",sourceDirName:"api",slug:"/api/server",permalink:"/api/server",draft:!1,editUrl:"https://github.com/mbecker20/monitor/tree/main/docsite/docs/api/server.mdx",tags:[],version:"current",frontMatter:{},sidebar:"docs",previous:{title:"deployment",permalink:"/api/deployment"},next:{title:"permissions",permalink:"/api/permissions"}},p={},d=[{value:"list servers",id:"list-servers",level:2},{value:"response body",id:"response-body",level:3},{value:"get server",id:"get-server",level:2},{value:"response body",id:"response-body-1",level:3},{value:"get server action state",id:"get-server-action-state",level:2},{value:"response body",id:"response-body-2",level:3},{value:"get server github accounts",id:"get-server-github-accounts",level:2},{value:"response body",id:"response-body-3",level:3},{value:"get server docker accounts",id:"get-server-docker-accounts",level:2},{value:"response body",id:"response-body-4",level:3},{value:"get server available secrets",id:"get-server-available-secrets",level:2},{value:"response body",id:"response-body-5",level:3},{value:"create server",id:"create-server",level:2},{value:"request body",id:"request-body",level:3},{value:"response body",id:"response-body-6",level:3},{value:"create full server",id:"create-full-server",level:2},{value:"request body",id:"request-body-1",level:3},{value:"response body",id:"response-body-7",level:3},{value:"delete server",id:"delete-server",level:2},{value:"response body",id:"response-body-8",level:3},{value:"update server",id:"update-server",level:2},{value:"request body",id:"request-body-2",level:3},{value:"response body",id:"response-body-9",level:3},{value:"get server periphery version",id:"get-server-periphery-version",level:2},{value:"response body",id:"response-body-10",level:3},{value:"get server system information",id:"get-server-system-information",level:2},{value:"response body",id:"response-body-11",level:3},{value:"get server stats",id:"get-server-stats",level:2},{value:"query params",id:"query-params",level:3},{value:"response body",id:"response-body-12",level:3},{value:"get server stats history",id:"get-server-stats-history",level:2},{value:"query params",id:"query-params-1",level:3},{value:"response body",id:"response-body-13",level:3},{value:"get server stats at time",id:"get-server-stats-at-time",level:2},{value:"query params",id:"query-params-2",level:3},{value:"response body",id:"response-body-14",level:3},{value:"get docker networks",id:"get-docker-networks",level:2},{value:"response body",id:"response-body-15",level:3},{value:"prune docker networks",id:"prune-docker-networks",level:2},{value:"response body",id:"response-body-16",level:3},{value:"get docker images",id:"get-docker-images",level:2},{value:"response body",id:"response-body-17",level:3},{value:"prune docker images",id:"prune-docker-images",level:2},{value:"response body",id:"response-body-18",level:3},{value:"get docker containers",id:"get-docker-containers",level:2},{value:"response body",id:"response-body-19",level:3},{value:"prune docker containers",id:"prune-docker-containers",level:2},{value:"response body",id:"response-body-20",level:3}],u={toc:d},m="wrapper";function v(e){let{components:r,...t}=e;return(0,a.kt)(m,(0,n.Z)({},u,t,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"server"},"server"),(0,a.kt)("p",null,"these routes relate to interacting with monitor ",(0,a.kt)("inlineCode",{parentName:"p"},"servers")),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null},"name"),(0,a.kt)("th",{parentName:"tr",align:null},"route"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#list-servers"},"list servers")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"GET /api/server/list"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#get-server"},"get server")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"GET /api/server/<server_id>"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#get-server-action-state"},"get server action state")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"GET /api/server/<server_id>/action_state"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#get-server-github-accounts"},"get server github accounts")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"GET /api/server/<server_id>/github_accounts"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#get-server-docker-accounts"},"get server docker accounts")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"GET /api/server/<server_id>/docker_accounts"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#get-server-available-secrets"},"get server available secrets")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"GET /api/server/<server_id>/secrets"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#create-server"},"create server")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"POST /api/server/create"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#create-full-server"},"create full server")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"POST /api/server/create_full"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#delete-server"},"delete server")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"DELETE /api/server/<server_id>/delete"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#update-server"},"update server")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"PATCH /api/server/update"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#get-server-periphery-version"},"get server periphery version")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"GET /api/server/<server_id>/version"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#get-server-system-information"},"get server system information")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"GET /api/server/<server_id>/system_information"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#get-server-stats"},"get server stats")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"GET /api/server/<server_id>/stats"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#get-server-stats-history"},"get server stats history")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"GET /api/server/<server_id>/stats/history"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#get-server-stats-at-time"},"get server stats at time")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"GET /api/server/<server_id>/stats/at_ts"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#get-docker-networks"},"get docker networks")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"GET /api/server/<server_id>/networks"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#prune-docker-networks"},"prune docker networks")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"POST /api/server/<server_id>/networks/prune"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#get-docker-images"},"get docker images")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"GET /api/server/<server_id>/images"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#prune-docker-images"},"prune docker images")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"POST /api/server/<server_id>/images/prune"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#get-docker-containers"},"get docker containers")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"GET /api/server/<server_id>/containers"))),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("a",{parentName:"td",href:"/api/server#prune-docker-containers"},"prune docker containers")),(0,a.kt)("td",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"td"},"POST /api/server/<server_id>/containers/prune"))))),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"list-servers"},"list servers"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"GET /api/server/list")),(0,a.kt)("p",null,"this method will return an array of servers with their status\nthat the requesting user has a minimum of ",(0,a.kt)("inlineCode",{parentName:"p"},"Read")," permissions on."),(0,a.kt)("h3",{id:"response-body"},"response body"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"[\n    {\n        server: Server,\n        status: ServerStatus\n    },\n    ...\n]\n")),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"get-server"},"get server"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"GET /api/server/<server_id>")),(0,a.kt)("p",null,"this method will return the server with server status that\nthe requesting user has a minimum of ",(0,a.kt)("inlineCode",{parentName:"p"},"Read")," permissions on.\nit will return ",(0,a.kt)("inlineCode",{parentName:"p"},"500: Internal Server Error")," if the user does not have the required permissions."),(0,a.kt)("h3",{id:"response-body-1"},"response body"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"{\n    server: Server,\n    status: ServerStatus\n}\n")),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"get-server-action-state"},"get server action state"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"GET /api/server/<server_id>/action_state")),(0,a.kt)("p",null,"this method returns the action state for the server, eg. whether the server is currently ",(0,a.kt)("inlineCode",{parentName:"p"},"pruning_images"),"."),(0,a.kt)("h3",{id:"response-body-2"},"response body"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"{\n    pruning_networks: boolean,\n    pruning_containers: boolean,\n    pruning_images: boolean,\n}\n")),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"get-server-github-accounts"},"get server github accounts"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"GET /api/server/<server_id>/github_accounts")),(0,a.kt)("p",null,"this method returns a list of all the github account usernames that are available on the server,\nas defined in the server's periphery config under ","[github_accounts]","."),(0,a.kt)("h3",{id:"response-body-3"},"response body"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},'["<github_username_1>", "<github_username_2>", ...]\n')),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"get-server-docker-accounts"},"get server docker accounts"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"GET /api/server/<server_id>/docker_accounts")),(0,a.kt)("p",null,"this method returns a list of all the docker account usernames that are available on the server,\nas defined in the server's periphery config under ","[docker_accounts]","."),(0,a.kt)("h3",{id:"response-body-4"},"response body"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},'["<docker_username_1>", "<docker_username_2>", ...]\n')),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"get-server-available-secrets"},"get server available secrets"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"GET /api/server/<server_id>/secrets")),(0,a.kt)("p",null,"this method returns a list of all the secret keys that are available on the server,\nas defined in the server's periphery config under ","[secrets]","."),(0,a.kt)("h3",{id:"response-body-5"},"response body"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},'["<secret_key_1>", "<secret_key_2>", ...]\n')),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"create-server"},"create server"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"POST /api/server/create")),(0,a.kt)("h3",{id:"request-body"},"request body"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"{\n    name: string,\n    address: string, // eg. http://12.34.56.78:8000\n} \n")),(0,a.kt)("h3",{id:"response-body-6"},"response body"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/api/types#server"},"Server")),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"create-full-server"},"create full server"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"POST /api/server/create_full")),(0,a.kt)("p",null,"this method is used to create a new server, already initialized with config.\nit will return the created server."),(0,a.kt)("h3",{id:"request-body-1"},"request body"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/api/types#server"},"Server")),(0,a.kt)("h3",{id:"response-body-7"},"response body"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/api/types#server"},"Server")),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"delete-server"},"delete server"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"DELETE /api/server/<server_id>/delete")),(0,a.kt)("p",null,"this method will delete the server, along with all deployments attached to the server."),(0,a.kt)("h3",{id:"response-body-8"},"response body"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/api/types#server"},"Server")),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"update-server"},"update server"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"PATCH /api/server/update")),(0,a.kt)("p",null,"this method is used to update a servers configuration."),(0,a.kt)("h3",{id:"request-body-2"},"request body"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/api/types#server"},"Server")),(0,a.kt)("h3",{id:"response-body-9"},"response body"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/api/types#server"},"Server")),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"get-server-periphery-version"},"get server periphery version"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"GET /api/server/<server_id>/version")),(0,a.kt)("p",null,"this method is used to get the version of the periphery binary running on the server."),(0,a.kt)("h3",{id:"response-body-10"},"response body"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"string // the periphery version\n")),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"get-server-system-information"},"get server system information"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"GET /api/server/<server_id>/system_information")),(0,a.kt)("p",null,"this method gets some information about the host system running the periphery binary."),(0,a.kt)("h3",{id:"response-body-11"},"response body"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"{\n    name?: string,       // the name of the system\n    os?: string,         // the os the system is running\n    kernel?: string,     // the version of the kernel\n    core_count?: number, // number of cores in the cpu\n    host_name?: string,  // host name of the system\n    cpu_brand: string,   // information on the cpu of the system\n}\n")),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"get-server-stats"},"get server stats"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"GET /api/server/<server_id>/stats")),(0,a.kt)("p",null,"this method retrieves current system stats of the server."),(0,a.kt)("h3",{id:"query-params"},"query params"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"cpus=boolean // optional. if true, response will include information about each core individually\ndisks=boolean // optional. if true, response will include breakdown of disk usage by mount point\nnetworks=boolean // optional. if true, response will include info on network usage\ncomponents=boolean // optional. if true, response will include component tempurature\nprocesses=boolean // optional. if true, response will include all system processes running on host and their resource usage\n")),(0,a.kt)("h3",{id:"response-body-12"},"response body"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"{\n    system_load: number,\n    cpu_perc: number,\n    cpu_freq_mhz: number,\n    mem_used_gb: number,\n    mem_total_gb: number,\n    disk: {},\n    cpus: [],\n    networks: [],\n    components: [],\n    processes: [],\n    polling_rate: Timelength,\n    refresh_ts: number,\n    refresh_list_ts: number,\n}\n")),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"get-server-stats-history"},"get server stats history"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"GET /api/server/<server_id>/stats/history")),(0,a.kt)("p",null,"this method will return historical system stats for the server.\nthe response is paginated, to get older data, specify a higher page number."),(0,a.kt)("h3",{id:"query-params-1"},"query params"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"interval=Timelength // optional, default interval is 1-hr. controls granularity of historical data\nlimit=number // optional, default is 100, max is 500. specifies the number of data points to fetch\npage=number // optional, default is 0. specifies the page of data, going backward in time.\nnetworks=boolean // optional. if true, response will include historical info on network usage\ncomponents=boolean // optional. if true, response will include historical component tempuratures\n")),(0,a.kt)("h3",{id:"response-body-13"},"response body"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"[\n    {\n        ts: number, // unix timestamp in ms\n        server_id: string // specifies the server\n        system_load: number,\n        cpu_perc: number,\n        cpu_freq_mhz: number,\n        mem_used_gb: number,\n        mem_total_gb: number,\n        disk: {},\n        cpus: [],\n        networks: [],\n        components: [],\n        processes: [],\n        polling_rate: Timelength,\n    },\n    ...\n]\n")),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"get-server-stats-at-time"},"get server stats at time"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"GET /api/server/<server_id>/stats/at_ts")),(0,a.kt)("p",null,"this method retrieves the historical stats for a server at a specific timestamp"),(0,a.kt)("h3",{id:"query-params-2"},"query params"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"ts=number // required. the timestamp in ms\n")),(0,a.kt)("h3",{id:"response-body-14"},"response body"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"{\n    ts: number, // unix timestamp in ms\n    server_id: string // specifies the server\n    system_load: number,\n    cpu_perc: number,\n    cpu_freq_mhz: number,\n    mem_used_gb: number,\n    mem_total_gb: number,\n    disk: {},\n    cpus: [],\n    networks: [],\n    components: [],\n    processes: [],\n    polling_rate: Timelength,\n}\n")),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"get-docker-networks"},"get docker networks"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"GET /api/server/<server_id>/networks")),(0,a.kt)("p",null,"this method retrieves the docker networks on the server"),(0,a.kt)("h3",{id:"response-body-15"},"response body"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"[\n    {\n        Name?: string,\n        Id?: string,\n        Created?: string,\n        Scope?: string,\n        Driver?: string,\n        EnableIPv6?: boolean,\n        IPAM?: {\n            Driver?: string,\n            Config?: [\n                {\n                    Subnet?: string,\n                    IPRange?: string,\n                    Gateway?: string,\n                    AuxiliaryAddresses?: {}\n                },\n                ...\n            ],\n            Options?: {}\n        },\n        Internal?: boolean,\n        Attachable?: boolean,\n        Ingress?: boolean,\n        Containers?: {},\n        Options?: {},\n        Labels?: {}\n    },\n    ...\n]\n")),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"prune-docker-networks"},"prune docker networks"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"POST /api/server/<server_id>/networks/prune")),(0,a.kt)("p",null,"this method triggers the ",(0,a.kt)("inlineCode",{parentName:"p"},"network prune")," action on the server, which runs\n",(0,a.kt)("inlineCode",{parentName:"p"},"docker network prune -f")," on the target server"),(0,a.kt)("h3",{id:"response-body-16"},"response body"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/api/types#update"},"Update")),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"get-docker-images"},"get docker images"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"GET /api/server/<server_id>/images")),(0,a.kt)("p",null,"this method will return a list of images available locally on the server"),(0,a.kt)("h3",{id:"response-body-17"},"response body"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"[\n    {\n        Id: string,\n        ParentId: string,\n        RepoTags: [string],\n        RepoDigests: [string],\n        Created: number,\n        Size: number,\n        SharedSize: number,\n        VirtualSize: number,\n        Labels: {},\n        Containers: number,\n    }\n]\n")),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"prune-docker-images"},"prune docker images"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"POST /api/server/<server_id>/images/prune")),(0,a.kt)("p",null,"this method triggers the ",(0,a.kt)("inlineCode",{parentName:"p"},"image prune")," action, which runs\n",(0,a.kt)("inlineCode",{parentName:"p"},"docker image prune -a -f")," on the target server"),(0,a.kt)("h3",{id:"response-body-18"},"response body"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/api/types#update"},"Update")),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"get-docker-containers"},"get docker containers"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"GET /api/server/<server_id>/containers")),(0,a.kt)("p",null,"this method is used to retrieve information about all the containers on the target server"),(0,a.kt)("h3",{id:"response-body-19"},"response body"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"[\n    {\n        name: string,\n        id: string,\n        image: string,\n        state: DockerContainerState,\n        status?: string,\n    },\n    ...\n]\n")),(0,a.kt)(s.Z,{mdxType:"Divider"}),(0,a.kt)("h2",{id:"prune-docker-containers"},"prune docker containers"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"POST /api/server/<server_id>/containers/prune")),(0,a.kt)("p",null,"this method triggers the ",(0,a.kt)("inlineCode",{parentName:"p"},"container prune")," action, which runs\n",(0,a.kt)("inlineCode",{parentName:"p"},"docker container prune -f")," on the target server"),(0,a.kt)("h3",{id:"response-body-20"},"response body"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"/api/types#update"},"Update")))}v.isMDXComponent=!0}}]);