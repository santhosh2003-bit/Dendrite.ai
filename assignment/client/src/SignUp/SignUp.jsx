import React, { useState } from 'react';
import { Container,  Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

const navigate=useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: name,
                    email: email,
                    password: password
                })

            }).then((data) => {
                return data.json();
            }).then((result) => {
                if (result.message) {
navigate('/signin')
                    return result.message;
                }
                else {
                    return result.error;
                }
            })
// console.log(response)
alert(response)

        } catch (error) {
            console.log('Signup failed:', error);

        }

    };







    return (
        <Container style={{ maxWidth: '500px', marginTop: '20px' }}>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column"}}>
                        <div className='input' style={{width:"100%",border:"1px solid gray",borderRadius:"15px",marginBottom:"10px",boxSizing:"border-box",overflow:"hidden"}}>
                        <input  style={{border:"none",margin:"10px",outline:"none",width:"100%"}} type="text" placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className='input' style={{width:"100%",border:"1px solid gray",borderRadius:"15px",marginBottom:"10px",boxSizing:"border-box",overflow:"hidden"}}>
                        <input style={{border:"none",margin:"10px",outline:"none",width:"100%"}} type="email" placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className='input' style={{width:"100%",border:"1px solid gray",borderRadius:"15px",marginBottom:"10px",boxSizing:"border-box",overflow:"hidden"}}>
                        <input style={{border:"none",margin:"10px",outline:"none",width:"100%"}} type="password" placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className='input' style={{width:"100%",border:"1px solid gray",borderRadius:"15px",marginBottom:"10px",boxSizing:"border-box",overflow:"hidden",backgroundColor:"blue"}}>
                        <button style={{border:"none",margin:"10px",outline:"none",width:"100%",backgroundColor:"transparent",fontSize:"15px",fontWeight:"bolder",color:"white",letterSpacing:"1px"}}>Submit</button>
                        </div>


                        <div className='input' style={{width:"100%",border:"1px solid gray",borderRadius:"15px",marginBottom:"10px",boxSizing:"border-box",overflow:"hidden",backgroundColor:"blue"}}>
                        <button style={{border:"none",margin:"10px",outline:"none",width:"100%",backgroundColor:"transparent",fontSize:"15px",fontWeight:"bolder",color:"white",letterSpacing:"1px"}}><Link to='/signin' style={{textDecoration:"none",color:"white"}}>SignIn</Link></button>
                        </div>
                        
                       
                       
                        
                    </form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SignUp;
