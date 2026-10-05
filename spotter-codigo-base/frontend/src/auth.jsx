import { createContext, useContext, useState } from 'react';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => JSON.parse(localStorage.getItem('usuario') || 'null'));

  const entrar = ({ usuario, token }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setUsuario(usuario);
  };
  const salir = () => {
    localStorage.clear();
    setUsuario(null);
  };

  return <Ctx.Provider value={{ usuario, entrar, salir }}>{children}</Ctx.Provider>;
}
