import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Ellipse, Transformer } from 'react-konva';
import { Container, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import io from 'socket.io-client';
import { jsPDF } from 'jspdf';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const socket = io.connect('http://localhost:5000');

const Whiteboard = () => {
    const [tool, setTool] = useState('line');
    const [shapes, setShapes] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [color, setColor] = useState('#000000');
    const [fillColor, setFillColor] = useState('#FFFFFF');
    const [lineWidth, setLineWidth] = useState(5);
    const [undoHistory, setUndoHistory] = useState([]);
    const [redoHistory, setRedoHistory] = useState([]);
    const stageRef = useRef(null);
    const transformerRef = useRef(null);
    const isDrawing = useRef(false);

    useEffect(() => {
        socket.on('drawing', (data) => {
            setShapes(prevShapes => [...prevShapes, data]);
        });
        socket.on('undo', handleUndoReceived);
        socket.on('redo', handleRedoReceived);
        return () => {
            socket.off('drawing');
            socket.off('undo');
            socket.off('redo');
        };
    }, []);

    useEffect(() => {
        const transformer = transformerRef.current;
        if (selectedId && transformer) {
            const selectedShape = stageRef.current.findOne(`#${selectedId}`);
            transformer.nodes(selectedShape ? [selectedShape] : []);
            transformer.getLayer().batchDraw();
        } else {
            transformer.nodes([]);
        }
    }, [selectedId]);

    const handleMouseDown = (e) => {
        const pos = stageRef.current.getPointerPosition();
        isDrawing.current = true;
        const newShape = {
            id: `shape_${shapes.length}`,
            type: tool,
            points: [pos.x, pos.y],
            color,
            fillColor,
            lineWidth,
        };
        setShapes([...shapes, newShape]);
        saveToUndo([...shapes, newShape]);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current) return;
        const point = stageRef.current.getPointerPosition();
        updateShape(point);
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
        const lastShape = shapes[shapes.length - 1];
        socket.emit('drawing', lastShape);
    };

    const updateShape = (point) => {
        if (!shapes.length) return;
        const lastShape = shapes[shapes.length - 1];
        if (lastShape.points) {
            lastShape.points = lastShape.points.concat([point.x, point.y]);
            setShapes(shapes.map((shape, idx) => idx === shapes.length - 1 ? lastShape : shape));
            if (tool === 'line') {
                socket.emit('drawing', lastShape);
            }
        }
    };

    const undo = () => {
        if (undoHistory.length > 0) {
            const lastState = undoHistory.pop();
            setShapes(lastState);
            setRedoHistory(redoHistory => [...redoHistory, shapes]);
            socket.emit('undo', lastState);  // Emit the last state to the server
        }
    };

    const redo = () => {
        if (redoHistory.length > 0) {
            const nextState = redoHistory.shift();
            setShapes(nextState);
            setUndoHistory(undoHistory => [...undoHistory, shapes]);
            socket.emit('redo', nextState);  // Emit the next state to the server
        }
    };
    const handleUndoReceived = (data) => {
        setShapes(data);  // Set the shapes directly from received data
    };

    const handleRedoReceived = (data) => {
        setShapes(data);  // Set the shapes directly from received data
    };
    const saveToUndo = (newState) => {
        setUndoHistory([...undoHistory, newState]);
    };

    const exportToImage = (format = 'image/png') => {
        const dataURL = stageRef.current.toDataURL({ mimeType: format, quality: 1 });
        return dataURL;
    };

    const exportToPDF = () => {
        const image = exportToImage('image/jpeg');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'px',
            format: [stageRef.current.width(), stageRef.current.height()]
        });
        pdf.addImage(image, 'JPEG', 0, 0, stageRef.current.width(), stageRef.current.height());
        pdf.save('drawing.pdf');
        saveDrawing('application/pdf');
    };

    const handleSaveAsPNG = () => {
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = exportToImage('image/png');
        link.click();
        saveDrawing('image/png');
    };

    const handleSaveAsPDF = () => {
        exportToPDF();
    };

    const saveDrawing = (format) => {
        const dataURL = exportToImage(format);
        const existingDrawings = JSON.parse(localStorage.getItem('drawings') || '[]');
        existingDrawings.push(dataURL);
        localStorage.setItem('drawings', JSON.stringify(existingDrawings));
    };

    return (
        <Container className="p-3" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="d-flex align-items-center justify-content-between mb-2">
                <Link to="/" style={{ textDecoration: 'none', color: 'white', backgroundColor: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '8px 20px', borderRadius: '20px', marginRight: '10px' }}>Home</Link>
                <Button onClick={undo} variant="secondary" className="me-2">Undo</Button>
                <Button onClick={redo} variant="secondary" className="me-2">Redo</Button>
                <DropdownButton id="dropdown-basic-button" title="Tool" onSelect={(e) => setTool(e)}>
                    <Dropdown.Item eventKey="line">Line</Dropdown.Item>
                    <Dropdown.Item eventKey="rectangle">Rectangle</Dropdown.Item>
                    <Dropdown.Item eventKey="ellipse">Ellipse</Dropdown.Item>
                    <Dropdown.Item eventKey="eraser">Eraser</Dropdown.Item>
                </DropdownButton>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="me-2" title="Stroke Color" />
                <input type="color" value={fillColor} onChange={(e) => setFillColor(e.target.value)} className="me-2" title="Fill Color" />
                <input type="range" min="1" max="20" value={lineWidth} onChange={(e) => setLineWidth(parseInt(e.target.value))} className="me-2" />
                <Button onClick={handleSaveAsPNG} variant="info" className="me-2">Save as PNG</Button>
                <Button onClick={handleSaveAsPDF} variant="info" className="me-2">Save as PDF</Button>
            </div>
            <Stage ref={stageRef} width={window.innerWidth} height={600} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} style={{ backgroundColor: 'white', border: '1px solid #ccc' }}>
                <Layer>
                    {shapes.map((shape, i) => {
                        const shapeProps = {
                            key: i,
                            id: shape.id,
                            x: shape.x,
                            y: shape.y,
                            points: shape.points,
                            stroke: shape.color,
                            strokeWidth: shape.lineWidth,
                            fill: shape.fillColor,
                            draggable: true,
                            onDragEnd: (e) => {
                                const newShapes = shapes.slice();
                                newShapes[i] = { ...newShapes[i], x: e.target.x(), y: e.target.y() };
                                setShapes(newShapes);
                                saveToUndo(newShapes);
                            },
                        };
                        switch (shape.type) {
                            case 'line':
                                return <Line {...shapeProps} />;
                            case 'rectangle':
                                return <Rect {...shapeProps} width={shape.width} height={shape.height} />;
                            case 'ellipse':
                                return <Ellipse {...shapeProps} radiusX={shape.width / 2} radiusY={shape.height / 2} />;
                            default:
                                return null;
                        }
                    })}
                    <Transformer ref={transformerRef} />
                </Layer>
            </Stage>
        </Container>
    );
};

export default Whiteboard;
