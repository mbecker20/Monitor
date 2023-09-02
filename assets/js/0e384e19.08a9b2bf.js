"use strict";(self.webpackChunkdocsite=self.webpackChunkdocsite||[]).push([[671],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>h});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},m="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),m=c(r),u=o,h=m["".concat(l,".").concat(u)]||m[u]||d[u]||i;return r?n.createElement(h,a(a({ref:t},p),{},{components:r})):n.createElement(h,a({ref:t},p))}));function h(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[m]="string"==typeof e?e:o,a[1]=s;for(var c=2;c<i;c++)a[c]=r[c];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},9881:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>c});var n=r(7462),o=(r(7294),r(3905));const i={slug:"/intro"},a="what is monitor?",s={unversionedId:"intro",id:"intro",title:"what is monitor?",description:"If you have many servers running many applications, it can be a challenge to keep things organized and easily accessible. Without structure, things can become messy quickly, which means operational issues are more likely to arise and they can take longer to resolve. Ultimately these issues hinder productivity and waste valuable time. Monitor is a web app to provide this structure for how applications are built, deployed, and managed across many servers.",source:"@site/docs/intro.md",sourceDirName:".",slug:"/intro",permalink:"/intro",draft:!1,editUrl:"https://github.com/mbecker20/monitor/tree/main/docsite/docs/intro.md",tags:[],version:"current",frontMatter:{slug:"/intro"},sidebar:"docs",next:{title:"core setup",permalink:"/core-setup"}},l={},c=[{value:"docker",id:"docker",level:2},{value:"monitor",id:"monitor",level:2},{value:"architecture and components",id:"architecture-and-components",level:2},{value:"monitor core",id:"monitor-core",level:3},{value:"monitor periphery",id:"monitor-periphery",level:3},{value:"monitor cli",id:"monitor-cli",level:3},{value:"core API",id:"core-api",level:2},{value:"permissioning",id:"permissioning",level:2}],p={toc:c},m="wrapper";function d(e){let{components:t,...r}=e;return(0,o.kt)(m,(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"what-is-monitor"},"what is monitor?"),(0,o.kt)("p",null,"If you have many servers running many applications, it can be a challenge to keep things organized and easily accessible. Without structure, things can become messy quickly, which means operational issues are more likely to arise and they can take longer to resolve. Ultimately these issues hinder productivity and waste valuable time. Monitor is a web app to provide this structure for how applications are built, deployed, and managed across many servers."),(0,o.kt)("h2",{id:"docker"},"docker"),(0,o.kt)("p",null,"Monitor is opinionated by design, and ",(0,o.kt)("a",{parentName:"p",href:"https://docs.docker.com/"},"docker")," is the tool of choice. Docker provides the ability to package applications and their runtime dependencies into a standalone bundle, called an ",(0,o.kt)("em",{parentName:"p"},"image"),'. This makes them easy to "ship" to any server and run without the hassle of setting up the runtime environment. Docker uses the image as a sort of template to create ',(0,o.kt)("em",{parentName:"p"},"containers"),". Containers are kind of like virtual machines but with different performance characteristics, namely that processes contained still run natively on the system kernel. The file system is seperate though, and like virtual machines, they can be created, started, stopped, and destroyed."),(0,o.kt)("h2",{id:"monitor"},"monitor"),(0,o.kt)("p",null,"Monitor is a solution for handling for the following:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Build application source into auto-versioned images. "),(0,o.kt)("li",{parentName:"ol"},"Create, start, stop, and restart Docker containers, and view their status and logs."),(0,o.kt)("li",{parentName:"ol"},"Keep a record of all the actions that are performed and by whom."),(0,o.kt)("li",{parentName:"ol"},"View realtime and historical system resource usage."),(0,o.kt)("li",{parentName:"ol"},"Alerting for server health, like high cpu, memory, disk, etc.")),(0,o.kt)("h2",{id:"architecture-and-components"},"architecture and components"),(0,o.kt)("p",null,"Monitor is composed of a single core and any amount of connected servers running the periphery application. "),(0,o.kt)("h3",{id:"monitor-core"},"monitor core"),(0,o.kt)("p",null,"The core is a web server that hosts the core API and serves the frontend to be accessed in a web browser. All user interaction with the connected servers flow through the core. It is the stateful part of the system, with the application state stored on an instance of MongoDB."),(0,o.kt)("h3",{id:"monitor-periphery"},"monitor periphery"),(0,o.kt)("p",null,"The periphery is a stateless web server that exposes API called by the core. The core calls this API to get system usage and container status / logs, clone git repos, and perform docker actions. It is only intended to be reached from the core, and has an address whitelist to limit the IPs allowed to call this API."),(0,o.kt)("h3",{id:"monitor-cli"},"monitor cli"),(0,o.kt)("p",null,"This is a simple standalone cli that helps perform some actions required to setup monitor core and periphery, like generating config files. "),(0,o.kt)("h2",{id:"core-api"},"core API"),(0,o.kt)("p",null,"Monitor exposes powerful functionality over the core's REST API, enabling infrastructure engineers to manage deployments programmatically in addition to with the GUI. There is a ",(0,o.kt)("a",{parentName:"p",href:"https://crates.io/crates/monitor_client"},"rust crate")," to simplify programmatic interaction with the API, but in general this can be accomplished using any programming language that can make REST requests. "),(0,o.kt)("h2",{id:"permissioning"},"permissioning"),(0,o.kt)("p",null,"Monitor is a system designed to be used by many users, whether they are developers, operations personnel, or administrators. The ability to affect an applications state is very powerful, so monitor has a granular permissioning system to only provide this functionality to the intended users. The permissioning system is explained in detail in the ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/mbecker20/monitor/blob/main/docs/permissions.md"},"permissioning")," section. "),(0,o.kt)("p",null,"User sign-on is possible using username / password, or with Oauth (Github and Google). Allowed login methods can be configured from the ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/mbecker20/monitor/blob/main/config_example/core.config.example.toml"},"core config"),"."))}d.isMDXComponent=!0}}]);