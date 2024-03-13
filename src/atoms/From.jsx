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
                title: 'Oops...',
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
        return curp.toUpperCase();
    };

    const handleSubmitAlertDataForm = (event) => {
        event.preventDefault();
        
        if (!nombre || !apellidoPaterno || !apellidoMaterno || !dia || !mes || !ano || !sexo || !estado) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Todos los campos son obligatorios.',
            });
            return; // Detiene la ejecución si algún campo está vacío
        }
    
        const diaInt = parseInt(dia, 10);
        const mesInt = parseInt(mes, 10);
        const anoInt = parseInt(ano, 10);
    
        // Validación básica del día y el mes
        if (diaInt < 1 || diaInt > 31) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El día debe estar entre 1 y 31.',
            });
            return; // Detiene la ejecución si la validación falla
        }
    
        if (mesInt < 1 || mesInt > 12) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El mes debe estar entre 1 y 12.',
            });
            return; 
        }
    
        // Validación específica para febrero y años bisiestos
        if (mesInt === 2 && diaInt > 29) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Febrero no puede tener más de 29 días.',
            });
            return;
        }
        if (!ano || ano.toString().length !== 4) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El año debe tener exactamente 4 dígitos.',
            });
            return; // Detiene la ejecución si la validación falla
        }    
        if (anoInt < 1950 || anoInt > 2024) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El año debe estar entre 1950 y 2024.',
            });
            return; // Detiene la ejecución si la validación falla
        }
    
        if (mesInt === 2 && diaInt === 29 && !(anoInt % 4 === 0 && (anoInt % 100 !== 0 || anoInt % 400 === 0))) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El año no es bisiesto, febrero no puede tener 29 días.',
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
                        <form onSubmit={handleSubmit}>
                            <p className="title">Registro para CURP</p>
                            {!isCaptchaSolved && (
                                <>
                                    <p className='text-center'>{captcha}</p>
                                    <input type="text" value={userInput} onChange={handleInputChange} required />
                                    <button type="submit">Verificar</button>
                                </>
                            )}
                        </form>
                    </center>
                    <table className="centered-table">
                        <thead>
                            <tr>
                                <th>CURP</th>
                                <th>Nombre</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.curp}</td>
                                    <td>{data.nombre}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <form onSubmit={handleSubmitAlertDataForm} className="form">
                        <input placeholder="Nombre(s)" type="text" className="input" onChange={e => setNombre(e.target.value)} />
                        <input placeholder="Apellido Paterno" type="text" className="input" onChange={e => setApellidoPaterno(e.target.value)} />
                        <input placeholder="Apellido Materno" type="text" className="input" onChange={e => setApellidoMaterno(e.target.value)} />
                        <input placeholder="Día" type="number" className="input" onChange={e => setDia(e.target.value)} />
                        <input placeholder="Mes" type="number" className="input" onChange={e => setMes(e.target.value)} />
                        <input placeholder="Año" type="number" className="input" onChange={e => setAno(e.target.value)} />
                        <select className="input" onChange={e => setSexo(e.target.value)}>
                            <option value="">Sexo</option>
                            <option value="hombre">Hombre</option>
                            <option value="mujer">Mujer</option>
                        </select>
                        <select className="input" onChange={e => setEstado(e.target.value)}>
                            <option value="">Selecciona un estado</option>
                                <option value="CS">Chiapas</option>
                                <option value="AS">Aguascalientes</option>
                                <option value="BC">Baja California</option>
                                <option value="BS">Baja California Sur</option>
                                <option value="CC">Campeche</option>
                                <option value="CH">Chihuahua</option>
                                <option value="CL">Coahuila</option>
                                <option value="CM">Colima</option>
                                <option value="DG">Durango</option>
                                <option value="DF">Distrito Federal</option>
                                <option value="GT">Guanajuato</option>
                                <option value="GR">Guerrero</option>
                                <option value="HG">Hidalgo</option>
                                <option value="JC">Jalisco</option>
                                <option value="MN">Michoacán</option>
                                <option value="MS">Morelos</option>
                                <option value="MC">México</option>
                                <option value="NT">Nayarit</option>
                                <option value="NL">Nuevo León</option>
                                <option value="OC">Oaxaca</option>
                                <option value="PL">Puebla</option>
                                <option value="QT">Querétaro</option>
                                <option value="QR">Quintana Roo</option>
                                <option value="SP">San Luis Potosí</option>
                                <option value="SL">Sinaloa</option>
                                <option value="SR">Sonora</option>
                                <option value="TC">Tabasco</option>
                                <option value="TS">Tamaulipas</option>
                                <option value="TL">Tlaxcala</option>
                                <option value="VZ">Veracruz</option>
                                <option value="YN">Yucatán</option>
                                <option value="ZS">Zacatecas</option>
                        </select>
                        <div className="d-flex justify-content-center">
                            <button className="btn mt-5 " type="submit"><i className="animation"></i>Generar CURP<i className="animation"></i></button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
    
}

export default Form;

                   
                     
                 