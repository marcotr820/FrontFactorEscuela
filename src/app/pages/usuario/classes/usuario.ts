export class Usuario {
  constructor(
    public id: string = '',
    public userName: string = '',
    public email: string = '',
    public isBlocked: boolean = false,
    public rol?: string,
  ){}
  
}