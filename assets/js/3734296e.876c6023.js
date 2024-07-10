"use strict";(self.webpackChunkdocsite=self.webpackChunkdocsite||[]).push([[92],{5918:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>a,contentTitle:()=>r,default:()=>d,frontMatter:()=>i,metadata:()=>h,toc:()=>l});var n=s(4848),o=s(8453);const i={},r="File Paths",h={id:"file-paths",title:"File Paths",description:"When working with monitor, you might have to configure file or directory paths.",source:"@site/docs/file-paths.md",sourceDirName:".",slug:"/file-paths",permalink:"/docs/file-paths",draft:!1,unlisted:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/file-paths.md",tags:[],version:"current",frontMatter:{}},a={},l=[{value:"Relative Paths",id:"relative-paths",level:2},{value:"Implementation",id:"implementation",level:3},{value:"Docker Volume Paths",id:"docker-volume-paths",level:2}];function c(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h1,{id:"file-paths",children:"File Paths"}),"\n",(0,n.jsx)(t.p,{children:"When working with monitor, you might have to configure file or directory paths."}),"\n",(0,n.jsx)(t.h2,{id:"relative-paths",children:"Relative Paths"}),"\n",(0,n.jsx)(t.p,{children:"Where possible, it is better to use relative file paths. Using relative file paths removes the connection between the process being run and the particular server it runs on, making it easier to move things between servers."}),"\n",(0,n.jsx)(t.p,{children:"Where you see relative paths:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"setting the build directory and path of the Dockerfile"}),"\n",(0,n.jsx)(t.li,{children:"setting a pre build command path"}),"\n"]}),"\n",(0,n.jsx)(t.p,{children:"For all of the above, the path can be given relative to the root of the configured repo"}),"\n",(0,n.jsx)(t.p,{children:"The one exception is the Dockerfile path, which is given relative to the build directory (This is done by Docker itself, and this pattern matches usage of the Docker CLI)."}),"\n",(0,n.jsx)(t.p,{children:"There are 3 kinds of paths to pass:"}),"\n",(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsxs)(t.li,{children:["to specify the root of the repo, use ",(0,n.jsx)(t.code,{children:"."})," as the path"]}),"\n",(0,n.jsxs)(t.li,{children:["to specify a folder in the repo, pass it with ",(0,n.jsx)(t.strong,{children:"no"})," preceding ",(0,n.jsx)(t.code,{children:"/"}),". For example, ",(0,n.jsx)(t.code,{children:"example_folder"})," or ",(0,n.jsx)(t.code,{children:"folder1/folder2"})]}),"\n",(0,n.jsxs)(t.li,{children:["to specify an absolute path on the servers filesystem, use a preceding slash, eg. ",(0,n.jsx)(t.code,{children:"/home/ubuntu/example"}),". This way should only be used if absolutely necessary, like when passing host paths when configuring docker volumes."]}),"\n"]}),"\n",(0,n.jsx)(t.h3,{id:"implementation",children:"Implementation"}),"\n",(0,n.jsxs)(t.p,{children:["Relative file paths are joined with the path of the repo on the system using a Rust ",(0,n.jsx)(t.a,{href:"https://doc.rust-lang.org/std/path/struct.PathBuf.html#method.push",children:"PathBuf"}),"."]}),"\n",(0,n.jsx)(t.h2,{id:"docker-volume-paths",children:"Docker Volume Paths"}),"\n",(0,n.jsxs)(t.p,{children:["These are passed directly to the Docker CLI using ",(0,n.jsx)(t.code,{children:"--volume /path/on/system:/path/in/container"}),". So for these, the same rules apply as when using Docker on the command line. Paths here should usually be given as absolute. It's also probably best to avoid usage of ",(0,n.jsx)(t.code,{children:"~"})," or environment variables like ",(0,n.jsx)(t.code,{children:"$HOME"}),", as this may lead to unexpected behavior."]})]})}function d(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},8453:(e,t,s)=>{s.d(t,{R:()=>r,x:()=>h});var n=s(6540);const o={},i=n.createContext(o);function r(e){const t=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function h(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),n.createElement(i.Provider,{value:t},e.children)}}}]);