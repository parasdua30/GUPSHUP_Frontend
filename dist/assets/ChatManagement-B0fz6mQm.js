import{r as o,$ as s,j as e,t as l,S as n}from"./index-Du6Uwkmi.js";import{c as p}from"./index-DJ2Ah1Ch.js";import{A as c}from"./AdminLayout-B1G8E9T6.js";import{A as d}from"./AvatarCard-DzGKErVP.js";import{T as f}from"./Table-DTsPPQFH.js";import{d as m}from"./sampleData-Lm4jJ_UH.js";import{A as b}from"./Menu-wUt2zOYa.js";import"./Menu-D39zixRf.js";import"./Modal-DdgoaOgr.js";import"./Typography-D1miUXsC.js";import"./ExitToApp-DHmyjwa3.js";import"./Container-CAA9JtHf.js";import"./TextField-BYQxlb9E.js";import"./isMuiElement-D1-MrS4c.js";import"./Tooltip-Cct72D16.js";import"./Toolbar-GU60VVgH.js";import"./MenuItem-CblBUfRF.js";import"./Button-DK210MLF.js";import"./InputAdornment-1L-Srb_k.js";import"./CircularProgress-CXO9Uo61.js";const N=[{field:"id",headerName:"ID",headerClassName:"table-header",width:200},{field:"avatar",headerName:"Avatar",headerClassName:"table-header",width:150,renderCell:a=>e.jsx(d,{avatar:a.row.avatar})},{field:"name",headerName:"Name",headerClassName:"table-header",width:300},{field:"groupChat",headerName:"Group",headerClassName:"table-header",width:100},{field:"totalMembers",headerName:"Total Members",headerClassName:"table-header",width:120},{field:"members",headerName:"Members",headerClassName:"table-header",width:400,renderCell:a=>e.jsx(d,{max:100,avatar:a.row.members})},{field:"totalMessages",headerName:"Total Messages",headerClassName:"table-header",width:120},{field:"creator",headerName:"Created By",headerClassName:"table-header",width:250,renderCell:a=>e.jsxs(n,{direction:"row",alignItems:"center",spacing:"1rem",children:[e.jsx(b,{alt:a.row.creator.name,src:a.row.creator.avatar}),e.jsx("span",{children:a.row.creator.name})]})}],$=()=>{const{loading:a,data:w,error:C}=p("dashboard-chats"),[h,i]=o.useState([]);return o.useEffect(()=>{m&&i(m.chats.map(r=>({...r,id:r._id,avatar:r.avatar.map(t=>s(t,50)),members:r.members.map(t=>s(t.avatar,50)),creator:{name:r.creator.name,avatar:s(r.creator.avatar,50)}})))},[m]),e.jsx(c,{children:a?e.jsx(l,{height:"100vh"}):e.jsx(f,{heading:"All Chats",columns:N,rows:h})})};export{$ as default};
