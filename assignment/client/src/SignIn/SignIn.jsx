import React, { useState } from 'react';
import { Container,  Card } from 'react-bootstrap';
import {Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
   const navigate=useNavigate();
   const [email,setEmail]=useState('');
   const [password,setPassword]=useState('');


   

    const handleSubmit = (event) => {
        event.preventDefault();
        fetch('http://localhost:5000/api/auth/signin',{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({
            email:email,
            password:password
        })}).then((res)=>res.json())
        .then((data)=>{
            // console.log(data)
            if(data.error){
                // console.log(data.error)
                alert(data.error);
            }
            else{
                //console.log(data.token)
                navigate("/")
                localStorage.setItem("token",data.token);
            }
        })
       
    };

   

    return (
        <Container style={{ maxWidth: '500px', marginTop: '20px' }}>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Sign In</h2>
                    <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                        <div style={{border:"1px solid gray",borderRadius:"15px",boxSizing:"border-box",overflow:"hidden"}}>
                        <input style={{border:"none",margin:"10px",width:"100%",outline:"none"}}  type="email"  value={email} placeholder='Enter Email' onChange={(e)=>setEmail(e.target.value)}/>
                        </div>
                        <div style={{border:"1px solid gray",borderRadius:"15px",boxSizing:"border-box",overflow:"hidden"}}>
                        <input style={{border:"none",margin:"10px",width:"100%",outline:"none"}} type="password" value={password} placeholder='Enter Password' onChange={(e)=>setPassword(e.target.value)} />
                        </div>
                        <div style={{border:"1px solid gray",borderRadius:"15px",boxSizing:"border-box",overflow:"hidden",backgroundColor:"blue"}}>
                        <button style={{border:"none",margin:"10px",width:"100%",backgroundColor:"transparent",color:"white",fontSize:"15px",fontWeight:"bolder",letterSpacing:"1px",outline:"none"}}>SignIn</button>
                        </div>
                        <div style={{border:"1px solid gray",borderRadius:"15px",boxSizing:"border-box",overflow:"hidden",backgroundColor:"blue"}}>
                        <button style={{border:"none",margin:"10px",width:"100%",backgroundColor:"transparent",color:"white",fontSize:"15px",fontWeight:"bolder",letterSpacing:"1px",outline:"none"}}><Link style={{textDecoration:"none",color:"white"}} to="/signup">SignUp</Link></button>
                        </div>
                        
                        
                        
                    </form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SignIn;
