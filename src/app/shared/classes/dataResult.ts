import { Usuario } from '../../pages/usuario/classes/usuario';

export class DataResult {
    token: string = '';
    isBlocked: boolean = false;
    usuario = {} as Usuario;
}