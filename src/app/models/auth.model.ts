export interface ApiUser {
  idUsuario: number;
  Rol: string;
  usuario: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: number;
  idRolUsuario: number;
}

export interface LoginResponse {
  user_id: number;
  status: number;
  token: string;
  user: ApiUser;
}
export interface SessionUser {
  id: number;
  role: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  roleId: number;
  roles?: string[];
}

export interface Session {
  token: string;
  user: SessionUser;
}
