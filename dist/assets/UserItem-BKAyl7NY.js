import{j as r,r as c,S as l,$ as p}from"./index-Du6Uwkmi.js";import{L as x}from"./ListItem-2FVKjEUW.js";import{A as d}from"./Menu-wUt2zOYa.js";import{c as h,T as v}from"./Typography-D1miUXsC.js";import{I as f}from"./Modal-DdgoaOgr.js";import{A as b}from"./Hook-v4cjVH3m.js";const j=h(r.jsx("path",{d:"M19 13H5v-2h14z"}),"Remove"),I=({user:e,handler:s,handlerIsLoading:t,isAdded:o=!1,styling:a={}})=>{const{name:i,_id:m,avatar:n}=e;return r.jsx(x,{sx:{"&:hover":{background:"rgba(0, 0, 0, 0.10)",cursor:"pointer"}},children:r.jsxs(l,{direction:"row",alignItems:"center",spacing:"1rem",width:"100%",...a,children:[r.jsx(d,{src:p(n)}),r.jsx(v,{variant:"body1",sx:{flexGlow:1,display:"-webkit-box",WebkitLineClamp:1,WebkitBoxOrient:"vertical",overflow:"hidden",textOverflow:"ellipsis",width:"100%"},children:i}),r.jsx(f,{size:"small",sx:{bgcolor:o?"error.main":"primary.main",color:"white","&:hover":{bgcolor:o?"error.dark":"primary.dark"}},onClick:()=>s(m),disabled:t,children:o?r.jsx(j,{}):r.jsx(b,{})})]})})},R=c.memo(I);export{R as U};
