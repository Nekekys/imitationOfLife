import './App.css';
import React, {useEffect, useRef, useState} from "react";
import {bornCount, deadCount, getCount, includeGeneralCommand, initialization, progress} from "./main";

const rules = [20, 25, 30, 35, 40]

function rect(props) {
    const {ctx, x, y, width, height, color, photosynthesis, predation, era} = props;
    let opacity = 1
    if (era < 10) opacity = 0.5
    ctx.fillStyle = predation > photosynthesis ? `rgba(127,0,0,${opacity})` : `rgba(0,92,16,${opacity})`
    ctx.fillRect(x, y, width, height);
}

const widthCell = 10
const heightCell = 10

function Form({submitForm}) {
    const [energy, setEnergy] = useState(10)
    const [lostEnergy, setLostEnergy] = useState(6)
    const [sex, setSex] = useState(100)
    const [kys, setKys] = useState(30)
    const [population, setPopulation] = useState(50)
    const [type, setType] = useState(false)
    const [error, setError] = useState(false)

    const submitFormFunction = () => {
        if (energy > 1 && lostEnergy > 0 && sex > 0 && kys > 0 && population > 0){
            submitForm({energy,lostEnergy,sex,kys,population,type})
        }else {
            setError(true)
        }
    }


    return (
        <div className="Menu">
            <div className="States">
                <h3>Инициализация</h3>
                <div className="container-input">
                    <span>Энергият от фотосинтеза:</span>
                    <input value={energy} onChange={event => setEnergy(event.target.value)} type="number"/>
                </div>
                <div className="container-input">
                    <span>Потеря энергии за ход:</span>
                    <input value={lostEnergy} onChange={event => setLostEnergy(event.target.value)} type="number"/>
                </div>
                <div className="container-input">
                    <span>Порог энергии для размножения:</span>
                    <input value={sex} onChange={event => setSex(event.target.value)} type="number"/>
                </div>
                <div className="container-input">
                    <span>Энергия от поедания(не включая энергию полащенной клетки):</span>
                    <input value={kys} onChange={event => setKys(event.target.value)} type="number"/>
                </div>
                <div className="container-input">
                    <span>Начальная популяция:</span>
                    <input value={population} onChange={event => setPopulation(event.target.value)} type="number"/>
                </div>
                <div className="container-input" style={{ display: 'flex' }}>
                    <span>Вид клеток:</span>
                    <div>
                        <div className="rect"></div>
                        <input checked={!type} onChange={()=> setType(false)} className="rectInput" type="radio" name="style"/>
                    </div>
                    <div style={{ marginLeft: '10px' }}>
                        <div className="circular"></div>
                        <input checked={type} onChange={()=> setType(true)} className="circularInput" type="radio" name="style"/>
                    </div>

                </div>
                {error && <span style={{ color: 'red' }}>Без отрицательных чисел пожалуйста</span>}
                <button style={{ marginTop: '10px' }} onClick={submitFormFunction} className="button ini">Старт</button>
            </div>
        </div>
    );
}

export default Form;
