"use strict";(self.webpackChunkdocsite=self.webpackChunkdocsite||[]).push([[440],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>m});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=a.createContext({}),p=function(e){var t=a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=p(e.components);return a.createElement(s.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},g=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),c=p(n),g=r,m=c["".concat(s,".").concat(g)]||c[g]||d[g]||o;return n?a.createElement(m,i(i({ref:t},u),{},{components:n})):a.createElement(m,i({ref:t},u))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=g;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[c]="string"==typeof e?e:r,i[1]=l;for(var p=2;p<o;p++)i[p]=n[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}g.displayName="MDXCreateElement"},4032:(e,t,n)=>{n.d(t,{Z:()=>r});var a=n(7294);function r(){return a.createElement("div",{style:{opacity:.7,backgroundColor:"rgb(175, 175, 175)",height:"3px",width:"100%",margin:"75px 0px"}})}},7326:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>l,default:()=>g,frontMatter:()=>i,metadata:()=>s,toc:()=>u});var a=n(7462),r=(n(7294),n(3905)),o=n(4032);const i={},l="login",s={unversionedId:"api/login",id:"api/login",title:"login",description:"monitor supports local login (username and password), Oauth2 login (github and google),",source:"@site/docs/api/login.mdx",sourceDirName:"api",slug:"/api/login",permalink:"/monitor/api/login",draft:!1,editUrl:"https://github.com/mbecker20/monitor/tree/main/docsite/docs/api/login.mdx",tags:[],version:"current",frontMatter:{},sidebar:"docs",previous:{title:"authenticating requests",permalink:"/monitor/api/authenticating-requests"},next:{title:"api secrets",permalink:"/monitor/api/api-secrets"}},p={},u=[{value:"get login options",id:"get-login-options",level:2},{value:"response body",id:"response-body",level:3},{value:"create local user account",id:"create-local-user-account",level:2},{value:"request body",id:"request-body",level:3},{value:"response body",id:"response-body-1",level:3},{value:"login local user account",id:"login-local-user-account",level:2},{value:"request body",id:"request-body-1",level:3},{value:"response body",id:"response-body-2",level:3},{value:"login using api secret",id:"login-using-api-secret",level:2},{value:"request body",id:"request-body-2",level:3},{value:"response body",id:"response-body-3",level:3}],c={toc:u},d="wrapper";function g(e){let{components:t,...n}=e;return(0,r.kt)(d,(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"login"},"login"),(0,r.kt)("p",null,"monitor supports local login (username and password), Oauth2 login (github and google),\nand secret login (username and API secret key).\neach method must be explicitly enabled in your monitor core config,\notherwise the api won't be available."),(0,r.kt)("admonition",{type:"note"},(0,r.kt)("p",{parentName:"admonition"},"in order to login to an Oauth2 user's account programmatically,\nyou must ",(0,r.kt)("a",{parentName:"p",href:"/api/api-secrets#create-api-secret"},"create an api secret")," and login using ",(0,r.kt)("a",{parentName:"p",href:"/api/login#login-using-api-secret"},"/auth/secret/login"))),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"name"),(0,r.kt)("th",{parentName:"tr",align:null},"route"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"/api/login#get-login-options"},"get login options")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"GET /auth/options"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"/api/login#create-local-user-account"},"create local user account")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"POST /auth/local/create_user"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"/api/login#login-local-user-account"},"login local user account")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"POST /auth/local/login"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("a",{parentName:"td",href:"/api/login#login-using-api-secret"},"login using api secret")),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"POST /auth/secret/login"))))),(0,r.kt)(o.Z,{mdxType:"Divider"}),(0,r.kt)("h2",{id:"get-login-options"},"get login options"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"GET /auth/options")),(0,r.kt)("p",null,"this method is used to obtain the login options for monitor core"),(0,r.kt)("h3",{id:"response-body"},"response body"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},"{\n    local: boolean,\n    github: boolean,\n    google: boolean,\n}\n")),(0,r.kt)(o.Z,{mdxType:"Divider"}),(0,r.kt)("h2",{id:"create-local-user-account"},"create local user account"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"POST /auth/local/create_user")),(0,r.kt)("p",null,"this method will create a new local auth account with the provided ",(0,r.kt)("strong",{parentName:"p"},"username")," and ",(0,r.kt)("strong",{parentName:"p"},"password"),",\nand return a ",(0,r.kt)("inlineCode",{parentName:"p"},"JWT")," for the user to authenticate with."),(0,r.kt)("h3",{id:"request-body"},"request body"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},"{\n    username: string,\n    password: string,\n}\n")),(0,r.kt)("h3",{id:"response-body-1"},"response body"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"<JWT token as string>")),(0,r.kt)("admonition",{type:"caution"},(0,r.kt)("p",{parentName:"admonition"},"a user created with this method is, by default, ",(0,r.kt)("inlineCode",{parentName:"p"},"disabled"),". a monitor admin must enable their account before they can access the API.")),(0,r.kt)(o.Z,{mdxType:"Divider"}),(0,r.kt)("h2",{id:"login-local-user-account"},"login local user account"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"POST /auth/local/login")),(0,r.kt)("p",null,"this method will authenticate a local users credentials and return a JWT if login is successful."),(0,r.kt)("h3",{id:"request-body-1"},"request body"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},"{\n    username: string,\n    password: string,\n}\n")),(0,r.kt)("h3",{id:"response-body-2"},"response body"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"<JWT token as string>")),(0,r.kt)(o.Z,{mdxType:"Divider"}),(0,r.kt)("h2",{id:"login-using-api-secret"},"login using api secret"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"POST /auth/secret/login")),(0,r.kt)("p",null,"this method will authenticate a users account of any kind using an api secret generated using ",(0,r.kt)("a",{parentName:"p",href:"/api/api-secrets#create-api-secret"},"/api/secret/create")),(0,r.kt)("h3",{id:"request-body-2"},"request body"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},"{\n    username: string,\n    secret: string,\n}\n")),(0,r.kt)("h3",{id:"response-body-3"},"response body"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"<JWT token as string>")))}g.isMDXComponent=!0}}]);