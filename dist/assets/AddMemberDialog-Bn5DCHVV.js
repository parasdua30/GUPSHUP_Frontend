import{u as S,c as y,b0 as C,r as D,j as e,S as i,t as k,b7 as E,al as H}from"./index-Du6Uwkmi.js";import{U as T}from"./UserItem-BKAyl7NY.js";import{b as w,a as B}from"./Hook-v4cjVH3m.js";import{D as F,a as I}from"./DialogTitle-Ds0-Ex3u.js";import{T as L}from"./Typography-D1miUXsC.js";import{B as l}from"./Button-DK210MLF.js";import"./ListItem-2FVKjEUW.js";import"./Menu-wUt2zOYa.js";import"./Modal-DdgoaOgr.js";import"./isMuiElement-D1-MrS4c.js";const K=({chatId:o})=>{var d,c;const m=S(),{isAddMember:p}=y(s=>s.misc),{isLoading:u,data:r,isError:b,error:x}=C(o),[g,h]=w(E),[a,M]=D.useState([]),j=s=>{M(n=>n.includes(s)?n.filter(A=>A!==s):[...n,s])},t=()=>{m(H(!1))},f=()=>{g("Adding Members...",{members:a,chatId:o}),t()};return B([{isError:b,error:x}]),e.jsx(F,{open:p,onClose:t,children:e.jsxs(i,{p:"2rem",width:"20rem",spacing:"2rem",children:[e.jsx(I,{textAlign:"center",children:"Add Member"}),e.jsx(i,{spacing:"1rem",children:u?e.jsx(k,{}):((d=r==null?void 0:r.friends)==null?void 0:d.length)>0?(c=r==null?void 0:r.friends)==null?void 0:c.map(s=>e.jsx(T,{user:s,handler:j,isAdded:a.includes(s._id)},s._id)):e.jsx(L,{textAlign:"center",children:"No Friends"})}),e.jsxs(i,{direction:"row",alignItems:"center",justifyContent:"space-evenly",children:[e.jsx(l,{color:"error",onClick:t,children:"Cancel"}),e.jsx(l,{onClick:f,variant:"contained",disabled:h,children:"Submit Changes"})]})]})})};export{K as default};
