(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[966],{682:function(e,n,o){(window.__NEXT_P=window.__NEXT_P||[]).push(["/account",function(){return o(99023)}])},99023:function(e,n,o){"use strict";o.r(n),o.d(n,{default:function(){return P}});var l=o(85893),r=o(41664),t=o.n(r),s=o(87357),i=o(86886),d=o(15861),a=o(67720),c=o(67294),x=o(83321),p=o(65582),h=o(72882),u=o(7906),m=o(53184),j=o(53816),f=o(53252),Z=o(295),g=o(72908),b=o(98456),C=o(25675),y=o.n(C),w=o(81607),k=o(60263),T=o(8058),A=o(60041),N=o(52211),S=o(50594),v=o(69077),R=o(64745),I=o(34278),_=o(62402),L=o(12879),M=o(61673),B=o(38183),E=o(59582),F=o(93014);let D={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:400,boxShadow:24,backgroundColor:"#1f304a",borderRadius:"15px",color:"#ececec",padding:"20px 20px"};var O=function(e){let{orders:n}=e,[o,r]=(0,c.useState)(!1),[t,i]=(0,c.useState)(null),{address:a}=(0,v.mA)(),p=(0,L.yl)(),C=(0,I.T)(),O=(0,E.i)(),[z,W]=(0,M.q)(null==t?void 0:t.loanToken,null==t?void 0:t.loanAmount,(0,B.tw)()),[q,P]=(0,c.useMemo)(()=>t?t.status===w.Kq.CLOSED||t.status===w.Kq.CANCELED?["Close",()=>r(!1)]:t.status===w.Kq.WORKING?t.lender===a?Date.now()>1e3*Number(t.timestamps[1])?["Liquidate",()=>C((0,_.ie)({account:a,protocolContract:p,orderId:t.id}))]:["Close",()=>r(!1)]:Date.now()>1e3*Number(t.timestamps[0])?z===M.U.APPROVED?["Repay",()=>C((0,_.$0)({account:a,protocolContract:p,orderId:t.id}))]:["Approve & Repay",W]:["Close",()=>r(!1)]:t.status===w.Kq.OPEN?["Cancel Order",()=>C((0,_.sl)({account:a,protocolContract:p,orderId:t.id}))]:void 0:["Close",()=>0],[t,a,z,W,C,p]),K=(0,c.useMemo)(()=>z===M.U.PENDING||(0,F.RU)(O,"order-".concat(Number(null==t?void 0:t.id))),[z,t,O]);return(0,c.useEffect)(()=>{t&&i(n.find(e=>e.id===t.id))},[n]),(0,l.jsxs)(h.Z,{sx:{px:2,height:"64vh",overflowY:"auto"},children:[(0,l.jsxs)(u.Z,{sx:{borderSpacing:"0px 5px",borderCollapse:"separate"},children:[(0,l.jsx)(m.Z,{children:(0,l.jsxs)(j.Z,{sx:{"& .MuiTableCell-root":{color:"#9597a1",backgroundColor:"#1f304a",textAlign:"center",fontFamily:"square",fontSize:"15px",borderBottom:"none",paddingTop:"10px",paddingBottom:"10px"}},children:[(0,l.jsx)(f.Z,{children:"Loan Amount"}),(0,l.jsx)(f.Z,{children:"Collateral Amount"}),(0,l.jsx)(f.Z,{children:"Lender Fee"}),(0,l.jsx)(f.Z,{children:"Duration"}),(0,l.jsx)(f.Z,{children:"Reward"})]})}),(0,l.jsx)(Z.Z,{children:null==n?void 0:n.map((e,n)=>{let o=(0,k.b)(e.lenderFeeAmount,(0,T.pC)(e.loanToken)),t=(0,k.b)(e.loanAmount,(0,T.pC)(e.loanToken)),c=(0,k.b)(e.collateralAmount,(0,T.pC)(e.collateralToken)),x=Number(o)/Number(t)*100,p=e.status===w.Kq.OPEN?"Open":e.status===w.Kq.WORKING?"Working":e.status===w.Kq.CLOSED?"Closed":"Canceled";return(0,l.jsxs)(j.Z,{sx:{height:"80px",cursor:"pointer","&:hover":{transitionDuration:"500ms",transform:"scale(1.02)","& .MuiTableCell-root":{bgcolor:"rgb(24,37,57)"}},"& .MuiTableCell-root":{borderBottom:"1px solid #383944",borderTop:"1px solid #383944",textAlign:"center",color:"#ececec !important",fontFamily:"square !important",fontSize:"18px",bgcolor:"#1c2c44"},".MuiTableCell-root:first-of-type":{borderTopLeftRadius:"10px",borderBottomLeftRadius:"10px",borderLeft:"1px solid #383944"},".MuiTableCell-root:last-of-type":{borderTopRightRadius:"10px",borderBottomRightRadius:"10px",borderRight:"1px solid #383944"}},onClick:()=>{i(e),r(!0)},children:[(0,l.jsx)(f.Z,{children:(0,l.jsxs)(s.Z,{sx:{display:"flex",justifyContent:"center",alignItems:"center",gap:2,position:"relative"},children:[(0,l.jsx)(s.Z,{sx:{position:"absolute",zIndex:100,top:"-20px",left:"-10px","& .MuiBox-root":{border:"1px solid grey",borderRadius:"5px",p:.2,mb:.2}},children:(0,l.jsx)(s.Z,{children:(0,l.jsx)(d.Z,{sx:{fontSize:"10px",color:"grey"},children:e.lender===a?"You Supplied":"You Borrowed"})})}),(0,l.jsx)(y(),{src:(0,T.W_)(e.loanToken),alt:"img",width:30,height:30}),(0,l.jsxs)(d.Z,{width:100,children:[t," ",(0,T.mc)(e.loanToken)]})]})}),(0,l.jsx)(f.Z,{children:(0,l.jsxs)(s.Z,{sx:{display:"flex",justifyContent:"center",alignItems:"center",gap:2},children:[(0,l.jsx)(y(),{src:(0,T.W_)(e.collateralToken),alt:"img",width:30,height:30}),(0,l.jsxs)(d.Z,{width:100,children:[c," ",(0,T.mc)(e.collateralToken)]})]})}),(0,l.jsx)(f.Z,{children:(0,l.jsxs)(d.Z,{sx:{color:"rgb(0, 247, 167)"},children:[(0,A.f)(x)," %"]})}),(0,l.jsx)(f.Z,{children:(0,l.jsx)(d.Z,{children:p})}),(0,l.jsx)(f.Z,{children:(0,l.jsx)(s.Z,{sx:{display:"flex",justifyContent:"center",alignItems:"center",gap:2},children:(0,l.jsx)(d.Z,{sx:{color:"rgb(0, 247, 167)"},children:0})})})]},n)})})]}),t&&(0,l.jsx)(g.Z,{open:o,onClose:()=>r(!1),children:(0,l.jsxs)(s.Z,{sx:D,children:[(0,l.jsxs)(s.Z,{display:"flex",justifyContent:"space-between",alignItems:"center",mb:3,children:[(0,l.jsxs)(d.Z,{fontSize:"20px",children:[t.lender===a?"Supply  ":"Borrow  ","Info"]}),(0,l.jsx)(S.Z,{onClick:()=>r(!1),sx:{cursor:"pointer"}})]}),(0,l.jsxs)(s.Z,{sx:{"& > .MuiBox-root":{display:"flex",justifyContent:"space-between",alignItems:"center",my:2,"& > p:first-of-type":{color:"#aaa",fontSize:"14px"},"& .MuiBox-root":{display:"flex",alignItems:"center"}}},children:[(0,l.jsxs)(s.Z,{children:[(0,l.jsx)(d.Z,{children:"Loan Amount"}),(0,l.jsxs)(s.Z,{children:[(0,l.jsx)(y(),{src:(0,T.W_)(t.loanToken),width:20,height:20,alt:"token_logo"}),(0,l.jsx)(d.Z,{ml:1,children:(0,k.b)(t.loanAmount,(0,T.pC)(t.loanToken))}),(0,l.jsx)(d.Z,{ml:.5,children:(0,T.mc)(t.loanToken)})]})]}),(0,l.jsxs)(s.Z,{children:[(0,l.jsx)(d.Z,{children:"Collateral Amount"}),(0,l.jsxs)(s.Z,{children:[(0,l.jsx)(y(),{src:(0,T.W_)(t.collateralToken),width:20,height:20,alt:"token_logo"}),(0,l.jsx)(d.Z,{ml:1,children:(0,k.b)(t.collateralAmount,(0,T.pC)(t.collateralToken))}),(0,l.jsx)(d.Z,{ml:.5,children:(0,T.mc)(t.collateralToken)})]})]}),(0,l.jsxs)(s.Z,{children:[(0,l.jsx)(d.Z,{children:"Lender Fee"}),(0,l.jsxs)(d.Z,{children:[(0,A.f)(Number((0,k.b)(t.lenderFeeAmount,(0,T.pC)(t.loanToken)))/Number((0,k.b)(t.loanAmount,(0,T.pC)(t.loanToken)))*100)," ","% ("," ",(0,A.f)((0,k.b)(t.lenderFeeAmount,(0,T.pC)(t.loanToken)))," ",(0,T.mc)(t.loanToken)," )"]})]}),(0,l.jsxs)(s.Z,{children:[(0,l.jsx)(d.Z,{children:"You will get"}),(0,l.jsxs)(s.Z,{sx:{display:"flex",flexDirection:"column"},children:[(0,l.jsx)(R.Z,{logo:(0,T.W_)(t.loanToken),amount:t.lender===a?(0,k.b)(t.loanAmount+t.lenderFeeAmount,(0,T.pC)(t.loanToken)):(0,k.b)(t.loanAmount-t.lenderFeeAmount,(0,T.pC)(t.loanToken)),symbol:(0,T.mc)(t.loanToken)}),(0,l.jsx)(d.Z,{sx:{fontSize:"12px",color:"grey",maxWidth:"150px",textAlign:"right"},children:t.lender===a?"Loan  + Lender Fee":"Loan  - ( Lender Fee + Protocol Fee)"})]})]}),(0,l.jsxs)(s.Z,{sx:{px:4,flexDirection:"column","& .MuiTypography-root":{color:"#aaa",fontSize:"14px"}},children:[(0,l.jsxs)(d.Z,{mb:1,children:[t.lender===a?"Borrowers ":"You ","have from",(0,l.jsx)("span",{style:{fontSize:"16px",color:"#ccc",padding:"0 5px"},children:(0,N.i)(1e3*Number(t.timestamps[0]))}),"to repay your loan, with the deadline being",(0,l.jsx)("span",{style:{fontSize:"16px",color:"#ccc",padding:"0 5px"},children:(0,N.i)(1e3*Number(t.timestamps[1]))})]}),(0,l.jsx)(d.Z,{children:"If the repayment is not completed, all collateral amount go to the lender."})]})]}),(0,l.jsx)(s.Z,{mx:5,children:(0,l.jsxs)(x.Z,{onClick:P,children:[q,K&&(0,l.jsx)(b.Z,{sx:{color:"white",ml:2},size:20})]})})]})})]})},z=o(672),W=o(98933);let q=()=>{let[e,n]=(0,c.useState)(!1),{address:o}=(0,v.mA)(),{orders:r,loading:h}=(0,W.n)(),u=(0,c.useMemo)(()=>null==r?void 0:r.filter(e=>e.lender===o||e.borrower===o),[r,o]);return(0,l.jsx)(l.Fragment,{children:(0,l.jsxs)(p.Z,{sx:{display:"flex",justifyContent:"center",flexDirection:"column",mt:2,width:"100%",fontFamily:"Rubik"},children:[(0,l.jsx)(s.Z,{sx:{display:"flex",width:"100%"},children:(0,l.jsxs)(i.ZP,{container:!0,spacing:2,children:[(0,l.jsx)(i.ZP,{item:!0,xs:12,md:6,children:(0,l.jsxs)(s.Z,{sx:{display:"flex",justifyContent:"center",alignItems:"center",flexWrap:"wrap",gap:5,p:{xs:1,md:2},bgcolor:"#1c2c42",borderRadius:5,minHeight:"74px","& .MuiBox-root":{width:"fit-content"}},children:[(0,l.jsxs)(s.Z,{sx:{display:"flex",alignItems:"center",gap:1},children:[(0,l.jsx)(y(),{src:"https://twopaws.app/static/media/fuel.95a53fd17843648c51b0d000461e4216.svg",alt:"img",width:30,height:30}),(0,l.jsx)(d.Z,{children:"15.63"}),(0,l.jsx)(d.Z,{children:"Gwei"})]}),(0,l.jsxs)(s.Z,{sx:{display:"flex",alignItems:"center",gap:1},children:[(0,l.jsx)(y(),{src:"https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png",alt:"img",width:30,height:30}),(0,l.jsx)(d.Z,{children:"13.97 USD"})]})]})}),(0,l.jsx)(i.ZP,{item:!0,xs:12,md:6,children:(0,l.jsxs)(s.Z,{sx:{display:"flex",justifyContent:"center",flexWrap:"wrap",alignItems:"center",gap:3,p:2,bgcolor:"#1c2c42",minHeight:"68px !important",borderRadius:5,"& .MuiButton-root":{whiteSpace:"nowrap",padding:"auto 20px",maxWidth:"140px",width:"fit-content"}},children:[(0,l.jsx)(t(),{href:"/",children:(0,l.jsx)(x.Z,{variant:"outlined",children:"Orders Book"})}),(0,l.jsx)(t(),{href:"./account",children:(0,l.jsx)(x.Z,{variant:"outlined",children:"My Account"})}),(0,l.jsx)(x.Z,{variant:"outlined",onClick:()=>n(!0),children:"New Loan"})]})})]})}),(0,l.jsxs)(s.Z,{mt:4,sx:{width:"100%",minHeight:"80vh",borderRadius:"20px",bgcolor:"rgb(31, 48, 74)",border:"1px solid #141e2f"},children:[(0,l.jsx)(d.Z,{sx:{ml:2,fontSize:"25px",my:2},children:"Orders"}),(0,l.jsx)(a.Z,{sx:{bgcolor:"#141e2f",p:"0.2px"}}),(0,l.jsx)(O,{orders:u})]}),(0,l.jsx)(z.Z,{open:e,handleClose:()=>n(!1)})]})})};var P=q}},function(e){e.O(0,[310,526,774,888,179],function(){return e(e.s=682)}),_N_E=e.O()}]);