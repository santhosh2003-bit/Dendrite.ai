import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
const HeaderComponent = () => {
       const navigate= useNavigate()
  function handleToWhiteBoard(){
    const token=localStorage.getItem("token")
    if(!token){
      navigate('/signin')
    }
  }
  return (
    <Navbar bg="light" expand="lg">
    <Container >
    <Link style={{textDecoration:"none",display:"flex",justifyContent:"center",alignItems:"center",padding:"8px 20px",borderRadius:"20px",marginRight:"10px"}} to="/"><h2 style={{fontFamily:"cursive"}}>React-Whiteboard</h2></Link>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav >
            <Link style={{textDecoration:"none",color:"white",backgroundColor:"black",display:"flex",justifyContent:"center",alignItems:"center",padding:"8px 20px",borderRadius:"20px",marginRight:"10px"}} to="/">Home</Link>
                <Link style={{textDecoration:"none",color:"white",backgroundColor:"black",display:"flex",justifyContent:"center",alignItems:"center",padding:"8px 20px",borderRadius:"20px ",marginRight:"10px"}} to="/features">Features</Link>
                
                <button style={{backgroundColor:"black",display:"flex",justifyContent:"center",alignItems:"center",padding:"8px 20px",borderRadius:"20px",marginRight:"10px",border:"none",outline:"none"}} onClick={handleToWhiteBoard}><Link style={{textDecoration:"none",color:"white"}} to="/whiteboard" >WhiteBoard</Link></button>
            </Nav>
            <Link style={{textDecoration:"none",color:"white",backgroundColor:"black",display:"flex",justifyContent:"center",alignItems:"center",padding:"8px 20px",borderRadius:"20px",marginRight:"10px"}} to="/signin" >Sign in</Link>
            <Link style={{textDecoration:"none",color:"white",backgroundColor:"black",display:"flex",justifyContent:"center",alignItems:"center",padding:"8px 20px",borderRadius:"20px",marginRight:"10px"}} to="/signup">Sign up</Link>
        </Navbar.Collapse>
    </Container>
</Navbar>
  )
}

export default HeaderComponent