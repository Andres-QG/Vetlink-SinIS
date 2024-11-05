import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  TextField,
  InputAdornment,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  Email,
  CheckCircleOutline,
  CheckCircle,
  LockReset,
} from "@mui/icons-material";

// Pagina que pide el correo al usuario

export function PassReset() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setRole } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(true);
      return;
    }
    setError(false);
    console.log("Sending");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/reset-password/",
        {
          email,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.data.exists === true) {
        setRole(5);
        navigate("/check-reset");
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <div className="h-screen flex items-center justify-center bg-[url('./src/assets/shapes/wave.svg')] bg-bottom bg-no-repeat w-full">
            <div className="flex flex-col h-[450px] w-[400px] rounded-xl relative bottom-3 bg-bgsecondary shadow-2xl items-center pt-8 text-secondary ">
              <LockReset style={{ fontSize: "80px" }} />
              <h1 className="pb-4 text-2xl font-bold text-center">
                ¿Olvidaste tu contraseña?
              </h1>
              <p className="font-bold text-center">
                Escribe tu correo para enviarte un código de verificación
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center w-full py-16"
              >
                {/* Campo correo */}
                <TextField
                  label="Correo"
                  name="correo"
                  value={email}
                  error={error}
                  className="relative w-5/6 bottom-6"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Boton enviar correo */}

                <div className="flex justify-center w-5/6 h-full text-md gap-7">
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/login")}
                    disabled={loading}
                    sx={{
                      borderColor: "#00308F",
                      color: "#00308F",
                      minWidth: "150px", // Set a fixed width for both buttons
                      "&:hover": {
                        color: "#00246d",
                        borderColor: "#00246d",
                      },
                    }}
                  >
                    Cancelar
                  </Button>

                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={loading && <CircularProgress size={20} />}
                    sx={{
                      backgroundColor: "#00308F",
                      color: "#fff",
                      minWidth: "150px", // Matching width for both buttons
                      "&:hover": {
                        backgroundColor: "#00246d",
                      },
                    }}
                  >
                    {loading ? "Enviando..." : "Enviar"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export function CheckCode() {
  const navigate = useNavigate();
  const [values, setValues] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const { role, setRole } = useContext(AuthContext);

  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value) || value.length > 1) {
      return;
    }

    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);

    if (value && index < 5) {
      document.getElementById(`digit-${index + 1}`).focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      // Maneja el input de borrar un digito
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").slice(0, 6); // Limite de copiar 6 caracteres
    const updatedValues = pasteData
      .split("")
      .concat(Array(6).fill(""))
      .slice(0, 6); // Llena los 6 caracteres

    for (const value of updatedValues) {
      if (isNaN(value) || value.length > 1) {
        return;
      }
    }

    setValues(updatedValues);

    // LLena los campos con lo que se obtuvo del clipboard
    const lastFilledIndex = updatedValues.findIndex((value) => value === "");
    if (lastFilledIndex !== -1) {
      const nextInput = document.getElementById(`input-${lastFilledIndex}`);
      nextInput && nextInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/verify-code/",
        {
          values,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.data.status === "success") {
        console.log(role);
        navigate("/change-pass");
      }
    } catch (error) {
      setRole(null);
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <div className="h-screen flex items-center justify-center bg-[url('./src/assets/shapes/wave.svg')] bg-bottom bg-no-repeat w-full">
            <div className="flex flex-col h-[350px] w-[400px] rounded-xl bg-bgsecondary shadow-2xl items-center pt-8 text-secondary">
              <h1 className="text-2xl font-bold text-center">
                Código de Verificación
              </h1>
              <p className="mt-4 font-bold text-center">
                Digita el código enviado a tu correo
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center w-full py-10"
              >
                {/* Campo valores */}

                <div className="flex pt-6 space-x-2" onPaste={handlePaste}>
                  {values.map((value, index) => (
                    <input
                      key={index}
                      id={`digit-${index}`}
                      type="text"
                      maxLength="1"
                      value={value}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleBackspace(e, index)}
                      ref={(el) => (inputRefs.current[index] = el)}
                      className="w-10 h-10 text-lg text-center border border-gray-300 rounded-md"
                    />
                  ))}
                </div>

                {/* Boton enviar correo */}
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                  sx={{
                    backgroundColor: "#00308F",
                    color: "#fff",
                    mt: 8,
                    minWidth: "260px",
                    "&:hover": {
                      backgroundColor: "#00246d",
                    },
                  }}
                >
                  {loading ? "Confirmando..." : "Confirmar"}
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// Pagina que recibe la contraseña nueva del usuario

export function ChangePass() {
  const navigate = useNavigate();
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\d[a-zA-Z])[\S]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    // Revisa que las contraseñas sean iguales
    if (newPass !== confPass) {
      validationErrors["confPass"] = "Las contraseñas deben ser iguales";
    }

    // Revisa que la contraseña tenga los caracteres necesarios
    if (!passRegex.test(newPass)) {
      validationErrors["newPass"] =
        "La contraseña debe tener al menos 8 caracteres, un número y un símbolo.";
    }

    // Revisa si el objeto de validacion de errores tiene elementos
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors({});
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/check-new-pass/",
        {
          newPass,
          confPass,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      setLoading(false);
      if (response.data.same === true) {
        console.log("Password can't be the same");
      }
      if (response.data.status === "success") {
        navigate("/pass-success");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <div className="h-screen flex items-center justify-center bg-[url('./src/assets/shapes/wave.svg')] bg-bottom bg-no-repeat w-full">
            <div className="flex flex-col h-[650px] w-[400px] rounded-xl bg-bgsecondary shadow-2xl items-center pt-8 text-secondary">
              <h1 className="text-2xl font-bold text-center">
                Crea una contraseña nueva
              </h1>
              <p className="m-2 font-bold text-center">
                Dígita tu nueva contraseña
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center w-full m-14"
              >
                {/* Campo nueva contraseña */}

                <TextField
                  label="Dígita tu nueva contraseña"
                  type="password"
                  name="newpass"
                  value={newPass}
                  error={!!errors["newPass"]}
                  helperText={errors["newPass"]}
                  onChange={(e) => setNewPass(e.target.value)}
                  sx={{ mb: 2, width: "19rem" }}
                />

                {/* Campo repetir contraseña */}

                <TextField
                  label="Confirma tu contraseña"
                  type="password"
                  name="confirmation"
                  value={confPass}
                  error={!!errors["confPass"]}
                  helperText={errors["confPass"]}
                  onChange={(e) => setConfPass(e.target.value)}
                  sx={{ mb: 2, width: "19rem" }}
                />
                <div className="flex flex-col justify-center h-20 m-8 items-left w-72 bg-bgsecondary">
                  <div className="flex items-center space-x-2">
                    <CheckCircleOutline />
                    <span>Al menos 8 carácteres</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleOutline />
                    <span>Al menos una letra mayúscula</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleOutline />
                    <span>Al menos un número y un símbolo</span>
                  </div>
                </div>

                {/* Boton enviar correo */}
                <a href=""></a>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                  sx={{
                    backgroundColor: "#00308F",
                    color: "#fff",
                    mt: 8,
                    minWidth: "19rem",
                    height: "45px",
                    "&:hover": {
                      backgroundColor: "#00246d",
                    },
                  }}
                >
                  {loading ? "Estableciendo..." : "Establecer Contraseña"}
                </Button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export function PassSuccess() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <div className="h-screen flex items-center justify-center bg-[url('./src/assets/shapes/wave.svg')] bg-bottom bg-no-repeat w-full">
            <div className="flex flex-col h-[350px] w-[400px] rounded-xl bg-bgsecondary shadow-2xl items-center pt-8 text-secondary">
              <CheckCircle className="text-primary text-6xl mb-4" />
              <h1 className="text-2xl font-bold text-center">Listo</h1>
              <p className="m-8 font-bold text-center">Tu contraseña ha sido cambiada</p>
              <p className="mb-8 text-center">Ya puedes iniciar sesión con tu contraseña nueva</p>

              <Button
                variant="contained"
                className="mt-8 text-xl w-72 h-12 border-none text-bgsecondary"
                sx={{
                  backgroundColor: "#00308F",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#00246d",
                    transform: "scale(1.03)",
                  },
                }}
                onClick={() => navigate("/login")}
              >
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
