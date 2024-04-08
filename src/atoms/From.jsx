import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import "../assets/style/Button.css";
import "../assets/style/Form.css";

function Form() {
    const [formData, setFormData] = useState([]);
    const [isVerified, setIsVerified] = useState(false);
    const [isCaptchaSolved, setIsCaptchaSolved] = useState(false);
    const [captcha, setCaptcha] = useState('');
    const [userInput, setUserInput] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [dia, setDia] = useState('');
    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [sexo, setSexo] = useState('');
    const [estado, setEstado] = useState('');

    useEffect(() => {
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        let randomString = '';
        const characters = '6LcntpApAAAAAABa5Ndio61PfktpRp_ajCpddq2b';
        for (let i = 0; i < 5; i++) {
            randomString += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setCaptcha(randomString);
    };

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (userInput !== captcha) {
            Swal.fire({
                icon: 'error',
                text: 'El captcha ingresado no coincide!',
            });
            generateCaptcha();
            setUserInput('');
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Bien hecho!',
                text: 'El captcha ingresado coincide.',
            });
            setIsCaptchaSolved(true);
            setUserInput('');
        }
    };

    const removeAccents = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    const generateRandomLetter = () => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    };
    
    const generateRandomNumber = () => {
        return Math.floor(Math.random() * 10);
    };
    
    
    const generateCURP = () => {
        const vowels = 'AEIOU';
        const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
        let curp = removeAccents(apellidoPaterno[0] + (Array.from(apellidoPaterno.slice(1)).find(c => vowels.includes(c.toUpperCase())) || ''));
        curp += removeAccents(apellidoMaterno[0] + nombre[0]);
        curp += ano.slice(2) + (mes.length === 1 ? '0' + mes : mes) + (dia.length === 1 ? '0' + dia : dia);
        curp += sexo[0].toUpperCase();
        curp += estado ? estado.slice(0, 2).toUpperCase() : '';
        curp += removeAccents((Array.from(apellidoPaterno.slice(1)).find(c => consonants.includes(c.toUpperCase())) || ''));
        curp += removeAccents((Array.from(apellidoMaterno.slice(1)).find(c => consonants.includes(c.toUpperCase())) || ''));
        curp += removeAccents((Array.from(nombre.slice(1)).find(c => consonants.includes(c.toUpperCase())) || ''));
        curp += generateRandomLetter();
        curp += generateRandomNumber();
        return curp.toUpperCase();
    };

    const handleSubmitAlertDataForm = (event) => {
        event.preventDefault();
        
        if (!nombre || !apellidoPaterno || !apellidoMaterno || !dia || !mes || !ano || !sexo || !estado) {
            Swal.fire({
                icon: 'error',
                text: 'Todos los campos son obligatorios.',
            });
            return;
        }
    
        const diaInt = parseInt(dia, 10);
        const mesInt = parseInt(mes, 10);
        const anoInt = parseInt(ano, 10);
    
        if (mesInt === 2 && diaInt === 29 && !(anoInt % 4 === 0 && (anoInt % 100 !== 0 || anoInt % 400 === 0))) {
            Swal.fire({
                icon: 'error',
                text: 'El año no es bisiesto, febrero no puede tener 29 días.',
            });
            return;
        }        
        if (diaInt < 1 || diaInt > 31) {
            Swal.fire({
                icon: 'error',
                text: 'El día debe estar entre 1 y 31.',
            });
            return;
        }
        if (mesInt < 1 || mesInt > 12) {
            Swal.fire({
                icon: 'error',
                text: 'El mes debe estar entre 1 y 12.',
            });
            return; 
        }
        if (!ano || ano.toString().length !== 4) {
            Swal.fire({
                icon: 'error',
                text: 'El año debe tener exactamente 4 dígitos.',
            });
            return; 
        }    
        if (anoInt < 1900 || anoInt > 2024) {
            if (anoInt < 0) {
                Swal.fire({
                    icon: 'error',
                    text: 'No se permiten números negativos.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    text: 'El año debe estar entre 1900 y 2024.',
                });
            }
            return;
        }
        if (mesInt === 2 && diaInt === 29 && !(anoInt % 4 === 0 && (anoInt % 100 !== 0 || anoInt % 400 === 0))) {
            Swal.fire({
                icon: 'error',
                text: 'El año no es bisiesto, febrero no puede tener 29 días.',
            });
            return;
        }
        const regex = /[^\w\s]/;
        if (regex.test(nombre) || regex.test(apellidoPaterno) || regex.test(apellidoMaterno) || regex.test(estado)) {
            Swal.fire({
                icon: 'error',
                text: 'Los campos no deben contener puntos o caracteres especiales.',
            });
            return;
        }
        const curp = generateCURP();
        setFormData([...formData, { curp, nombre, apellidoPaterno, apellidoMaterno, dia, mes, ano, sexo, estado }]);
        Swal.fire({
            title: 'Enviado!',
            text: 'Tu formulario ha sido enviado.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
       
    };
    return ( 
        <>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className='form'>
                    <center>
                        <form onSubmit={handleSubmit} className='size-form'>
                            <p className="title">PROYECTO</p>
                            {!isCaptchaSolved && (
                                <>
                                    <p className='text-center'>{captcha}</p>
                                    <input type="text" value={userInput} onChange={handleInputChange} required />
                                    <button type="submit">Verificar</button>
                                </>
                            )}
                        </form>
                    </center>
                    <form onSubmit={handleSubmitAlertDataForm} className="form">
                        <table className="centered-table">
                            <thead>
                                <tr>
                                    <th>CURP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.map((data, index) => (
                                    <tr key={index}>
                                        <td>{data.curp}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <input placeholder="Nombre(s)" type="text" className="input" onChange={e => setNombre(e.target.value)} disabled={!isCaptchaSolved} />
                        <input placeholder="Apellido Paterno" type="text" className="input" onChange={e => setApellidoPaterno(e.target.value)} disabled={!isCaptchaSolved} />
                        <input placeholder="Apellido Materno" type="text" className="input" onChange={e => setApellidoMaterno(e.target.value)} disabled={!isCaptchaSolved} />
                        <input placeholder="Día" type="number" className="input" onChange={e => setDia(e.target.value)} disabled={!isCaptchaSolved} />
                        <input placeholder="Mes" type="number" className="input" onChange={e => setMes(e.target.value)} disabled={!isCaptchaSolved} />
                        <input placeholder="Año" type="number" className="input" onChange={e => setAno(e.target.value)} disabled={!isCaptchaSolved} />
                        <div className='chooise'>
                            <select className="input" onChange={e => setSexo(e.target.value)} disabled={!isCaptchaSolved}>
                                <option value="">Sexo</option>
                                <option value="hombre">Hombre</option>
                                <option value="mujer">Mujer</option>
                            </select>
                            <select className="input" onChange={e => setEstado(e.target.value)} disabled={!isCaptchaSolved}>
                                <option value="">Selecciona un estado</option>
                                <option value="CS">Chiapas</option>
                            </select>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button className="btn mt-5 " type="submit" disabled={!isCaptchaSolved}><i className="animation"></i>Generardor<i className="animation"></i></button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Form;
