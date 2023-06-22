
import './App.css';
import React, {useEffect, useRef, useState} from "react";
import {bornCount, deadCount, getCount, includeGeneralCommand, initialization, progress} from "./main";
import Form from "./Form";

const rules = [20, 25, 30, 35, 40]
function rect(props) {
    const {ctx, x, y, width, height, color, photosynthesis, predation, era} = props;
    let opacity = 1
    if(era < 10) opacity = 0.5
    ctx.fillStyle = predation > photosynthesis ? `rgba(127,0,0,${opacity})` : `rgba(0,92,16,${opacity})`
    ctx.fillRect(x, y, width, height);
}

function circle(props) {
    const {ctx, x, y, width, height, color, photosynthesis, predation, era} = props;
    let opacity = 1
    if(era < 10) opacity = 0.5
    ctx.fillStyle = predation > photosynthesis ? `rgba(127,0,0,${opacity})` : `rgba(0,92,16,${opacity})`
    ctx.beginPath();
    ctx.arc(x+widthCell/2, y+widthCell/2, widthCell/2,0, 2 * Math.PI);
    ctx.fill();
}

const widthCell = 10
const heightCell = 10

function App() {
    const [dead, setDead] = useState(0)
    const [born, setBorn] = useState(0)
    const [count, setCount] = useState(0)
    const [cells, setCells] = useState(0)
    const [fixCurrentCell, setFixCurrentCell] = useState(false)
    const [run, setRun] = useState(false)
    const [initial, setInitial] = useState(false)
    const [currentInfo, setCurrentInfo] = useState({})
    const [cellsArray, setCellsArray] = useState([])
    const [typeCell, setTypeCell] = useState(false)

    const myInterval = useRef();
    const canvas = useRef(null);

    const updateCanvas = () => {
        const ctx = document.getElementById("myCanvas").getContext('2d');
        ctx.clearRect(0,0, 800, 600);
        // отобразить "дочерние" компоненты
        // rect({ctx, x: 10, y: 10, width: 10, height: 10});
        const arr = progress()
        setCellsArray(arr)
        setDead(deadCount())
        setBorn(bornCount())
        setCount(getCount())
        setCells(arr.length)
        if(typeCell){
            arr.forEach(elem => {
                circle({
                    ctx,
                    x: elem.x,
                    y: elem.y,
                    width: 10,
                    height: 10,
                    predation: elem.predation,
                    photosynthesis: elem.photosynthesis,
                    era: elem.era
                });
            })
        }else {
            arr.forEach(elem => {
                rect({
                    ctx,
                    x: elem.x,
                    y: elem.y,
                    width: 10,
                    height: 10,
                    predation: elem.predation,
                    photosynthesis: elem.photosynthesis,
                    era: elem.era
                });
            })
        }

    }

    const updateCanvasTick = () => {
        setRun(true)
        myInterval.current = setInterval(updateCanvas, 100)
    }
    const updateCanvasTickStop = () => {
        setRun(false)
        clearInterval(myInterval.current)
    }

    const hoverOnCanvas = (e) => {
        if(!run && fixCurrentCell){
            const pageX = e.pageX - canvas.current.getBoundingClientRect().x
            const pageY = e.pageY - canvas.current.getBoundingClientRect().y

            cellsArray.forEach(cell => {
                const X = pageX - cell.x
                const Y = pageY - cell.y
                if (X > 0 && X < 10 && Y > 0 && Y < 10){
                   setCurrentInfo(cell)
                }
            })
        }
    }

    const fixCurrentCellOnClick = () => {
        setFixCurrentCell(!fixCurrentCell)
    }

    const submitForm = (e) => {
        setInitial(true)
        initialization(e)
        setTypeCell(e.type)
    }

  return (
    <div className="App">
        <div className="Canvas">
            <canvas ref={canvas} onClick={fixCurrentCellOnClick} onMouseMove={hoverOnCanvas} className="CanvasMain" id="myCanvas" width={800} height={600}/>
            {currentInfo.id && !run && <div onClick={fixCurrentCellOnClick} style={{ left: currentInfo.x+22, top: currentInfo.y+22}} className="Ramka"></div>}
        </div>
        {initial ?
            <div className="Menu">
            <div className="MenuContainer">
                <div className="States">
                    <h3>Статистика</h3>
                    <div>Смерти: <span>{dead}</span></div>
                    <div>Рождений: <span>{born}</span></div>
                    <div>Цикл: <span>{count}</span></div>
                    <div>Особей: <span>{cells}</span></div>
                </div>
                <div className="States">
                    <h3>Гены</h3>
                    <div>Фотосинтез: <span>20</span></div>
                    <div>Поворот: <span>25</span></div>
                    <div>Идти: <span>30</span></div>
                    <div>Съесть: <span>35</span></div>
                    <div>Повернуться в сторону <br/> ближайшей клетки: <span>40</span></div>
                </div>
                {currentInfo.id && currentInfo.energy > 0 && <div className="Data">
                    <div>id: <span>{currentInfo.id}</span></div>
                    <div>energy: <span>{currentInfo.energy}</span></div>
                    <div>era: <span>{currentInfo.era}</span></div>
                    <div>ytk: <span>{currentInfo.ytk}</span></div>
                    <div>genes: {currentInfo?.genes.map((e, i) => {
                        if (rules.includes(e)) return <span style={{
                            color: `rgb(256,0,${10 * (e - 20)})`,
                            border: currentInfo.ytk === i ? "1px solid #fff" : "1px solid transparent"
                        }}>{e + " "}</span>
                        else return <span
                            style={{border: currentInfo.ytk === i ? "1px solid #fff" : "1px solid transparent"}}>{e + " "}</span>
                    })}</div>
                </div>}

            </div>
            <div>
                <button className="button left" onClick={updateCanvasTick}>Старт</button>
                <button className="button right" onClick={updateCanvasTickStop}>Стоп</button>
            </div>

        </div>
        :
            <Form submitForm={submitForm} />}
    </div>
  );
}

export default App;
