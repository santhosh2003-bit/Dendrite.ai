// src/components/Home.tsx
import React, { useState, useEffect } from 'react';
import { Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderComponent from '../Header/HeaderComponent';



const Home = () => {
    const [savedDrawings, setSavedDrawings] = useState([]);

    useEffect(() => {
        // Load drawings from local storage
        const drawings = JSON.parse(localStorage.getItem('drawings') || '[]');
        setSavedDrawings(drawings);
    }, []);

    return (
        <div style={{ backgroundColor: "black", color: "white", minHeight: "100vh" }}>
          
            <HeaderComponent/>
           
            <Container className="mt-5">
                <h1>Welcome to React-Whiteboard</h1>
                <p>This is a collaborative whiteboarding tool where you can draw, share, and innovate together in real-time.</p>
            </Container>
            <Container style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                <div style={{ maxWidth: "1000px", boxShadow: "0 4px 8px rgba(255, 255, 255, 0.5)", borderRadius: "20px", padding: "20px" }}>
                    <h2>Your Activity</h2>
                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
                        {savedDrawings.map((drawing, index) => (
                            <div key={index} style={{ boxShadow: "0 4px 8px rgba(255, 255, 255, 0.2)", borderRadius: "10px" }}>
                                <img src={drawing} alt={`drawing-${index}`} style={{ width: '100%', height: '100%', borderRadius: "10px" }} />
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Home;
